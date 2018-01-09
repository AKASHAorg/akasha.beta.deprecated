import { apply, call, fork, put, select, takeEvery } from 'redux-saga/effects';
import * as actions from '../actions/action-actions';
import * as commentsActions from '../actions/comments-actions';
import * as draftActions from '../actions/draft-actions';
import * as entryActions from '../actions/entry-actions';
import * as profileActions from '../actions/profile-actions';
import * as tagActions from '../actions/tag-actions';
import * as transactionActions from '../actions/transaction-actions';
import * as types from '../constants';
import { selectAction, selectLoggedEthAddress, selectActionToPublish } from '../selectors';
import * as actionService from '../services/action-service';
import * as actionStatus from '../../constants/action-status';
import * as actionTypes from '../../constants/action-types';
import { balanceToNumber } from '../../utils/number-formatter';

/**
 * Mapping actionType to Action Creator (AC) that launches a "publishing" action
 * These actions are dispatched from the "actionPublish" saga
 * When a new action needs to be created, add a new field here
 * These ACs should receive one parameter: an object containing actionId and
 *   the payload (destructured). See actionPublish below
 */
const publishActions = {
    [actionTypes.bondAeth]: profileActions.profileBondAeth,
    [actionTypes.claim]: entryActions.entryClaim,
    [actionTypes.claimVote]: entryActions.entryClaimVote,
    [actionTypes.comment]: commentsActions.commentsPublish,
    [actionTypes.commentDownvote]: commentsActions.commentsDownvote,
    [actionTypes.commentUpvote]: commentsActions.commentsUpvote,
    [actionTypes.cycleAeth]: profileActions.profileCycleAeth,
    [actionTypes.tagCreate]: tagActions.tagCreate,
    [actionTypes.draftPublish]: draftActions.draftPublish,
    [actionTypes.draftPublishUpdate]: draftActions.draftPublishUpdate,
    [actionTypes.entryDownvote]: entryActions.entryDownvote,
    [actionTypes.entryUpvote]: entryActions.entryUpvote,
    [actionTypes.faucet]: profileActions.profileFaucet,
    [actionTypes.follow]: profileActions.profileFollow,
    [actionTypes.freeAeth]: profileActions.profileFreeAeth,
    [actionTypes.profileRegister]: profileActions.profileRegister,
    [actionTypes.profileUpdate]: profileActions.profileUpdate,
    [actionTypes.sendTip]: profileActions.profileSendTip,
    [actionTypes.toggleDonations]: profileActions.profileToggleDonations,
    [actionTypes.transferAeth]: profileActions.profileTransferAeth,
    [actionTypes.transferEth]: profileActions.profileTransferEth,
    [actionTypes.transformEssence]: profileActions.profileTransformEssence,
    [actionTypes.unfollow]: profileActions.profileUnfollow,
};

/**
 * Mapping actionType to Action Creator that launches a "success" action
 * These actions are dispatched from the "actionUpdate" saga
 * When a new action needs to be created, add a new field here
 * These ACs should receive one parameter: the action's payload object
 */
const publishSuccessActions = {
    [actionTypes.bondAeth]: profileActions.profileBondAethSuccess,
    [actionTypes.claim]: entryActions.entryClaimSuccess,
    [actionTypes.claimVote]: entryActions.entryClaimVoteSuccess,
    [actionTypes.comment]: commentsActions.commentsPublishSuccess,
    [actionTypes.commentDownvote]: commentsActions.commentsDownvoteSuccess,
    [actionTypes.commentUpvote]: commentsActions.commentsUpvoteSuccess,
    [actionTypes.cycleAeth]: profileActions.profileCycleAethSuccess,
    [actionTypes.tagCreate]: tagActions.tagCreateSuccess,
    [actionTypes.draftPublish]: draftActions.draftPublishSuccess,
    [actionTypes.draftPublishUpdate]: draftActions.draftPublishUpdateSuccess,
    [actionTypes.entryDownvote]: entryActions.entryDownvoteSuccess,
    [actionTypes.entryUpvote]: entryActions.entryUpvoteSuccess,
    [actionTypes.faucet]: profileActions.profileFaucetSuccess,
    [actionTypes.follow]: profileActions.profileFollowSuccess,
    [actionTypes.freeAeth]: profileActions.profileFreeAethSuccess,
    [actionTypes.profileRegister]: profileActions.profileRegisterSuccess,
    [actionTypes.profileUpdate]: profileActions.profileUpdateSuccess,
    [actionTypes.sendTip]: profileActions.profileSendTipSuccess,
    [actionTypes.toggleDonations]: profileActions.profileToggleDonationsSuccess,
    [actionTypes.transferAeth]: profileActions.profileTransferAethSuccess,
    [actionTypes.transferEth]: profileActions.profileTransferEthSuccess,
    [actionTypes.transformEssence]: profileActions.profileTransformEssenceSuccess,
    [actionTypes.unfollow]: profileActions.profileUnfollowSuccess,
};
function balanceRequired (actionType) {
    const requireBalanceFor = [
        actionTypes.comment,
        actionTypes.commentUpvote,
        actionTypes.commentDownvote,
        actionTypes.draftPublish,
        actionTypes.draftPublishUpdate,
        actionTypes.entryUpvote,
        actionTypes.entryDownvote,
    ];
    if (requireBalanceFor.includes(actionType)) {
        return true;
    }
    return false;
}
function hasEnoughBalance (actionType, balance, publishingCost) {
    const remainingMana = balanceToNumber(balance.getIn(['mana', 'remaining']), 5);
    const entryPublishingCost = balanceToNumber(publishingCost.getIn(['entry', 'cost']), 5);
    let hasMana;
    switch (actionType) {
        case actionTypes.draftPublish:
            hasMana = remainingMana >= entryPublishingCost;
            break;
        default:
            hasMana = true;
    }
    return {
        eth: balanceToNumber(balance.get('eth'), 2) > 0.12,
        aeth: balanceToNumber(balance.getIn(['aeth', 'free'])) > 0,
        mana: hasMana,
    };
}

function* actionAdd ({ ethAddress, payload, actionType }) {
    if (actionType === actionTypes.faucet) {
        const id = yield select(selectActionToPublish);
        yield put(actions.actionPublish(id)); // eslint-disable-line no-use-before-define
    }
    /**
     * Check if user has enough balance to create the action
     */
    const balance = yield select(state => state.profileState.get('balance'));
    const publishingCost = yield select(state => state.profileState.get('publishingCost'));
    const hasBalance = hasEnoughBalance(actionType, balance, publishingCost);
    if ((hasBalance.eth && hasBalance.aeth && hasBalance.mana) || !balanceRequired(actionType)) {
        /**
         * continue to publishing
         */
        yield put(actions.actionAddSuccess(ethAddress, actionType, payload));
    } else {
        /**
         * stop publishing and display the appropriate modal
         */
        yield put(actions.actionAddNoFunds({
            ethAddress,
            actionType,
            payload,
            needEth: !hasBalance.eth,
            needAeth: !hasBalance.aeth,
            needMana: !hasBalance.mana,
        }));
    }
}

function* actionDelete ({ id }) {
    try {
        yield apply(actionService, actionService.deleteAction, [id]);
    } catch (error) {
        yield put(actions.actionDeleteError(error));
    }
}

function* actionGetClaimable () {
    try {
        const loggedEthAddress = yield select(selectLoggedEthAddress);
        const claimable = ['draftPublish', 'entryDownvote', 'entryUpvote'];
        const request = claimable.map(type => [loggedEthAddress, type]);
        const data = yield apply(actionService, actionService.getClaimable, [request]);
        if (data.length) {
            yield call(actionGetClaimableEntries, data); // eslint-disable-line no-use-before-define
        }
        yield put(actions.actionGetClaimableSuccess(data));
    } catch (error) {
        yield put(actions.actionGetClaimableError(error));
    }
}

function* actionGetClaimableEntries (data) {
    const loggedEthAddress = yield select(selectLoggedEthAddress);
    const entries = [];
    const otherEntries = [];
    const ownEntries = [];
    data.forEach((action) => {
        const { entryId, ethAddress } = action.payload;
        if (entryId && ethAddress) {
            entries.push({ entryId, ethAddress });
            if (ethAddress === loggedEthAddress) {
                ownEntries.push(entryId);
            } else {
                otherEntries.push(entryId);
            }
        }
    });
    for (let i = 0; i < entries.length; i++) {
        const { entryId, ethAddress } = entries[i];
        yield put(entryActions.entryGetShort({ context: 'claimableEntries', entryId, ethAddress }));
    }
    if (ownEntries.length) {
        yield put(entryActions.entryCanClaim(ownEntries));
        yield put(entryActions.entryGetBalance(ownEntries));
    }
    if (otherEntries.length) {
        yield put(entryActions.entryCanClaimVote(otherEntries));
        yield put(entryActions.entryGetVoteOf(otherEntries));
    }
}

function* actionGetHistory ({ request }) {
    try {
        const loggedEthAddress = yield select(selectLoggedEthAddress);
        const input = [];
        request.forEach(type => input.push([loggedEthAddress, type]));
        const data = yield apply(
            actionService,
            actionService.getActionsByType,
            [input]
        );
        yield put(actions.actionGetHistorySuccess(data, request));
    } catch (error) {
        yield put(actions.actionGetHistoryError(error));
    }
}

/**
 * Fetch all actions with a "publishing" status from local db;
 * Then dispatch transactionGetStatus to check if the pending transactions were mined;
 * This is called from bootstrapHome saga (after initial login and on refresh);
 */
function* actionGetPending () {
    try {
        const loggedEthAddress = yield select(selectLoggedEthAddress);
        const data = yield apply(actionService, actionService.getPendingActions, [loggedEthAddress]);
        yield put(actions.actionGetPendingSuccess(data));
        if (data.length) {
            const txs = [];
            const ids = [];
            data.forEach((action) => {
                txs.push(action.tx);
                ids.push(action.id);
            });
            for (let i = 0; i < txs.length; i++) {
                yield put(transactionActions.transactionGetStatus([txs[i]], [ids[i]]));
            }
        }
    } catch (error) {
        yield put(actions.actionGetPendingError(error));
    }
}

/**
 * Dispatch the action resulted from the action creator defined in publishActions above;
 * This is called:
 *  - from watchProfileLoginChannel, after a successful reauthentication;
 *  - from checkAuthentication saga, whenever reauthentication is not needed (token is not expired)
 */
function* actionPublish ({ id }) { // eslint-disable-line complexity
    const action = yield select(state => selectAction(state, id));
    const actionId = action.get('id');
    const payload = action.get('payload').toJS();
    const publishAction = publishActions[action.get('type')];
    if (publishAction) {
        yield put(publishAction({ actionId, ...payload }));
    }
}

/**
 * Save action in local DB
 * This is called from actionUpdate saga, when status is updated to "publishing" or "published"
 */
function* actionSave (id) {
    let action = yield select(state => selectAction(state, id));
    // For published actions, remove non persistent fields from payload before saving to local DB
    // This is needed to avoid storing useless data like entry content or profile data
    if (action && action.status === actionStatus.published) {
        const nonPersistentFields = action.getIn(['payload', 'nonPersistentFields']);
        if (nonPersistentFields && nonPersistentFields.size) {
            nonPersistentFields.forEach((field) => {
                action = action.deleteIn(['payload', field]);
            });
        }
        action = action.deleteIn(['payload', 'nonPersistentFields']);
    }
    if (action) {
        try {
            yield apply(actionService, actionService.saveAction, [action.toJS()]);
        } catch (error) {
            yield put(actions.actionSaveError(error));
        }
    }
}

function* actionPublished ({ receipt }) {
    const { blockNumber, cumulativeGasUsed, success, transactionHash } = receipt;
    const loggedEthAddress = yield select(selectLoggedEthAddress);
    const actionId = yield apply(actionService, actionService.getActionByTx, [transactionHash]);
    const action = yield select(state => selectAction(state, actionId)); // eslint-disable-line

    if (action && action.get('ethAddress') === loggedEthAddress) {
        const status = actionStatus.published;
        const changes = { id: actionId, blockNumber, cumulativeGasUsed, status, success };
        yield put(actions.actionUpdate(changes));
        yield put(profileActions.profileGetBalance());
        yield put(profileActions.profileManaBurned());
    }
}

/**
 * React to action updates, depending on the new action status
 * Important: the "changes" object must contain the id of the action
 */
function* actionUpdate ({ changes }) {
    const action = yield select(state => selectAction(state, changes.id));
    if (changes.status === actionStatus.publishing) {
        yield fork(actionSave, changes.id);
    }
    if (changes.status === actionStatus.published) {
        yield fork(actionSave, changes.id);
        const publishSuccessAction = publishSuccessActions[action.get('type')];
        if (publishSuccessAction && changes.success) {
            yield put(publishSuccessAction(action.get('payload').toJS()));
        }
    }
}

// Action watchers

export function* watchActionActions () {
    yield takeEvery(types.ACTION_ADD, actionAdd);
    yield takeEvery(types.ACTION_DELETE, actionDelete);
    yield takeEvery(types.ACTION_GET_CLAIMABLE, actionGetClaimable);
    yield takeEvery(types.ACTION_GET_HISTORY, actionGetHistory);
    yield takeEvery(types.ACTION_GET_PENDING, actionGetPending);
    yield takeEvery(types.ACTION_PUBLISH, actionPublish);
    yield takeEvery(types.ACTION_PUBLISHED, actionPublished);
    yield takeEvery(types.ACTION_UPDATE, actionUpdate);
}

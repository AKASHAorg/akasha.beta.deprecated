// @flow
import * as reduxSaga from 'redux-saga';
import { apply, call, fork, put, select, takeEvery } from 'redux-saga/effects';
import * as actions from '../actions/action-actions';
import * as commentsActions from '../actions/comments-actions';
import * as draftActions from '../actions/draft-actions';
import * as entryActions from '../actions/entry-actions';
import * as profileActions from '../actions/profile-actions';
import * as tagActions from '../actions/tag-actions';
import * as transactionActions from '../actions/transaction-actions';
import * as types from '../constants';
import { actionSelectors, profileSelectors } from '../selectors';
import * as actionService from '../services/action-service';
import * as actionStatus from '../../constants/action-status';
import * as actionTypes from '../../constants/action-types';
import { balanceToNumber } from '../../utils/number-formatter';

/*::
    import type { Saga } from 'redux-saga';
 */

const ACTION_HISTORY_LIMIT = 20;

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

function balanceRequired (actionType)/* : boolean */ {
    const balanceNotRequired = [actionTypes.faucet];
    if (balanceNotRequired.includes(actionType)) {
        return false;
    }
    return true;
}

function checkHasMana (actionType, remainingMana, costs) {
    switch (actionType) {
        case actionTypes.draftPublish:
            return (remainingMana >= costs.entryPublishingCost);
        case actionTypes.comment:
            return (remainingMana >= costs.commentPublishingCost);
        case actionTypes.commentUpvote:
        case actionTypes.commentDownvote:
        case actionTypes.entryUpvote:
        case actionTypes.entryDownvote:
            return (remainingMana >= costs.costByWeight);
        default:
            return true;
    }
}
function hasEnoughBalance (actionType, balance, publishingCost, payload) {
    const remainingMana = balanceToNumber(balance.getIn(['mana', 'remaining']), 5);
    const entryPublishingCost = balanceToNumber(publishingCost.getIn(['entry', 'cost']), 5);
    const commentPublishingCost = balanceToNumber(publishingCost.getIn(['comments', 'cost']), 5);
    let costByWeight = 0;
    if (payload && typeof payload.weight === 'number') {
        costByWeight = balanceToNumber(
            publishingCost.get('votes').find(vote => vote.get('weight') === payload.weight).get('cost'),
            5
        );
    }
    const hasMana = checkHasMana(actionType, remainingMana, {
        entryPublishingCost,
        commentPublishingCost,
        costByWeight
    });
    
    const ethCost = actionType === actionTypes.batch && payload && payload.actions ?
        0.005 * payload.actions.length :
        0.01;
    return {
        eth: balanceToNumber(balance.get('eth'), 2) > ethCost,
        aeth: balanceToNumber(balance.getIn(['aeth', 'free'])) > 0,
        mana: hasMana,
    };
}

function* actionAdd ({ ethAddress, payload, actionType })/* : Saga<void> */ {
    if (actionType === actionTypes.faucet) {
        const id = yield select(actionSelectors.selectActionToPublish);
        yield put(actions.actionPublish(id)); // eslint-disable-line no-use-before-define
    }
    /**
     * Check if user has enough balance to create the action
     */
    const balance = yield select(state => state.profileState.get('balance'));
    const publishingCost = yield select(profileSelectors.selectPublishingCost);
    const hasBalance = hasEnoughBalance(actionType, balance, publishingCost, payload || null);
    if ((hasBalance.eth && hasBalance.mana) || !balanceRequired(actionType)) {
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

function* actionDelete ({ id })/* : Saga<void> */ {
    try {
        yield apply(actionService, actionService.deleteAction, [id]);
    } catch (error) {
        yield put(actions.actionDeleteError(error));
    }
}

function* actionGetAllHistory ({ loadMore })/* : Saga<void> */ {
    const loggedEthAddress = yield select(profileSelectors.selectLoggedEthAddress);
    try {
        const offset = (yield select(actionSelectors.getActionHistory)).size;
        const resp = yield apply(
            actionService,
            actionService.getAllHistory,
            [loggedEthAddress, offset, ACTION_HISTORY_LIMIT]
        );
        yield put(actions.actionGetAllHistorySuccess(resp, { loadMore }));
    } catch (error) {
        yield put(actions.actionGetAllHistoryError(error, { loadMore }));
    }
}

function* actionGetHistory ({ request })/* : Saga<void> */ {
    try {
        const loggedEthAddress = yield select(profileSelectors.selectLoggedEthAddress);
        const data = yield apply(
            actionService,
            actionService.getActionsByType,
            [{ethAddress: loggedEthAddress, type: request}]
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
function* actionGetPending ()/* : Saga<void> */ {
    try {
        const loggedEthAddress = yield select(profileSelectors.selectLoggedEthAddress);
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
function* actionPublish ({ id })/* : Saga<void> */ { // eslint-disable-line complexity
    const action = yield select(state => actionSelectors.selectActionById(state, id));
    const actionId = action.get('id');
    const payload = action.get('payload').toJS();
    if (action.get('type') === actionTypes.batch) {
        const batchActions = yield select(actionSelectors.selectBatchActions);
        for (let i = 0; i < batchActions.size; i++) {
            const act = batchActions.get(i);
            const publishAction = publishActions[act.get('type')];
            if (publishAction) {
                yield put(publishAction({ actionId: act.get('id'), ...act.get('payload').toJS() }));
                yield call([reduxSaga, reduxSaga.delay], 200);
            }
        }
    } else {
        const publishAction = publishActions[action.get('type')];
        if (publishAction) {
            yield put(publishAction({ actionId, ...payload }));
        }
    }
}

/**
 * Save action in local DB
 * This is called from actionUpdate saga, when status is updated to "publishing" or "published"
 */
function* actionSave (id)/* : Saga<void> */ {
    let action = yield select(state => actionSelectors.selectActionById(state, id));
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

function* actionPublished ({ receipt })/* : Saga<void> */ {
    const { blockNumber, cumulativeGasUsed, success, transactionHash } = receipt;
    const loggedEthAddress = yield select(profileSelectors.selectLoggedEthAddress);
    const actionId = yield apply(actionService, actionService.getActionByTx, [transactionHash]);
    const action = yield select(state => actionSelectors.selectActionById(state, actionId)); // eslint-disable-line

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
function* actionUpdate ({ changes })/* : Saga<void> */ {
    const action = yield select(state => actionSelectors.selectActionById(state, changes.id));
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

function* actionUpdateClaim ({ data })/* : Saga<void> */ {
    const loggedEthAddress = yield select(profileSelectors.selectLoggedEthAddress);
    try {
        yield apply(
            actionService,
            actionService.updateClaimAction,
            [loggedEthAddress, data.entryId]
        );
    } catch (error) {
        yield put(actions.actionUpdateClaimError(error));
    }
}

function* actionUpdateClaimVote ({ data })/* : Saga<void> */ {
    const loggedEthAddress = yield select(profileSelectors.selectLoggedEthAddress);
    try {
        yield apply(
            actionService,
            actionService.updateClaimVoteAction,
            [loggedEthAddress, data.entryId]
        );
    } catch (error) {
        yield put(actions.actionUpdateClaimVoteError(error));
    }
}

export function* watchActionActions ()/* : Saga<void> */ {
    yield takeEvery(types.ACTION_ADD, actionAdd); 
    yield takeEvery(types.ACTION_DELETE, actionDelete); 
    yield takeEvery(types.ACTION_GET_ALL_HISTORY, actionGetAllHistory); 
    yield takeEvery(types.ACTION_GET_HISTORY, actionGetHistory); 
    yield takeEvery(types.ACTION_GET_PENDING, actionGetPending); 
    yield takeEvery(types.ACTION_PUBLISH, actionPublish); 
    yield takeEvery(types.ACTION_PUBLISHED, actionPublished); 
    yield takeEvery(types.ACTION_UPDATE, actionUpdate); 
    yield takeEvery(types.ACTION_UPDATE_CLAIM, actionUpdateClaim); 
    yield takeEvery(types.ACTION_UPDATE_CLAIM_VOTE, actionUpdateClaimVote);
}

import { apply, call, fork, put, select, takeEvery } from 'redux-saga/effects';
import * as actions from '../actions/action-actions';
import * as appActions from '../actions/app-actions';
import * as commentsActions from '../actions/comments-actions';
import * as entryActions from '../actions/entry-actions';
import * as profileActions from '../actions/profile-actions';
import * as tagActions from '../actions/tag-actions';
import * as transactionActions from '../actions/transaction-actions';
import * as types from '../constants';
import { selectAction, selectLoggedAkashaId, selectTokenExpiration } from '../selectors';
import * as actionService from '../services/action-service';
import * as actionStatus from '../../constants/action-status';
import * as actionTypes from '../../constants/action-types';

/**
 * Mapping actionType to Action Creator (AC) that launches a "publishing" action
 * These actions are dispatched from the "actionPublish" saga
 * When a new action needs to be created, add a new field here
 * These ACs should receive one parameter: an object containing actionId and
 *   the payload (destructured). See actionPublish below
 */
const publishActions = {
    [actionTypes.claim]: entryActions.entryClaim,
    [actionTypes.comment]: commentsActions.commentsPublish,
    [actionTypes.createTag]: tagActions.tagCreate,
    [actionTypes.downvote]: entryActions.entryDownvote,
    [actionTypes.follow]: profileActions.profileFollow,
    [actionTypes.profileRegister]: profileActions.profileRegister,
    [actionTypes.profileUpdate]: profileActions.profileUpdate,
    [actionTypes.sendTip]: profileActions.profileSendTip,
    [actionTypes.unfollow]: profileActions.profileUnfollow,
    [actionTypes.upvote]: entryActions.entryUpvote
};

/**
 * Mapping actionType to Action Creator that launches a "success" action
 * These actions are dispatched from the "actionUpdate" saga
 * When a new action needs to be created, add a new field here
 * These ACs should receive one parameter: the action's payload object
 */
const publishSuccessActions = {
    [actionTypes.claim]: entryActions.entryClaimSuccess,
    [actionTypes.comment]: commentsActions.commentsPublishSuccess,
    [actionTypes.createTag]: tagActions.tagCreateSuccess,
    [actionTypes.downvote]: entryActions.entryDownvoteSuccess,
    [actionTypes.follow]: profileActions.profileFollowSuccess,
    [actionTypes.profileRegister]: profileActions.profileRegisterSuccess,
    [actionTypes.profileUpdate]: profileActions.profileUpdateSuccess,
    [actionTypes.sendTip]: profileActions.profileSendTipSuccess,
    [actionTypes.unfollow]: profileActions.profileUnfollowSuccess,
    [actionTypes.upvote]: entryActions.entryUpvoteSuccess
};


/**
 * Fetch all actions with a "publishing" status from local db;
 * Then dispatch transactionGetStatus to check if the pending transactions were mined;
 * This is called from bootstrapHome saga (after initial login and on refresh);
 */
function* actionGetPending () {
    try {
        const loggedAkashaId = yield select(selectLoggedAkashaId);
        const data = yield apply(actionService, actionService.getPendingActions, [loggedAkashaId]);
        yield put(actions.actionGetPendingSuccess(data));
        if (data.length) {
            const txs = [];
            const ids = [];
            data.forEach((action) => {
                txs.push(action.tx);
                ids.push(action.id);
            });
            yield put(transactionActions.transactionGetStatus(txs, ids));
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
    // Remove non persistent fields from payload before saving to local DB
    // This is needed to avoid storing useless data like entry content or profile data
    const nonPersistentFields = action.getIn(['payload', 'nonPersistentFields']);
    if (nonPersistentFields && nonPersistentFields.size) {
        nonPersistentFields.forEach((field) => {
            action = action.deleteIn(['payload', field]);
        });
    }
    action = action.deleteIn(['payload', 'nonPersistentFields']);
    try {
        yield apply(actionService, actionService.saveAction, [action.toJS()]);
    } catch (error) {
        yield put(actions.actionSaveError(error));
    }
}

/**
 * React to action updates, depending on the new action status
 * Important: the "changes" object must contain the id of the action
 */
function* actionUpdate ({ changes }) {
    const action = yield select(state => selectAction(state, changes.id));
    if (changes.status === actionStatus.publishing) {
        yield put(transactionActions.transactionAddToQueue([changes]));
        yield fork(actionSave, changes.id);
    }
    if (changes.status === actionStatus.published) {
        yield fork(actionSave, changes.id);
        const publishSuccessAction = publishSuccessActions[action.get('type')];
        if (publishSuccessAction) {
            yield put(publishSuccessAction(action.get('payload').toJS()));
        }
    }
}

// Action watchers

export function* watchActionActions () {
    yield takeEvery(types.ACTION_GET_PENDING, actionGetPending);
    yield takeEvery(types.ACTION_PUBLISH, actionPublish);
    yield takeEvery(types.ACTION_UPDATE, actionUpdate);
}

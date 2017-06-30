import { delay } from 'redux-saga';
import { takeEvery, take, put, select, call, fork, all } from 'redux-saga/effects';
import * as pendingActionService from '../services/pending-actions-service';
import * as types from '../constants';
import * as actions from '../actions/app-actions';
import * as tempProfileActions from '../actions/temp-profile-actions';

const PUBLISHER_PREFIX = '@@publisher/';

const publishTriggerActions = [
    ...Object.keys(types)
        .filter(type => type.includes('PUBLISH'))
];

const filterPublishingActions = ({ type }) =>
    type.includes('_PUBLISH') &&
    type.includes('_START') &&
    type.includes('/');

/**
 * Save pending action in db
 * @param {Record} pendingAction Pending action meta info
 * @param {Record} payload Pending action payload -> the actual entity
 */
function* pendingActionSave ({ akashaId, pendingAction, payload }) {
    const { entityType, entityId } = pendingAction;
    // console.log(entityType, 'the entity that must be saved', payload);
    try {
        yield pendingActionService.savePendingAction(
            akashaId,
            pendingAction.toJS(),
            payload.toJS()
        );
        yield put(actions.pendingActionSaveSuccess(entityId));
    } catch (ex) {
        console.log(ex, 'an exception occured');
    }
}

function* pendingActionPublish ({ type, data }) {
    const entityType = type.split('/')[0];
    switch (entityType) {
        case 'tempProfile':
            // console.log('publish temp profile', data);
            yield put(tempProfileActions.tempProfilePublish({ tempProfile: data, isUpdate: true }));
            break;
        case 'comment':
            console.log('publish a comment');
            break;
        default:
            console.log('publish something');
    }
}

export function* watchPublishActions () {
    yield takeEvery(types.PENDING_ACTION_SAVE, pendingActionSave);
    yield takeEvery(filterPublishingActions, pendingActionPublish);
    // yield fork(watchPublishingStartActions);
    // yield fork(watchCommentPublishActions);
    /** ***************** SIMULATIONS **************** */
    // yield fork(watchConfirmActions);
    // yield fork(watchAuthActions);
    /** ***************** /SIMULATIONS **************** */
}

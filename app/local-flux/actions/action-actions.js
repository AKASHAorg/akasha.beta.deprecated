import * as types from '../constants';
import { action } from './helpers';

export const actionAdd = (ethAddress, actionType, payload) =>
    action(types.ACTION_ADD, { ethAddress, actionType, payload });
export const actionClearHistory = () => action(types.ACTION_CLEAR_HISTORY);
export const actionDelete = id => action(types.ACTION_DELETE, { id });

export const actionDeleteError = error => action(types.ACTION_DELETE_ERROR, { error });
export const actionGetClaimable = () => action(types.ACTION_GET_CLAIMABLE);

export const actionGetClaimableError = (error) => {
    error.code = 'AGCE01';
    error.messageId = 'actionGetClaimable';
    return action(types.ACTION_GET_CLAIMABLE_ERROR, { error });
};

export const actionGetClaimableSuccess = data => action(types.ACTION_GET_CLAIMABLE_SUCCESS, { data });
export const actionGetHistory = request => action(types.ACTION_GET_HISTORY, { request });

export const actionGetHistoryError = (error) => {
    error.code = 'AGHE01';
    error.messageId = 'actionGetHistory';
    return action(types.ACTION_GET_HISTORY_ERROR, { error });
};

export const actionGetHistorySuccess = (data, request) =>
    action(types.ACTION_GET_HISTORY_SUCCESS, { data, request });
export const actionGetPending = () => action(types.ACTION_GET_PENDING);

export const actionGetPendingError = (error) => {
    error.code = 'AGPE01';
    error.messageId = 'actionGetPending';
    return action(types.ACTION_GET_PENDING_ERROR, { error });
};

export const actionGetPendingSuccess = data => action(types.ACTION_GET_PENDING_SUCCESS, { data });
export const actionPublish = id => action(types.ACTION_PUBLISH, { id });
export const actionPublished = receipt => action(types.ACTION_PUBLISHED, { receipt });

export const actionSaveError = (error) => {
    error.code = 'ASE01';
    error.messageId = 'actionSave';
    return action(types.ACTION_SAVE_ERROR, { error });
};

export const actionUpdate = changes => action(types.ACTION_UPDATE, { changes });

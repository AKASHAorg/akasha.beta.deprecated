//@flow strict
import * as types from '../constants';
import { action } from './helpers';
/* ::
import type { ActionType, ErrorPayloadType } from '../../flow-types/actions/action';
import type { ActionAddPayload, ActionNoFunds, ActionDelete, GetAllHistory, ActionGetHistory,
    ActionGetHistorySuccess, ActionGetPendingSuccess, ActionPublish, ActionPublished,
    ActionUpdate, ActionUpdateClaim, ActionUpdateClaimVote
} from '../../flow-types/actions/action-actions';
*/
export const actionAdd = (payload /* : ActionAddPayload */) /* : ActionType */ =>
    action(types.ACTION_ADD, payload);
export const actionAddSuccess = (payload /* : ActionAddPayload */) /* : ActionType */ =>
    action(types.ACTION_ADD_SUCCESS, payload);
export const actionAddNoFunds = (payload /* : ActionNoFunds */) => action(types.ACTION_ADD_NO_FUNDS, payload);

export const actionResetFundingRequirements /* : () => ActionType */ = () =>
    action(types.ACTION_RESET_FUNDING_REQUIREMENTS);

export const actionClearHistory = () /* : ActionType */ => action(types.ACTION_CLEAR_HISTORY);
export const actionDelete = (payload /* : ActionDelete */) => action(types.ACTION_DELETE, payload);

export const actionDeleteError = (payload /*: ErrorPayloadType */) /* : ActionType */ =>
    action(types.ACTION_DELETE_ERROR, payload);

export const actionGetAllHistory = (loadMore /*: Boolean */) /* : ActionType */ =>
    action(types.ACTION_GET_ALL_HISTORY, loadMore);
export const actionGetAllHistoryError = (payload /*: ErrorPayloadType */) /*: ActionType */ => {
    payload.code = 'AGAHE01';
    payload.messageId = 'actionGetAllHistory';
    return action(types.ACTION_GET_ALL_HISTORY_ERROR, payload);
};
export const actionGetAllHistorySuccess = (payload /*: GetAllHistory */) /*: ActionType */ =>
    action(types.ACTION_GET_ALL_HISTORY_SUCCESS, payload);

export const actionGetHistory = (payload /*: ActionGetHistory*/) /*: ActionType */ =>
    action(types.ACTION_GET_HISTORY, payload);
export const actionGetHistoryError = (payload /*: ErrorPayloadType */) /*: ActionType */ => {
    payload.code = 'AGHE01';
    payload.messageId = 'actionGetHistory';
    return action(types.ACTION_GET_HISTORY_ERROR, payload);
};
export const actionGetHistorySuccess = (payload /*: ActionGetHistorySuccess*/) /*: ActionType */ =>
    action(types.ACTION_GET_HISTORY_SUCCESS, payload);

export const actionGetPending = () /* : ActionType */ => action(types.ACTION_GET_PENDING);
export const actionGetPendingError = (payload /*: ErrorPayloadType*/) /* : ActionType */ => {
    payload.code = 'AGPE01';
    payload.messageId = 'actionGetPending';
    return action(types.ACTION_GET_PENDING_ERROR, payload);
};
export const actionGetPendingSuccess = (payload /*: ActionGetPendingSuccess*/) /* : ActionType */ =>
    action(types.ACTION_GET_PENDING_SUCCESS, payload);

export const actionPublish = (payload /*: ActionPublish*/) /* : ActionType */ =>
    action(types.ACTION_PUBLISH, payload);
export const actionPublished = (payload /*: ActionPublished */) /* : ActionType */ =>
    action(types.ACTION_PUBLISHED, payload);

export const actionSaveError = (payload /*: ErrorPayloadType */) /* : ActionType */ => {
    payload.code = 'ASE01';
    payload.messageId = 'actionSave';
    return action(types.ACTION_SAVE_ERROR, payload);
};

export const actionUpdate = (payload /*: ActionUpdate */) /* : ActionType */ =>
    action(types.ACTION_UPDATE, payload);

export const actionUpdateClaim = (payload /*: ActionUpdateClaim*/) /* : ActionType */ =>
    action(types.ACTION_UPDATE_CLAIM, payload);
export const actionUpdateClaimError = (payload /*: ErrorPayloadType */) /* : ActionType */ => {
    payload.code = 'AUCE01';
    return action(types.ACTION_UPDATE_CLAIM_ERROR, payload);
};

export const actionUpdateClaimVote = (payload /*: ActionUpdateClaimVote*/) /* : ActionType */ =>
    action(types.ACTION_UPDATE_CLAIM_VOTE, payload);
export const actionUpdateClaimVoteError = (payload /*: ErrorPayloadType */) /* : ActionType */ => {
    payload.code = 'AUCVE01';
    return action(types.ACTION_UPDATE_CLAIM_VOTE_ERROR, payload);
};

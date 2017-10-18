import pendingActionsDb from './db/pending-actions';

export const savePendingAction = (akashaId, pendingAction, payload) => {
    console.log(akashaId, pendingAction, payload, 'in service');
    return pendingActionsDb.transaction('rw', pendingActionsDb.payloads, pendingActionsDb.actions, () => {
        pendingActionsDb.actions.add({
            id: pendingAction.entityId,
            akashaId,
            ...pendingAction
        });
        pendingActionsDb.payloads.add({
            akashaId,
            ...payload
        });
    });
};

export const updatePendingAction = action => pendingActionsDb.action.update(action);

export const saveActionPayload = payload => pendingActionsDb.payload.put(payload);

export const updateActionPayload = payload => pendingActionsDb.payload.update(payload);

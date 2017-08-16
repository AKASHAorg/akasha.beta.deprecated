import { List, Record, Map } from 'immutable';

export const ActionRecord = Record({
    akashaId: null,
    blockNumber: null,
    cumulativeGasUsed: null,
    id: null,
    payload: new Map(),
    status: null,
    tx: null,
    type: null
});

export const ActionState = Record({
    allActions: new List(),
    byId: new Map(),
    needAuth: null,
    needTransferConfirm: null,
    needWeightConfirm: null,
    published: new List(),
    publishing: new List()
});

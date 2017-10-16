import { List, Record, Map } from 'immutable';

export const ActionRecord = Record({
    blockNumber: null,
    cumulativeGasUsed: null,
    ethAddress: null,
    id: null,
    payload: new Map(),
    status: null,
    success: null,
    tx: null,
    type: null
});

export const ActionState = Record({
    allActions: new List(),
    byId: new Map(),
    byType: new Map(),
    needAuth: null,
    pending: new Map({
        bondAeth: false,
        claim: new Map(),
        comment: new Map(),
        commentVote: new Map(),
        cycleAeth: false,
        createTag: new Map(),
        entryVote: new Map(),
        follow: new Map(),
        profileRegister: false,
        profileUpdate: false,
        sendTip: new Map(),
    }),
    published: new List(),
    publishing: new List()
});

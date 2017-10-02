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
    pending: new Map({
        claim: new Map(),
        comment: new Map(),
        commentVote: new Map(),
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

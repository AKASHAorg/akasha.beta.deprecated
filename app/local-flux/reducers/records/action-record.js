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

const Flags = Record({
    fetchingAethTransfers: false,
    fetchingClaimable: false,
    fetchingHistory: false,
});

export const ActionState = Record({
    allActions: new List(),
    byId: new Map(),
    byType: new Map(),
    claimable: new List(),
    flags: new Flags(),
    history: new List(),
    historyTypes: new List(),
    needAuth: null,
    needEth: null,
    needAeth: null,
    needMana: null,
    pending: new Map({
        bondAeth: false,
        claim: new Map(),
        claimVote: new Map(),
        comment: new Map(),
        commentVote: new Map(),
        cycleAeth: null,
        createTag: new Map(),
        entryVote: new Map(),
        follow: new Map(),
        profileRegister: false,
        profileUpdate: false,
        sendTip: new Map(),
        toggleDonations: false
    }),
    published: new List(),
    publishing: new List(),
    toPublish: null
});

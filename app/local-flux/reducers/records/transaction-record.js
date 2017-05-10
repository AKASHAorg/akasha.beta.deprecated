import { Map, Record } from 'immutable';

export const TransactionFlags = Record({
    deletingPendingTx: new Map(),
    fetchingMined: false,
    fetchingPending: false,
});

export const PendingTransaction = Record({
    akashaId: null,
    extra: {},
    gas: null,
    tx: '',
    type: null,
});

export const MinedTransaction = Record({
    akashaId: null,
    blockNumber: null,
    cumulativeGasUsed: null,
    extra: {},
    hasEvents: false,
    tx: '',
    type: null
});

export const TransactionState = Record({
    pending: new Map(),
    mined: new Map(),
    flags: new TransactionFlags()
});

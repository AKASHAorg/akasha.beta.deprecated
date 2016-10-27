/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record"] }]*/
import { fromJS, Record, List } from 'immutable';
import * as types from '../constants/TransactionConstants';
import { createReducer } from './create-reducer';

const ErrorRecord = Record({
    code: 0,
    fatal: null,
    message: ''
});

const PendingTransaction = Record({
    tx: ''
});

const MinedTransaction = Record({
    tx: '',
    blockNumber: 0,
    cumulativeGasUsed: 0,
    hasEvents: false
});

const initialState = fromJS({
    pending: new List(),
    mined: new List(),
    errors: new List()
});

const transactionState = createReducer(initialState, {

    [types.ADD_TO_QUEUE_SUCCESS]: (state, action) => {
        const txs = action.data.map(tx => new PendingTransaction({ tx }));
        return state.merge({
            pending: state.get('pending').concat(txs)
        });
    },

    [types.ADD_TO_QUEUE_ERROR]: (state, action) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(action.error))
        }),

    [types.TRANSACTION_MINED_SUCCESS]: (state, action) => {
        const { mined, ...other } = action.data;
        return state.merge({
            mined: state.get('mined').push(new MinedTransaction({ tx: mined, ...other })),
            pending: state.get('pending').filter(transaction =>
                transaction.tx !== action.data.mined)
        });
    },

    [types.TRANSACTION_MINED_ERROR]: (state, action) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(action.error))
        }),

    [types.GET_MINED_TRANSACTION_ERROR]: (state, action) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(action.error))
        }),

    [types.GET_MINED_TRANSACTION_SUCCESS]: (state, action) =>
        state.merge({
            mined: state.get('mined').concat(action.data)
        }),

    [types.GET_PENDING_TRANSACTION_SUCCESS]: (state, action) =>
        state.merge({
            pending: state.get('pending').concat(action.data)
        }),

    [types.GET_PENDING_TRANSACTION_ERROR]: (state, action) => {
        return state.merge({
            errors: state.get('errors').push(new ErrorRecord(action.error))
        });
    },
});

export default transactionState;

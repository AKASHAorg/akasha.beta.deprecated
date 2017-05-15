/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record"] }]*/
import { fromJS, Map, Record } from 'immutable';
import * as transactionTypes from '../constants/TransactionConstants';
import * as types from '../constants';
import { createReducer } from './create-reducer';
import { MinedTransaction, PendingTransaction, TransactionFlags, TransactionState } from './records';

const ErrorRecord = Record({
    code: 0,
    fatal: null,
    message: ''
});

const initialState = new TransactionState();

const deletePendingTxFlagHandler = (state, { error, flags }) => {
    const deletingPendingTx = state.getIn(['flags', 'deletingPendingTx']);
    const index = deletingPendingTx.findIndex(flag =>
        flag.tx === flags.deletingPendingTx.tx);
    if (index === -1) {
        return state.merge({
            flags: state.get('flags').merge({
                deletingPendingTx: state.getIn(['flags', 'deletingPendingTx'])
                    .push(flags.deletingPendingTx)
            }),
            errors: error ?
                state.get('errors').push(new ErrorRecord(error)) :
                state.get('errors')
        });
    }
    return state.merge({
        flags: state.get('flags').mergeIn(['deletingPendingTx', index], flags.deletingPendingTx),
        errors: error ?
            state.get('errors').push(new ErrorRecord(error)) :
            state.get('errors')
    });
};

const transactionState = createReducer(initialState, {

    [transactionTypes.ADD_TO_QUEUE_SUCCESS]: (state, action) =>
        state.merge({
            pending: state.get('pending').concat(fromJS(action.data))
        }),

    [transactionTypes.ADD_TO_QUEUE_ERROR]: (state, action) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(action.error))
        }),

    [transactionTypes.TRANSACTION_MINED_SUCCESS]: (state, action) => {
        const { mined, ...other } = action.data;
        return state.merge({
            mined: state.get('mined').push(new MinedTransaction({ tx: mined, ...other }))
        });
    },

    [transactionTypes.TRANSACTION_MINED_ERROR]: (state, action) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(action.error))
        }),

    [transactionTypes.DELETE_PENDING_TX]: deletePendingTxFlagHandler,

    [transactionTypes.DELETE_PENDING_TX_SUCCESS]: (state, { tx, flags }) => {
        const deletingPendingTx = state.getIn(['flags', 'deletingPendingTx']);
        const index = deletingPendingTx.findIndex(flag =>
            flag.tx === flags.deletingPendingTx.tx);
        if (index === -1) {
            return state.merge({
                pending: state.get('pending').filter(pending => pending.get('tx') !== tx),
                flags: state.get('flags').merge({
                    deletingPendingTx: state.getIn(['flags', 'deletingPendingTx'])
                        .push(flags.deletingPendingTx)
                }),
            });
        }
        return state.merge({
            pending: state.get('pending').filter(pending => pending.get('tx') !== tx),
            flags: state.get('flags').mergeIn(['deletingPendingTx', index], flags.deletingPendingTx),
        });
    },

    [transactionTypes.DELETE_PENDING_TX_ERROR]: deletePendingTxFlagHandler,

    [transactionTypes.GET_MINED_TRANSACTION]: state =>
        state.merge({
            fetchingMined: true
        }),

    [transactionTypes.GET_MINED_TRANSACTION_ERROR]: (state, action) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(action.error)),
            fetchingMined: false
        }),

    [transactionTypes.GET_MINED_TRANSACTION_SUCCESS]: (state, action) =>
        state.merge({
            mined: state.get('mined').concat(action.data),
            fetchingMined: false
        }),

    [transactionTypes.GET_PENDING_TRANSACTION]: state =>
        state.merge({
            fetchingPending: true
        }),

    [transactionTypes.GET_PENDING_TRANSACTION_SUCCESS]: (state, action) =>
        state.merge({
            pending: state.get('pending').concat(fromJS(action.data)),
            fetchingPending: false
        }),

    [transactionTypes.GET_PENDING_TRANSACTION_ERROR]: (state, action) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(action.error)),
            fetchingPending: false
        }),

    // *************** NEW REDUCERS **************************

    [types.PROFILE_LOGOUT]: state =>
        state.merge({
            flags: new TransactionFlags(),
            mined: new Map(),
            pending: new Map()
        }),

    [types.TRANSACTION_ADD_TO_QUEUE_SUCCESS]: (state, { request }) => {
        let pending = state.get('pending');
        request.forEach((req) => { pending = pending.set(req.tx, new PendingTransaction(req)); });
        return state.set('pending', pending);
    },

    [types.TRANSACTION_DELETE_PENDING]: (state, { tx }) =>
        state.setIn(['flags', 'deletingPendingTx', tx], true),

    [types.TRANSACTION_DELETE_PENDING_ERROR]: (state, { tx }) =>
        state.setIn(['flags', 'deletingPendingTx', tx], false),

    [types.TRANSACTION_DELETE_PENDING_SUCCESS]: (state, { data }) =>
        state.merge({
            flags: state.get('flags').setIn(['deletingPendingTx', data], false),
            pending: state.get('pending').delete(data)
        }),

    [types.TRANSACTION_EMIT_MINED_SUCCESS]: (state, { data }) => {
        let mined = state.get('mined');
        data.forEach((tx) => { mined = mined.set(tx.tx, new MinedTransaction(tx)); });
        return state.set('mined', mined);
    },

    [types.TRANSACTION_GET_MINED]: state =>
        state.setIn(['flags', 'fetchingMined'], true),

    [types.TRANSACTION_GET_MINED_ERROR]: state =>
        state.setIn(['flags', 'fetchingMined'], false),

    [types.TRANSACTION_GET_MINED_SUCCESS]: (state, { data }) => {
        let mined = new Map();
        data.forEach((tx) => { mined = mined.set(tx.tx, new MinedTransaction(tx)); });
        return state.merge({
            flags: state.get('flags').set('fetchingMined', false),
            mined
        });
    },

    [types.TRANSACTION_GET_PENDING]: state =>
        state.setIn(['flags', 'fetchingPending'], true),

    [types.TRANSACTION_GET_PENDING_ERROR]: state =>
        state.setIn(['flags', 'fetchingPending'], false),

    [types.TRANSACTION_GET_PENDING_SUCCESS]: (state, { data }) => {
        let pending = new Map();
        data.forEach((tx) => { pending = pending.set(tx.tx, new PendingTransaction(tx)); });
        return state.merge({
            flags: state.get('flags').set('fetchingPending', false),
            pending
        });
    },
});

export default transactionState;

/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record"] }]*/
import { fromJS, Record, List, Map } from 'immutable';
import * as types from '../constants/TransactionConstants';
import { createReducer } from './create-reducer';

const ErrorRecord = Record({
    code: 0,
    fatal: null,
    message: ''
});

// const PendingTransaction = Record({
//     tx: '',
//     type: null,
//     profile: '',
//     akashaId: null,
//     tagName: null,
//     draftId: null
// });

const MinedTransaction = Record({
    tx: '',
    profile: '',
    blockNumber: 0,
    cumulativeGasUsed: 0,
    hasEvents: false
});

const initialState = fromJS({
    pending: new List(),
    mined: new List(),
    errors: new List(),
    fetchingMined: false,
    fetchingPending: false,
    flags: new Map({
        deletingPendingTx: new List()
    })
});

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

    [types.ADD_TO_QUEUE_SUCCESS]: (state, action) =>
        state.merge({
            pending: state.get('pending').concat(fromJS(action.data))
        }),

    [types.ADD_TO_QUEUE_ERROR]: (state, action) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(action.error))
        }),

    [types.TRANSACTION_MINED_SUCCESS]: (state, action) => {
        const { mined, ...other } = action.data;
        return state.merge({
            mined: state.get('mined').push(new MinedTransaction({ tx: mined, ...other }))
        });
    },

    [types.TRANSACTION_MINED_ERROR]: (state, action) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(action.error))
        }),

    [types.DELETE_PENDING_TX]: deletePendingTxFlagHandler,

    [types.DELETE_PENDING_TX_SUCCESS]: (state, { tx, flags }) => {
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

    [types.DELETE_PENDING_TX_ERROR]: deletePendingTxFlagHandler,

    [types.GET_MINED_TRANSACTION]: state =>
        state.merge({
            fetchingMined: true
        }),

    [types.GET_MINED_TRANSACTION_ERROR]: (state, action) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(action.error)),
            fetchingMined: false
        }),

    [types.GET_MINED_TRANSACTION_SUCCESS]: (state, action) =>
        state.merge({
            mined: state.get('mined').concat(action.data),
            fetchingMined: false
        }),

    [types.GET_PENDING_TRANSACTION]: state =>
        state.merge({
            fetchingPending: true
        }),

    [types.GET_PENDING_TRANSACTION_SUCCESS]: (state, action) =>
        state.merge({
            pending: state.get('pending').concat(fromJS(action.data)),
            fetchingPending: false
        }),

    [types.GET_PENDING_TRANSACTION_ERROR]: (state, action) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(action.error)),
            fetchingPending: false
        })
});

export default transactionState;

import { Record, Set } from 'immutable';
import { createReducer } from './create-reducer';
import { ErrorRecord } from './records';
import { ErrorModel } from './models';
import * as types from '../constants/error-constants';

const initialState = new ErrorModel();
const pushNewError = (state, { error }) => {
    return state.merge({
        errors: state.get('errors').push(new ErrorRecord(error))
    });
};

const errorReducer = createReducer(initialState, {
    [types.START_GETH_ERROR]: pushNewError,
    [types.STOP_GETH_ERROR]: pushNewError,
    [types.START_IPFS_ERROR]: pushNewError,
    [types.STOP_IPFS_ERROR]: pushNewError,
    [types.SET_IPFS_PORTS_ERROR]: pushNewError,
});

export default errorReducer;

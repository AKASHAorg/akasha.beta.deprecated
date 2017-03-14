import { createReducer } from './create-reducer';
import { ErrorRecord } from './records';
import { ErrorModel } from './models';
import * as types from '../constants';

const initialState = new ErrorModel();
const newError = (error) => {
    const err = new ErrorRecord(error);
    return err.set('id', err.hashCode());
};
const addNewError = (state, { error }) => {
    const err = newError(error);
    const extra = err.fatal ?
        { fatalErrors: state.get('fatalErrors').push(err.id) } :
        { nonFatalErrors: state.get('nonFatalErrors').push(err.id) };

    return state.merge({
        allIds: state.get('allIds').push(err.id),
        byId: state.get('byId').set(err.id, err),
        ...extra
    });
};

const errorState = createReducer(initialState, {
    [types.ERROR_DELETE_FATAL]: (state, { id }) => {
        const index = state.get('fatalErrors').findIndex(err => err.id === id);
        return state.merge({
            fatalErrors: state.get('fatalErrors').delete(index)
        });
    },
    [types.ERROR_DELETE_NON_FATAL]: (state, { id }) => {
        const index = state.get('nonFatalErrors').findIndex(err => err.id === id);
        return state.merge({
            nonFatalErrors: state.get('nonFatalErrors').delete(index)
        });
    },
    [types.GENERAL_SETTINGS_ERROR]: addNewError,
    [types.GENERAL_SETTINGS_SAVE_ERROR]: addNewError,
    [types.GETH_GET_OPTIONS_ERROR]: addNewError,
    [types.GETH_GET_STATUS_ERROR]: addNewError,
    [types.GETH_SAVE_SETTINGS_ERROR]: addNewError,
    [types.GETH_SETTINGS_ERROR]: addNewError,
    [types.GETH_START_ERROR]: addNewError,
    [types.GETH_STOP_ERROR]: addNewError,
    [types.IPFS_GET_CONFIG_ERROR]: addNewError,
    [types.IPFS_GET_PORTS_ERROR]: addNewError,
    [types.IPFS_GET_STATUS_ERROR]: addNewError,
    [types.IPFS_SAVE_SETTINGS_ERROR]: addNewError,
    [types.IPFS_SET_PORTS_ERROR]: addNewError,
    [types.IPFS_SETTINGS_ERROR]: addNewError,
    [types.IPFS_START_ERROR]: addNewError,
    [types.IPFS_STOP_ERROR]: addNewError,
});

export default errorState;

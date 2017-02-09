import { fromJS, Record, List, Map } from 'immutable';
import * as types from '../constants/UtilsConstants';
import { createReducer } from './create-reducer';

const ErrorRecord = Record({
    code: null,
    fatal: null,
    message: ''
});

const initialState = fromJS({
    errors: new List(),
    flags: new Map()
});

const errorHandler = (state, { error, flags }) =>
    state.merge({
        errors: state.get('errors').push(new ErrorRecord(error)),
        flags: state.get('flags').merge(flags)
    });

const flagHandler = (state, { flags }) =>
    state.merge({
        flags: state.get('flags').merge(flags)
    });

const utilsState = createReducer(initialState, {

    [types.BACKUP_KEYS]: flagHandler,

    [types.BACKUP_KEYS_SUCCESS]: flagHandler,

    [types.BACKUP_KEYS_ERROR]: errorHandler,

});

export default utilsState;

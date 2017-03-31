import * as types from '../constants';
import { createReducer } from './create-reducer';
import { UtilsState } from './records';

const initialState = new UtilsState();

const utilsState = createReducer(initialState, {

    [types.BACKUP_KEYS_ERROR]: state =>
        state.setIn(['flags', 'backupPending'], false),

    [types.BACKUP_KEYS_REQUEST]: state =>
        state.setIn(['flags', 'backupPending'], true),

    [types.BACKUP_KEYS_SUCCESS]: state =>
        state.setIn(['flags', 'backupPending'], false),
});

export default utilsState;

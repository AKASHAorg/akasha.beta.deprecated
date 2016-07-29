import * as types from '../constants/SettingsConstants';
import { createReducer } from './create-reducer';
import { fromJS, Map } from 'immutable';

const initialState = fromJS({
    geth: Map(),
    ipfs: Map(),
    flags: {},
    userSettings: Map()
});

const settingsState =  createReducer(initialState, {
    [types.GET_SETTINGS_SUCCESS]: (state, action) => {
        return state.merge({ [action.table]: fromJS(action.data) });
    },
    [types.GET_SETTINGS_ERROR]: (state, action) => {
        return state.merge({ [action.table]: { error: action.error }});
    },
});

export default settingsState;

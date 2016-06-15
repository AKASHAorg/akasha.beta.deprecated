import * as types from '../constants/SettingsConstants';
import { fromJS } from 'immutable';

const initialState = fromJS({
    geth: {},
    ipfs: {}
});

export default function settingsState (state = initialState, action) {
    switch (action.type) {
        case types.GET_SETTINGS_SUCCESS:
            return state.merge({ [action.table]: action.data });
        case types.GET_SETTINGS_ERROR:
            return state.merge({ [action.table]: action.error });
        default:
            return state;
    }
}

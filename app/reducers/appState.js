import * as types from '../constants/AppConstants';
import { fromJS } from 'immutable';

const initialState = fromJS({
    error: [],
    appLoading: false
});


export default function appState (state = initialState, action) {
    switch (action.type) {
        case '@reduxAsyncConnect/BEGIN_GLOBAL_LOAD':
            return state.merge({ appLoading: true });
        case '@reduxAsyncConnect/END_GLOBAL_LOAD':
            return state.merge({ appLoading: false });
        case types.SHOW_ERROR:
            return state.merge({ error: action.error });
        case types.CLEAR_ERRORS:
            return initialState;
        default:
            return state;
    }
}

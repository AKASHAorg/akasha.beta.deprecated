import * as types from '../constants/AppConstants';
import { fromJS } from 'immutable';
import { createReducer } from './create-reducer';

const initialState = fromJS({
    error: [],
    updates: null,
    appLoading: false,
    appUpdating: false,
    showAuthDialog: false,
});

const appState = createReducer(initialState, {
    ['@reduxAsyncConnect/BEGIN_GLOBAL_LOAD']: (state) => {
        return state.merge({ appLoading: true });
    },
    ['@reduxAsyncConnect/END_GLOBAL_LOAD']: (state) => {
        return state.merge({ appLoading: false });
    },
    [types.CHECK_FOR_UPDATES]: (state, action) => {
        return state.merge({ updates: action.updates });
    },
    [types.UPDATE_APP]: (state, action) => {
        return state.set('appUpdating', action.updating);
    },
    [types.SHOW_ERROR]: (state, action) => {
        return state.merge({ error: action.error });
    },
    [types.CLEAR_ERRORS]: () => {
        return initialState;
    },
    [types.SHOW_AUTH_DIALOG]: (state) => {
        return state.set('showAuthDialog', true);
    },
    [types.HIDE_AUTH_DIALOG]: (state) => {
        return state.set('showAuthDialog', false);
    }
});

export default appState;

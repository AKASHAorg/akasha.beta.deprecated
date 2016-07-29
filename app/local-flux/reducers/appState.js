import * as types from '../constants/AppConstants';
import { fromJS } from 'immutable';
import { createReducer } from './create-reducer';

const initialState = fromJS({
    error: [],
    appLoading: false
});


const appState = createReducer(initialState, {
    ['@reduxAsyncConnect/BEGIN_GLOBAL_LOAD']: (state) => {
        return state.merge({ appLoading: true });
    },
    ['@reduxAsyncConnect/END_GLOBAL_LOAD']: (state) => {
        return state.merge({ appLoading: false });
    },
    [types.SHOW_ERROR]: (state, action) => {
        return state.merge({ error: action.error });
    },
    [types.CLEAR_ERRORS]: (state, action) => {
        return initialState;
    }
});

export default appState;

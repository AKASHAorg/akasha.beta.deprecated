import { fromJS } from 'immutable';
import * as types from '../constants/AppConstants';
import { createReducer } from './create-reducer';

const initialState = fromJS({
    activePanel: {
        name: null,
        ovelay: false
    }
});

const panelState = createReducer(initialState, {
    [types.SHOW_PANEL]: (state, action) =>
        state.merge({ activePanel: action.panel }),

    [types.HIDE_PANEL]: (state, action) => {
        if (!action.panel) {
            return state.merge(initialState);
        }
        return state;
    },

    [types.CLEAN_STORE]: state => initialState,
});

export default panelState;

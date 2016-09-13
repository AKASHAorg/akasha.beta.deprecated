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
    [types.SHOW_PANEL]: (state, action) => {
        return state.merge({ activePanel: action.panel });
    },
    [types.HIDE_PANEL]: (state, action) => {
        if (!action.panel) {
            return state.merge(initialState);
        }
    },
});

export default panelState;

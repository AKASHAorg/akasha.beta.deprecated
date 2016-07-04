import * as types from '../constants/AppConstants';
import { fromJS } from 'immutable';

const initialState = fromJS({
    activePanel: {
        name: null,
        ovelay: false
    }
});

export default function panelState (state = initialState, action) {
    switch (action.type) {
        case types.SHOW_PANEL:
            return state.merge({ activePanel: action.panel });
        case types.HIDE_PANEL:
            if (!action.panel) {
                return state.merge(initialState);
            }
            break;
        default:
            return state;
    }
}

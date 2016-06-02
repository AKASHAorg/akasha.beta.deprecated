import * as types from '../constants/PanelConstants';
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
    case types.HIDE_PANELS:
        return state.merge(initialState);
    default:
        return state;
    }
}

import * as types from '../constants';
import { createReducer } from './create-reducer';
import { PanelState } from './records';

const initialState = new PanelState();

const panelState = createReducer(initialState, {
    [types.PANEL_HIDE]: state =>
        state.set('activePanel', null),

    [types.PANEL_SHOW]: (state, { panel }) =>
        state.set('activePanel', panel)
});

export default panelState;

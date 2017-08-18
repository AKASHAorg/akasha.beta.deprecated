import { createReducer } from './create-reducer';
import * as types from '../constants';
import { HighlightRecord, HighlightState } from './records';

const initialState = new HighlightState();

const highlightState = createReducer(initialState, {
    [types.HIGHLIGHT_SAVE_SUCCESS]: (state, { data }) =>
        state.setIn(['byId', data.id], new HighlightRecord(data)),
});

export default highlightState;

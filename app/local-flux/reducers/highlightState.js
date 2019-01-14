import { List } from 'immutable';
import { createReducer } from './utils';
import * as types from '../constants';
import HighlightStateModel, { HighlightRecord } from './state-models/highlight-state-model';

const initialState = new HighlightStateModel();

const highlightState = createReducer(initialState, {
    [types.HIGHLIGHT_DELETE_SUCCESS]: (state, { id }) =>
        state.deleteIn(['byId', id]),

    [types.HIGHLIGHT_EDIT_NOTES_SUCCESS]: (state, { data }) =>
        state.setIn(['byId', data.id], new HighlightRecord(data)),

    [types.HIGHLIGHT_GET_ALL_SUCCESS]: (state, { data }) => {
        let byId = state.get('byId');
        data.forEach((highlight) => {
            byId = byId.set(highlight.id, new HighlightRecord(highlight));
        });
        return state.set('byId', byId);
    },

    [types.HIGHLIGHT_SAVE_SUCCESS]: (state, { data }) =>
        state.setIn(['byId', data.id], new HighlightRecord(data)),

    [types.HIGHLIGHT_SEARCH]: (state, { search }) =>
        state.set('search', search),

    [types.HIGHLIGHT_SEARCH_SUCCESS]: (state, { data }) =>
        state.set('searchResults', new List(data)),

    [types.PROFILE_LOGOUT_SUCCESS]: () => initialState,

    [types.HIGHLIGHT_TOGGLE_NOTE_EDITABLE]: (state, { id }) => {
        const byId = state.get('byId');
        const newById = byId.map((highlight) => {
            if (highlight.get('id') === id) {
                return highlight.set('editNotes', !highlight.get('editNotes'));
            }
            return highlight.set('editNotes', false);
        });
        return state.set('byId', newById);
    },
    // state.setIn(['byId', id, 'editNotes'], !state.getIn(['byId', id, 'editNotes'])),

    [types.HIGHLIGHT_TOGGLE_EDITING]: (state, { id }) => {
        if (id === state.get('editing')) {
            return state.set('editing', null);
        }
        return state.set('editing', id);
    }
});

export default highlightState;

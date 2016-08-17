import * as types from '../constants/EntryConstants';
import { fromJS, List } from 'immutable';
import { createReducer } from './create-reducer';

const initialState = fromJS({
    drafts: List(),
    published: List(),
    savingDraft: false,
    draftsCount: 0,
    entriesCount: 0
});
/**
 * State of the entries and drafts
 */
const entryState = createReducer(initialState, {
    [types.SAVE_DRAFT]: (state) => {
        return state.merge({ savingDraft: true });
    },
    [types.GET_DRAFTS_SUCCESS]: (state, action) => {
        return state.merge({ drafts: List(action.drafts) });
    },
    [types.GET_DRAFT_SUCCESS]: (state, action) => {
        return state.merge({ drafts: List([fromJS(action.draft)]) });
    },
    [types.CREATE_DRAFT_SUCCESS]: (state, action) => {
        state.merge({ drafts: state.get('drafts').push(fromJS(action.draft)) });
        return state.set('savingDraft', false);
    },
    [types.UPDATE_DRAFT_SUCCESS]: (state, action) => {
        const draftIndex = state.get('drafts').findIndex(draft =>
            draft.id === action.draft.id
        );
        state.updateIn(['drafts', draftIndex], () => fromJS(action.draft));
        return state.set('savingDraft', false);
    },
    [types.GET_ENTRIES_COUNT_SUCCESS]: (state, action) => {
        return state.set('entriesCount', action.count);
    },
    [types.GET_DRAFTS_COUNT_SUCCESS]: (state, action) => {
        return state.set('draftsCount', action.count);
    }
});

export default entryState;


import * as types from '../constants/EntryConstants';
import { fromJS, List } from 'immutable';

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

export default function entryState (state = initialState, action) {
    switch (action.type) {
        case types.SAVE_DRAFT:
            return state.merge({ savingDraft: true });
        case types.GET_DRAFTS_SUCCESS:
            return state.merge({ drafts: action.drafts });
        case types.GET_DRAFT_SUCCESS:
            return state.merge({ drafts: state.get('drafts').push(action.draft) });
        case types.CREATE_DRAFT_SUCCESS:
            state.merge({ drafts: state.get('drafts').push(fromJS(action.draft)) });
            return state.set('savingDraft', false);
        case types.UPDATE_DRAFT_SUCCESS: {
            const draftIndex = state.get('drafts').findIndex(draft =>
                draft.id === action.draft.id
            );
            state.updateIn(['drafts', draftIndex], () => fromJS(action.draft));
            console.log(action.draft, 'drafts');
            return state.set('savingDraft', false);
        }
        case types.GET_ENTRIES_COUNT_SUCCESS:
            return state.set('entriesCount', action.count);
        case types.GET_DRAFTS_COUNT_SUCCESS:
            return state.set('draftsCount', action.count);
        default:
            return state;
    }
}

import { fromJS, List, Record } from 'immutable';
import { createReducer } from './create-reducer';
import * as types from '../constants/EntryConstants';

const Draft = Record({
    id: null,
    content: {},
    title: null,
    wordCount: 0,
    excerpt: null,
    featured_image: null,
    tags: new List(),
    status: {
        created_at: '',
        updated_at: '',
        tagsPublished: false,
        publishing: false
    }
});

const Entry = Record({
    content: {},
    title: null,
    wordCount: 0,
    excerpt: null,
    featured_image: null,
    tags: new List(),
    address: null,
    ipfsHash: null
});

const initialState = fromJS({
    drafts: new List(),
    published: new List(),
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
        const drafts = new List(action.drafts.map(draft => new Draft(draft)));
        return state.merge({
            drafts: state.get('drafts').concat(drafts)
        });
    },
    [types.GET_DRAFT_SUCCESS]: (state, action) => {
        return state.merge({
            drafts: state.get('drafts').push(new Draft(action.draft))
        });
    },
    [types.CREATE_DRAFT_SUCCESS]: (state, action) => {
        const draft = new Draft(action.draft);
        return state.merge({
            drafts: state.get('drafts').push(draft),
            savingDraft: false
        });
    },
    [types.UPDATE_DRAFT_SUCCESS]: (state, action) => {
        const draftIndex = state.get('drafts').findIndex(draft => {
            return draft.id === action.draft.id;
        });
        return state.merge({
            drafts: state.updateIn(['drafts', draftIndex], (record) => {
                return record.merge(new Map(action.draft));
            }),
            savingDraft: false
        });
    },
    [types.GET_ENTRIES_COUNT_SUCCESS]: (state, action) => {
        return state.set('entriesCount', action.count);
    },
    [types.GET_DRAFTS_COUNT_SUCCESS]: (state, action) => {
        return state.set('draftsCount', action.count);
    },
    [types.PUBLISH_ENTRY_SUCCESS]: (state, action) => {
        const draftIndex = state.get('drafts').findIndex(drft =>
            drft.get('id') === action.entry.id);
        return state.merge({
            drafts: state.get('drafts').delete(draftIndex),
            entries: state.get('entries').push(new Entry(action.entry))
        });
    },
    [types.GET_SORTED_ENTRIES]: (state, action) => {
        return state.merge({
            published: action.entries
        });
    }
});

export default entryState;


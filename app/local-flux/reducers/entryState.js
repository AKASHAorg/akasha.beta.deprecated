/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record"] }]*/
import { fromJS, List, Record, Map } from 'immutable';
import { createReducer } from './create-reducer';
import * as types from '../constants/EntryConstants';

const ErrorRecord = Record({
    code: '',
    message: null,
    fatal: false
});
const Entry = Record({
    content: {},
    title: null,
    wordCount: 0,
    excerpt: null,
    featured_image: null,
    tags: new List(),
    address: null,
    ipfsHash: null,
    created_at: new Date(2016, 1, 5).toString()
});
const SavedEntry = Record({
    address: String,
    author: {},
    commentCount: Number,
    content: [],
    downvotes: Number,
    excerpt: String,
    id: Number,
    licence: {},
    shareCount: Number,
    status: {
        created_at: Date(),
        updated_at: Date()
    },
    tags: [],
    title: String,
    upvotes: Number,
    username: String,
    wordCount: Number
});
const initialState = fromJS({
    published: new List(),
    savedEntries: new List(),
    errors: new List(),
    flags: new Map(),
    fetchingEntriesCount: false,
    entriesCount: 0 // entries published by a logged profile
});
/**
 * State of the entries and drafts
 */
const entryState = createReducer(initialState, {
    [types.GET_ENTRIES_COUNT]: (state, { flags }) =>
        state.merge({
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_ENTRIES_COUNT_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            entriesCount: parseInt(data.count, 10),
            flags: state.get('flags').merge(flags)
        }),

    [types.PUBLISH_ENTRY_SUCCESS]: (state, action) => {
        const draftIndex = state.get('drafts').findIndex(drft =>
            drft.get('id') === action.entry.id);
        return state.merge({
            drafts: state.get('drafts').delete(draftIndex),
            entries: state.get('entries').push(new Entry(action.entry))
        });
    },

    [types.GET_SORTED_ENTRIES]: (state, action) => {
        const entriesList = new List(action.entries.map(entry => new Entry(entry)));
        return state.merge({
            published: entriesList
        });
    },

    [types.CREATE_SAVED_ENTRY_SUCCESS]: (state, action) =>
        state.merge({
            savedEntries: state.get('savedEntries').push(new SavedEntry(action.entry))
        }),

    [types.GET_SAVED_ENTRIES_SUCCESS]: (state, action) => {
        const entriesList = new List(action.entries.map(entry => new SavedEntry(entry)));
        return state.set('savedEntries', entriesList);
    }
});

export default entryState;

/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record", "EntryContent", "EntryEth"] }]*/
import { fromJS, List, Record, Map } from 'immutable';
import { createReducer } from './create-reducer';
import * as types from '../constants/EntryConstants';

const ErrorRecord = Record({
    code: '',
    message: null,
    fatal: false
});

const EntryContent = Record({
    draft: {},
    excerpt: null,
    featuredImage: null,
    licence: {},
    tags: [],
    title: ''
});

const EntryEth = Record({
    blockNr: null,
    ipfsHash: null,
    publisher: null
});

const Entry = Record({
    akashaId: null,
    active: null,
    baseUrl: '',
    content: EntryContent(),
    entryEth: EntryEth(),
    entryId: null,
    score: null
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
    akashaId: String,
    wordCount: Number
});
const Licence = Record({
    id: null,
    parent: null,
    label: '',
    description: []
});
const EntriesStream = Record({
    akashaId: null,
    profiles: new List(),
    tags: new List()
});
const initialState = fromJS({
    published: new List(),
    savedEntries: new List(),
    licences: new List(),
    errors: new List(),
    flags: new Map(),
    fetchingEntriesCount: false,
    entriesStream: new EntriesStream(),
    tagEntries: new List(), // entries published with the selected tag
    savedEntries: new List(),
    moreTagEntries: false,
    moreSavedEntries: false,
    tagEntriesCount: new Map(),
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

    [types.PUBLISH_ENTRY_SUCCESS]: (state, action) =>
        state.merge({
            entries: state.get('entries').push(new Entry(action.entry))
        }),

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
    },

    [types.GET_PROFILE_ENTRIES]: (state, flags) =>
        state.merge({
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_PROFILE_ENTRIES_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            published: state.get('published').concat(data.collection.map(item =>
                new Entry({ akashaId: data.akashaId, ...item.content }))),
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_PROFILE_ENTRIES_ERROR]: (state, { error, flags }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_LICENCES_SUCCESS]: (state, { licences }) => {
        const licencesList = new List(licences.map(licence => new Licence(licence)));
        return state.set('licences', licencesList);
    },

    [types.GET_LICENCES_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.GET_LICENCE_BY_ID_SUCCESS]: (state, { licence }) =>
        state.merge({
            licences: state.get('licences').push(new Licence(licence))
        }),

    [types.GET_LICENCE_BY_ID_ERROR]: (state, { error }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error))
        }),

    [types.GET_ENTRIES_STREAM]: (state, { flags }) =>
        state.merge({
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_ENTRIES_STREAM_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            entriesStream: new EntriesStream(fromJS(data)),
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_ENTRIES_STREAM_ERROR]: (state, { error, flags }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            flags: state.get('flags').merge(flags)
        }),

    [types.ENTRY_TAG_ITERATOR]: (state, { flags }) =>
        state.merge({
            flags: state.get('flags').merge(flags)
        }),

    [types.ENTRY_TAG_ITERATOR_SUCCESS]: (state, { data, flags }) => {
        const moreTagEntries = data.limit === data.collection.length;
        const newTagEntries = moreTagEntries ?
            fromJS(data.collection.slice(0, -1)) :
            fromJS(data.collection);
        return state.merge({
            tagEntries: state.get('tagEntries').concat(newTagEntries),
            moreTagEntries,
            flags: state.get('flags').merge(flags)
        })
    },

    [types.ENTRY_TAG_ITERATOR_ERROR]: (state, { error, flags }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_TAG_ENTRIES_COUNT]: (state, { flags }) =>
        state.merge({
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_TAG_ENTRIES_COUNT_SUCCESS]: (state, { data, flags }) => {
        return state.merge({
            tagEntriesCount: state.get('tagEntriesCount').merge(fromJS(data)),
            flags: state.get('flags').merge(flags)
        })
    },

    [types.GET_TAG_ENTRIES_COUNT_ERROR]: (state, { error, flags }) =>
        state.merge({
            errors: state.get('errors').push(new ErrorRecord(error)),
            flags: state.get('flags').merge(flags)
        }),


    [types.CLEAR_TAG_ENTRIES]: state =>
        state.merge({
            tagEntries: new List()
        })
});

export default entryState;

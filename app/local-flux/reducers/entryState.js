/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record", "EntryContent", "EntryEth"] }]*/
import { fromJS, List, Record, Map } from 'immutable';
import { createReducer } from './create-reducer';
import * as types from '../constants/EntryConstants';
import * as commentsTypes from '../constants/CommentsConstants';
import * as appTypes from '../constants/AppConstants';

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
    title: '',
    wordCount: null
});

const EntryEth = Record({
    blockNr: null,
    ipfsHash: null,
    publisher: null,
    unixStamp: null
});

const Entry = Record({
    akashaId: null,
    active: null,
    balance: null,
    baseUrl: '',
    canClaim: null,
    content: EntryContent(),
    entryEth: EntryEth(),
    entryId: null,
    score: null,
    commentsCount: 0,
    voteWeight: null
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
    licences: new List(),
    errors: new List(),
    flags: new Map({
        votePending: new List(),
        claimPending: new List()
    }),
    fetchingEntriesCount: false,
    entriesStream: new EntriesStream(),
    entries: new List(),
    fullEntry: null,
    savedEntries: new List(),
    moreProfileEntries: false,
    moreSavedEntries: false,
    moreTagEntries: false,
    tagEntriesCount: new Map(),
    entriesCount: 0, // entries published by a logged profile
    voteCost: new Map()
});

const voteFlagHandler = (state, { error, flags }) => {
    const votePending = state.getIn(['flags', 'votePending']);
    const index = votePending.findIndex(flag =>
        flag.entryId === flags.votePending.entryId);
    if (index === -1) {
        return state.merge({
            flags: state.get('flags').merge({
                votePending: state.getIn(['flags', 'votePending'])
                    .push(flags.votePending)
            }),
            errors: error ?
                state.get('errors').push(new ErrorRecord(error)) :
                state.get('errors')
        });
    }
    return state.merge({
        flags: state.get('flags').mergeIn(['votePending', index], flags.votePending),
        errors: error ?
            state.get('errors').push(new ErrorRecord(error)) :
            state.get('errors')
    });
};

const claimFlagHandler = (state, { error, flags }) => {
    const claimPending = state.getIn(['flags', 'claimPending']);
    const index = claimPending.findIndex(flag =>
        flag.entryId === flags.claimPending.entryId);
    if (index === -1) {
        return state.merge({
            flags: state.get('flags').merge({
                claimPending: state.getIn(['flags', 'claimPending'])
                    .push(flags.claimPending)
            }),
            errors: error ?
                state.get('errors').push(new ErrorRecord(error)) :
                state.get('errors')
        });
    }
    return state.merge({
        flags: state.get('flags').mergeIn(['claimPending', index], flags.claimPending),
        errors: error ?
            state.get('errors').push(new ErrorRecord(error)) :
            state.get('errors')
    });
};

const flagHandler = (state, { flags }) =>
    state.merge({
        flags: state.get('flags').merge(flags)
    });

const errorHandler = (state, { error, flags }) =>
    state.merge({
        errors: state.get('errors').push(new ErrorRecord(error)),
        flags: state.get('flags').merge(flags)
    });

/**
 * State of the entries and drafts
 */
const entryState = createReducer(initialState, {
    [types.GET_ENTRIES_COUNT]: flagHandler,

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

    [types.GET_SAVED_ENTRIES]: flagHandler,

    [types.GET_SAVED_ENTRIES_ERROR]: errorHandler,

    [types.GET_SAVED_ENTRIES_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            savedEntries: fromJS(data),
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_SAVED_ENTRIES_LIST]: flagHandler,

    [types.GET_SAVED_ENTRIES_LIST_ERROR]: errorHandler,

    [types.GET_SAVED_ENTRIES_LIST_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            entries: state.get('entries')
                .filter(entry => entry.get('type') !== 'savedEntry')
                .concat(fromJS(data.collection).map(entry => entry.set('type', 'savedEntry'))),
            flags: state.get('flags').merge(flags)
        }),

    [types.MORE_SAVED_ENTRIES_LIST]: flagHandler,

    [types.MORE_SAVED_ENTRIES_LIST_ERROR]: errorHandler,

    [types.MORE_SAVED_ENTRIES_LIST_SUCCESS]: (state, { data, flags }) => {
        const entries = fromJS(data.collection).map(entry => entry.set('type', 'savedEntry'));
        return state.merge({
            entries: state.get('entries').concat(entries),
            flags: state.get('flags').merge(flags)
        });
    },

    [types.ENTRY_PROFILE_ITERATOR]: flagHandler,

    [types.ENTRY_PROFILE_ITERATOR_SUCCESS]: (state, { data, flags }) => {
        const moreProfileEntries = data.limit === data.collection.length;
        const newProfileEntries = moreProfileEntries ?
            fromJS(data.collection.slice(0, -1).map((entry) => {
                return { content: entry, entryId: entry.entryId };
            })) :
            fromJS(data.collection.map((entry) => {
                return { content: entry, entryId: entry.entryId };
            }));
        return state.merge({
            entries: state.get('entries')
                .filter(entry =>
                    entry.get('type') !== 'profileEntry' || entry.get('akashaId') !== data.akashaId)
                .concat(newProfileEntries.map(entry =>
                    entry.merge({ type: 'profileEntry', akashaId: data.akashaId })
                )),
            moreProfileEntries,
            flags: state.get('flags').merge(flags)
        });
    },

    [types.ENTRY_PROFILE_ITERATOR_ERROR]: errorHandler,

    [types.MORE_ENTRY_PROFILE_ITERATOR]: flagHandler,

    [types.MORE_ENTRY_PROFILE_ITERATOR_SUCCESS]: (state, { data, flags }) => {
        const moreProfileEntries = data.limit === data.collection.length;
        const newProfileEntries = moreProfileEntries ?
            fromJS(data.collection.slice(0, -1).map((entry) => {
                return { content: entry, entryId: entry.entryId };
            })) :
            fromJS(data.collection.map((entry) => {
                return { content: entry, entryId: entry.entryId };
            }));
        return state.merge({
            entries: state.get('entries').concat(newProfileEntries.map(entry =>
                entry.merge({ type: 'profileEntry', akashaId: data.akashaId }))),
            moreProfileEntries,
            flags: state.get('flags').merge(flags)
        });
    },

    [types.MORE_ENTRY_PROFILE_ITERATOR_ERROR]: errorHandler,

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

    [types.GET_ENTRIES_STREAM]: flagHandler,

    [types.GET_ENTRIES_STREAM_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            entriesStream: new EntriesStream(fromJS(data)),
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_ENTRIES_STREAM_ERROR]: errorHandler,

    [types.ENTRY_TAG_ITERATOR]: flagHandler,

    [types.ENTRY_TAG_ITERATOR_SUCCESS]: (state, { data, flags }) => {
        const moreTagEntries = data.limit === data.collection.length;
        const newTagEntries = moreTagEntries ?
            fromJS(data.collection.slice(0, -1).map((entry) => {
                return { content: entry, entryId: entry.entryId };
            })) :
            fromJS(data.collection.map((entry) => {
                return { content: entry, entryId: entry.entryId };
            }));
        return state.merge({
            entries: state.get('entries')
                .filter(entry => entry.get('type') !== 'tagEntry')
                .concat(newTagEntries.map(entry => entry.set('type', 'tagEntry'))),
            moreTagEntries,
            flags: state.get('flags').merge(flags)
        });
    },

    [types.ENTRY_TAG_ITERATOR_ERROR]: errorHandler,

    [types.MORE_ENTRY_TAG_ITERATOR]: flagHandler,

    [types.MORE_ENTRY_TAG_ITERATOR_SUCCESS]: (state, { data, flags }) => {
        const moreTagEntries = data.limit === data.collection.length;
        const newTagEntries = moreTagEntries ?
            fromJS(data.collection.slice(0, -1).map((entry) => {
                return { content: entry, entryId: entry.entryId };
            })) :
            fromJS(data.collection.map((entry) => {
                return { content: entry, entryId: entry.entryId };
            }));
        return state.merge({
            entries: state.get('entries').concat(newTagEntries.map(entry =>
                entry.set('type', 'tagEntry'))),
            moreTagEntries,
            flags: state.get('flags').merge(flags)
        });
    },

    [types.MORE_ENTRY_TAG_ITERATOR_ERROR]: errorHandler,

    [types.GET_TAG_ENTRIES_COUNT]: flagHandler,

    [types.GET_TAG_ENTRIES_COUNT_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            tagEntriesCount: state.get('tagEntriesCount').merge(fromJS(data)),
            flags: state.get('flags').merge(flags)
        }),

    [types.GET_TAG_ENTRIES_COUNT_ERROR]: errorHandler,

    [types.VOTE_COST]: flagHandler,

    [types.VOTE_COST_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            voteCost: state.get('voteCost').merge({ [data.weight]: data.cost }),
            flags: state.get('flags').merge(flags)
        }),

    [types.VOTE_COST_ERROR]: errorHandler,

    [types.UPVOTE]: voteFlagHandler,

    [types.UPVOTE_SUCCESS]: voteFlagHandler,

    [types.UPVOTE_ERROR]: voteFlagHandler,

    [types.DOWNVOTE]: voteFlagHandler,

    [types.DOWNVOTE_SUCCESS]: voteFlagHandler,

    [types.DOWNVOTE_ERROR]: voteFlagHandler,

    [types.GET_ENTRY]: flagHandler,

    [types.GET_ENTRY_ERROR]: errorHandler,

    [types.GET_ENTRY_SUCCESS]: (state, { data, flags }) => {
        const entryIndex = state.get('entries').findIndex(entry =>
            entry.get('entryId') === data.entryId);
        return state.merge({
            entries: state.get('entries').mergeIn([entryIndex], data),
            flags: state.get('flags').merge(flags)
        });
    },
    [types.GET_FULL_ENTRY]: flagHandler,
    [types.GET_FULL_ENTRY_ERROR]: errorHandler,
    [types.GET_FULL_ENTRY_SUCCESS]: (state, { data, flags }) => {
        const { active, baseUrl, commentsCount, entryId, score, content, entryEth } = data;
        const newEntry = new Entry({
            active,
            baseUrl,
            commentsCount: parseInt(commentsCount, 10),
            entryId,
            score,
            content: content ? new EntryContent(content) : null,
            entryEth: new EntryEth(entryEth)
        });
        const newState = state.setIn(['fullEntry'], newEntry);
        return newState.merge({
            flags: state.get('flags').merge(flags)
        });
    },
    [commentsTypes.GET_COMMENTS_COUNT_SUCCESS]: (state, { data }) => {
        if (state.get('fullEntry') && (data.entryId === state.getIn(['fullEntry', 'entryId']))) {
            return state.merge({
                fullEntry: state.get('fullEntry').setIn(['commentsCount'], parseInt(data.count, 10))
            });
        }
        return state;
    },
    [types.UNLOAD_FULL_ENTRY]: state =>
        state.set('fullEntry', null),

    [types.GET_SCORE]: flagHandler,

    [types.GET_SCORE_ERROR]: errorHandler,

    [types.GET_SCORE_SUCCESS]: (state, { data, flags }) => {
        const entryIndex = state.get('entries').findIndex(entry =>
            entry.get('entryId') === data.entryId);
        const oldFullEntry = state.get('fullEntry');
        const fullEntry = oldFullEntry && data.entryId === oldFullEntry.entryId ?
            oldFullEntry.set('score', data.score) :
            oldFullEntry;
        return state.merge({
            entries: entryIndex === -1 ?
                state.get('entries') :
                state.get('entries').mergeIn([entryIndex, 'content', 'score'], data.score),
            flags: state.get('flags').merge(flags),
            fullEntry
        });
    },

    [types.IS_ACTIVE]: flagHandler,

    [types.IS_ACTIVE_ERROR]: errorHandler,

    [types.IS_ACTIVE_SUCCESS]: (state, { data, flags }) => {
        const entryIndex = state.get('entries').findIndex(entry =>
            entry.get('entryId') === data.entryId);
        const oldFullEntry = state.get('fullEntry');
        const fullEntry = oldFullEntry && data.entryId === oldFullEntry.entryId ?
            oldFullEntry.set('active', data.active) :
            oldFullEntry;
        return state.merge({
            entries: entryIndex === -1 ?
                state.get('entries') :
                state.get('entries').mergeIn([entryIndex, 'content', 'active'], data.active),
            flags: state.get('flags').merge(flags),
            fullEntry
        });
    },

    [types.GET_VOTE_OF]: flagHandler,

    [types.GET_VOTE_OF_ERROR]: errorHandler,

    [types.GET_VOTE_OF_SUCCESS]: (state, { data, flags }) => {
        const entryIndex = state.get('entries').findLastIndex(entry =>
            entry.get('entryId') === data.entryId);
        const oldFullEntry = state.get('fullEntry');
        const fullEntry = oldFullEntry && data.entryId === oldFullEntry.entryId ?
            oldFullEntry.set('voteWeight', data.weight) :
            oldFullEntry;
        return state.merge({
            entries: entryIndex === -1 ?
                state.get('entries') :
                state.get('entries').setIn([entryIndex, 'content', 'voteWeight'], data.weight),
            flags: state.get('flags').merge(flags),
            fullEntry
        });
    },

    [types.SAVE_ENTRY]: flagHandler,

    [types.SAVE_ENTRY_ERROR]: errorHandler,

    [types.SAVE_ENTRY_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            savedEntries: state.get('savedEntries').push(fromJS(data)),
            flags: state.get('flags').merge(flags)
        }),

    [types.DELETE_ENTRY]: flagHandler,

    [types.DELETE_ENTRY_ERROR]: errorHandler,

    [types.DELETE_ENTRY_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            savedEntries: state.get('savedEntries').filter(entry => entry.get('entryId') !== data),
            entries: state.get('entries').filter(entry =>
                entry.get('type') !== 'savedEntry' || entry.get('entryId') !== data),
            flags: state.get('flags').merge(flags)
        }),

    [types.CAN_CLAIM]: flagHandler,

    [types.CAN_CLAIM_ERROR]: errorHandler,

    [types.CAN_CLAIM_SUCCESS]: (state, { data, flags }) => {
        const entryIndex = state.get('entries').findLastIndex(entry =>
            entry.get('entryId') === data.entryId);
        const oldFullEntry = state.get('fullEntry');
        const fullEntry = oldFullEntry && data.entryId === oldFullEntry.entryId ?
            oldFullEntry.set('canClaim', data.canClaim) :
            oldFullEntry;

        return state.merge({
            entries: state.get('entries').mergeIn([entryIndex, 'content'], {
                canClaim: data.canClaim
            }),
            flags: state.get('flags').merge(flags),
            fullEntry
        });
    },

    [types.GET_ENTRY_BALANCE]: flagHandler,

    [types.GET_ENTRY_BALANCE_ERROR]: errorHandler,

    [types.GET_ENTRY_BALANCE_SUCCESS]: (state, { data, flags }) => {
        const entryIndex = state.get('entries').findLastIndex(entry =>
            entry.get('entryId') === data.entryId);
        const oldFullEntry = state.get('fullEntry');
        const fullEntry = oldFullEntry && data.entryId === oldFullEntry.entryId ?
            oldFullEntry.set('balance', data.balance) :
            oldFullEntry;

        return state.merge({
            entries: state.get('entries').mergeIn([entryIndex, 'content'], {
                balance: data.balance
            }),
            flags: state.get('flags').merge(flags),
            fullEntry
        });
    },

    [types.CLEAR_TAG_ENTRIES]: state =>
        state.merge({
            entries: state.get('entries').filter(entry => entry.get('type') !== 'tagEntry')
        }),

    [types.CLEAR_SAVED_ENTRIES]: state =>
        state.merge({
            entries: state.get('entries').filter(entry => entry.get('type') !== 'savedEntry')
        }),

    [types.CLEAR_PROFILE_ENTRIES]: state =>
        state.merge({
            entries: state.get('entries').filter(entry => entry.get('type') !== 'profileEntry')
        }),

    [types.CLAIM]: claimFlagHandler,

    [types.CLAIM_SUCCESS]: claimFlagHandler,

    [types.CLAIM_ERROR]: claimFlagHandler,

    [appTypes.CLEAN_STORE]: () => initialState,
});

export default entryState;

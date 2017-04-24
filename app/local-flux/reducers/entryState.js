/* eslint new-cap: ["error", { "capIsNewExceptions": ["Record", "EntryContent", "EntryEth"] }]*/
import { fromJS, List, Record } from 'immutable';
import { createReducer } from './create-reducer';
import * as entryTypes from '../constants/EntryConstants';
import * as commentsTypes from '../constants/CommentsConstants';
import * as appTypes from '../constants/AppConstants';
import * as searchTypes from '../constants/SearchConstants';
import * as types from '../constants';
import { EntriesStream, EntryContent, EntryEth, EntryRecord, EntryState } from './records';

const ErrorRecord = Record({
    code: '',
    message: null,
    fatal: false
});

const initialState = new EntryState();

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

const querySuccessHandler = (state, { data }) => {
    const newSearchEntries = fromJS(data.collection.map(entry => (
        { content: entry, entryId: entry.entryId, type: 'searchEntry' }
    )));
    return state.merge({
        entries: state.get('entries').concat(newSearchEntries),
    });
};

const addEntry = (byId, entry) => {
    if (!entry) {
        return byId;
    }
    let record = new EntryRecord(entry);
    if (entry.content) {
        record = record.set('content', new EntryContent(entry.content));
    }
    record = record.set('entryEth', new EntryEth(entry.entryEth));
    if (entry.entryEth.publisher) {
        // only keep a reference to the publisher's profile address
        record = record.setIn(['entryEth', 'publisher'], entry.entryEth.publisher.profile);
    }
    return byId.set(entry.entryId, record);
};

const entryIteratorHandler = (state, { data }) => {
    let byId = state.get('byId');
    const moreEntries = data.limit === data.collection.length;
    data.collection.forEach((entry, index) => {
        // the request is made for n + 1 entries to determine if there are more entries left
        // if this is the case, ignore the extra entry
        if (!moreEntries || index !== data.collection.length - 1) {
            byId = addEntry(byId, entry);
        }
    });
    return state.set('byId', byId);
};

/**
 * State of the entries and drafts
 */
const entryState = createReducer(initialState, {
    [entryTypes.GET_ENTRIES_COUNT]: flagHandler,

    [entryTypes.GET_ENTRIES_COUNT_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            entriesCount: parseInt(data.count, 10),
            flags: state.get('flags').merge(flags)
        }),

    [entryTypes.PUBLISH_ENTRY_SUCCESS]: (state, action) =>
        state.merge({
            entries: state.get('entries').push(new EntryRecord(action.entry))
        }),

    [entryTypes.GET_SORTED_ENTRIES]: (state, action) => {
        const entriesList = new List(action.entries.map(entry => new EntryRecord(entry)));
        return state.merge({
            published: entriesList
        });
    },

    [entryTypes.GET_SAVED_ENTRIES]: flagHandler,

    [entryTypes.GET_SAVED_ENTRIES_ERROR]: errorHandler,

    [entryTypes.GET_SAVED_ENTRIES_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            savedEntries: fromJS(data),
            flags: state.get('flags').merge(flags)
        }),

    [entryTypes.GET_SAVED_ENTRIES_LIST]: flagHandler,

    [entryTypes.GET_SAVED_ENTRIES_LIST_ERROR]: errorHandler,

    [entryTypes.GET_SAVED_ENTRIES_LIST_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            entries: state.get('entries')
                .filter(entry => entry.get('type') !== 'savedEntry')
                .concat(fromJS(data.collection.map(entry => (
                    { content: entry, entryId: entry.entryId, type: 'savedEntry' }
                )))),
            flags: state.get('flags').merge(flags)
        }),

    [entryTypes.MORE_SAVED_ENTRIES_LIST]: flagHandler,

    [entryTypes.MORE_SAVED_ENTRIES_LIST_ERROR]: errorHandler,

    [entryTypes.MORE_SAVED_ENTRIES_LIST_SUCCESS]: (state, { data, flags }) => {
        const entries = fromJS(data.collection).map(entry => entry.set('type', 'savedEntry'));
        return state.merge({
            entries: state.get('entries').concat(entries),
            flags: state.get('flags').merge(flags)
        });
    },

    // [entryTypes.ENTRY_PROFILE_ITERATOR]: flagHandler,

    // [entryTypes.ENTRY_PROFILE_ITERATOR_SUCCESS]: (state, { data, flags }) => {
    //     const moreProfileEntries = data.limit === data.collection.length;
    //     const newProfileEntries = moreProfileEntries ?
    //         fromJS(data.collection.slice(0, -1).map(entry => (
    //             { content: entry, entryId: entry.entryId }
    //         ))) :
    //         fromJS(data.collection.map(entry => (
    //             { content: entry, entryId: entry.entryId }
    //         )));
    //     return state.merge({
    //         entries: state.get('entries')
    //             .filter(entry =>
    //                 entry.get('type') !== 'profileEntry' || entry.get('akashaId') !== data.akashaId)
    //             .concat(newProfileEntries.map(entry =>
    //                 entry.merge({ type: 'profileEntry', akashaId: data.akashaId })
    //             )),
    //         moreProfileEntries,
    //         flags: state.get('flags').merge(flags)
    //     });
    // },

    // [entryTypes.ENTRY_PROFILE_ITERATOR_ERROR]: errorHandler,

    // [entryTypes.MORE_ENTRY_PROFILE_ITERATOR]: flagHandler,

    // [entryTypes.MORE_ENTRY_PROFILE_ITERATOR_SUCCESS]: (state, { data, flags }) => {
    //     const moreProfileEntries = data.limit === data.collection.length;
    //     const newProfileEntries = moreProfileEntries ?
    //         fromJS(data.collection.slice(0, -1).map(entry => (
    //             { content: entry, entryId: entry.entryId }
    //         ))) :
    //         fromJS(data.collection.map(entry => (
    //             { content: entry, entryId: entry.entryId }
    //         )));
    //     return state.merge({
    //         entries: state.get('entries').concat(newProfileEntries.map(entry =>
    //             entry.merge({ type: 'profileEntry', akashaId: data.akashaId }))),
    //         moreProfileEntries,
    //         flags: state.get('flags').merge(flags)
    //     });
    // },

    // [entryTypes.MORE_ENTRY_PROFILE_ITERATOR_ERROR]: errorHandler,

    [entryTypes.GET_ENTRIES_STREAM]: flagHandler,

    [entryTypes.GET_ENTRIES_STREAM_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            entriesStream: new EntriesStream(fromJS(data)),
            flags: state.get('flags').merge(flags)
        }),

    [entryTypes.GET_ENTRIES_STREAM_ERROR]: errorHandler,

    [entryTypes.MORE_ENTRY_TAG_ITERATOR]: flagHandler,

    [entryTypes.MORE_ENTRY_TAG_ITERATOR_SUCCESS]: (state, { data, flags }) => {
        const moreTagEntries = data.limit === data.collection.length;
        const newTagEntries = moreTagEntries ?
            fromJS(data.collection.slice(0, -1).map(entry => (
                { content: entry, entryId: entry.entryId }
            ))) :
            fromJS(data.collection.map(entry => (
                { content: entry, entryId: entry.entryId }
            )));
        return state.merge({
            entries: state.get('entries').concat(newTagEntries.map(entry =>
                entry.set('type', 'tagEntry'))),
            moreTagEntries,
            flags: state.get('flags').merge(flags)
        });
    },

    [entryTypes.MORE_ENTRY_TAG_ITERATOR_ERROR]: errorHandler,

    [entryTypes.ALL_STREAM_ITERATOR]: flagHandler,

    [entryTypes.ALL_STREAM_ITERATOR_SUCCESS]: (state, { data, flags }) => {
        const moreAllStreamEntries = data.limit === data.collection.length;
        const newEntries = moreAllStreamEntries ?
            fromJS(data.collection.slice(0, -1).map(entry => (
                { content: entry, entryId: entry.entryId }
            ))) :
            fromJS(data.collection.map(entry => (
                { content: entry, entryId: entry.entryId }
            )));
        return state.merge({
            entries: state.get('entries')
                .filter(entry => entry.get('type') !== 'allStreamEntry')
                .concat(newEntries.map(entry => entry.set('type', 'allStreamEntry'))),
            lastAllStreamBlock: data.lastBlock,
            moreAllStreamEntries,
            flags: state.get('flags').merge(flags)
        });
    },

    [entryTypes.ALL_STREAM_ITERATOR_ERROR]: errorHandler,

    [entryTypes.MORE_ALL_STREAM_ITERATOR]: flagHandler,

    [entryTypes.MORE_ALL_STREAM_ITERATOR_SUCCESS]: (state, { data, flags }) => {
        const moreAllStreamEntries = data.limit === data.collection.length;
        const newEntries = moreAllStreamEntries ?
            fromJS(data.collection.slice(0, -1).map(entry => (
                { content: entry, entryId: entry.entryId }
            ))) :
            fromJS(data.collection.map(entry => (
                { content: entry, entryId: entry.entryId }
            )));
        return state.merge({
            entries: state.get('entries').concat(newEntries.map(entry =>
                entry.set('type', 'allStreamEntry'))),
            lastAllStreamBlock: data.lastBlock,
            moreAllStreamEntries,
            flags: state.get('flags').merge(flags)
        });
    },

    [entryTypes.MORE_ALL_STREAM_ITERATOR_ERROR]: errorHandler,

    [entryTypes.GET_TAG_ENTRIES_COUNT]: flagHandler,

    [entryTypes.GET_TAG_ENTRIES_COUNT_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            tagEntriesCount: state.get('tagEntriesCount').merge(fromJS(data)),
            flags: state.get('flags').merge(flags)
        }),

    [entryTypes.GET_TAG_ENTRIES_COUNT_ERROR]: errorHandler,

    [entryTypes.VOTE_COST]: flagHandler,

    [entryTypes.VOTE_COST_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            voteCost: state.get('voteCost').merge({ [data.weight]: data.cost }),
            flags: state.get('flags').merge(flags)
        }),

    [entryTypes.VOTE_COST_ERROR]: errorHandler,

    [entryTypes.UPVOTE]: voteFlagHandler,

    [entryTypes.UPVOTE_SUCCESS]: voteFlagHandler,

    [entryTypes.UPVOTE_ERROR]: voteFlagHandler,

    [entryTypes.DOWNVOTE]: voteFlagHandler,

    [entryTypes.DOWNVOTE_SUCCESS]: voteFlagHandler,

    [entryTypes.DOWNVOTE_ERROR]: voteFlagHandler,

    [entryTypes.GET_ENTRY]: flagHandler,

    [entryTypes.GET_ENTRY_ERROR]: errorHandler,

    [entryTypes.GET_ENTRY_SUCCESS]: (state, { data, flags }) => {
        const entryIndex = state.get('entries').findIndex(entry =>
            entry.get('entryId') === data.entryId);
        if (entryIndex === -1) {
            return state.merge({
                flags: state.get('flags').merge(flags)
            });
        }
        return state.merge({
            entries: state.get('entries').mergeDeepIn([entryIndex], { content: data }),
            flags: state.get('flags').merge(flags)
        });
    },
    [entryTypes.GET_FULL_ENTRY]: flagHandler,
    [entryTypes.GET_FULL_ENTRY_ERROR]: errorHandler,
    [entryTypes.GET_FULL_ENTRY_SUCCESS]: (state, { data, flags }) => {
        const { active, baseUrl, commentsCount, entryId, score, content, entryEth } = data;
        const newEntry = new EntryRecord({
            active,
            baseUrl,
            commentsCount: parseInt(commentsCount, 10),
            entryId,
            score,
            content: content ? new EntryContent(content) : null,
            entryEth: new EntryEth(entryEth)
        });
        const newState = state.setIn(['fullEntry'], newEntry);
        const fullEntry = state.get('fullEntry');
        const latestVersion = fullEntry && data.entryId !== fullEntry.get('entryId') ?
            data.content.version || null :
            Math.max(state.get('fullEntryLatestVersion'), data.content && data.content.version) || null;
        return newState.merge({
            flags: state.get('flags').merge(flags),
            fullEntryLatestVersion: latestVersion
        });
    },
    [entryTypes.SET_LATEST_VERSION]: (state, { data }) =>
        state.merge({
            fullEntryLatestVersion: data
        }),
    [commentsTypes.GET_COMMENTS_COUNT_SUCCESS]: (state, { data }) => {
        if (state.get('fullEntry') && (data.entryId === state.getIn(['fullEntry', 'entryId']))) {
            return state.merge({
                fullEntry: state.get('fullEntry').setIn(['commentsCount'], parseInt(data.count, 10))
            });
        }
        return state;
    },
    [entryTypes.UNLOAD_FULL_ENTRY]: (state) => {
        const newState = state.set('fullEntry', null);
        return newState.set('fullEntryLatestVersion', null);
    },

    [entryTypes.GET_SCORE]: flagHandler,

    [entryTypes.GET_SCORE_ERROR]: errorHandler,

    [entryTypes.GET_SCORE_SUCCESS]: (state, { data, flags }) => {
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

    [entryTypes.IS_ACTIVE]: flagHandler,

    [entryTypes.IS_ACTIVE_ERROR]: errorHandler,

    [entryTypes.IS_ACTIVE_SUCCESS]: (state, { data, flags }) => {
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

    [entryTypes.GET_VOTE_OF]: flagHandler,

    [entryTypes.GET_VOTE_OF_ERROR]: errorHandler,

    [entryTypes.GET_VOTE_OF_SUCCESS]: (state, { data, flags }) => {
        const entryIndex = state.get('entries').findLastIndex(entry =>
            entry.get('entryId') === data.entryId);
        const oldFullEntry = state.get('fullEntry');
        const fullEntry = oldFullEntry && data.entryId === oldFullEntry.entryId ?
            oldFullEntry.set('voteWeight', data.weight) :
            oldFullEntry;
        if (!state.getIn(['entries', entryIndex, 'content'])) {
            return state.merge({
                entries: state.get('entries'),
                flags: state.get('flags').merge(flags),
                fullEntry
            });
        }
        return state.merge({
            entries: entryIndex === -1 ?
                state.get('entries') :
                state.get('entries').setIn([entryIndex, 'content', 'voteWeight'], data.weight),
            flags: state.get('flags').merge(flags),
            fullEntry
        });
    },

    [entryTypes.SAVE_ENTRY]: flagHandler,

    [entryTypes.SAVE_ENTRY_ERROR]: errorHandler,

    [entryTypes.SAVE_ENTRY_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            savedEntries: state.get('savedEntries').push(fromJS(data)),
            flags: state.get('flags').merge(flags)
        }),

    [entryTypes.DELETE_ENTRY]: flagHandler,

    [entryTypes.DELETE_ENTRY_ERROR]: errorHandler,

    [entryTypes.DELETE_ENTRY_SUCCESS]: (state, { data, flags }) =>
        state.merge({
            savedEntries: state.get('savedEntries').filter(entry => entry.get('entryId') !== data),
            entries: state.get('entries').filter(entry =>
                entry.get('type') !== 'savedEntry' || entry.get('entryId') !== data),
            flags: state.get('flags').merge(flags)
        }),

    [entryTypes.CAN_CLAIM]: flagHandler,

    [entryTypes.CAN_CLAIM_ERROR]: errorHandler,

    [entryTypes.CAN_CLAIM_SUCCESS]: (state, { data, flags }) => {
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

    [entryTypes.GET_ENTRY_BALANCE]: flagHandler,

    [entryTypes.GET_ENTRY_BALANCE_ERROR]: errorHandler,

    [entryTypes.GET_ENTRY_BALANCE_SUCCESS]: (state, { data, flags }) => {
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

    [entryTypes.CLEAR_ALL_STREAM]: state =>
        state.merge({
            entries: state.get('entries').filter(entry => entry.get('type') !== 'allStreamEntry')
        }),

    [entryTypes.CLEAR_TAG_ENTRIES]: state =>
        state.merge({
            entries: state.get('entries').filter(entry => entry.get('type') !== 'tagEntry')
        }),

    [entryTypes.CLEAR_SAVED_ENTRIES]: state =>
        state.merge({
            entries: state.get('entries').filter(entry => entry.get('type') !== 'savedEntry')
        }),

    [entryTypes.CLEAR_PROFILE_ENTRIES]: state =>
        state.merge({
            entries: state.get('entries').filter(entry => entry.get('type') !== 'profileEntry')
        }),

    [entryTypes.CLAIM]: claimFlagHandler,

    [entryTypes.CLAIM_SUCCESS]: claimFlagHandler,

    [entryTypes.CLAIM_ERROR]: claimFlagHandler,

    [searchTypes.QUERY_SUCCESS]: querySuccessHandler,

    [searchTypes.MORE_QUERY_SUCCESS]: querySuccessHandler,

    [searchTypes.RESET_RESULTS]: state =>
        state.merge({
            entries: state.get('entries').filter(entry => entry.get('type') !== 'searchEntry')
        }),

    [appTypes.CLEAN_STORE]: () => initialState,

    // ************************* NEW REDUCERS ******************************

    [types.ENTRY_CAN_CLAIM_SUCCESS]: (state, { data }) =>
        state.setIn(['canClaim', data.entryId], data.canClaim),

    [types.ENTRY_GET_BALANCE_SUCCESS]: (state, { data }) =>
        state.setIn(['balance', data.entryId], data.balance),

    [types.ENTRY_GET_VOTE_OF_SUCCESS]: (state, { data }) =>
        state.setIn(['votes', data.entryId], data.weight),

    [types.ENTRY_MORE_NEWEST_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_MORE_PROFILE_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_MORE_STREAM_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_MORE_TAG_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_NEWEST_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_PROFILE_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_STREAM_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_TAG_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_VOTE_COST_SUCCESS]: (state, { data }) =>
        state.setIn(['voteCostByWeight', data.weight], data.cost),
});

export default entryState;

import { Map } from 'immutable';
import { createReducer } from './create-reducer';
import * as types from '../constants';
import { EntryAuthor, EntryContent, EntryPageOverlay, EntryRecord,
    EntryState } from './records';

const initialState = new EntryState();

const createEntryRecord = entry =>
    new EntryRecord(entry).withMutations((mEntry) => {
        if (entry.content) {
            mEntry.set('content', new EntryContent(entry.content));
        }
    });

const createEntryWithAuthor = entry =>
    new EntryRecord(entry).set('author', new EntryAuthor(entry.author));

const entryIteratorHandler = (state, { data }) => {
    let byId = state.get('byId');
    data.collection.forEach((entry) => {
        if (!state.getIn(['byId', entry.entryId])) {
            const newEntry = createEntryWithAuthor(entry);
            byId = byId.set(entry.entryId, newEntry);
        }
    });
    return state.set('byId', byId);
};
    // state.withMutations((mState) => {
    //     const moreEntries = data.limit === data.collection.length;
    //     data.collection.forEach((entry, index) => {
    //         const publisherEthAddress = entry.author.ethAddress;
    //         // the request is made for n + 1 entries to determine if there are more entries left
    //         // if this is the case, ignore the extra entry
    //         if (!moreEntries || index !== data.collection.length - 1) {
    //             let newEntry = createEntryRecord(entry);
    //             const oldContent = state.getIn(['byId', entry.entryId, 'content']);
    //             // it shouldn't reset the entry content
    //             if (!newEntry.get('content') && oldContent) {
    //                 newEntry = newEntry.set('content', oldContent);
    //             }
    //             mState.setIn(['byId', entry.entryId], newEntry)
    //                 .setIn(['byEthAddress', publisherEthAddress],
    //                     new List(mState.getIn(['byEthAddress', publisherEthAddress])).push(entry.entryId)
    //                 );
    //         }
    //     });
    // });

/**
 * State of the entries and drafts
 */
const entryState = createReducer(initialState, {
    [types.COMMENTS_GET_COUNT_SUCCESS]: (state, { data }) => {
        if (state.get('fullEntry') && (data.entryId === state.getIn(['fullEntry', 'entryId']))) {
            return state.setIn(['fullEntry', 'commentsCount'], data.count);
        }
        return state;
    },

    [types.ENTRY_CAN_CLAIM_SUCCESS]: (state, { data }) => {
        const canClaim = {};
        data.collection.forEach((res) => {
            canClaim[res.entryId] = res.canClaim;
        });
        return state.mergeIn(['canClaim'], new Map(canClaim));
    },

    [types.ENTRY_CLEAN_FULL]: state =>
        state.merge({
            flags: state.get('flags').set('fetchingFullEntry', false),
            fullEntry: null
        }),

    [types.ENTRY_GET_BALANCE_SUCCESS]: (state, { data }) => {
        const balance = {};
        data.collection.forEach((res) => {
            balance[res.entryId] = res.balance;
        });
        return state.mergeIn(['balance'], new Map(balance));
    },

    [types.ENTRY_GET_FULL]: (state, { asDraft }) => {
        if (!asDraft) {
            return state.setIn(['flags', 'fetchingFullEntry'], true);
        }
        return state;
    },

    [types.ENTRY_GET_FULL_ERROR]: state => state.setIn(['flags', 'fetchingFullEntry'], false),

    [types.ENTRY_GET_FULL_SUCCESS]: (state, { data, request }) => {
        if (!state.getIn(['flags', 'fetchingFullEntry'])) {
            return state;
        }
        const { entryId, ethAddress } = request;
        data.entryId = entryId;
        const fullEntry = state.get('fullEntry');
        const version = data.content && data.content.version;
        const latestVersion = fullEntry && data.entryId !== fullEntry.get('entryId') ?
            version || null :
            Math.max(state.get('fullEntryLatestVersion'), version) || null;

        return state.merge({
            flags: state.get('flags').set('fetchingFullEntry', false),
            fullEntry: createEntryRecord(data).setIn(['author', 'ethAddress'], ethAddress),
            fullEntryLatestVersion: latestVersion
        });
    },

    [types.ENTRY_GET_LATEST_VERSION_SUCCESS]: (state, { data = null }) =>
        state.set('fullEntryLatestVersion', data),

    [types.ENTRY_GET_SCORE_SUCCESS]: (state, { data }) => {
        const entry = state.getIn(['byId', data.entryId]);
        const oldFullEntry = state.get('fullEntry');
        const fullEntry = oldFullEntry && data.entryId === oldFullEntry.entryId ?
            oldFullEntry.set('score', data.score) :
            oldFullEntry;
        return state.merge({
            byId: !entry ?
                state.get('byId') :
                state.get('byId').setIn([data.entryId, 'score'], data.score),
            fullEntry
        });
    },

    [types.ENTRY_GET_SHORT]: (state, { entryId, context }) => {
        let pendingEntries = state.getIn(['flags', 'pendingEntries', context]) || new Map();
        pendingEntries = pendingEntries.set(entryId, true);
        return state.setIn(['flags', 'pendingEntries', context], pendingEntries);
    },

    [types.ENTRY_GET_SHORT_ERROR]: (state, { request }) => {
        const { entryId, context } = request;
        let pendingEntries = state.getIn(['flags', 'pendingEntries', context]) || new Map();
        pendingEntries = pendingEntries.set(entryId, false);
        return state.setIn(['flags', 'pendingEntries', context], pendingEntries);
    },

    [types.ENTRY_GET_SHORT_SUCCESS]: (state, { data, request }) => {
        const { entryId, context } = request;
        data.entryId = entryId;
        let pendingEntries = state.getIn(['flags', 'pendingEntries', context]) || new Map();
        pendingEntries = pendingEntries.set(entryId, false);
        const oldEntry = state.getIn(['byId', entryId]);
        const newEntry = createEntryRecord(data).set('author', oldEntry.get('author'));
        return state.merge({
            byId: state.get('byId').set(entryId, newEntry),
            flags: state.get('flags').setIn(['pendingEntries', context], pendingEntries)
        });
    },

    [types.ENTRY_GET_VOTE_OF_SUCCESS]: (state, { data }) => {
        const votes = {};
        data.collection.forEach((res) => {
            votes[res.entryId] = res.vote;
        });
        return state.mergeIn(['votes'], new Map(votes));
    },

    [types.ENTRY_LIST_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_MORE_NEWEST_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_MORE_PROFILE_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_MORE_STREAM_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_MORE_TAG_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_NEWEST_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_PAGE_HIDE]: state => state.set('entryPageOverlay', new EntryPageOverlay()),

    [types.ENTRY_PAGE_SHOW]: (state, { entryId, version = null }) =>
        state.set('entryPageOverlay', new EntryPageOverlay({ entryId, version })),

    [types.ENTRY_PROFILE_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_RESOLVE_IPFS_HASH]: (state, { ipfsHash, columnId }) => {
        let newHashes = new Map();
        ipfsHash.forEach((hash) => { newHashes = newHashes.set(hash, true); });
        return state.mergeIn(['flags', 'resolvingIpfsHash', columnId], newHashes);
    },

    [types.ENTRY_RESOLVE_IPFS_HASH_ERROR]: (state, { error, req }) =>
        state.setIn(['flags', 'resolvingIpfsHash', req.columnId, error.ipfsHash], false),

    [types.ENTRY_RESOLVE_IPFS_HASH_SUCCESS]: (state, { data, req }) => {
        const index = req.ipfsHash.indexOf(data.ipfsHash);
        const entryId = req.entryIds[index];
        return state.merge({
            flags: state.get('flags').setIn(['resolvingIpfsHash', req.columnId, data.ipfsHash], false),
            byId: state.get('byId').setIn([entryId, 'content'], new EntryContent(data.entry))
        });
    },

    [types.ENTRY_STREAM_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_TAG_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_VOTE_COST_SUCCESS]: (state, { data }) => {
        const voteCost = {};
        data.collection.forEach((res) => {
            voteCost[res.weight] = res.cost;
        });
        return state.set('voteCostByWeight', new Map(voteCost));
    },
    [types.SEARCH_MORE_QUERY_SUCCESS]: entryIteratorHandler,

    [types.SEARCH_QUERY_SUCCESS]: entryIteratorHandler
});

export default entryState;

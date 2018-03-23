import { List, Map, fromJS } from 'immutable';
import { createReducer } from './create-reducer';
import * as types from '../constants';
import { CardInfo, EntryAuthor, EntryBalance, EntryContent, EntryPageOverlay, EntryRecord,
    EntryState, EntryVote, ProfileEntries } from './records';
import { isEthAddress } from '../../utils/dataModule';

const initialState = new EntryState();

const createEntryRecord = entry =>
    new EntryRecord(entry).withMutations((mEntry) => {
        if (entry.content) {
            let cardInfo = new CardInfo();
            let title = entry.content.title;
            if (entry.content.cardInfo) {
                cardInfo = cardInfo.merge(fromJS(entry.content.cardInfo));
                title = title || entry.content.cardInfo.title;
            }
            mEntry.set('content', new EntryContent({
                ...entry.content,
                cardInfo,
                title
            }));
        }
    });

const createEntryContent = (content) => {
    let cardInfo = new CardInfo();
    let title = content.title;
    if (content.cardInfo) {
        cardInfo = cardInfo.merge(fromJS(content.cardInfo));
        title = title || content.cardInfo.title;
    }
    return new EntryContent({
        ...content,
        cardInfo,
        title
    });
};

const createEntryWithAuthor = entry =>
    new EntryRecord(entry).set('author', new EntryAuthor(entry.author));

const entryIteratorHandler = (state, { data, request }) => {
    if (!request || request.reversed) {
        return state;
    }
    let byId = state.get('byId');
    data.collection.forEach((entry) => {
        if (!state.getIn(['byId', entry.entryId])) {
            const newEntry = createEntryWithAuthor(entry);
            byId = byId.set(entry.entryId, newEntry);
        }
    });
    return state.set('byId', byId);
};

const entrySearchIteratorHandler = (state, { data }) => {
    const collection = data.collection.map(res => ({
        entryId: res.entryId,
        author: { ethAddress: res.ethAddress }
    }));
    return entryIteratorHandler(state, { data: { collection } });
};

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
            canClaim[res.entryId] = res.status;
        });
        return state.mergeIn(['canClaim'], new Map(canClaim));
    },

    [types.ENTRY_CAN_CLAIM_VOTE_SUCCESS]: (state, { data }) => {
        const canClaimVote = {};
        data.collection.forEach((res) => {
            canClaimVote[res.entryId] = res.status;
        });
        return state.mergeIn(['canClaimVote'], new Map(canClaimVote));
    },

    [types.ENTRY_CLEAN_FULL]: state =>
        state.merge({
            flags: state.get('flags').set('fetchingFullEntry', false),
            fullEntry: null,
            fullEntryLatestVersion: null
        }),

    [types.ENTRY_GET_BALANCE_SUCCESS]: (state, { data }) => {
        const balance = {};
        data.collection.forEach((res) => {
            balance[res.entryId] = new EntryBalance(res);
        });
        return state.mergeIn(['balance'], new Map(balance));
    },

    [types.ENTRY_GET_END_PERIOD_SUCCESS]: (state, { data }) => {
        let endPeriod = new Map();
        data.collection.forEach((res) => {
            endPeriod = endPeriod.set(res.entryId, res.endDate);
        });
        return state.set('endPeriod', endPeriod);
    },

    [types.ENTRY_GET_FULL]: (state, { asDraft, entryId, publishedDateOnly }) => {
        if (!asDraft && !publishedDateOnly) {
            return state.merge({
                flags: state.get('flags').set('fetchingFullEntry', true),
                fullEntry: createEntryRecord({ entryId })
            });
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
        const { content } = data;
        // This is needed to avoid inconsistency between "null" and "undefined" values
        if (data.content === undefined) {
            data.content = null;
        }
        const version = content && content.version;
        const entryType = content && content.entryType;
        const latestVersion = fullEntry && data.entryId !== fullEntry.get('entryId') ?
            version || null :
            Math.max(state.get('fullEntryLatestVersion'), version) || null;
        let byId = state.get('byId');
        if (byId.get(entryId)) {
            byId = byId.mergeIn([entryId], {
                commentsCount: data.commentsCount,
                score: data.score
            });
        }
        return state.merge({
            byId,
            flags: state.get('flags').set('fetchingFullEntry', false),
            fullEntry: createEntryRecord({ entryType, ...data }).setIn(['author', 'ethAddress'], ethAddress),
            fullEntryLatestVersion: latestVersion
        });
    },

    // [types.ENTRY_GET_VERSION_PUBLISHED_DATE_SUCCESS]: (state, { data }) => {
    //     const { version } = data.content;
    //     return state.setIn(['fullEntry', 'versionsInfo', version], data.publishDate);
    // },

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

    [types.ENTRY_GET_SHORT]: (state, { entryId, context, ethAddress }) => {
        let pendingEntries = state.getIn(['flags', 'pendingEntries', context]) || new Map();
        pendingEntries = pendingEntries.set(entryId, true);
        let byId = state.get('byId');
        if (!byId.get(entryId)) {
            const newEntry = createEntryWithAuthor({ author: { ethAddress }, entryId });
            byId = byId.set(entryId, newEntry);
        }
        return state.merge({
            byId,
            flags: state.get('flags').setIn(['pendingEntries', context], pendingEntries)
        });
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

        const newEntry = state.getIn(['byId', entryId]).mergeWith((old, newVal, key) => {
            if (key === 'author') {
                return old;
            }
            if (key === 'entryType' && old === -1) {
                if (data.content.cardInfo.url) {
                    return 1;
                }
                return 0;
            } else if (key === 'entryType' && old > -1) {
                return old;
            }
            return newVal;
        }, createEntryRecord(data));
        return state.merge({
            byId: state.get('byId').set(entryId, newEntry),
            flags: state.get('flags').setIn(['pendingEntries', context], pendingEntries)
        });
    },

    [types.ENTRY_GET_VOTE_OF_SUCCESS]: (state, { data }) => {
        const votes = {};
        data.collection.forEach((res) => {
            votes[res.entryId] = new EntryVote(res);
        });
        return state.mergeIn(['votes'], new Map(votes));
    },

    [types.ENTRY_GET_VOTE_RATIO_SUCCESS]: (state, { data }) => {
        const { entryId, upvoteRatio } = data;
        const currentFullEntryId = state.getIn(['fullEntry', 'entryId']);
        /** just to be sure that we are setting things for the correct entryId */
        if (entryId === currentFullEntryId) {
            return state.setIn(['fullEntry', 'upvoteRatio'], upvoteRatio);
        }
        return state;
    },

    [types.ENTRY_LIST_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_MORE_LIST_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_MORE_NEWEST_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_MORE_PROFILE_ITERATOR]: (state, { column }) => {
        const { value } = column;
        if (isEthAddress(value)) {
            return state.setIn(['profileEntries', value, 'fetchingMoreEntries'], true);
        }
        return state;
    },

    [types.ENTRY_MORE_PROFILE_ITERATOR_SUCCESS]: (state, { data, request }) => {
        const newState = entryIteratorHandler(state, { data });
        const { ethAddress } = request;
        if (!ethAddress) {
            return newState;
        }
        const entryIds = data.collection.map(result => result.entryId);
        return newState.mergeIn(['profileEntries', ethAddress], {
            entryIds: state.getIn(['profileEntries', ethAddress, 'entryIds']).concat(entryIds),
            fetchingMoreEntries: false,
            lastBlock: data.lastBlock,
            lastIndex: data.lastIndex,
            moreEntries: !!data.lastBlock
        });
    },

    [types.ENTRY_MORE_STREAM_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_MORE_TAG_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_NEWEST_ITERATOR_SUCCESS]: entryIteratorHandler,

    [types.ENTRY_PAGE_HIDE]: state => state.set('entryPageOverlay', new EntryPageOverlay()),

    [types.ENTRY_PAGE_SHOW]: (state, { entryId, version = null }) =>
        state.set('entryPageOverlay', new EntryPageOverlay({ entryId, version })),

    [types.ENTRY_PROFILE_ITERATOR]: (state, { column }) => {
        const { value, asDrafts } = column;
        if (isEthAddress(value) && !asDrafts) {
            return state.setIn(['profileEntries', value], new ProfileEntries({ fetchingEntries: true }));
        }
        return state;
    },

    [types.ENTRY_PROFILE_ITERATOR_SUCCESS]: (state, { data, request }) => {
        const newState = entryIteratorHandler(state, { data });
        const { ethAddress } = request;
        if (!ethAddress) {
            return newState;
        }
        const entryIds = data.collection.map(result => result.entryId);
        return newState.mergeIn(['profileEntries', ethAddress], {
            entryIds: new List(entryIds),
            fetchingEntries: false,
            lastBlock: data.lastBlock,
            lastIndex: data.lastIndex,
            moreEntries: !!data.lastBlock
        });
    },

    [types.ENTRY_RESOLVE_IPFS_HASH]: (state, { entryId }) => {
        if (entryId === state.getIn(['fullEntry', 'entryId'])) {
            return state.setIn(['flags', 'resolvingFullEntryHash'], true);
        }
        return state;
    },

    [types.ENTRY_RESOLVE_IPFS_HASH_ERROR]: (state, { request }) => {
        if (request.entryId === state.getIn(['fullEntry', 'entryId'])) {
            return state.setIn(['flags', 'resolvingFullEntryHash'], false);
        }
        return state;
    },

    [types.ENTRY_RESOLVE_IPFS_HASH_SUCCESS]: (state, { data, request }) => {
        if (data.entry && request.entryId === state.getIn(['fullEntry', 'entryId'])) {
            return state.merge({
                flags: state.get('flags').set('resolvingFullEntryHash', false),
                fullEntry: state.get('fullEntry').set('content', createEntryContent(data.entry))
            });
        }
        return state;
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

    [types.PROFILE_LOGOUT_SUCCESS]: () => initialState,

    [types.PROFILE_RESET_COLUMNS]: (state, { ethAddress }) =>
        state.deleteIn(['profileEntries', ethAddress]),

    [types.SEARCH_MORE_QUERY_SUCCESS]: entrySearchIteratorHandler,

    [types.SEARCH_QUERY_SUCCESS]: entrySearchIteratorHandler
});

export default entryState;

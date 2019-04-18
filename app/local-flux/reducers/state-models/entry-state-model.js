import { fromJS, List, Map, Record } from 'immutable';
import { CardInfo } from './draft-state-model';

export const EntryAuthor = Record({
    akashaId: null,
    ethAddress: null,
});

export const EntryBalance = Record({
    claimed: null,
    endPeriod: null,
    entryId: null,
    score: null,
    totalKarma: null,
    totalVotes: null
});

export const EntryContent = Record({
    cardInfo: CardInfo(),
    draft: {},
    excerpt: null,
    entryType: null,
    featuredImage: null,
    licence: {},
    tags: [],
    title: '',
    version: null,
    wordCount: null
});

export const EntryVote = Record({
    claimed: false,
    essence: null,
    vote: null,
});

export const EntryRecord = Record({
    author: new EntryAuthor(),
    baseUrl: '',
    commentsCount: 0,
    content: EntryContent(),
    endPeriod: null,
    entryId: null,
    ipfsHash: null,
    publishDate: null,
    score: null,
    totalKarma: null,
    totalVotes: null,
    versionsInfo: new Map(),
    upvoteRatio: null,
});

// const Flags = Record({
//     fetchingEntryBalance: false,
//     fetchingFullEntry: false,
//     pendingEntries: new Map(),
//     resolvingFullEntryHash: false,
// });

export const EntryPageOverlay = Record({
    entryId: null,
    version: null
});

export const ProfileEntries = Record({
    entryIds: new List(),
    // fetchingEntries: false,
    // fetchingMoreEntries: false,
    lastBlock: null,
    lastIndex: null,
    moreEntries: false
});

const EntryState = Record({
    balance: new Map(),
    byId: new Map(),
    canClaim: new Map(),
    canClaimVote: new Map(),
    endPeriod: new Map(),
    entriesCount: 0, // entries published by a logged profile
    entryPageOverlay: new EntryPageOverlay(),
    // flags: new Flags(),
    // fetchingEntriesCount: false,
    fullEntry: null,
    fullEntryLatestVersion: null,
    savedEntries: new List(),
    // @todo what are those 'more..' used at??
    moreAllStreamEntries: false,
    moreProfileEntries: false,
    moreSavedEntries: false,
    moreSearchEntries: false,
    moreTagEntries: false,
    newestEntries: new List(),
    profileEntries: new Map(),
    published: new List(),
    tagEntriesCount: new Map(),
    voteCostByWeight: new Map(),
    votes: new Map(),
});

export default class EntryStateModel extends EntryState {

    createEntryRecord (entry) {
        const newEntry = new EntryRecord(entry).withMutations((mEntry) => {
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
        return newEntry;
    }

    createEntryContent (record) {
        const content = Object.assign({}, record);
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
    }

    createEntryWithAuthor (entry) {
        const entryRecord = new EntryRecord(entry).set('author', new EntryAuthor(entry.author));
        return entryRecord;
    }

    entryIteratorHandler (state, { data, request }) {
        if (!request) {
            return state;
        }
        let byId = state.get('byId');
        data.collection.forEach((entry) => {
            if (!state.get('byId').has(entry.entryId)) {
                const newEntry = this.createEntryWithAuthor(entry);
                byId = byId.set(entry.entryId, newEntry);
            }
        });
        return state.set('byId', byId);
    }

    entrySearchIteratorHandler (state, { data }) {
        const collection = data.collection.map(res => ({
            entryId: res.entryId,
            author: { ethAddress: res.ethAddress }
        }));
        return this.entryIteratorHandler(state, { data: { collection } });
    }
}

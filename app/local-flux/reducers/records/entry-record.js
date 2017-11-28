import { List, Map, Record } from 'immutable';
import { CardInfo } from './draft-record';

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
    publishDate: null,
    score: null,
    totalKarma: null,
    totalVotes: null,
    versionsInfo: new Map()
});

const Flags = Record({
    fetchingEntryBalance: false,
    fetchingFullEntry: false,
    pendingEntries: new Map(),
});

export const EntryPageOverlay = Record({
    entryId: null,
    version: null
});

export const ProfileEntries = Record({
    entryIds: new List(),
    fetchingEntries: false,
    fetchingMoreEntries: false,
    lastBlock: null,
    lastIndex: null,
    moreEntries: false
});

export const EntryState = Record({
    balance: new Map(),
    byId: new Map(),
    canClaim: new Map(),
    canClaimVote: new Map(),
    entriesCount: 0, // entries published by a logged profile
    entryPageOverlay: new EntryPageOverlay(),
    flags: new Flags(),
    fetchingEntriesCount: false,
    fullEntry: null,
    fullEntryLatestVersion: null,
    savedEntries: new List(),
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

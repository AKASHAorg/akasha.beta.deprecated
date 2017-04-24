import { List, Map, Record } from 'immutable';

export const EntryContent = Record({
    draft: {},
    excerpt: null,
    featuredImage: null,
    licence: {},
    tags: [],
    title: '',
    version: null,
    wordCount: null
});

export const EntryEth = Record({
    blockNr: null,
    ipfsHash: null,
    publisher: null,
    unixStamp: null
});

export const EntryRecord = Record({
    active: null,
    baseUrl: '',
    commentsCount: 0,
    content: EntryContent(),
    entryEth: EntryEth(),
    entryId: null,
    score: null,
});

const EntriesStream = Record({
    akashaId: null,
    profiles: new List(),
    tags: new List()
});

const Flags = Record({
    fetchingNewest: false,
    fetchingMoreNewest: false,
    moreNewest: false
});

// export const EntryState = Record({
//     published: new List(),
//     licences: new List(),
//     errors: new List(),
//     flags: new Map({
//         votePending: new List(),
//         claimPending: new List()
//     }),
//     fetchingEntriesCount: false,
//     entriesStream: new EntriesStream(),
//     entries: new List(),
//     fullEntry: null,
//     fullEntryLatestVersion: null,
//     lastAllStreamBlock: null,
//     savedEntries: new List(),
//     moreAllStreamEntries: false,
//     moreProfileEntries: false,
//     moreSavedEntries: false,
//     moreSearchEntries: false,
//     moreTagEntries: false,
//     tagEntriesCount: new Map(),
//     entriesCount: 0, // entries published by a logged profile
//     voteCostByWeight: new Map()
// });

export const EntryState = Record({
    balance: new Map(),
    byId: new Map(),
    canClaim: new Map(),
    published: new List(),
    flags: new Flags(),
    fetchingEntriesCount: false,
    entriesStream: new EntriesStream(),
    fullEntry: null,
    fullEntryLatestVersion: null,
    savedEntries: new List(),
    moreAllStreamEntries: false,
    moreProfileEntries: false,
    moreSavedEntries: false,
    moreSearchEntries: false,
    moreTagEntries: false,
    newestEntries: new List(),
    tagEntriesCount: new Map(),
    entriesCount: 0, // entries published by a logged profile
    voteCostByWeight: new Map(),
    votes: new Map(),
});

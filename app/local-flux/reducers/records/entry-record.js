import { List, Map, Record } from 'immutable';

const EntryContent = Record({
    draft: {},
    excerpt: null,
    featuredImage: null,
    licence: {},
    tags: [],
    title: '',
    version: null,
    wordCount: null
});

const EntryEth = Record({
    blockNr: null,
    ipfsHash: null,
    publisher: null,
    unixStamp: null
});

export const EntryRecord = Record({
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

const EntriesStream = Record({
    akashaId: null,
    profiles: new List(),
    tags: new List()
});

export const EntryState = Record({
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
    fullEntryLatestVersion: null,
    lastAllStreamBlock: null,
    savedEntries: new List(),
    moreAllStreamEntries: false,
    moreProfileEntries: false,
    moreSavedEntries: false,
    moreSearchEntries: false,
    moreTagEntries: false,
    tagEntriesCount: new Map(),
    entriesCount: 0, // entries published by a logged profile
    voteCostByWeight: new Map()
});

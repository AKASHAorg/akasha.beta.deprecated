import { List, Map, Record } from 'immutable';

export const AethBalance = Record({
    bonded: null,
    cycling: null,
    free: null,
    total: null
});

export const EssenceBalance = Record({
    aethValue: null,
    total: null
});

export const ManaBalance = Record({
    remaining: null,
    spent: null,
    total: null
});

export const Balance = Record({
    aeth: new AethBalance(),
    essence: new EssenceBalance(),
    eth: null,
    mana: new ManaBalance(),
});

const CyclingRecord = Record({
    collection: [],
    total: null
});

export const CyclingStates = Record({
    available: new CyclingRecord(),
    pending: new CyclingRecord()
});

export const ProfileRecord = Record({
    about: '',
    akashaId: '',
    avatar: null,
    backgroundImage: new Map(),
    baseUrl: '',
    commentsCount: '0',
    donationsEnabled: false,
    entriesCount: '0',
    ethAddress: null,
    firstName: '',
    followersCount: null,
    followingCount: null,
    ipfsHash: '',
    karma: null,
    lastName: '',
    links: [],
    profile: null,
    subscriptionsCount: null,
});

export const LoggedProfile = Record({
    akashaId: null,
    ethAddress: null,
    expiration: null,
    token: null,
});

const Flags = Record({
    ethAddressPending: false,
    fetchingFollowers: new Map(),
    fetchingFollowings: new Map(),
    fetchingLocalProfiles: false,
    fetchingLoggedProfile: false,
    fetchingMoreFollowers: new Map(),
    fetchingMoreFollowings: new Map(),
    fetchingProfileList: false,
    localProfilesFetched: false,
    loginPending: false,
    pendingListProfiles: new Map(),
    resolvingIpfsHash: new Map(),
});

const Interests = Record({
    tag: new List(),
    profile: new List()
});

export const ProfileState = Record({
    balance: new Balance(),
    byEthAddress: new Map(),
    byId: new Map(),
    cyclingStates: new CyclingStates(),
    errors: new List(), // to be removed
    fetchingFullLoggedProfile: false, // to be removed
    flags: new Flags(),
    followers: new Map(),
    followersList: new List(), // to be removed
    followings: new Map(),
    followingsList: new List(), // to be removed
    interests: new Interests(),
    isFollower: new Map(),
    lastFollower: new Map(),
    lastFollowing: new Map(),
    localProfiles: new List(),
    loggedProfile: new LoggedProfile(),
    loginErrors: new List(),
    moreFollowers: new Map(),
    moreFollowings: new Map(),
    profiles: new List(), // to be removed
});

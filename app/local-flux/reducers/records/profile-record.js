import { List, Map, Record } from 'immutable';

export const ProfileRecord = Record({
    firstName: '',
    lastName: '',
    akashaId: '',
    avatar: null,
    backgroundImage: [],
    about: null,
    links: [],
    profile: null,
    ethAddress: null,
    baseUrl: '',
    followersCount: null,
    followingCount: null,
    followers: new List(),
    following: new List(),
    moreFollowers: false,
    moreFollowing: false,
    entriesCount: null,
    subscriptionsCount: null,
    entries: new List(),
    isFollower: new Map()
});

export const LoggedProfile = Record({
    account: null,
    token: null,
    expiration: null,
    profile: null,
    akashaId: null
});

const Flags = Record({
    currentProfilePending: false,
    fetchingLocalProfiles: false,
    fetchingProfileList: false,
    localProfilesFetched: false,
    loginPending: false
});

const ProfileState = Record({
    balance: null,
    byId: new Map(),
    errors: new List(),
    ethAddresses: new Map(),
    fetchingFullLoggedProfile: false,
    flags: new Flags(),
    followingsList: new List(),
    localProfiles: new List(),
    loggedProfile: new LoggedProfile(),
    loginErrors: new List(),
    profiles: new List(),
});

export default ProfileState;

import { List, Map, Record } from 'immutable';

export const ProfileRecord = Record({
    about: '',
    akashaId: '',
    avatar: null,
    backgroundImage: [],
    baseUrl: '',
    entriesCount: null,
    firstName: '',
    followersCount: null,
    followingCount: null,
    ipfsHash: '',
    lastName: '',
    links: [],
    profile: null,
    subscriptionsCount: null,
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
    ethAddressPending: false,
    fetchingFollowers: new Map(),
    fetchingFollowings: new Map(),
    fetchingLocalProfiles: false,
    fetchingLoggedProfile: false,
    fetchingMoreFollowers: new Map(),
    fetchingMoreFollowings: new Map(),
    fetchingProfileData: false,
    fetchingProfileList: false,
    followPending: new Map(),
    localProfilesFetched: false,
    loginPending: false,
    resolvingIpfsHash: new Map(),
    sendingTip: new Map()
});

const Interests = Record({
    tag: new List(),
    profile: new List()
});

const ProfileState = Record({
    balance: null,
    byId: new Map(),
    errors: new List(), // to be removed
    ethAddresses: new Map(),
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

export default ProfileState;

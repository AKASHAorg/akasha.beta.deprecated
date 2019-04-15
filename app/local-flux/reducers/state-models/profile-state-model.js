import { List, Map, Record, Collection, fromJS } from 'immutable';

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
export const EssenceIterator = Record({
    lastBlock: null,
    lastIndex: null
});
export const ManaBalance = Record({
    remaining: null,
    spent: null,
    total: null
});

export const Balance = Record({
    aeth: new AethBalance(),
    balance: null,
    essence: new EssenceBalance(),
    mana: new ManaBalance(),
    unit: null
});

const CyclingRecord = Record({
    collection: [],
    total: null
});

export const CyclingStates = Record({
    available: new CyclingRecord(),
    pending: new CyclingRecord()
});

const ManaBurned = Record({
    comments: 0,
    entriesTotal: 0,
    votes: 0
});

export const EssenceEvent = Record({
    amount: null,
    action: '',
    sourceId: '',
    blockNumber: null
});

export const ProfileRecord = Record({
    about: '',
    akashaId: '',
    avatar: null,
    backgroundImage: {},
    baseUrl: '',
    commentsCount: '0',
    donationsEnabled: false,
    entriesCount: '0',
    essence: null,
    ethAddress: null,
    firstName: '',
    followersCount: null,
    followingCount: null,
    ipfsHash: '',
    karma: null,
    lastName: '',
    links: [],
    profile: null,
    subscriptionsCount: null
});
export const TempProfileRecord = Record({
    localId: '',
    firstName: '',
    lastName: '',
    akashaId: '',
    donationsEnabled: true,
    ethAddress: '',
    avatar: '',
    backgroundImage: new Map(),
    baseUrl: '',
    about: '',
    links: new List(),
    crypto: new List()
});

export const LoggedProfile = Record({
    akashaId: null,
    ethAddress: null,
    expiration: null,
    token: null,
    raw: null
});

const Interests = Record({
    tag: new List(),
    profile: new List()
});

export const ProfileExistsRecord = Record({
    exists: null,
    idValid: null,
    normalisedId: null
});

const ProfileState = Record({
    allFollowings: new List(),
    balance: new Balance(),
    byEthAddress: new Map(),
    byId: new Map(),
    canCreateTags: false,
    cyclingStates: new CyclingStates(),
    essenceEvents: new Collection.Set([]),
    essenceIterator: new EssenceIterator(),
    errors: new List(), // to be removed
    exists: new Map(),
    faucet: null,
    followers: new Map(),
    followersList: new List(), // to be removed
    followings: new Map(),
    followingsList: new List(), // to be removed
    interests: new Interests(),
    isFollower: new Map(),
    karmaRanking: new Map(),
    lastFollower: new Map(),
    lastFollowing: new Map(),
    localProfiles: new List(),
    loggedProfile: new LoggedProfile(),
    loginErrors: new List(),
    manaBurned: new ManaBurned(),
    moreFollowers: new Map(),
    moreFollowings: new Map(),
    profiles: new List(), // to be removed
    publishingCost: new Map(),
    tempProfile: new TempProfileRecord()
});

export default class ProfileStateModel extends ProfileState {
    addProfileData (byEthAddress, { ...profileData }, full) {
        if (!profileData) {
            return byEthAddress;
        }
        profileData.followersCount = Number(profileData.followersCount);
        profileData.followingCount = Number(profileData.followingCount);

        const oldProfile = byEthAddress.get(profileData.ethAddress);
        if (!full && oldProfile) {
            profileData.backgroundImage = oldProfile.get('backgroundImage');
            profileData.links = oldProfile.get('links');
        }
        if (oldProfile) {
            /*
             * Prevent data from being overwriten if the new response is an unresolved profile
             */
            profileData.avatar = profileData.avatar || oldProfile.get('avatar');
            profileData.firstName = profileData.firstName || oldProfile.get('firstName');
            profileData.lastName = profileData.lastName || oldProfile.get('lastName');
        }
        return byEthAddress.set(profileData.ethAddress, new ProfileRecord(profileData));
    }
    getKarmaPopoverDefaultState (collection, myRanking) {
        let defaultState = [];
        if (collection.length < 4) {
            return collection;
        }
        if (collection.length) {
            if (myRanking === 0) {
                defaultState = collection.slice(myRanking, myRanking + 3);
            } else if (myRanking === collection.length - 1) {
                defaultState = collection.slice(myRanking - 2);
            } else {
                defaultState = collection.slice(myRanking - 1, myRanking + 2);
            }
        }
        return defaultState;
    }

    createTempProfile (profileData) {
        const { links = [], crypto = [], backgroundImage, ...others } = profileData;
        const tLinks = new List(links.map(link => new Map(link)));
        const tCrypto = new List(crypto.map(currency => new Map(currency)));
        const tBackgroundImage = fromJS(backgroundImage);
        return new TempProfileRecord({
            links: tLinks,
            crypto: tCrypto,
            backgroundImage: tBackgroundImage,
            ...others
        });
    }

    profileToTempProfile (profileData) {
        const {
            localId,
            about = '',
            akashaId,
            avatar,
            backgroundImage,
            baseUrl,
            crypto,
            ethAddress,
            firstName,
            lastName,
            links
        } = profileData;
        return this.createTempProfile({
            localId,
            about,
            akashaId,
            avatar,
            backgroundImage,
            baseUrl,
            ethAddress,
            firstName,
            lastName,
            links,
            crypto
        });
    }
}

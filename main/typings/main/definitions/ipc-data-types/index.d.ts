// main -> renderer ipc data exchange format

interface MainResponse {
    data: any;
    error?: {
        message: string,
        fatal?: boolean
    };
}

interface AuthRequest {
    token: string;
    gas?: number;
}

interface IPCmanager {
    channel: string;
    listen: boolean;
}
/////////// ipfs models \\\\\\\\\\\\\
interface IpfsLink {
    '/': string;  // ex: { '/': 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG' }
}

type mediaSource = { src: string, width: number, height: number };
type multiRes = {
    xs?: mediaSource,
    sm?: mediaSource,
    md?: mediaSource,
    lg?: mediaSource,
    xl?: mediaSource
};
interface ProfileModel {
    firstName: string;
    lastName: string;
    avatar?: string; // ipfs hash
    backgroundImage?: any;
    about?: string; // ipfs hash
    links?: { title: string, url: string, type: string, id: number }[];
}

interface EntryModel {
    title: string;
    tags: string [];
    content: { data: string, html: string }; // ipfs hash
    excerpt: string; // ipfs hash
    featuredImage?: IpfsLink;
    wordCount: number;
}

interface CommentModel {
    parent?: string;
    content: any; // ipfs hash
    date: Date;
}
/////////////////// ipfs models \\\\\\\\\\\\\\\\\\\\\\\\\

// Define type of `data`
//  renderer -> channels.server.geth.start
interface GethStartRequest {
    datadir?: string;
    ipcpath?: string;
    cache?: string;
    fast?: string;
    testnet?: string;
}

interface GethStatus {
    downloading?: boolean;
    starting?: boolean;
    api: boolean;
    spawned: boolean;
    started?: boolean;
    stopped?: boolean;
}

interface IpfsStatus {
    downloading?: boolean;
    api: boolean;
    spawned: boolean;
    started?: boolean;
    stopped?: boolean;
}

interface IpfsResolveRequest {
    hash: string;
}

interface IpfsStartRequest {
    storagePath?: string;
    ports?: {
        gateway?: number,
        api?: number,
        swarm?: number
    }
}

interface IpfsgetConfigResponse extends MainResponse {
    data: {
        apiPort: string;
        storagePath: string;
    }
}
interface IpfsResolveResponse extends MainResponse {
    data: {
        content: any;
        hash: string;
    };
}

interface IpfsSetConfigRequest {
    ports: {
        gateway?: number,
        api?: number,
        swarm?: number
    }
    restart?: boolean;
}
interface IpfsSetConfigResponse extends MainResponse {
    data: {
        set: boolean
    }
}

interface IpfsGetPortsResponse {
    data: {
        gatewayPort: string,
        apiPort: string,
        swarmPort: string
    }
}
// channels.server.geth.restart
interface GethRestartRequest {
    timer?: number;
}

// channels.server.geth.stop
interface GethStopRequest {
    signal?: string;
}

// channels.client.geth.syncStatus
interface GethSyncStatus {
    currentBlock?: number;
    highestBlock?: number;
    startingBlock?: number;
    peerCount?: number;
    synced: boolean;
}

// channels.server.ipfs.stop
interface IpfsStopRequest {
    signal?: string;
}

/////////////////////////// < AUTH > \\\\\\\\\\\\\\\\\\\\\\\\

// channels.server.auth.login
interface AuthLoginRequest {
    account: string;
    password: Uint8Array;
    registering: boolean;
    rememberTime: number; // number of minutes to remember the password
}

// channels.client.auth.login
interface AuthLoginResponse extends MainResponse {
    data: {
        token: string
        expiration: Date;
    };
}

// channels.server.auth.logout
interface AuthLogoutRequest {
    flush?: boolean;
}

// channels.client.auth.logout
interface AuthLogoutResponse extends MainResponse {
    data: {
        done: boolean
    };
}

// channels.server.auth.generateEthKey
interface AuthKeygenRequest {
    password: Uint8Array;
}

// channels.client.auth.generateEthKey
interface AuthKeygenResponse extends MainResponse {
    data: {
        address: string
    };
}

interface RequestEtherRequest {
    address: string;
}

interface RequestEtherResponse extends MainResponse {
    data: {
        tx: string
    };
}

interface LocalProfilesResponse extends MainResponse {
    data: { key: string, profile: string }[];
}

////////////////////////// </ AUTH > \\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////////  < TX > \\\\\\\\\\\\\\\\\\\\\\\\\\\
interface AddToQueueRequest {
    tx: string;
}

interface AddToQueueResponse extends MainResponse {
    data: {
        watching: boolean
    };
}

interface EmitMinedRequest {
    watch: boolean;
}

interface EmitMinedResponse extends MainResponse {
    data: {
        mined?: string,
        blockNumber?: number,
        cumulativeGasUsed?: number,
        hasEvents?: boolean, // akasha contract events
        watching: boolean;
    };
}
/////////////////////////  </ TX > \\\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////////  < Registry > \\\\\\\\\\\\\\\\\\\\\\\\

interface ProfileExistsRequest {
    akashaId: string;
}

interface ProfileExistsResponse extends MainResponse {
    data: {
        akashaId: string;
        exists: boolean;
    };
}

interface CurrentProfileResponse extends MainResponse {
    data: {
        address: string;
    };
}

interface ProfileByAddressRequest {
    ethAddress: string;
}

interface ProfileByAddressResponse extends MainResponse {
    data: {
        profileAddress: string
    };
}

interface ProfileCreateRequest extends AuthRequest {
    akashaId: string;
    ipfs: IpfsProfileCreateRequest;
}

interface ProfileCreateResponse extends MainResponse {
    data: {
        tx: string;
    };
}

interface ProfileUpdateRequest extends AuthRequest {
    ipfs: IpfsProfileCreateRequest;
}
interface ProfileUpdateResponse extends MainResponse {
    data: {
        tx: string;
    };
}

interface GenericErrorEventRequest {
    fromBlock?: string,
    toBlock?: string,
    address?: string
}

interface GenericErrorEventResponse extends MainResponse {
    data: {
        events: any[]
    }
}

interface ProfileErrorEventRequest extends GenericErrorEventRequest {
}
interface ProfileErrorEventResponse extends GenericErrorEventResponse {
}

interface GenericFromEventResponse extends MainResponse {
    data: {
        collection: any[]
    }
}

interface GenericFromEventRequest extends ProfileErrorEventRequest {
    index: {};
}

interface ProfileRegisteredEventRequest extends GenericFromEventRequest {
}
interface ProfileRegisteredEventResponse extends GenericFromEventResponse {
}
/////////////////////////  </ Registry > \\\\\\\\\\\\\\\\\\\\\\\\

////////////////////////// < Profile> \\\\\\\\\\\\\\\\\\\\\\\\\\\\\
type mediaSourcePost = { src: any, width: number, height: number };
type multiResPost = {
    xs?: mediaSourcePost,
    sm?: mediaSourcePost,
    md?: mediaSourcePost,
    lg?: mediaSourcePost,
    xl?: mediaSourcePost
};
interface IpfsProfileCreateRequest {
    firstName: string;
    lastName: string;
    avatar?: any;
    backgroundImage?: multiResPost;
    about?: string;
    links?: { title: string, url: string, type: string, id: number }[];
}

interface ProfileDataRequest {
    profile: string; // profile contract address
    full?: boolean; // resolve full profile from ipfs
    resolveImages?: boolean // resolve media to buffer
}

interface ProfileDataResponse {
    firstName: string;
    lastName: string;
    akashaId: string;
    avatar?: any;
    backgroundImage?: any;
    about?: string;
    links?: any;
}

interface BalanceRequest {
    etherBase?: string;
    unit?: string; // ether/wei/etc
}

interface BalanceResponse extends MainResponse {
    data: { value: string };
}

interface IpfsDataRequest {
    ipfsHash: string; // ipfs profile hash
    full?: boolean; // resolve all info
    resolveImages?: boolean
}

interface IpfsDataResponse extends MainResponse {
    data: {
        firstName: string;
        lastName: string;
        avatar?: Uint8Array;
        backgroundImage?: any;
        about?: string;
        links?: { title: string, url: string, type: string, id: number }[];
    };
}

interface ProfileUnregisterRequest extends AuthRequest {
    akashaId: string;
}

interface ProfileFollowRequest extends AuthRequest {
    profileAddress: string;
}

interface ProfileFollowResponse extends MainResponse {
    data: {
        tx: string;
    }
}

interface GetFollowerCountRequest {
    akashaId: string;
}

interface GetFollowersRequest {
    profileAddress: string;
    from?: number;
    to?: number;
}

interface GetFollowersResponse extends MainResponse {
    data: {
        followers: string[];
    }
}

interface GetFollowingResponse extends MainResponse {
    data: {
        following: string[];
    }
}
///////////////////////// </ Profile> \\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//////////////////////// < TAGS > \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
interface TagCreateRequest extends AuthRequest {
    tagName: string;
}

interface TagCreateResponse extends MainResponse {
    data: {
        tx: string;
    };
}

interface TagExistsRequest {
    tagName: string;
}

interface TagExistsResponse extends MainResponse {
    data: {
        exists: boolean;
    };
}

interface TagAtIdRequest {
    tagId: number;
}

interface TagAtIdResponse extends MainResponse {
    data: {
        tagName: string;
    };
}

interface TagAtNameRequest {
    tagName: string;
}

interface TagAtNameResponse extends MainResponse {
    data: {
        tagId: number; // bigNumber instance
    };
}

interface TagSubscribeRequest extends AuthRequest {
    tagName: string;
}

interface TagSubscribeResponse extends MainResponse {
    data: {
        tx: string;
    };
}

interface TagUnSubscribeRequest extends AuthRequest {
    tagName: string;
    subPosition: number | string;
}

interface TagUnSubscribeResponse extends MainResponse {
    data: {
        tx: string;
    };
}

interface TagGetSubPositionRequest {
    address: string; // profile address
    tagId: number;
}

interface TagGetSubPositionResponse extends MainResponse {
    data: {
        position: number;
    };
}

interface TagIsSubscribedRequest {
    address: string; // profile address
    tagId: number;
}

interface TagIsSubscribedResponse extends MainResponse {
    data: {
        subscribed: boolean;
    };
}

interface TagsFromToRequest {
    from: number;
    to: number;
}
interface TagsFromToResponse extends MainResponse {
    data: {
        from: number;
        to: number;
        tags: string[];
    }
}
/////////////////////// </ TAGS > \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\


////////////////////// < ENTRY > \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
interface EntryCreateRequest extends AuthRequest {
    content: any;
    tags: string[];
}

interface EntryCreateResponse extends MainResponse {
    data: {
        tx: string;
    };
}

interface EntryUpdateRequest extends AuthRequest {
    content: any;
    tags: string[],
    entryId: string;
}

interface EntryUpdateResponse extends MainResponse {
    data: {
        tx: string;
    };
}

interface EntryUpvoteRequest extends AuthRequest {
    entryId: string; // entry address
    weight: number;
    value: number;
}
interface EntryUpvoteResponse extends MainResponse {
    data: {
        tx: string;
    };
}
interface EntryOpenedVotesRequest {
    address: string; // entry address
}

interface EntryOpenedVotesResponse extends MainResponse {
    data: {
        address: string;
        voting: boolean;
    };
}

interface EntryVoteofRequest {
    profile: string; // profile address of voter
    address: string;  // entry address
}

interface EntryVoteofResponse extends MainResponse {
    data: {
        profile: string;
        weight: number;
    };
}

interface EntryVoteDateRequest {
    address: string; // entry address
}

interface EntryVoteDateResponse {
    data: {
        address: string;
        date: number; // unix date
    };
}

interface EntryScoreRequest {
    address: string; // entry address
}

interface EntryScoreResponse {
    data: {
        address: string;
        score: number;
    };
}

interface EntriesCountRequest {
    profileAddress: string;
}

interface EntriesCountTagRequest {
    tagName: string;
}

interface EntriesCountResponse extends MainResponse {
    data: {
        profileAddress: string;
        count: number;
    }
}

interface EntriesOfRequest extends EntriesCountRequest {
    position: number;
}

interface EntriesOfResponse extends MainResponse {
    data: {
        profileAddress: string;
        content: any;
    }
}

interface EntryGetRequest {
    entryId: string;
    full?: boolean;
}

interface EntryGetResponse extends MainResponse {
    data: {
        entryAddress: string;
        content: any;
    }
}
///////////////////// </ ENTRY> \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

//////////////////// < COMMENTS > \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
interface CommentPublishRequest extends AuthRequest {
    address: string; // entry address
    hash: string; // ipfshash
}

interface CommentPublishResponse extends MainResponse {
    data: {
        tx: string;
    };
}

interface CommentUpdateRequest extends AuthRequest {
    address: string; // entry address
    commentId: number;
    hash: string; // ipfshash
}

interface CommentUpdateResponse extends MainResponse {
    data: {
        tx: string;
    };
}

interface CommentVoteRequest extends AuthRequest {
    address: string; // entry address
    weight: number;
    commentId: number;
    value?: number;
}

interface CommentVoteResponse extends MainResponse {
    data: {
        tx: string;
    };
}

interface CommentScoreRequest {
    address: string; // entry address
    commentId: number; // comment id
}

interface CommentScoreResponse extends MainResponse {
    data: {
        score: number;
    }
}

interface GetCommentCountRequest {
    address: string; // entry address
}

interface GetCommentCountResponse extends MainResponse {
    data: {
        count: number,
        address: string; // entry address
    }
}
interface GetCommentAtRequest {
    address: string; //entry address
    id: number; // comment id
}

interface GetCommentAtResponse extends MainResponse {
    data: {
        hash: string; // ipfs hash
        owner: string; // profile address
        date: number; // post date unix timestamp
        address: string;
        id: number;
    }
}
/////////////////// </ COMMENTS > \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

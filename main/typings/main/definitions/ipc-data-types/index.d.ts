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
    backgroundImage?: IpfsLink;
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
    content: { data: string, html: string }; // ipfs hash
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

interface IpfsResolveResponse extends MainResponse {
    data: {
        content: any;
        hash: string;
    };
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
        mined?: string
        watching: boolean;
    };
}
/////////////////////////  </ TX > \\\\\\\\\\\\\\\\\\\\\\\\\\\

/////////////////////////  < Registry > \\\\\\\\\\\\\\\\\\\\\\\\

interface ProfileExistsRequest {
    username: string;
}

interface ProfileExistsResponse extends MainResponse {
    data: {
        username: string;
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
    username: string;
    ipfs: IpfsProfileCreateRequest;
    gas?: number;
}

interface ProfileCreateResponse extends MainResponse {
    data: {
        tx: string;
    };
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
}

interface ProfileDataResponse extends MainResponse{
    data: {
        firstName: string;
        lastName: string;
        avatar?: Uint8Array;
        backgroundImage?: any;
        about?: string;
        links?: { title: string, url: string, type: string, id: number }[];
    };
}

interface MyBalanceRequest {
    etherBase?: string;
    unit?: string; // ether/wei/etc
}

interface MyBalanceResponse extends MainResponse {
    data: { value: string };
}

interface IpfsDataRequest {
    ipfsHash: string; // ipfs profile hash
    full?: boolean; // resolve all info
}

interface IpfsDataResponse extends MainResponse{
    data: {
        firstName: string;
        lastName: string;
        avatar?: Uint8Array;
        backgroundImage?: any;
        about?: string;
        links?: { title: string, url: string, type: string, id: number }[];
    };
}
///////////////////////// </ Profile> \\\\\\\\\\\\\\\\\\\\\\\\\\\\\

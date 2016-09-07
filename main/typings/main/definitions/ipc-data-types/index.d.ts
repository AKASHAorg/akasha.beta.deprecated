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
    ipfsHash: string;
    gas?: number;
}

interface ProfileCreateResponse extends MainResponse {
    data: {
        tx: string;
    };
}
/////////////////////////  </ Registry > \\\\\\\\\\\\\\\\\\\\\\\\

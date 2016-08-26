// main -> renderer ipc data exchange format

interface MainResponse {
    data: Object;
    error?: {
        message: string,
        fatal?: boolean
    };
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
interface AuthLoginResponse {
    token: string;
    expiration: Date;
}

// channels.server.auth.logout
interface AuthLogoutRequest {
    flush?: boolean;
}

// channels.client.auth.logout
interface AuthLogoutResponse {
    done: boolean;
}

// channels.server.auth.generateEthKey
interface AuthKeygenRequest {
    password: Uint8Array;
}

// channels.client.auth.generateEthKey
interface AuthKeygenResponse {
    address: string;
}

////////////////////////// </ AUTH > \\\\\\\\\\\\\\\\\\\\\\\\

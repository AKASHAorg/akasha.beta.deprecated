// main -> renderer ipc data exchange format

interface MainResponse {
    data: Object;
    error?: {
        message: string,
        fatal?: boolean
    };
}

interface IPCmanager{
    channel: string;
    listen: boolean;
}

// Define type of `data`
//  renderer -> channels.server.geth.start
interface GethStart {
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
    started?:  boolean;
    stopped?: boolean;
}

// channels.server.geth.restart
interface GethRestart {
    timer?: number;
}

// channels.server.geth.stop
interface GethStop {
    signal?: string;
}

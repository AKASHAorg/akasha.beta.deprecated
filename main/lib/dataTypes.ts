// Define type of `data`

// channels.server.geth.start
export interface GethStart {
    datadir?: string;
    ipcpath?: string;
    cache?: string;
    fast?: string;
    testnet?: string;
}

// channels.server.geth.restart
export interface GethRestart {
    timer?: number;
}

// channels.server.geth.stop
export interface GethStop {
    signal?: string;
}

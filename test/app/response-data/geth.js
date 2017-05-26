export const gethStatus = {
    api: false,
    blockNr: 0,
    downloading: false,
    message: '',
    process: false,
    started: false,
    starting: false,
    stopped: false,
    upgrading: false,
};

export const gethSyncStatus = {
    currentBlock: 0,
    highestBlock: 0,
    startingBlock: 0,
    peerCount: 0,
    synced: false
};

export const gethStart = {
    datadir: '',
    ipcpath: '',
    cache: '',
    fast: '',
    testnet: ''
};

export const gethStartError = {
    from: {},
    message: 'error starting geth service',
    fatal: true
};

export const gethStop = {
    started: false,
    stopped: true
};

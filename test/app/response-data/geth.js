export const gethStatus = {
    downloading: false,
    upgrading: false,
    starting: true,
    api: false,
    spawned: false,
    started: false,
    stopped: false,
    blockNr: 0
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

import { Record, OrderedSet } from 'immutable';

const GethStatus = Record({
    api: false,
    blockNr: null,
    downloading: null,
    ipc: null,
    message: null,
    process: false,
    started: null,
    starting: null,
    stopped: null,
    upgrading: null,
    version: null,
});

const GethSyncStatus = Record({
    currentBlock: null,
    highestBlock: null,
    knownStates: null,
    peerCount: null,
    pulledStates: null,
    startingBlock: null,
    synced: false
});

const GethFlags = Record({
    // @TODO: Document this flag
    busyState: false,
    gethStarting: false,
});

const GethRecord = Record({
    flags: new GethFlags(),
    lastLogTimestamp: null,
    logs: new OrderedSet(),
    status: new GethStatus(),
    /*
     * 0 - initial
     * 1 - syncing
     * 2 - paused
     * 3 - stopped
     * 4 - synced
     */
    syncActionId: 0,
    syncStatus: new GethSyncStatus(),
});

export { GethRecord, GethStatus, GethSyncStatus, GethFlags };

import { Record, OrderedSet } from 'immutable';

const GethStatus = Record({
    api: false,
    blockNr: null,
    downloading: null,
    message: null,
    spawned: false,
    started: null,
    starting: null,
    stopped: null,
    upgrading: null,
});

const GethSyncStatus = Record({
    api: null,
    currentBlock: null,
    highestBlock: null,
    knownStates: null,
    peerCount: null,
    pulledStates: null,
    spawned: null,
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

export default GethRecord;
export { GethStatus, GethSyncStatus, GethFlags };

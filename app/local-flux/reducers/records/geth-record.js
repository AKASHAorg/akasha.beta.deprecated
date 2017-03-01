import { Record, List, Set } from 'immutable';

const GethStatus = Record({
    downloading: null,
    starting: null,
    api: false,
    spawned: false,
    started: null,
    stopped: null,
    upgrading: null,
    blockNr: null
});
const GethSyncStatus = Record({
    currentBlock: null,
    highestBlock: null,
    startingBlock: null,
    peerCount: null,
    knownStates: null,
    pulledStates: null,
    synced: false
});

const GethFlags = Record({
    // @TODO: Document this flag
    busyState: false,
    // @TODO: Document this flag
    startRequested: false,
    syncActionId: 0
});

const GethRecord = Record({
    status: new GethStatus(),
    syncStatus: new GethSyncStatus(),
    logs: new Set(),
    flags: new GethFlags(),
});

export default GethRecord;
export { GethStatus, GethSyncStatus, GethFlags };

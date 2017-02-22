import { Record, List, Set } from 'immutable';

const GethStatus = Record({
    downloading: null,
    starting: null,
    api: false,
    spawned: false,
    started: null,
    stopped: null,
    upgrading: null,
    message: null,
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
const GethStatusRecord = Record({
    status: new GethStatus(),
    syncStatus: new GethSyncStatus(),
    errors: new List(),
    logs: new Set(),
    flags: new Record({
        // @TODO: Document this flag
        gethBusyState: false,
        // @TODO: Document this flag
        startRequested: false
    }),
});

export default GethStatusRecord;
export { GethStatus, GethSyncStatus };

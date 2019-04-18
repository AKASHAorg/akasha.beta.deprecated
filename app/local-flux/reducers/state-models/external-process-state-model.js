import { OrderedSet, Record } from 'immutable';

export const GethStatus = Record({
    api: false,
    blockNr: null,
    downloading: null,
    ipc: null,
    message: null,
    process: false,
    progress: null,
    started: null,
    starting: null,
    stopped: null,
    upgrading: null,
    version: null,
});

export const GethSyncStatus = Record({
    currentBlock: null,
    highestBlock: null,
    knownStates: null,
    peerCount: null,
    pulledStates: null,
    startingBlock: null,
    synced: false
});

// const GethFlags = Record({
//     // @TODO: Document this flag
//     busyState: false,
//     gethStarting: false,
//     statusFetched: false,
// });

const GethRecord = Record({
    // flags: new GethFlags(),
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

export const IpfsStatus = Record({
    api: false,
    baseUrl: '',
    downloading: null,
    process: false,
    progress: null,
    started: null,
    starting: null,
    stopped: null,
    upgrading: null,
    version: null,
    state: null,
});

// const IpfsFlags = Record({
//     busyState: false,
//     ipfsStarting: false,
//     portsRequested: false,
//     settingPorts: false,
//     statusFetched: false,
// });

const IpfsRecord = Record({
    // flags: new IpfsFlags(),
    lastLogTimestamp: null,
    logs: new OrderedSet(),
    status: new IpfsStatus(),
});

const ExternalProcessState = Record({
    geth: new GethRecord(),
    ipfs: new IpfsRecord()
});

export const LogRecord = Record({
    level: null,
    message: '',
    timestamp: Date.now(),
});
export default class ExternalProcessStateModel extends ExternalProcessState {
    computeGethStatus (status) {
        const newStatus = Object.assign({}, status);
        if (newStatus.started) {
            newStatus.message = null;
            newStatus.starting = null;
        }
        if (newStatus.starting || newStatus.process || newStatus.api) {
            newStatus.downloading = null;
            newStatus.stopped = null;
        }
        if (newStatus.downloading) {
            newStatus.upgrading = null;
        }
        if (newStatus.stopped) {
            newStatus.starting = false;
            newStatus.started = false;
        }
        return newStatus;
    }

    computeIpfsStatus (record) {
        const newStatus = Object.assign({}, record);
        if (newStatus.started || newStatus.process) {
            newStatus.downloading = null;
            newStatus.starting = false;
        }
        if (newStatus.downloading) {
            newStatus.upgrading = null;
        }
        return newStatus;
    }
}

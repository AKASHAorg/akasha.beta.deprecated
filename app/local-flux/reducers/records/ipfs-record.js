import { Record, OrderedSet } from 'immutable';

const IpfsStatus = Record({
    api: false,
    baseUrl: '',
    downloading: null,
    process: false,
    started: null,
    starting: null,
    stopped: null,
    upgrading: null,
    version: null,
    state: null,
});

const IpfsFlags = Record({
    busyState: false,
    ipfsStarting: false,
    portsRequested: false,
    settingPorts: false
});

const IpfsRecord = Record({
    flags: new IpfsFlags(),
    lastLogTimestamp: null,
    logs: new OrderedSet(),
    status: new IpfsStatus(),
});

export { IpfsRecord, IpfsStatus };

import { Record, OrderedSet } from 'immutable';

const IpfsStatus = Record({
    downloading: null,
    api: false,
    spawned: false,
    started: null,
    stopped: null,
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

export default IpfsRecord;
export { IpfsStatus };

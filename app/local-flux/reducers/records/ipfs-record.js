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
    status: new IpfsStatus(),
    flags: new IpfsFlags(),
    logs: new OrderedSet(),
});

export default IpfsRecord;
export { IpfsStatus };

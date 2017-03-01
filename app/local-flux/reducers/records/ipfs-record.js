import { Record, List, Set } from 'immutable';

const IpfsStatus = Record({
    downloading: null,
    api: false,
    spawned: false,
    started: null,
    stopped: null,
});
const IpfsFlags = Record({
    startRequested: false,
    busyState: false,
    portsRequested: false
});

const IpfsRecord = Record({
    status: new IpfsStatus(),
    flags: new IpfsFlags(),
    logs: new Set(),
});

export default IpfsRecord;
export { IpfsStatus };

import { Record, List, Set } from 'immutable';

const IpfsStatus = Record({
    downloading: null,
    api: false,
    spawned: false,
    started: null,
    stopped: null,
    startRequested: false
});

const IpfsStatusRecord = Record({
    status: new IpfsStatus(),
    errors: new List(),
    logs: new Set(),
    isBusy: false,
    portsRequested: false
});

export default IpfsStatusRecord;
export { IpfsStatus };

// @flow
export const selectGeth = (state/*: Object */) => state.externalProcessState.get('geth');
export const selectGethLogs = (state/*: Object */) => state.externalProcessState.getIn(['geth', 'logs']);
export const selectGethStatus = (state/*: Object */) => state.externalProcessState.getIn(['geth', 'status']);
export const selectGethSyncStatus = (state/*: Object */) => state.externalProcState.getIn(['geth', 'syncStatus']);
export const selectGethSyncActionId = (state/*: Object */) => state.externalProcState.getIn(['geth', 'syncActionId']);
export const selectGethFlags = (state/*: Object */) => state.externalProcessState.getIn(['geth', 'flags']);

export const selectIpfs = (state/*: Object */) => state.externalProcessState.get('ipfs');
export const selectIpfsLogs = (state/*: Object */) => state.externalProcessState.getIn(['ipfs', 'logs']);
export const selectIpfsStatus = (state/*: Object */) => state.externalProcState.getIn(['ipfs', 'status']);
export const selectIpfsFlags = (state/*: Object */) => state.externalProcessState.getIn(['ipfs', 'flags']);

export const selectLastGethLog = (state/*: Object */) =>
    state.externalProcState.getIn(['geth', 'lastLogTimestamp']);
export const selectLastIpfsLog = (state/*: Object */) =>
    state.externalProcState.getIn(['ipfs', 'lastLogTimestamp']);


export const getCurrentBlockNumber = (state/*: Object */) => selectGethStatus(state).get('blockNumber');
export const getBaseUrl = (state /*: Object */) => state.externalProcState.getIn(['ipfs', 'status', 'baseUrl']);
export const getGethBusyState = (state/*: Object */) => selectGethFlags(state).get('busyState');
export const getGethStarting = (state/*: Object */) => selectGethFlags(state).get('gethStarting');
export const getGethStatusFetched = (state/*: Object */) => selectGethFlags(state).get('statusFetched');
export const getIpfsStarting = (state/*: Object */) => selectIpfsFlags(state).get('ipfsStarting');
export const getIpfsBusyState = (state/*: Object */) => selectIpfsFlags(state).get('busyState');
export const getIpfsPortsRequested = (state/*: Object */) => selectIpfsFlags(state).get('portsRequested');
export const getIpfsStatusFetched = (state/*: Object */) => selectIpfsFlags(state).get('statusFetched');


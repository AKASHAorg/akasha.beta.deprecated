// @flow
export const selectGeth = (state /*: Object */) => state.externalProcState.get('geth');
export const selectGethLogs = (state /*: Object */) => state.externalProcState.getIn(['geth', 'logs']);
export const selectGethStatus = (state /*: Object */) => state.externalProcState.getIn(['geth', 'status']);
export const selectGethSyncStatus = (state /*: Object */) =>
    state.externalProcState.getIn(['geth', 'syncStatus']);
export const selectGethSyncActionId = (state /*: Object */) =>
    state.externalProcState.getIn(['geth', 'syncActionId']);

export const selectIpfs = (state /*: Object */) => state.externalProcState.get('ipfs');
export const selectIpfsLogs = (state /*: Object */) => state.externalProcState.getIn(['ipfs', 'logs']);
export const selectIpfsStatus = (state /*: Object */) => state.externalProcState.getIn(['ipfs', 'status']);

export const selectLastGethLog = (state /*: Object */) =>
    state.externalProcState.getIn(['geth', 'lastLogTimestamp']);
export const selectLastIpfsLog = (state /*: Object */) =>
    state.externalProcState.getIn(['ipfs', 'lastLogTimestamp']);

export const getCurrentBlockNumber = (state /*: Object */) => selectGethStatus(state).get('blockNumber');
export const getBaseUrl = (state /*: Object */) =>
    state.externalProcState.getIn(['ipfs', 'status', 'baseUrl']);

export const getIpfsStoragePath = (state /* : Object */) =>
    state.settingsState.getIn(['ipfs', 'storagePath']);

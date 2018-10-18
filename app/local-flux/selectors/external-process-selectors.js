export const selectGethStatus = state => state.externalProcState.getIn(['geth', 'status']);

export const selectGethSyncStatus = state => state.externalProcState.getIn(['geth', 'syncStatus']);

export const selectGethSyncActionId = state => state.externalProcState.getIn(['geth', 'syncActionId']);

export const selectIpfsStatus = state => state.externalProcState.getIn(['ipfs', 'status']);

export const selectLastGethLog = state =>
    state.externalProcState.getIn(['geth', 'lastLogTimestamp']);

export const selectLastIpfsLog = state =>
    state.externalProcState.getIn(['ipfs', 'lastLogTimestamp']);


export const selectBaseUrl = state =>
    state.externalProcState.getIn(['ipfs', 'status', 'baseUrl']);

export const selectBlockNumber = state => state.externalProcState.getIn(['geth', 'status', 'blockNr']);

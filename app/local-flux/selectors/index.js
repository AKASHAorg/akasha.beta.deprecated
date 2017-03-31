export const selectEthAddress = (state, profileAddress) =>
    state.profileState.getIn(['ethAddresses', profileAddress]);

export const selectGethStatus = state =>
    state.externalProcState.getIn(['geth', 'status']);

export const selectIpfsStatus = state =>
    state.externalProcState.getIn(['ipfs', 'status']);

export const selectLocalProfiles = state =>
    state.profileState
        .get('localProfiles')
        .filter(address => !!state.profileState.getIn(['byId', address]))
        .map(address => state.profileState.getIn(['byId', address]));

export const selectLoggedProfileData = state =>
    state.profileState.getIn(['byId', state.profileState.getIn(['loggedProfile', 'profile'])]);

export const selectProfile = (state, profileAddress) =>
    state.profileState.getIn(['byId', profileAddress]);

export const selectProfileFlag = (state, flag) =>
    state.profileState.getIn(['flags', flag]);

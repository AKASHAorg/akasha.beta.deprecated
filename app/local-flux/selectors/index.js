import { ProfileRecord } from '../reducers/records';

/* eslint-disable no-use-before-define */

export const selectActivePanel = state => state.panelState.get('activePanel');

export const selectColumnLastEntry = (state, columnId) =>
    state.dashboardState.getIn(['columnById', columnId, 'entries']).last();

export const selectEntry = (state, id) => state.entryState.getIn(['byId', id]);

export const selectEntryFlag = (state, flag) => state.entryState.getIn(['flags', flag]);

export const selectEthAddress = (state, profileAddress) =>
    state.profileState.getIn(['ethAddresses', profileAddress]);

export const selectGethStatus = state => state.externalProcState.getIn(['geth', 'status']);

export const selectIpfsStatus = state => state.externalProcState.getIn(['ipfs', 'status']);

export const selectLastAllStreamBlock = state => state.entryState.get('lastAllStreamBlock');

export const selectLocalProfiles = state =>
    state.profileState
        .get('localProfiles')
        .filter(address => !!state.profileState.getIn(['byId', address]))
        .map(address => selectProfile(state, address));

export const selectLoggedProfileData = state =>
    selectProfile(state, state.profileState.getIn(['loggedProfile', 'profile']));

export const selectColumnEntries = (state, columnId) =>
    state.dashboardState
        .getIn(['columnById', columnId, 'entries'])
        .map(id => selectEntry(state, id));

export const selectProfile = (state, profileAddress) =>
    state.profileState.getIn(['byId', profileAddress]) || new ProfileRecord();

export const selectProfileFlag = (state, flag) => state.profileState.getIn(['flags', flag]);

/* eslint-enable no-use-before-define */

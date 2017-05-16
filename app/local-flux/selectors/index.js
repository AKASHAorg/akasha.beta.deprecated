import { ProfileRecord } from '../reducers/records';

/* eslint-disable no-use-before-define */

export const selectActiveDashboard = (state) => {
    const activeDashboard = state.dashboardState.get('activeDashboard');
    if (!activeDashboard) {
        return null;
    }
    return state.dashboardState.getIn([
        'dashboardById',
        activeDashboard
    ]);
};

export const selectColumnLastBlock = (state, columnId) =>
    state.dashboardState.getIn(['columnById', columnId, 'lastBlock']);

export const selectColumnLastEntry = (state, columnId) =>
    state.dashboardState.getIn(['columnById', columnId, 'entries']).last();

export const selectDashboards = (state) => {
    const akashaId = selectLoggedAkashaId(state);
    return state.dashboardState
        .get('dashboardById')
        .filter(dashboard => dashboard.get('akashaId') === akashaId);
};

export const selectEntry = (state, id) => state.entryState.getIn(['byId', id]);

export const selectEntryFlag = (state, flag) => state.entryState.getIn(['flags', flag]);

export const selectEthAddress = (state, profileAddress) =>
    state.profileState.getIn(['ethAddresses', profileAddress]);

export const selectGethStatus = state => state.externalProcState.getIn(['geth', 'status']);

export const selectIpfsStatus = state => state.externalProcState.getIn(['ipfs', 'status']);

export const selectLastStreamBlock = state => state.entryState.get('lastStreamBlock');

export const selectTagMargins = state => state.tagState.get('margins');

export const selectLocalProfiles = state =>
    state.profileState
        .get('localProfiles')
        .filter(address => !!state.profileState.getIn(['byId', address]))
        .map(address => selectProfile(state, address));

export const selectLoggedAkashaId = state =>
    state.profileState.getIn(['loggedProfile', 'akashaId']);

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

import { ProfileRecord } from '../reducers/records';
import actionTypes from '../../constants/action-types';

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

export const selectActiveDashboardId = (state) => {
    const activeDashboardName = state.dashboardState.get('activeDashboard');
    if (!activeDashboardName) {
        return null;
    }
    return state.dashboardState.getIn([
        'dashboardById',
        activeDashboardName,
        'id'
    ]);
};

export const selectActivePanel = state => state.panelState.get('activePanel');

export const selectAllComments = state => state.commentsState.get('byId').toList();

export const selectBalance = state => state.profileState.get('balance');

export const selectBaseUrl = state =>
    state.externalProcState.getIn(['ipfs', 'status', 'baseUrl']);

export const selectColumnEntries = (state, columnId) =>
    state.dashboardState
        .getIn(['columnById', columnId, 'entries'])
        .map(id => selectEntry(state, id));

export const selectColumnLastBlock = (state, columnId) =>
    state.dashboardState.getIn(['columnById', columnId, 'lastBlock']);

export const selectColumnLastEntry = (state, columnId) =>
    state.dashboardState.getIn(['columnById', columnId, 'entries']).last();

export const selectColumnSuggestions = (state, columnId) =>
    state.dashboardState.getIn(['columnById', columnId, 'suggestions']);

export const selectCommentsFlag = (state, flag, id) => {
    if (id) {
        return state.commentsState.getIn(['flags', flag, id]);
    }
    return state.commentsState.getIn(['flags', flag]);
};

export const selectDashboardId = (state, name) =>
    state.dashboardState.getIn(['dashboardById', name, 'id']);

export const selectDashboards = state =>
    state.dashboardState.get('dashboardById');

export const selectEntry = (state, id) => state.entryState.getIn(['byId', id]);

export const selectEntryBalance = (state, id) => state.entryState.getIn(['balance', id]);

export const selectEntryCanClaim = (state, id) => state.entryState.getIn(['canClaim', id]);

export const selectEntryFlag = (state, flag) => state.entryState.getIn(['flags', flag]);

export const selectEntryVote = (state, id) => state.entryState.getIn(['votes', id]);

export const selectEthAddress = (state, profileAddress) =>
    state.profileState.getIn(['ethAddresses', profileAddress]);

export const selectFirstComment = state => state.commentsState.get('firstComm');

export const selectFullEntry = state =>
    state.entryState.get('fullEntry');

export const selectGethStatus = state => state.externalProcState.getIn(['geth', 'status']);

export const selectIpfsStatus = state => state.externalProcState.getIn(['ipfs', 'status']);

export const selectIsFollower = (state, akashaId) => state.profileState.getIn(['isFollower', akashaId]);

export const selectLastComment = state => state.commentsState.get('lastComm');

export const selectLastFollower = (state, akashaId) =>
    state.profileState.getIn(['followers', akashaId]).last();

export const selectLastFollowing = (state, akashaId) =>
    state.profileState.getIn(['followings', akashaId]).last();

export const selectLastGethLog = state =>
    state.externalProcState.getIn(['geth', 'lastLogTimestamp']);

export const selectLastIpfsLog = state =>
    state.externalProcState.getIn(['ipfs', 'lastLogTimestamp']);

export const selectLastStreamBlock = state => state.entryState.get('lastStreamBlock');

export const selectListByName = (state, name) => state.listState.getIn(['byName', name]);

export const selectListNextEntries = (state, name, limit) => {
    const startIndex = state.listState.getIn(['byName', name, 'startIndex']);
    return state.listState
        .getIn(['byName', name, 'entryIds'])
        .slice(startIndex, startIndex + limit)
        .map(id => ({ entryId: id }))
        .toJS();
};

export const selectLists = (state) => {
    const searchResults = state.listState.get('searchResults');
    if (state.listState.get('search')) {
        return searchResults.map(name => state.listState.getIn(['byName', name]));
    }
    return state.listState.get('byName').toList();
};

export const selectListSearch = state => state.listState.get('search');

export const selectLocalProfiles = state =>
    state.profileState
        .get('localProfiles')
        .map(account => ({ account, profile: selectProfileByAccount(state, account) }));

export const selectLoggedAccount = state =>
    state.profileState.getIn(['loggedProfile', 'account']);

export const selectLoggedAkashaId = state =>
    state.profileState.getIn(['loggedProfile', 'akashaId']);

export const selectLoggedProfile = state => state.profileState.get('loggedProfile');

export const selectLoggedProfileData = state =>
    selectProfile(state, state.profileState.getIn(['loggedProfile', 'akashaId']));

export const selectPendingAction = (state, actionId) =>
    state.appState.getIn(['pendingActions', actionId]);

export const selectPendingComments = (state, entryId) => {
    const pendingComments = state.appState
        .get('pendingActions')
        .filter(act =>
            act.get('type') === actionTypes.comment &&
            act.get('status') === 'publishing' &&
            act.getIn(['payload', 'entryId']) === entryId);
    return pendingComments;
};

export const selectPendingTx = (state, tx) => state.transactionState.getIn(['pending', tx]);

export const selectProfile = (state, akashaId) =>
    state.profileState.getIn(['byId', akashaId]) || new ProfileRecord();

export const selectProfileByAccount = (state, account) => {
    const akashaId = state.profileState.getIn(['ethAddresses', account]);
    return state.profileState.getIn(['byId', akashaId]) || new ProfileRecord();
};

export const selectProfileEntries = (state, akashaId) => 
    state.entryState.get('byId').filter(entry => entry.getIn(['entryEth', 'publisher']) === akashaId)
        .toList();


export const selectProfileFlag = (state, flag) => state.profileState.getIn(['flags', flag]);

export const selectSearchEntries = state =>
    state.searchState.entryIds.map(entryId => state.entryState.byId.get(entryId));

export const selectSearchQuery = state => state.searchState.get('query');

export const selectTagMargins = state => state.tagState.get('margins');

export const selectTagGetEntriesCount = state =>
    state.searchState.tags.map(tag => ({ count: state.tagState.getIn(['entriesCount', tag]), tagName: tag }));

export const selectToken = state => state.profileState.getIn(['loggedProfile', 'token']);

/* eslint-enable no-use-before-define */

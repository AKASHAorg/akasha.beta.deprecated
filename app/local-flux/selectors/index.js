import { ProfileRecord } from '../reducers/records';
import * as actionTypes from '../../constants/action-types';

/* eslint-disable no-use-before-define */

export const selectAction = (state, id) => state.actionState.getIn(['byId', id]);

export const selectActiveDashboard = (state) => {
    const activeDashboard = state.dashboardState.get('activeDashboard');
    if (!activeDashboard) {
        return null;
    }
    return state.dashboardState.getIn([
        'dashboardByName',
        activeDashboard
    ]);
};

export const selectActiveDashboardId = (state) => {
    const activeDashboardName = state.dashboardState.get('activeDashboard');
    if (!activeDashboardName) {
        return null;
    }
    return state.dashboardState.getIn([
        'dashboardByName',
        activeDashboardName,
        'id'
    ]);
};

export const selectActivePanel = state => state.panelState.get('activePanel');

export const selectAllComments = state => state.commentsState.get('byId').toList();

export const selectAllLicenses = state => state.licenseState.get('byId');

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

export const selectColumns = state => state.dashboardState.get('columnById');

export const selectColumnSuggestions = (state, columnId) =>
    state.dashboardState.getIn(['columnById', columnId, 'suggestions']);

export const selectCommentsFlag = (state, flag, id) => {
    if (id) {
        return state.commentsState.getIn(['flags', flag, id]);
    }
    return state.commentsState.getIn(['flags', flag]);
};

export const selectDashboardId = (state, name) =>
    state.dashboardState.getIn(['dashboardByName', name, 'id']);

export const selectDashboards = (state) => {
    const search = selectDashboardSearch(state);
    if (!search) {
        return state.dashboardState.get('dashboardByName');
    }
    return state.dashboardState.get('dashboardByName').filter(dashboard =>
        dashboard.get('name').toLowerCase().includes(search.toLowerCase())
    );
};

export const selectDashboardSearch = state => state.dashboardState.get('search');

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

export const selectHighlight = (state, id) => state.highlightState.getIn(['byId', id]);

export const selectHighlights = (state) => {
    const searchResults = state.highlightState.get('searchResults');
    if (state.highlightState.get('search')) {
        return searchResults.map(id => state.highlightState.getIn(['byId', id]));
    }
    return state.highlightState.get('byId').toList();
};

export const selectHighlightsCount = state => state.highlightState.get('byId').size;

export const selectHighlightSearch = state => state.highlightState.get('search');

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
    if (state.listState.get('search')) {
        const searchResults = state.listState.get('searchResults');
        return searchResults.map(name => state.listState.getIn(['byName', name]));
    }
    return state.listState.get('byName').toList();
};

export const selectListsCount = state => state.listState.get('byName').size;

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

export const selectNeedAuthAction = state =>
    state.actionState.getIn(['byId', state.actionState.get('needAuth')]);

export const selectPendingAction = (state, actionId) =>
    state.appState.getIn(['pendingActions', actionId]);

export const selectPendingComments = (state, entryId) => {
    const pendingComments = state.actionState
        .get('publishing')
        .filter((actionId) => {
            const action = state.actionState.getIn(['byId', actionId]);
            return action.get('type') === actionTypes.comment &&
                action.getIn(['payload', 'entryId']) === entryId;
        })
        .map(actionId => state.actionState.getIn(['byId', actionId]));
    return pendingComments;
};

export const selectPendingEntryClaim = (state, entryId) => {
    const pendingClaim = state.actionState
        .get('publishing')
        .filter((actionId) => {
            const action = state.actionState.getIn(['byId', actionId]);
            return action.get('type') === actionTypes.claim &&
                action.getIn(['payload', 'entryId']) === entryId;
        });
    return !!pendingClaim.size;
};

export const selectPendingEntryVote = (state, entryId) => {
    const { entryDownvote, entryUpvote } = actionTypes;
    const pendingVotes = state.actionState
        .get('publishing')
        .filter((actionId) => {
            const action = state.actionState.getIn(['byId', actionId]);
            return [entryDownvote, entryUpvote].includes(action.get('type')) &&
                action.getIn(['payload', 'entryId']) === entryId;
        });
    return !!pendingVotes.size;
};

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

export const selectTagEntriesCount = state => state.tagState.get('entriesCount');

export const selectTagMargins = state => state.tagState.get('margins');

export const selectToken = state => state.profileState.getIn(['loggedProfile', 'token']);

export const selectTokenExpiration = state => state.profileState.getIn(['loggedProfile', 'expiration']);

export const selectVoteCost = state => state.entryState.get('voteCostByWeight');

/* eslint-enable no-use-before-define */

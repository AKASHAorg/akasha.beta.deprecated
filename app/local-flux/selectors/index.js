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

export const selectActivePanel = state => state.panelState.get('activePanel');

export const selectAllComments = state => state.commentsState.get('byId').toList();

export const selectColumnEntries = (state, columnId) =>
    state.dashboardState
        .getIn(['columnById', columnId, 'entries'])
        .map(id => selectEntry(state, id));

export const selectColumnLastBlock = (state, columnId) =>
    state.dashboardState.getIn(['columnById', columnId, 'lastBlock']);

export const selectColumnLastEntry = (state, columnId) =>
    state.dashboardState.getIn(['columnById', columnId, 'entries']).last();

export const selectCommentsFlag = (state, flag, id) => {
    if (id) {
        return state.commentsState.getIn(['flags', flag, id]);
    }
    return state.commentsState.getIn(['flags', flag]);
};

export const selectDashboards = (state) => {
    const akashaId = selectLoggedAkashaId(state);
    return state.dashboardState
        .get('dashboardById')
        .filter(dashboard => dashboard.get('akashaId') === akashaId);
};

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

export const selectLocalProfiles = state =>
    state.profileState
        .get('localProfiles')
        .filter(akashaId => !!state.profileState.getIn(['byId', akashaId]))
        .map(akashaId => selectProfile(state, akashaId));

export const selectLoggedAkashaId = state =>
    state.profileState.getIn(['loggedProfile', 'akashaId']);

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

export const selectProfileFlag = (state, flag) => state.profileState.getIn(['flags', flag]);

export const selectTagMargins = state => state.tagState.get('margins');

export const selectToken = state => state.profileState.getIn(['loggedProfile', 'token']);

/* eslint-enable no-use-before-define */

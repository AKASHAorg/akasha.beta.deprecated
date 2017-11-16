import { List } from 'immutable';
import { ProfileRecord } from '../reducers/records';

/* eslint-disable no-use-before-define */

export const selectAction = (state, id) => state.actionState.getIn(['byId', id]);

export const selectActionsHistory = state =>
    state.actionState.get('history').map(id => selectAction(state, id));

export const selectActiveDashboard = (state) => {
    const activeDashboard = state.dashboardState.get('activeDashboard');
    if (!activeDashboard) {
        return null;
    }
    return state.dashboardState.getIn([
        'byId',
        activeDashboard
    ]);
};

export const selectActiveDashboardColumns = (state) => {
    const id = state.dashboardState.get('activeDashboard');
    if (!id || !state.dashboardState.getIn(['byId', id])) {
        return new List();
    }
    return state.dashboardState
        .getIn(['byId', id, 'columns'])
        .map(columnId => selectColumn(state, columnId));
};

export const selectActiveDashboardId = state => state.dashboardState.get('activeDashboard');

export const selectActivePanel = state => state.panelState.get('activePanel');

export const selectAllLicenses = state => state.licenseState.get('byId');

export const selectAllPendingClaims = state => state.actionState.getIn(['pending', 'claim']);

export const selectAllPendingVotes = state => state.actionState.getIn(['pending', 'entryVote']);

export const selectBalance = state => state.profileState.get('balance');

export const selectBaseUrl = state =>
    state.externalProcState.getIn(['ipfs', 'status', 'baseUrl']);

export const selectBlockNumber = state => state.externalProcState.getIn(['geth', 'status', 'blockNr']);

export const selectClaimableEntries = state =>
    state.actionState.get('claimable').map(entryId => selectEntry(state, entryId));

export const selectColumn = (state, columnId) => state.dashboardState.getIn(['columnById', columnId]);

export const selectColumnEntries = (state, columnId) =>
    state.dashboardState
        .getIn(['columnById', columnId, 'entries'])
        .map(id => selectEntry(state, id));

export const selectColumnLastBlock = (state, columnId) =>
    state.dashboardState.getIn(['columnById', columnId, 'lastBlock']);

export const selectColumnLastEntry = (state, columnId) =>
    state.dashboardState.getIn(['columnById', columnId, 'entries']).last();

export const selectColumnLastIndex = (state, columnId) =>
    state.dashboardState.getIn(['columnById', columnId, 'lastIndex']);

export const selectColumns = state => state.dashboardState.get('columnById');

export const selectComment = (state, id) => state.commentsState.getIn(['byId', id]);

export const selectCommentLastBlock = (state, parent) => state.commentsState.getIn(['lastBlock', parent]);

export const selectCommentLastIndex = (state, parent) => state.commentsState.getIn(['lastIndex', parent]);

export const selectCommentVote = (state, commentId) => state.commentsState.getIn(['votes', commentId]);

export const selectCommentsForParent = (state, parent) => {
    const list = state.commentsState.getIn(['byParent', parent]) || new List();
    return list.map(id => selectComment(state, id));
};

export const selectCommentsFlag = (state, flag, id) => {
    if (id) {
        return state.commentsState.getIn(['flags', flag, id]);
    }
    return state.commentsState.getIn(['flags', flag]);
};

export const selectCyclingStates = state => state.profileState.get('cyclingStates');

export const selectDashboard = (state, id) =>
    state.dashboardState.getIn(['byId', id]);

export const selectDashboards = (state) => {
    const search = selectDashboardSearch(state);
    if (!search) {
        return state.dashboardState.get('allDashboards').map(id => selectDashboard(state, id));
    }
    return state.dashboardState.get('allDashboards')
        .filter(id =>
            selectDashboard(state, id).get('name').toLowerCase().includes(search.toLowerCase())
        );
};

export const selectDashboardSearch = state => state.dashboardState.get('search');

export const selectDraftById = (state, draftId) =>
    state.draftState.getIn(['drafts', draftId]);

export const selectEntry = (state, id) => state.entryState.getIn(['byId', id]);

export const selectEntryBalance = (state, id) => state.entryState.getIn(['balance', id]);

export const selectEntryCanClaim = (state, id) => state.entryState.getIn(['canClaim', id]);

export const selectEntryFlag = (state, flag) => state.entryState.getIn(['flags', flag]);

export const selectEntryVote = (state, id) => state.entryState.getIn(['votes', id]);

export const selectEthBalance = state => state.profileState.getIn(['balance', 'eth']);

export const selectFetchingFollowers = (state, ethAddress) =>
    state.profileState.getIn(['flags', 'fetchingFollowers', ethAddress]);

export const selectFetchingFollowings = (state, ethAddress) =>
    state.profileState.getIn(['flags', 'fetchingFollowings', ethAddress]);

export const selectFetchingMoreFollowers = (state, ethAddress) =>
    state.profileState.getIn(['flags', 'fetchingMoreFollowers', ethAddress]);

export const selectFetchingMoreFollowings = (state, ethAddress) =>
    state.profileState.getIn(['flags', 'fetchingMoreFollowings', ethAddress]);

export const selectFirstComment = state => state.commentsState.get('firstComm');

export const selectFollowers = (state, ethAddress) => {
    const followers = state.profileState.getIn(['followers', ethAddress]);
    if (followers) {
        return followers.map(ethAddr => selectProfile(state, ethAddr));
    }
    return new List();
};

export const selectFollowings = (state, ethAddress) => {
    const followings = state.profileState.getIn(['followings', ethAddress]);
    if (followings) {
        return followings.map(ethAddr => selectProfile(state, ethAddr));
    }
    return new List();
};

export const selectFullEntry = state =>
    state.entryState.get('fullEntry');

export const selectGethStatus = state => state.externalProcState.getIn(['geth', 'status']);

export const selectIpfsStatus = state => state.externalProcState.getIn(['ipfs', 'status']);

export const selectIsFollower = (state, ethAddress) => state.profileState.getIn(['isFollower', ethAddress]);

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

export const selectLastFollower = (state, ethAddress) =>
    state.profileState.getIn(['lastFollower', ethAddress]);

export const selectLastFollowing = (state, ethAddress) =>
    state.profileState.getIn(['lastFollowing', ethAddress]);

export const selectLastGethLog = state =>
    state.externalProcState.getIn(['geth', 'lastLogTimestamp']);

export const selectLastIpfsLog = state =>
    state.externalProcState.getIn(['ipfs', 'lastLogTimestamp']);

export const selectLastStreamBlock = state => state.entryState.get('lastStreamBlock');

export const selectListByName = (state, name) => state.listState.getIn(['byName', name]);

export const selectListEntryType = (state, listName, entryId) => {
    const entryIds = state.listState.getIn(['byName', listName, 'entryIds']);
    const entryIndex = entryIds.findIndex(ele => ele.entryId === entryId);
    const entry = entryIds.get(entryIndex);
    return entry.entryType;
};

export const selectListEntries = (state, value, limit) =>
    state.listState
        .getIn(['byName', value, 'entryIds'])
        .slice(0, limit)
        .map((ele) => {
            const { entryId, entryType, authorEthAddress } = ele;
            return { entryId, entryType, author: { ethAddress: authorEthAddress } };
        })
        .toJS();

export const selectListNextEntries = (state, value, limit) => {
    const startIndex = state.listState.getIn(['byName', value, 'startIndex']);
    return state.listState
        .getIn(['byName', value, 'entryIds'])
        .slice(startIndex, startIndex + limit)
        .map(ele => ({ entryId: ele.entryId, author: { ethAddress: ele.authorEthAddress } }))
        .toJS();
};

export const selectLists = (state) => {
    if (state.listState.get('search')) {
        const searchResults = state.listState.get('searchResults');
        return searchResults.map(name => state.listState.getIn(['byName', name]));
    }
    return state.listState.get('byName').toList();
};

export const selectListsNames = state => state.listState.get('byName').toList().map(list => list.get('name'));

export const selectListsCount = state => state.listState.get('byName').size;

export const selectListSearch = state => state.listState.get('search');

export const selectLocalProfiles = state =>
    state.profileState
        .get('localProfiles')
        .map(ethAddress => selectProfile(state, ethAddress));

export const selectLoggedAkashaId = state =>
    state.profileState.getIn(['loggedProfile', 'akashaId']);

export const selectLoggedEthAddress = state =>
    state.profileState.getIn(['loggedProfile', 'ethAddress']);

export const selectLoggedProfile = state => state.profileState.get('loggedProfile');

export const selectLoggedProfileData = state =>
    selectProfile(state, state.profileState.getIn(['loggedProfile', 'ethAddress']));

export const selectManaBalance = state => state.profileState.getIn(['balance', 'mana', 'remaining']);

export const selectManaBurned = state => state.profileState.get('manaBurned');

export const selectMoreComments = (state, parent) => state.commentsState.getIn(['moreComments', parent]);

export const selectMoreFollowers = (state, ethAddress) =>
    state.profileState.getIn(['moreFollowers', ethAddress]);

export const selectMoreFollowings = (state, ethAddress) =>
    state.profileState.getIn(['moreFollowings', ethAddress]);

export const selectNeedAuthAction = state =>
    state.actionState.getIn(['byId', state.actionState.get('needAuth')]);

export const selectNewColumn = state => state.dashboardState.get('newColumn');

// export const selectNewColumnEntries = (state) => {
//     const entryIds = state.dashboardState.getIn(['columnById', 'newColumn', 'entries']);
//     return entryIds.map(id => selectEntry(state, id));
// };

export const selectNewCommentsBlock = state =>
    state.commentsState.getIn(['newComments', 'lastBlock']) || selectBlockNumber(state);

export const selectNewestCommentBlock = (state, parent) =>
    state.commentsState.getIn(['newestCommentBlock', parent]);

export const selectPendingActionByType = (state, actionType) =>
    state.actionState.getIn(['pending', actionType]);

export const selectPendingBondAeth = state => state.actionState.getIn(['pending', 'bondAeth']);

export const selectPendingClaim = (state, entryId) =>
    !!state.actionState.getIn(['pending', 'claim', entryId]);

export const selectPendingClaims = state =>
    state.actionState.getIn(['pending', 'claim']);

export const selectPendingClaimVotes = state =>
    state.actionState.getIn(['pending', 'claimVote']);

export const selectPendingComments = (state, entryId) =>
    state.actionState.getIn(['pending', 'comment', entryId]) || new List();

export const selectPendingCommentVote = (state, commentId) =>
    state.actionState.getIn(['pending', 'commentVote', commentId]);

export const selectPendingCycleAeth = state => state.actionState.getIn(['pending', 'cycleAeth']);

export const selectPendingFollow = (state, akashaId) =>
    !!state.actionState.getIn(['pending', 'follow', akashaId]);

export const selectPendingTip = (state, akashaId) =>
    !!state.actionState.getIn(['pending', 'sendTip', akashaId]);

export const selectPendingTransformEssence = state =>
    state.actionState.getIn(['pending', 'transformEssence']);

export const selectPendingVote = (state, entryId) =>
    !!state.actionState.getIn(['pending', 'entryVote', entryId]);

export const selectProfile = (state, ethAddress) =>
    state.profileState.getIn(['byEthAddress', ethAddress]) || new ProfileRecord();

export const selectProfileEditToggle = state =>
    state.appState.get('showProfileEditor');

export const selectProfileEntries = (state, ethAddress) =>
    (state.entryState.getIn(['profileEntries', ethAddress, 'entryIds']) || new List())
        .map(entryId => selectEntry(state, entryId));

export const selectProfileEntriesFlags = (state, ethAddress) => {
    const profileEntries = state.entryState.getIn(['profileEntries', ethAddress]);
    if (!profileEntries) {
        return {};
    }
    return {
        fetchingEntries: profileEntries.get('fetchingEntries'),
        fetchingMoreEntries: profileEntries.get('fetchingMoreEntries'),
        moreEntries: profileEntries.get('moreEntries')
    };
};

export const selectProfileEntriesLastBlock = (state, value) =>
    state.entryState.getIn(['profileEntries', value, 'lastBlock']);

export const selectProfileEntriesLastIndex = (state, value) =>
    state.entryState.getIn(['profileEntries', value, 'lastIndex']);

export const selectProfileExists = state => state.profileState.get('exists');

export const selectProfileFlag = (state, flag) => state.profileState.getIn(['flags', flag]);

export const selectProfileSearchResults = state => state.searchState.get('profiles');

export const selectResolvingComment = (state, commentId) =>
    state.commentsState.getIn(['flags', 'resolvingComments', commentId]);

export const selectSearchEntries = state =>
    state.searchState.entryIds.map(entryId => state.entryState.byId.get(entryId));

export const selectSearchQuery = state => state.searchState.get('query');

export const selectSelectionState = (state, draftId, ethAddress) =>
    state.draftState.getIn(['selection', draftId, ethAddress]);

export const selectTagEntriesCount = state => state.tagState.get('entriesCount');

export const selectTagExists = state => state.tagState.get('exists');

export const selectTagSearchResults = state => state.searchState.get('tags');

export const selectToken = state => state.profileState.getIn(['loggedProfile', 'token']);

export const selectTokenExpiration = state => state.profileState.getIn(['loggedProfile', 'expiration']);

export const selectVoteCost = state => state.entryState.get('voteCostByWeight');

/* eslint-enable no-use-before-define */

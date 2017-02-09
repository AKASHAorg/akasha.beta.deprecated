import { connect } from 'react-redux';
import PanelLoader from 'shared-components/Panels/panel-loader';
import { AppActions, ProfileActions, EntryActions, DraftActions, NotificationsActions,
    SearchActions, SettingsActions, TagActions } from 'local-flux';

function mapStateToProps (state) {
    const loggedProfile = state.profileState.get('loggedProfile');
    const publishedEntries = state.entryState.get('entries')
        .filter(entry =>
            entry.get('type') === 'profileEntry'
                && entry.get('akashaId') === loggedProfile.get('akashaId')
        )
        .map(entry => entry.get('content'));
    const searchEntries = state.entryState
        .get('entries')
        .filter(entry => entry.get('type') === 'searchEntry')
        .map(entry => entry.get('content'));
    return {
        consecQueryErrors: state.searchState.get('consecutiveQueryErrors'),
        currentSearchPage: state.searchState.get('currentPage'),
        drafts: state.draftState.get('drafts'),
        draftsCount: state.draftState.get('draftsCount'),
        fetchingDrafts: state.draftState.getIn(['flags', 'fetchingDrafts']),
        fetchingMorePublishedEntries: state.entryState.getIn(['flags', 'fetchingMorePublishedEntries']),
        fetchingPublishedEntries: state.entryState.getIn(['flags', 'fetchingPublishedEntries']),
        fetchingProfileData: state.profileState.getIn(['flags', 'fetchingProfileData']),
        handshakePending: state.searchState.getIn(['flags', 'handshakePending']),
        loggedProfile,
        loggedProfileData: state.profileState.get('profiles').find(profile =>
            profile.get('profile') === state.profileState.getIn(['loggedProfile', 'profile'])),
        loginRequested: state.profileState.getIn(['flags', 'loginRequested']),
        moreProfileEntries: state.entryState.get('moreProfileEntries'),
        moreQueryPending: state.searchState.getIn(['flags', 'moreQueryPending']),
        mutedList: state.settingsState.get('userSettings').notifications.muted,
        notificationsState: state.notificationsState,
        panelState: state.panelState,
        publishedEntries,
        publishingDrafts: state.appState.get('pendingActions').filter(action => action.type === 'publishEntry'),
        query: state.searchState.get('query'),
        queryPending: state.searchState.getIn(['flags', 'queryPending']),
        searchErrors: state.searchState.get('errors'),
        searchResults: searchEntries,
        searchResultsCount: state.searchState.get('resultsCount'),
        searchService: state.searchState.get('searchService'),
        showResults: state.searchState.get('showResults'),
        totalSearchPages: state.searchState.get('totalPages'),
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        profileActions: new ProfileActions(dispatch),
        entryActions: new EntryActions(dispatch),
        draftActions: new DraftActions(dispatch),
        notificationsActions: new NotificationsActions(dispatch),
        searchActions: new SearchActions(dispatch),
        settingsActions: new SettingsActions(dispatch),
        tagActions: new TagActions(dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PanelLoader);

import { connect } from 'react-redux';
import PanelLoader from 'shared-components/Panels/panel-loader';
import { AppActions, ProfileActions, EntryActions, DraftActions, NotificationsActions, TagActions } from 'local-flux';

function mapStateToProps (state) {
    const loggedProfile = state.profileState.get('loggedProfile');
    const publishedEntries = state.entryState.get('entries')
        .filter(entry =>
            entry.get('type') === 'profileEntry'
                && entry.get('akashaId') === loggedProfile.get('akashaId')
        )
        .map(entry => entry.get('content'));
    return {
        drafts: state.draftState.get('drafts'),
        draftsCount: state.draftState.get('draftsCount'),
        fetchingDrafts: state.draftState.getIn(['flags', 'fetchingDrafts']),
        fetchingMorePublishedEntries: state.entryState.getIn(['flags', 'fetchingMorePublishedEntries']),
        fetchingPublishedEntries: state.entryState.getIn(['flags', 'fetchingPublishedEntries']),
        fetchingProfileData: state.profileState.getIn(['flags', 'fetchingProfileData']),
        loggedProfile,
        loggedProfileData: state.profileState.get('profiles').find(profile =>
            profile.get('profile') === state.profileState.getIn(['loggedProfile', 'profile'])),
        loginRequested: state.profileState.getIn(['flags', 'loginRequested']),
        moreProfileEntries: state.entryState.get('moreProfileEntries'),
        notificationsState: state.notificationsState,
        panelState: state.panelState,
        publishedEntries
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        profileActions: new ProfileActions(dispatch),
        entryActions: new EntryActions(dispatch),
        draftActions: new DraftActions(dispatch),
        notificationsActions: new NotificationsActions(dispatch),
        tagActions: new TagActions(dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PanelLoader);

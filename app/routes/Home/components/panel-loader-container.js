import { connect } from 'react-redux';
import PanelLoader from 'shared-components/Panels/panel-loader';
import { AppActions, ProfileActions, EntryActions, DraftActions, NotificationsActions } from 'local-flux';

function mapStateToProps (state) {
    const loggedProfile = state.profileState.get('loggedProfile');
    const publishedEntries = state.entryState.get('entries').filter(entry =>
        entry.get('type') === 'profileEntry' && entry.get('akashaId') === loggedProfile.get('akashaId')
    );
    return {
        fetchingProfileData: state.profileState.getIn(['flags', 'fetchingProfileData']),
        loginRequested: state.profileState.getIn(['flags', 'loginRequested']),
        panelState: state.panelState,
        loggedProfile,
        entries: publishedEntries,
        drafts: state.draftState.get('drafts'),
        draftsCount: state.draftState.get('draftsCount'),
        entriesCount: state.entryState.get('entriesCount'),
        notificationsState: state.notificationsState
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        profileActions: new ProfileActions(dispatch),
        entryActions: new EntryActions(dispatch),
        draftActions: new DraftActions(dispatch),
        notificationsActions: new NotificationsActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PanelLoader);

import { connect } from 'react-redux';
import PanelLoader from 'shared-components/Panels/panel-loader';
import { AppActions, ProfileActions, EntryActions, DraftActions } from 'local-flux';

function mapStateToProps (state) {
    return {
        fetchingProfileData: state.profileState.getIn(['flags', 'fetchingProfileData']),
        loginRequested: state.profileState.getIn(['flags', 'loginRequested']),
        panelState: state.panelState,
        loggedProfile: state.profileState.get('loggedProfile'),
        entries: state.entryState.get('published'),
        drafts: state.draftState.get('drafts'),
        draftsCount: state.draftState.get('draftsCount'),
        entriesCount: state.entryState.get('entriesCount'),
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        profileActions: new ProfileActions(dispatch),
        entryActions: new EntryActions(dispatch),
        draftActions: new DraftActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PanelLoader);

import { connect } from 'react-redux';
import { ProfileActions, EntryActions, DraftActions, TagActions,
    AppActions, SettingsActions } from 'local-flux';
import PublishEntryPanel from './components/publish-entry-panel';

function mapStateToProps (state) {
    return {
        loggedProfile: state.profileState.get('loggedProfile'),
        profiles: state.profileState.get('profiles'),
        drafts: state.draftState.get('drafts'),
        registerPending: state.tagState.getIn(['flags', 'registerPending']),
        licences: state.entryState.get('licences')
    };
}
/* eslint-disable no-unused-vars */
function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch),
        entryActions: new EntryActions(dispatch),
        draftActions: new DraftActions(dispatch),
        tagActions: new TagActions(dispatch),
        appActions: new AppActions(dispatch),
        settingsActions: new SettingsActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PublishEntryPanel);

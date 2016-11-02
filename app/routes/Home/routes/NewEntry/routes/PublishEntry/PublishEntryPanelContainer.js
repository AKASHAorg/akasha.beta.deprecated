import { connect } from 'react-redux';
import { ProfileActions, EntryActions, DraftActions } from 'local-flux';
import PublishEntryPanel from './components/publish-entry-panel';

function mapStateToProps (state) {
    return {
        loggedProfile: state.profileState.get('loggedProfile'),
        profiles: state.profileState.get('profiles'),
        drafts: state.draftState.get('drafts'),
        tagState: state.tagState
    };
}

function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch),
        entryActions: new EntryActions(dispatch),
        draftActions: new DraftActions(dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PublishEntryPanel);

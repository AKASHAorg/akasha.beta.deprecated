import { connect } from 'react-redux';
import { ProfileActions, EntryActions, DraftActions, TagActions } from 'local-flux';
import PublishEntryPanel from './components/publish-entry-panel';

function mapStateToProps (state) {
    return {
        loggedProfile: state.profileState.get('loggedProfile'),
        profiles: state.profileState.get('profiles'),
        drafts: state.draftState.get('drafts'),
        pendingTags: state.tagState.get('pendingTags')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch),
        entryActions: new EntryActions(dispatch),
        draftActions: new DraftActions(dispatch),
        tagActions: new TagActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PublishEntryPanel);

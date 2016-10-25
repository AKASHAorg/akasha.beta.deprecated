import PublishEntryPanel from './components/publish-entry-panel';
import { connect } from 'react-redux';
import { ProfileActions, EntryActions, DraftActions } from 'local-flux';

function mapStateToProps (state) {
    return {
        profileState: state.profileState,
        entryState: state.entryState,
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

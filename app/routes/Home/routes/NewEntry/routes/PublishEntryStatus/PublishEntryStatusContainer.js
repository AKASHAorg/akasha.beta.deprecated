import PublishEntryStatus from './components/publish-entry-status';
import { connect } from 'react-redux';
import { ProfileActions, EntryActions } from 'local-flux';

function mapStateToProps (state) {
    return {
        profileState: state.profileState,
        entryState: state.entryState
    };
}

function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch),
        entryActions: new EntryActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PublishEntryStatus);
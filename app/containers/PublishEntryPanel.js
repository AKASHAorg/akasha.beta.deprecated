import PublishEntryPanel from '../components/panels/publish-entry-panel';
import { connect } from 'react-redux';
import { ProfileActions, EntryActions } from '../actions';

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
)(PublishEntryPanel);


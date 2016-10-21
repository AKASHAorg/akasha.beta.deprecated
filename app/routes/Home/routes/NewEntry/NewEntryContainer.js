import { connect } from 'react-redux';
import { ProfileActions, DraftActions } from 'local-flux';
import AddEntryPage from './components/add-entry';

function mapStateToProps (state) {
    return {
        profileState: state.profileState,
        draftState: state.draftState
    };
}

function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch),
        draftActions: new DraftActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddEntryPage);

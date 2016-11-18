import { connect } from 'react-redux';
import { ProfileActions, DraftActions } from 'local-flux';
import AddEntryPage from './components/add-entry';

function mapStateToProps (state) {
    return {
        loggedProfile: state.profileState.get('loggedProfile'),
        draftState: state.draftState,
        drafts: state.draftState.get('drafts'),
        savingDraft: state.draftState.getIn(['flags', 'savingDraft']),
        errors: state.draftState.get('errors')
    };
}
/* eslint-disable no-unused-vars */
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

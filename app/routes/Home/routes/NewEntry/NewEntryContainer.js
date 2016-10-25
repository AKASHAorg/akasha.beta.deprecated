import { connect } from 'react-redux';
import { ProfileActions, DraftActions } from 'local-flux';
import AddEntryPage from './components/add-entry';

function mapStateToProps (state) {
    const profiles = state.profileState.get('profiles');
    const loggedProfileAddress = state.profileState.getIn(['loggedProfile', 'profile']);
    const loggedProfile = profiles.find(profile =>
        profile.get('profile') === loggedProfileAddress
    );
    return {
        loggedProfile,
        draftState: state.draftState,
        drafts: state.draftState.get('drafts'),
        savingDraft: state.draftState.get('savingDraft'),
        errors: state.draftState.get('errors')
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

import { connect } from 'react-redux';
import { AppActions, ProfileActions, DraftActions } from 'local-flux';
import AddEntryPage from './components/add-entry';

function mapStateToProps (state, ownProps) {
    return {
        loggedProfile: state.profileState.get('loggedProfile'),
        draftState: state.draftState,
        drafts: state.draftState.get('drafts'),
        savingDraft: state.draftState.getIn(['flags', 'savingDraft']),
        errors: state.draftState.get('errors'),
        entriesCount: parseInt(state.profileState.get('profiles').find(prof =>
            prof.get('akashaId') === ownProps.params.akashaId).get('entriesCount'), 10),
        draftsCount: state.draftState.get('draftsCount'),
        defaultLicence: state.settingsState.getIn(['userSettings', 'defaultLicence']),
        selectedTag: state.tagState.get('selectedTag')
    };
}
/* eslint-disable no-unused-vars */
function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        profileActions: new ProfileActions(dispatch),
        draftActions: new DraftActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddEntryPage);

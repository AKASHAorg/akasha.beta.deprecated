import { connect } from 'react-redux';
import { AppActions, DraftActions, EntryActions, ProfileActions } from 'local-flux';
import AddEntryPage from './components/add-entry';

function mapStateToProps (state, ownProps) {
    return {
        defaultLicence: state.settingsState.getIn(['userSettings', 'defaultLicence']),
        drafts: state.draftState.get('drafts'),
        draftsCount: state.draftState.get('draftsCount'),
        entriesCount: parseInt(state.profileState.get('profiles').find(prof =>
            prof.get('akashaId') === ownProps.params.akashaId).get('entriesCount'), 10),
        errors: state.draftState.get('errors'),
        fetchingFullEntry: state.entryState.getIn(['flags', 'fetchingFullEntry']),
        fullEntry: state.entryState.get('fullEntry'),
        latestVersion: state.entryState.get('fullEntryLatestVersion'),
        loggedProfile: state.profileState.get('loggedProfile'),
        savingDraft: state.draftState.getIn(['flags', 'savingDraft']),
        selectedTag: state.tagState.get('selectedTag')
    };
}
/* eslint-disable no-unused-vars */
function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        draftActions: new DraftActions(dispatch),
        entryActions: new EntryActions(dispatch),
        profileActions: new ProfileActions(dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddEntryPage);

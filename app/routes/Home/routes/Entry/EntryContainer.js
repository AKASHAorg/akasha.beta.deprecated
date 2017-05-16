import { connect } from 'react-redux';
import { AppActions, CommentsActions } from 'local-flux';
import EntryPage from './components/entry-page';
import { entryCleanFull, entryGetFull, entryGetLatestVersion } from '../../../../local-flux/actions/entry-actions';
import { selectLoggedProfileData } from '../../../../local-flux/selectors';

function mapStateToProps (state) {
    const entry = state.entryState.get('fullEntry');

    return {
        blockNr: state.externalProcState.getIn(['gethStatus', 'blockNr']),
        comments: state.commentsState.get('entryComments'),
        commentErrors: state.commentsState.get('errors'),
        drafts: state.draftState.get('drafts'),
        entry,
        fetchingFullEntry: state.entryState.getIn(['flags', 'fetchingFullEntry']),
        fetchingComments: state.commentsState.getIn(['flags', 'fetchingComments']),
        latestVersion: state.entryState.get('fullEntryLatestVersion'),
        licenses: state.licenseState.get('byId'),
        loggedProfile: state.profileState.get('loggedProfile'),
        loggedProfileData: selectLoggedProfileData(state),
        newCommentsIds: state.commentsState.get('newCommentsIds'),
        pendingCommentsActions: state.appState.get('pendingActions').filter(action => action.type === 'publishComment'),
        profiles: state.profileState.get('profiles'),
    };
}

function mapDispatchToProps (dispatch) {
    return {
        // appActions: new AppActions(dispatch),
        commentsActions: new CommentsActions(dispatch),
        entryCleanFull: () => dispatch(entryCleanFull()),
        entryGetFull: (id, version) => dispatch(entryGetFull(id, version)),
        entryGetLatestVersion: id => dispatch(entryGetLatestVersion(id))
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EntryPage);

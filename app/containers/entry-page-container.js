import { connect } from 'react-redux';
import { EntryPage } from '../components';
import { actionAdd } from '../local-flux/actions/action-actions';
import { commentsCheckNew, commentsClean, commentsIterator, commentsLoadNew,
    commentsMoreIterator } from '../local-flux/actions/comments-actions';
import { entryCleanFull, entryGetFull,
    entryGetLatestVersion } from '../local-flux/actions/entry-actions';
import { highlightSave } from '../local-flux/actions/highlight-actions';
import { selectLoggedProfileData, selectPendingComments } from '../local-flux/selectors';

function mapStateToProps (state) {
    const entry = state.entryState.get('fullEntry');
    return {
        entry,
        fetchingFullEntry: state.entryState.getIn(['flags', 'fetchingFullEntry']),
        latestVersion: state.entryState.get('fullEntryLatestVersion'),
        licenses: state.licenseState.get('byId'),
        loggedProfileData: selectLoggedProfileData(state),
        newComments: state.commentsState.getIn(['newComments', 'comments']),
        pendingComments: selectPendingComments(state, entry && entry.get('entryId')),
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
        commentsCheckNew,
        commentsClean,
        commentsIterator,
        commentsLoadNew,
        commentsMoreIterator,
        entryCleanFull,
        entryGetFull,
        entryGetLatestVersion,
        highlightSave,
    }
)(EntryPage);

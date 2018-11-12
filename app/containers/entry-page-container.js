import { connect } from 'react-redux';
import { EntryPage } from '../components';
import { actionAdd } from '../local-flux/actions/action-actions';
import { commentsCheckNew, commentsLoadNew,
    commentsMoreIterator } from '../local-flux/actions/comments-actions';
import { entryCleanFull, entryGetFull, entryGetLatestVersion,
    entryResolveIpfsHash } from '../local-flux/actions/entry-actions';
import { highlightSave } from '../local-flux/actions/highlight-actions';
import { toggleOutsideNavigation, fullSizeImageAdd } from '../local-flux/actions/app-actions';
import { getBaseUrl, getLoggedProfileData, selectPendingComments } from '../local-flux/selectors';

function mapStateToProps (state) {
    const entry = state.entryState.get('fullEntry');
    return {
        baseUrl: getBaseUrl(state),
        entry,
        fetchingFullEntry: state.entryState.getIn(['flags', 'fetchingFullEntry']),
        latestVersion: state.entryState.get('fullEntryLatestVersion'),
        licenses: state.licenseState.get('byId'),
        loggedProfileData: getLoggedProfileData(state),
        newComments: state.commentsState.getIn(['newComments', 'comments']),
        pendingComments: selectPendingComments(state, entry && entry.get('entryId')),
        resolvingIpfsHash: state.entryState.getIn(['flags', 'resolvingFullEntryHash'])
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
        commentsCheckNew,
        commentsLoadNew,
        commentsMoreIterator,
        entryCleanFull,
        entryGetFull,
        entryGetLatestVersion,
        entryResolveIpfsHash,
        fullSizeImageAdd,
        highlightSave,
        toggleOutsideNavigation,
    }
)(EntryPage);

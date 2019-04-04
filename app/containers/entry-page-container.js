import { connect } from 'react-redux';
import { EntryPage } from '../components';
import { actionAdd } from '../local-flux/actions/action-actions';
import { commentsCheckNew, commentsLoadNew,
    commentsMoreIterator } from '../local-flux/actions/comments-actions';
import { entryCleanFull, entryGetFull, entryGetLatestVersion,
    entryResolveIpfsHash } from '../local-flux/actions/entry-actions';
import { highlightSave } from '../local-flux/actions/highlight-actions';
import { toggleOutsideNavigation, fullSizeImageAdd } from '../local-flux/actions/app-actions';
import { actionSelectors, commentSelectors, entrySelectors, externalProcessSelectors,
    profileSelectors, licenseSelectors } from '../local-flux/selectors';

function mapStateToProps (state) {
    const entry = state.entryState.get('fullEntry');
    return {
        baseUrl: externalProcessSelectors.getBaseUrl(state),
        entry,
        fetchingFullEntry: entrySelectors.selectEntryFlag(state, 'fetchingFullEntry'),
        latestVersion: entrySelectors.selectFullEntryLatestVersion(state),
        licenses: licenseSelectors.selectAllLicenses(state),
        loggedProfileData: profileSelectors.getLoggedProfileData(state),
        newComments: commentSelectors.getNewComments(state),
        pendingComments: actionSelectors.getEntryPendingComments(state, entry && entry.get('entryId')),
        resolvingIpfsHash: entrySelectors.selectEntryFlag(state, 'resolvingFullEntryHash')
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
        commentsCheckNew,
        commentsLoadNew,
        // commentsMoreIterator,
        entryCleanFull,
        entryGetFull,
        entryGetLatestVersion,
        entryResolveIpfsHash,
        fullSizeImageAdd,
        highlightSave,
        toggleOutsideNavigation,
    }
)(EntryPage);

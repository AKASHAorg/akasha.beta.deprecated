import { connect } from 'react-redux';
import { AppActions, CommentsActions, EntryActions, TagActions, ProfileActions } from 'local-flux';
import EntryPage from './components/entry-page';

function mapStateToProps (state, ownProps) {
    const drafts = state.draftState.get('drafts');
    const entry = state.entryState.get('fullEntry');
    const existingDraft = entry &&
        drafts.find(draft => draft.get('entryId') === entry.get('entryId'));
    return {
        blockNr: state.externalProcState.getIn(['gethStatus', 'blockNr']),
        canClaimPending: state.entryState.getIn(['flags', 'canClaimPending']),
        claimPending: state.entryState.getIn(['flags', 'claimPending']),
        comments: state.commentsState.get('entryComments'),
        drafts: state.draftState.get('drafts'),
        entry,
        existingDraft,
        fetchingFullEntry: state.entryState.getIn(['flags', 'fetchingFullEntry']),
        fetchingComments: state.commentsState.getIn(['flags', 'fetchingComments']),
        fetchingEntryBalance: state.entryState.getIn(['flags', 'fetchingEntryBalance']),
        followingsList: state.profileState.get('followingsList'),
        latestVersion: state.entryState.get('fullEntryLatestVersion'),
        licences: state.entryState.get('licences'),
        loggedProfile: state.profileState.get('loggedProfile'),
        newCommentsIds: state.commentsState.get('newCommentsIds'),
        pendingCommentsActions: state.appState.get('pendingActions').filter(action => action.type === 'publishComment'),
        profiles: state.profileState.get('profiles'),
        savedEntries: state.entryState.get('savedEntries').map(entr => entr.get('entryId')),
        votePending: state.entryState.getIn(['flags', 'votePending']),
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        commentsActions: new CommentsActions(dispatch),
        entryActions: new EntryActions(dispatch),
        tagActions: new TagActions(dispatch),
        profileActions: new ProfileActions(dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EntryPage);

import { connect } from 'react-redux';
import { AppActions, CommentsActions, EntryActions, TagActions, ProfileActions } from 'local-flux';
import EntryPage from './components/entry-page';

function mapStateToProps (state, ownProps) {
    return {
        blockNr: state.externalProcState.getIn(['gethStatus', 'blockNr']),
        canClaimPending: state.entryState.getIn(['flags', 'canClaimPending']),
        claimPending: state.entryState.getIn(['flags', 'claimPending']),
        comments: state.commentsState.get('entryComments'),
        newCommentsIds: state.commentsState.get('newCommentsIds'),
        entry: state.entryState.get('fullEntry'),
        fetchingFullEntry: state.entryState.getIn(['flags', 'fetchingFullEntry']),
        fetchingComments: state.commentsState.getIn(['flags', 'fetchingComments']),
        fetchingEntryBalance: state.entryState.getIn(['flags', 'fetchingEntryBalance']),
        licences: state.entryState.get('licences'),
        loggedProfile: state.profileState.get('loggedProfile'),
        profiles: state.profileState.get('profiles'),
        followingsList: state.profileState.get('followingsList'),
        savedEntries: state.entryState.get('savedEntries').map(entry => entry.get('entryId')),
        votePending: state.entryState.getIn(['flags', 'votePending']),
        pendingCommentsActions: state.appState.get('pendingActions').filter(action => action.type === 'publishComment')
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

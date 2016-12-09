import { connect } from 'react-redux';
import { AppActions, CommentsActions, EntryActions, TagActions } from 'local-flux';
import EntryPage from './components/entry-page';

function mapStateToProps (state, ownProps) {
    return {
        blockNr: state.externalProcState.getIn(['gethStatus', 'blockNr']),
        canClaimPending: state.entryState.getIn(['flags', 'canClaimPending']),
        claimPending: state.entryState.getIn(['flags', 'claimPending']),
        comments: state.commentsState.get('entryComments'),
        entry: state.entryState.get('fullEntry'),
        fetchingFullEntry: state.entryState.getIn(['flags', 'fetchingFullEntry']),
        fetchingComments: state.commentsState.getIn(['flags', 'fetchingComments']),
        fetchingEntryBalance: state.entryState.getIn(['flags', 'fetchingEntryBalance']),
        loggedProfile: state.profileState.get('loggedProfile'),
        profiles: state.profileState.get('profiles'),
        savedEntries: state.entryState.get('savedEntries').map(entry => entry.get('entryId')),
        votePending: state.entryState.getIn(['flags', 'votePending']),
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        commentsActions: new CommentsActions(dispatch),
        entryActions: new EntryActions(dispatch),
        tagActions: new TagActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EntryPage);

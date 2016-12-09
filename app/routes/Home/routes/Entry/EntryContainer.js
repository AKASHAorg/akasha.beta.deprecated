import { connect } from 'react-redux';
import { AppActions, EntryActions, CommentsActions } from 'local-flux';
import EntryPage from './components/entry-page';

function mapStateToProps (state, ownProps) {
    return {
        entry: state.entryState.get('fullEntry'),
        fetchingFullEntry: state.entryState.getIn(['flags', 'fetchingFullEntry']),
        fetchingComments: state.commentsState.getIn(['flags', 'fetchingComments']),
        votePending: state.entryState.getIn(['flags', 'votePending']),
        profiles: state.profileState.get('profiles'),
        loggedProfile: state.profileState.get('loggedProfile'),
        comments: state.commentsState.get('entryComments')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        entryActions: new EntryActions(dispatch),
        commentsActions: new CommentsActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EntryPage);

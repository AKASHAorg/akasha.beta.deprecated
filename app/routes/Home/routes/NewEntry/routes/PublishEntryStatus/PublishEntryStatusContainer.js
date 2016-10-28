import { connect } from 'react-redux';
import { AppActions, DraftActions } from 'local-flux';
import PublishEntryStatus from './components/publish-entry-status';

function mapStateToProps (state) {
    return {
        loggedProfile: state.profileState.get('loggedProfile'),
        drafts: state.draftState.get('drafts')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        draftActions: new DraftActions(dispatch),
        appActions: new AppActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PublishEntryStatus);

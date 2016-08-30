import { connect } from 'react-redux';
import { ProfileActions, EntryActions, AppActions } from 'local-flux';
import EntryList from './components/entry-list';


function mapStateToProps (state) {
    return {
        profileState: state.profileState,
        entryState: state.entryState
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        profileActions: new ProfileActions(dispatch),
        entryActions: new EntryActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EntryList);

import { connect } from 'react-redux';
import Setup from '../components/startup/Setup';
import { SetupActions } from '../actions/SetupActions';
import { SyncActions } from '../actions/SyncActions';

function mapStateToProps (state) {
    return {
        setupConfig: state.setupConfig
    };
}

function mapDispatchToProps (dispatch) {
    return {
        setupActions: new SetupActions(dispatch),
        syncActions: new SyncActions(dispatch)
    };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Setup);

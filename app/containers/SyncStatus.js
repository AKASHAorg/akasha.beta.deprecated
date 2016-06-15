import { connect } from 'react-redux';
import SyncStatus from '../components/startup/SyncStatus';
import { SyncActions } from '../actions/SyncActions';
import { SetupActions } from '../actions/SetupActions';
import { LoggerActions } from '../actions/LoggerActions';

function mapStateToProps (state) {
    return {
        syncState: state.syncStatus,
        setupConfig: state.setupConfig
    };
}

function mapDispatchToProps (dispatch) {
    return {
        syncActions: new SyncActions(dispatch),
        setupActions: new SetupActions(dispatch),
        loggerActions: new LoggerActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SyncStatus);

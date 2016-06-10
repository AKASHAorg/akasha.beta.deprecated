import { connect } from 'react-redux';
import SyncStatus from '../components/startup/SyncStatus';
import { SyncActions } from '../actions/SyncActions';
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
        loggerActions: new LoggerActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SyncStatus);

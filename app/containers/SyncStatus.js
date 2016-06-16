import { connect } from 'react-redux';
import SyncStatus from '../components/startup/SyncStatus';
import { SyncActions, SetupActions, LoggerActions, EProcActions } from '../actions';

function mapStateToProps (state) {
    return {
        syncState: state.syncStatus,
        setupConfig: state.setupConfig
    };
}

function mapDispatchToProps (dispatch) {
    return {
        eProcActions: new EProcActions(dispatch),
        syncActions: new SyncActions(dispatch),
        setupActions: new SetupActions(dispatch),
        loggerActions: new LoggerActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SyncStatus);

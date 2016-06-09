import { connect } from 'react-redux';
import SyncStatus from '../components/startup/SyncStatus';
import { SyncActions } from '../actions/SyncActions';

function mapStateToProps (state) {
    return {
        syncState: state.syncStatus,
        setupConfig: state.setupConfig
    };
}

function mapDispatchToProps (dispatch) {
    return {
        syncActions: new SyncActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SyncStatus);

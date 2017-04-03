import { connect } from 'react-redux';
import { LogDetails } from '../components';
import { gethStartLogger, gethStopLogger } from 'local-flux/actions/external-process-actions';

const mapStateToProps = state => ({
    gethLogs: state.externalProcState.getIn(['geth', 'logs']),
    timestamp: state.appState.get('timestamp')
});

export default connect(
    mapStateToProps,
    {
        gethStartLogger,
        gethStopLogger,
    }
)(LogDetails);

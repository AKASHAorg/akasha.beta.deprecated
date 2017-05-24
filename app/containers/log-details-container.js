import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { LogDetails } from '../components';
import { gethStartLogger, gethStopLogger } from '../local-flux/actions/external-process-actions';

const mapStateToProps = state => ({
    gethLogs: state.externalProcState.getIn(['geth', 'logs'])
});

export default connect(
    mapStateToProps,
    {
        gethStartLogger,
        gethStopLogger,
    }
)(injectIntl(LogDetails));

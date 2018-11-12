import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { LogsDetails } from '../components';
import { gethStartLogger, gethStopLogger } from '../local-flux/actions/external-process-actions';
import { selectGethLogs } from '../local-flux/selectors';

const mapStateToProps = state => ({
    gethLogs: selectGethLogs(state)
});

export default connect(
    mapStateToProps,
    {
        gethStartLogger,
        gethStopLogger,
    }
)(injectIntl(LogsDetails));

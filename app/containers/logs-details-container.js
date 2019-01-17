import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { LogsDetails } from '../components';
import { gethStartLogger, gethStopLogger } from '../local-flux/actions/external-process-actions';
import { externalProcessSelectors } from '../local-flux/selectors';

const mapStateToProps = state => ({
    gethLogs: externalProcessSelectors.selectGethLogs(state)
});

export default connect(
    mapStateToProps,
    {
        gethStartLogger,
        gethStopLogger,
    }
)(injectIntl(LogsDetails));

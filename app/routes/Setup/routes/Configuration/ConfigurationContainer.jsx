import { connect } from 'react-redux';
import Configuration from './components/Configuration';
import { SetupActions, SyncActions, SettingsActions, EProcActions } from 'local-flux';

function mapStateToProps (state) {
    return {
        setupConfig: state.setupConfig
    };
}

function mapDispatchToProps (dispatch) {
    return {
        eProcActions: new EProcActions(dispatch),
        setupActions: new SetupActions(dispatch),
        settingsActions: new SettingsActions(dispatch),
        syncActions: new SyncActions(dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Configuration);

import { connect } from 'react-redux';
import Setup from '../components/startup/Setup';
import { SetupActions, SyncActions, SettingsActions, EProcActions } from '../actions';

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
)(Setup);

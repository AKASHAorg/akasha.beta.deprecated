import { connect } from 'react-redux';
import Configuration from './components/Configuration';
import {
    SettingsActions,
    EProcActions } from 'local-flux';

function mapStateToProps (state) {
    return {
        gethSettings: state.settingsState.get('geth'),
        ipfsSettings: state.settingsState.get('ipfs'),
        configFlags: state.settingsState.get('flags'),
        isAdvanced: state.settingsState.get('isAdvanced'),
        userSettings: state.settingsState.get('userSettings')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        eProcActions: new EProcActions(dispatch),
        settingsActions: new SettingsActions(dispatch),
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Configuration);

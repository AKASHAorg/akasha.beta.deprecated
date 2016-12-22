import { connect } from 'react-redux';
import Configuration from './components/Configuration';
import {
    SettingsActions,
    EProcActions } from 'local-flux';

function mapStateToProps (state, ownProps) {
    return {
        gethSettings: state.settingsState.get('geth'),
        defaultGethSettings: state.settingsState.get('defaultGethSettings'),
        ipfsSettings: state.settingsState.get('ipfs'),
        defaultIpfsSettings: state.settingsState.get('defaultIpfsSettings'),
        configFlags: state.settingsState.get('flags'),
        fetchingFlags: state.settingsState.get('fetchingFlags'),
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

import { connect } from 'react-redux';
import { saveConfiguration } from 'local-flux/actions/settings-actions'; // eslint-disable-line import/no-unresolved, import/extensions
import Configuration from './components/Configuration';

function mapStateToProps (state, ownProps) {
    return {
        configurationSaved: state.settingsState.getIn(['general', 'configurationSaved']),
        defaultGethSettings: state.settingsState.get('defaultGethSettings'),
        defaultIpfsSettings: state.settingsState.get('defaultIpfsSettings'),
        gethSettings: state.settingsState.get('geth'),
        ipfsSettings: state.settingsState.get('ipfs'),
    };
}

export default connect(
    mapStateToProps,
    {
        saveConfiguration
    }
)(Configuration);

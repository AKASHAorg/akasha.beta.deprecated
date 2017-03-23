import { connect } from 'react-redux';
import { saveConfiguration } from '../local-flux/actions/settings-actions'; // eslint-disable-line import/no-unresolved, import/extensions
import Configuration from '../components/configuration';
import connectWithTheme from '../utils/connect-with-theme';

function mapStateToProps (state) {
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

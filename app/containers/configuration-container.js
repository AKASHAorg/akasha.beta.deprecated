import { connect } from 'react-redux';
import { saveConfiguration } from '../local-flux/actions/settings-actions';
import { toggleLightSyncMode } from '../local-flux/actions/app-actions';
import { Configuration } from '../components';
import { getConfigurationSaved, selectDefaultGethSettings, selectDefaultIpfsSettings,
    selectGethSettings, selectIpfsSettings } from '../local-flux/selectors';

function mapStateToProps (state) {
    return {
        configurationSaved: getConfigurationSaved(state),
        defaultGethSettings: selectDefaultGethSettings(state),
        defaultIpfsSettings: selectDefaultIpfsSettings(state),
        gethSettings: selectGethSettings(state),
        ipfsSettings: selectIpfsSettings(state),
    };
}

export default connect(
    mapStateToProps,
    {
        saveConfiguration,
        toggleLightSyncMode,
    },
    null,
    // this option will disable the "shouldComponentUpdate" method on the connected component
    // sCU will be removed in react-redux 6.0 anyway
    { pure: false }
)(Configuration);

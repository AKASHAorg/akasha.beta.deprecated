import React, { PropTypes } from 'react';
import { TextField } from 'material-ui';
import * as Colors from 'material-ui/styles/colors';
import { setupMessages } from 'locale-data/messages';

const AdvancedSetupForm = (props) => {
    const {
        intl,
        cacheSizeError,
        gethSettings,
        ipfsSettings,
        handleGethIpc,
        handleGethDatadir,
        handleGethCacheSize,
        handleIpfsPath,
    } = props;
    const errorStyle = { color: Colors.minBlack };
    const floatingLabelStyle = { color: Colors.lightBlack };
    const inputStyle = { color: Colors.darkBlack };
    return (
      <div style={{ paddingLeft: '12px' }} >
        <TextField
          errorStyle={errorStyle}
          errorText={intl.formatMessage(setupMessages.changeGethDataDir)}
          floatingLabelStyle={floatingLabelStyle}
          floatingLabelText={intl.formatMessage(setupMessages.gethDataDirPath)}
          value={gethSettings.get('datadir')}
          inputStyle={inputStyle}
          onClick={handleGethDatadir}
          onFocus={handleGethDatadir}
          fullWidth
        />
        {/** <TextField
          errorStyle={errorStyle}
          errorText={intl.formatMessage(setupMessages.changeGethAlreadyStarted)}
          floatingLabelStyle={floatingLabelStyle}
          floatingLabelText={intl.formatMessage(setupMessages.gethIPCPath)}
          hintText={gethSettings.get('ipcpath')}
          inputStyle={inputStyle}
          onBlur={handleGethIpc}
          fullWidth
        /> */}
        <TextField
          errorStyle={cacheSizeError ? { color: 'red' } : errorStyle}
          errorText={cacheSizeError || intl.formatMessage(setupMessages.changeGethCacheSize)}
          floatingLabelStyle={floatingLabelStyle}
          floatingLabelText={intl.formatMessage(setupMessages.gethCacheSize)}
          hintText={gethSettings.get('cache')}
          inputStyle={inputStyle}
          onBlur={handleGethCacheSize}
          type="number"
          fullWidth
        />
        <TextField
          errorStyle={errorStyle}
          errorText={'Change ipfs directory'}
          floatingLabelStyle={floatingLabelStyle}
          floatingLabelText={'IPFS Path'}
          value={ipfsSettings.get('ipfsPath')}
          inputStyle={inputStyle}
          onClick={handleIpfsPath}
          onFocus={handleIpfsPath}
          type="text"
          fullWidth
        />
      </div>
    );
};
AdvancedSetupForm.propTypes = {
    intl: PropTypes.shape(),
    cacheSizeError: PropTypes.string,
    gethSettings: PropTypes.shape(),
    ipfsSettings: PropTypes.shape(),
    handleGethDatadir: PropTypes.func,
    handleGethIpc: PropTypes.func,
    handleGethCacheSize: PropTypes.func,
    handleIpfsPath: PropTypes.func,
    handleIpfsApiPort: PropTypes.func,
    handleIpfsGatewayPort: PropTypes.func
};

export { AdvancedSetupForm };

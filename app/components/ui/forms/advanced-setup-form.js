import React, { PropTypes } from 'react';
import { TextField } from 'material-ui';
import * as Colors from 'material-ui/styles/colors';
import { setupMessages } from '../../../locale-data/messages';

const AdvancedSetupForm = (props) => {
    const {
        intl,
        cacheSizeError,
        setupConfig,
        handleGethIpc,
        handleGethDatadir,
        handleGethCacheSize,
        handleIpfsPath,
        handleIpfsApiPort,
        handleIpfsGatewayPort
    } = props;
    const errorStyle = { color: Colors.minBlack };
    const floatingLabelStyle = { color: Colors.lightBlack };
    const inputStyle = { color: Colors.darkBlack };
    const rootStyle = { width: '400px' };
    return (
      <div style={{ paddingLeft: '12px' }} >
        <TextField
          errorStyle={errorStyle}
          errorText={intl.formatMessage(setupMessages.changeGethDataDir)}
          floatingLabelStyle={floatingLabelStyle}
          floatingLabelText={intl.formatMessage(setupMessages.gethDataDirPath)}
          value={setupConfig.getIn(['geth', 'dataDir'])}
          inputStyle={inputStyle}
          onClick={handleGethDatadir}
          onFocus={handleGethDatadir}
          style={rootStyle}
        />
        <TextField
          errorStyle={errorStyle}
          errorText={intl.formatMessage(setupMessages.changeGethAlreadyStarted)}
          floatingLabelStyle={floatingLabelStyle}
          floatingLabelText={intl.formatMessage(setupMessages.gethIPCPath)}
          hintText={setupConfig.getIn(['geth', 'ipcPath'])}
          inputStyle={inputStyle}
          onBlur={handleGethIpc}
          style={rootStyle}
        />
        <TextField
          errorStyle={cacheSizeError ? {color: 'red'} : errorStyle}
          errorText={cacheSizeError || intl.formatMessage(setupMessages.changeGethCacheSize)}
          floatingLabelStyle={floatingLabelStyle}
          floatingLabelText={intl.formatMessage(setupMessages.gethCacheSize)}
          hintText={setupConfig.getIn(['geth', 'cacheSize'])}
          inputStyle={inputStyle}
          onBlur={handleGethCacheSize}
          style={rootStyle}
          type="number"
        />
        <TextField
          errorStyle={errorStyle}
          errorText={'Change ipfs directory'}
          floatingLabelStyle={floatingLabelStyle}
          floatingLabelText={'IPFS Path'}
          value={setupConfig.getIn(['ipfs', 'ipfsPath'])}
          inputStyle={inputStyle}
          onClick={handleIpfsPath}
          onFocus={handleIpfsPath}
          style={rootStyle}
          type="text"
        />
        {/**
        <TextField
          errorStyle={errorStyle}
          errorText={intl.formatMessage(setupMessages.changeIfIpfsRunning)}
          floatingLabelStyle={floatingLabelStyle}
          floatingLabelText={intl.formatMessage(setupMessages.ipfsApiPort)}
          hintText={setupConfig.getIn(['ipfs', 'apiPort'])}
          inputStyle={inputStyle}
          onBlur={handleIpfsApiPort}
          style={rootStyle}
          type="number"
        />
        <TextField
          errorStyle={errorStyle}
          errorText={intl.formatMessage(setupMessages.changeIfIpfsRunning)}
          floatingLabelStyle={floatingLabelStyle}
          floatingLabelText={intl.formatMessage(setupMessages.ipfsGatewayPort)}
          hintText={setupConfig.getIn(['ipfs', 'gatewayPort'])}
          inputStyle={inputStyle}
          onBlur={handleIpfsGatewayPort}
          style={rootStyle}
          type="number"
        />
      */}
      </div>
    );
};
AdvancedSetupForm.propTypes = {
    intl: PropTypes.object,
    cacheSizeError: PropTypes.string,
    setupConfig: PropTypes.object,
    handleGethDatadir: PropTypes.func,
    handleGethIpc: PropTypes.func,
    handleGethCacheSize: PropTypes.func,
    handleIpfsPath: PropTypes.func,
    handleIpfsApiPort: PropTypes.func,
    handleIpfsGatewayPort: PropTypes.func
};

export { AdvancedSetupForm };

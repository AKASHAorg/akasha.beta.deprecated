import React, { PropTypes } from 'react';
import { TextField } from 'material-ui';
import { setupMessages } from '../../locale-data/messages';
import { PathInputField } from '../';

const floatingLabelStyle = {
    cursor: 'default',
    overflowX: 'visible',
    whiteSpace: 'nowrap'
};
const textFieldStyle = { display: 'block', width: '120px' };

export default function IpfsOptionsForm (props, { muiTheme }) {
    const { intl, ipfsPortsRequested, ipfsApi, style, apiPort, gatewayPort, swarmPort,
        storagePath, onIpfsApiPortChange, onIpfsGatewayPortChange, onIpfsSwarmPortChange,
        onIpfsStorageChange, showSuccessMessage } = props;
    const { palette } = muiTheme;
    const inputStyle = { color: palette.textColor };
    const labelStyle = Object.assign({}, floatingLabelStyle, { color: palette.disabledColor });

    return (
      <div style={style}>
        <PathInputField
          floatingLabelText={intl.formatMessage(setupMessages.ipfsStoragePath)}
          onChange={onIpfsStorageChange}
          path={storagePath}
        />
        {apiPort &&
          <TextField
            floatingLabelStyle={labelStyle}
            floatingLabelText={intl.formatMessage(setupMessages.ipfsApiPort)}
            floatingLabelFixed
            value={apiPort}
            inputStyle={inputStyle}
            type="number"
            onChange={onIpfsApiPortChange}
            style={textFieldStyle}
            disabled={!ipfsApi || ipfsPortsRequested}
          />
        }
        {gatewayPort &&
          <TextField
            floatingLabelStyle={labelStyle}
            floatingLabelText={intl.formatMessage(setupMessages.ipfsGatewayPort)}
            floatingLabelFixed
            value={gatewayPort}
            onChange={onIpfsGatewayPortChange}
            inputStyle={inputStyle}
            type="number"
            style={textFieldStyle}
            disabled={!ipfsApi || ipfsPortsRequested}
          />
        }
        {swarmPort &&
          <TextField
            floatingLabelStyle={labelStyle}
            floatingLabelText={intl.formatMessage(setupMessages.ipfsSwarmPort)}
            floatingLabelFixed
            value={swarmPort}
            onChange={onIpfsSwarmPortChange}
            inputStyle={inputStyle}
            type="number"
            style={textFieldStyle}
            disabled={!ipfsApi || ipfsPortsRequested}
          />
        }
        {showSuccessMessage &&
          <div style={{ color: palette.accent3Color, marginTop: '15px' }}>
            {intl.formatMessage(setupMessages.saveIpfsSettingsSuccess)}
          </div>
        }
      </div>
    );
}

IpfsOptionsForm.propTypes = {
    apiPort: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    gatewayPort: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    intl: PropTypes.shape().isRequired,
    ipfsApi: PropTypes.bool,
    ipfsPortsRequested: PropTypes.bool,
    onIpfsApiPortChange: PropTypes.func,
    onIpfsGatewayPortChange: PropTypes.func,
    onIpfsStorageChange: PropTypes.func,
    onIpfsSwarmPortChange: PropTypes.func,
    storagePath: PropTypes.string,
    style: PropTypes.shape(),
    swarmPort: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

IpfsOptionsForm.contextTypes = {
    muiTheme: PropTypes.shape().isRequired
};

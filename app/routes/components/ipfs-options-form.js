import React, { Component, PropTypes } from 'react';
import { TextField } from 'material-ui';
import { setupMessages } from 'locale-data/messages';

const floatingLabelStyle = {
    cursor: 'default',
    overflowX: 'visible',
    whiteSpace: 'nowrap'
};
const textFieldStyle = { display: 'block', width: '120px' };

class IpfsOptionsForm extends Component {
    render () {
        const { palette } = this.context.muiTheme;
        const { intl, style, ipfsSettings, storagePath, onIpfsStorageChange } = this.props;
        const inputStyle = { color: palette.textColor };
        const labelStyle = Object.assign({}, floatingLabelStyle, { color: palette.disabledColor });

        return (<div style={style}>
          <TextField
            floatingLabelStyle={labelStyle}
            floatingLabelText={intl.formatMessage(setupMessages.ipfsStoragePath)}
            floatingLabelFixed
            value={storagePath || ''}
            inputStyle={inputStyle}
            onClick={onIpfsStorageChange}
            fullWidth
          />
          {ipfsSettings.get('ports').apiPort &&
            <TextField
              floatingLabelStyle={labelStyle}
              floatingLabelText={intl.formatMessage(setupMessages.ipfsApiPort)}
              floatingLabelFixed
              value={ipfsSettings.get('ports').apiPort || ''}
              inputStyle={inputStyle}
              type="number"
              style={textFieldStyle}
              disabled
            />
          }
          {ipfsSettings.get('ports').gatewayPort &&
            <TextField
              floatingLabelStyle={labelStyle}
              floatingLabelText={intl.formatMessage(setupMessages.ipfsGatewayPort)}
              floatingLabelFixed
              value={ipfsSettings.get('ports').gatewayPort || ''}
              inputStyle={inputStyle}
              type="number"
              style={textFieldStyle}
              disabled
            />
          }
          {ipfsSettings.get('ports').swarmPort &&
            <TextField
              floatingLabelStyle={labelStyle}
              floatingLabelText={intl.formatMessage(setupMessages.ipfsSwarmPort)}
              floatingLabelFixed
              value={ipfsSettings.get('ports').swarmPort || ''}
              inputStyle={inputStyle}
              type="number"
              style={textFieldStyle}
              disabled
            />
          }
          {this.props.showSuccessMessage &&
            <div style={{ color: palette.accent3Color, marginTop: '15px' }}>
              {intl.formatMessage(setupMessages.saveIpfsSettingsSuccess)}
            </div>
          }
        </div>);
    }
}

IpfsOptionsForm.propTypes = {
    intl: PropTypes.shape().isRequired,
    ipfsSettings: PropTypes.shape().isRequired,
    style: PropTypes.shape(),
    onIpfsStorageChange: PropTypes.func,
    storagePath: PropTypes.string,
    showSuccessMessage: PropTypes.bool
};

IpfsOptionsForm.contextTypes = {
    muiTheme: PropTypes.shape().isRequired
};

export default IpfsOptionsForm;

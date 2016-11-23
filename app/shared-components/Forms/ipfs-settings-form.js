import React, { PropTypes, Component } from 'react';
import { TextField } from 'material-ui';
import { setupMessages } from 'locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions

class IpfsSettingsForm extends Component {
    handleDialogOpen = () => {
        this.directoryField.click();
    }
    _addDirectory = (node) => {
        if (node) {
            node.webkitdirectory = true;
            this.directoryField = node;
        }
    }
    _handleIpfsPath = () => {
        const ipfsPath = this.directoryField.files[0].path;
        if (this.props.handleIpfsPath) {
            this.props.handleIpfsPath(ipfsPath);
        }
    }
    render () {
        const { intl, ipfsSettings } = this.props;
        const { muiTheme } = this.context;
        const errorStyle = { color: muiTheme.palette.disabledColor };
        const floatingLabelStyle = { color: muiTheme.palette.disabledColor, zIndex: 0 };
        const inputStyle = { color: muiTheme.palette.textColor };
        return (
          <div style={{ position: 'relative' }}>
            <TextField
              errorStyle={errorStyle}
              errorText={intl.formatMessage(setupMessages.changeIpfsStoragePath)}
              floatingLabelStyle={floatingLabelStyle}
              floatingLabelText={'IPFS Path'}
              value={ipfsSettings.get('storagePath') || ''}
              inputStyle={inputStyle}
              onClick={this.handleDialogOpen}
              onFocus={this.handleDialogOpen}
              type="text"
              fullWidth
            />
            <input
              ref={(directoryField) => { this._addDirectory(directoryField); }}
              onChange={this._handleIpfsPath}
              style={{
                  opacity: 0,
                  height: 0,
                  width: 0
              }}
              type="file"
            />
          </div>
        );
    }
}

IpfsSettingsForm.propTypes = {
    intl: PropTypes.shape().isRequired,
    ipfsSettings: PropTypes.shape().isRequired,
    handleIpfsPath: PropTypes.func.isRequired
};

IpfsSettingsForm.contextTypes = {
    muiTheme: PropTypes.shape().isRequired
};

export default IpfsSettingsForm;

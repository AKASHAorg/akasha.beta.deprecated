import React, { Component, PropTypes } from 'react';
import { remote } from 'electron';
import { TextField, FlatButton } from 'material-ui';
import * as Colors from 'material-ui/styles/colors';
import { setupMessages, generalMessages } from 'locale-data/messages';

const { dialog } = remote;
const floatingLabelStyle = {
    cursor: 'default',
    overflowX: 'visible',
    whiteSpace: 'nowrap'
};
const textFieldStyle = { display: 'block', width: '120px' };

class IpfsOptionsForm extends Component {
    constructor (props) {
        super(props);

        this.state = {
            storagePath: props.ipfsSettings.get('storagePath'),
            showSuccessMessage: false,
            isDirty: false
        };
    }

    componentWillReceiveProps (nextProps) {
        const { ipfsSettings } = this.props;
        const nextIpfsSettings = nextProps.ipfsSettings;
        if (ipfsSettings.toJS().storagePath !== nextIpfsSettings.toJS().storagePath) {
            this.setState({
                showSuccessMessage: true
            });
        }
    }

    handleIpfsPath = (ev) => {
        ev.stopPropagation();
        ev.target.blur();
        dialog.showOpenDialog({
            title: 'Select IPFS path',
            buttonLabel: 'Select',
            properties: ['openDirectory']
        }, (paths) => {
            if (paths) {
                this.setState({
                    storagePath: paths[0],
                    isDirty: true
                });
            }
        });
    };

    onSaveSettings = () => {
        const { settingsActions } = this.props;
        const { storagePath } = this.state;

        settingsActions.saveSettings('ipfs', { storagePath });
        this.setState({
            showSuccessMessage: false,
            isDirty: false
        });
    };

    render () {
        const { palette } = this.context.muiTheme;
        const { intl, style, ipfsSettings } = this.props;
        const inputStyle = { color: palette.textColor };
        const labelStyle = Object.assign({}, floatingLabelStyle, { color: palette.disabledColor });

        return <div style={style}>
          <TextField
            floatingLabelStyle={labelStyle}
            floatingLabelText={intl.formatMessage(setupMessages.ipfsStoragePath)}
            floatingLabelFixed
            value={this.state.storagePath || ''}
            inputStyle={inputStyle}
            onClick={this.handleIpfsPath}
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
          {this.state.showSuccessMessage && !this.state.isDirty &&
            <div style={{ color: palette.accent3Color, marginTop: '15px' }}>
              {intl.formatMessage(setupMessages.saveIpfsSettingsSuccess)}
            </div>
          }
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <FlatButton
              label={intl.formatMessage(generalMessages.save)}
              primary
              disabled={!this.state.isDirty}
              onClick={this.onSaveSettings}
            />
          </div>
        </div>;
    }
}

IpfsOptionsForm.propTypes = {
    intl: PropTypes.shape().isRequired,
    ipfsSettings: PropTypes.shape().isRequired,
    settingsActions: PropTypes.shape().isRequired,
    style: PropTypes.shape()
};

IpfsOptionsForm.contextTypes = {
    muiTheme: PropTypes.shape().isRequired
}

export default IpfsOptionsForm;

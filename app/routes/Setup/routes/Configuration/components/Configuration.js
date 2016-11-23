import React, { Component, PropTypes } from 'react';
import { remote } from 'electron';
import { FlatButton, RadioButton, RadioButtonGroup, RaisedButton } from 'material-ui';
import { injectIntl } from 'react-intl';
import { setupMessages, generalMessages } from 'locale-data/messages'; /* eslint import/no-unresolved: 0 */
import PanelContainer from 'shared-components/PanelContainer/panel-container'; /* eslint import/no-unresolved: 0 */
import { GethSettingsForm, IpfsSettingsForm } from 'shared-components';
import PanelHeader from '../../../../components/panel-header';

const { dialog } = remote;

class Config extends Component {
    constructor (props) {
        super(props);

        this.state = {
            isDialogOpen: false
        };
    }
    componentWillUpdate (nextProps) {
        const { configFlags } = nextProps;
        const cancelRequest = configFlags && configFlags.get('requestStartupChange');
        if (!cancelRequest) {
            return this.context.router.push('setup/sync-status');
        }
        return null;
    }
    handleChange = (ev, value) => {
        const { settingsActions, isAdvanced } = this.props;
        const show = value === 'advanced';
        if (isAdvanced === show) {
            return;
        }
        settingsActions.toggleAdvancedSettings(show);
    };
    handleGethDatadir = (gethDataDir) => {
        const { settingsActions } = this.props;
        if (gethDataDir) {
            settingsActions.setupGethDataDir(gethDataDir);
        }
    };
    handleGethIpc = (ev) => {
        const { settingsActions, gethSettings } = this.props;
        const target = ev.target;
        const currentIpcPath = gethSettings.get('ipcPath');
        if (currentIpcPath === target.value || !target.value) {
            return;
        }
        settingsActions.setupGethIPCPath(target.value);
    };
    handleGethCacheSize = (event, index, value) => {
        this.props.settingsActions.setupGethCacheSize(value);
    };
    handleIpfsPath = (ipfsPath) => {
        const { settingsActions } = this.props;
        if (ipfsPath) {
            settingsActions.setupIPFSPath(ipfsPath);
        }
    };
    handleIpfsApiPort = (ev) => {
        const { settingsActions, ipfsSettings } = this.props;
        const target = ev.target;
        const currentIpfsApiPort = ipfsSettings.get('apiPort');
        if (currentIpfsApiPort === target.value || !target.value) {
            return;
        }
        settingsActions.setupIPFSApiPort(target.value);
    };
    handleIpfsGatewayPort = (ev) => {
        const { settingsActions, ipfsSettings } = this.props;
        const target = ev.target;
        const currentIpfsGatewayPort = ipfsSettings.get('gatewayPort');
        if (currentIpfsGatewayPort === target.value || !target.value) {
            return;
        }
        settingsActions.setupIPFSGatewayPort(target.value);
    };
    handleSubmit = () => {
        const { settingsActions, gethSettings, defaultGethSettings, ipfsSettings,
            defaultIpfsSettings, eProcActions, isAdvanced } = this.props;
        let geth = gethSettings.toJS();
        let ipfs = ipfsSettings.toJS();

        if (!isAdvanced) {
            geth = defaultGethSettings.toJS();
            ipfs = defaultIpfsSettings.toJS();
            settingsActions.resetSettings();
        }

        settingsActions.saveSettings('geth', geth);
        settingsActions.saveSettings('ipfs', ipfs);
        settingsActions.saveSettings('flags', { requestStartupChange: false });
        eProcActions.startSync();
        this.context.router.push('setup/sync-status');
    };

    showOpenDialog = (title, cb) => {
        this.setState({
            isDialogOpen: true
        }, () => {
            dialog.showOpenDialog({
                title: `Select ${title}`,
                buttonLabel: 'Select',
                properties: ['openDirectory']
            }, cb);
        });
    };

    _getLogs = () => {};
    _retrySetup = () => {
        const { settingsActions, isAdvanced } = this.props;
        settingsActions.retrySetup(isAdvanced);
    };

    _sendReport = () => {};
    render () {
        const { isAdvanced, intl, gethSettings, ipfsSettings, settingsActions } = this.props;
        const radioStyle = { marginTop: '10px', marginBottom: '10px' };
        const defaultSelected = !isAdvanced ? 'express' : 'advanced';
        return (
          <PanelContainer
            showBorder
            actions={[
              /* eslint-disable */
              <RaisedButton
                key="next"
                label={intl.formatMessage(generalMessages.nextButtonLabel)}
                primary
                backgroundColor={this.context.muiTheme.raisedButton.secondaryColor}
                style={{ marginLeft: '12px' }}
                onClick={this.handleSubmit}
              />
              /* eslint-enable */
            ]}
            header={<PanelHeader title={'AKASHA'} />}
          >
            <h1 style={{ fontWeight: '400' }} className="col-xs-12" >
              {intl.formatMessage(setupMessages.firstTimeSetupTitle)}
            </h1>
            <div className="col-xs-12">
              <p>
                {intl.formatMessage(setupMessages.akashaNextGenNetwork)}
              </p>
              <p>
                {intl.formatMessage(setupMessages.youHaveNotHeared)}
              </p>
              <p>
                {intl.formatMessage(setupMessages.ifYouHaveEth)}
              </p>
            </div>
            <div style={{ paddingLeft: '12px' }} className="col-xs-12" >
              <RadioButtonGroup
                defaultSelected={defaultSelected}
                name="installType"
                onChange={this.handleChange}
              >
                <RadioButton
                  label={intl.formatMessage(setupMessages.expressSetup)}
                  style={radioStyle}
                  value={'express'}
                />
                <RadioButton
                  label={intl.formatMessage(setupMessages.advancedSetup)}
                  style={radioStyle}
                  value={'advanced'}
                />
              </RadioButtonGroup>
              {isAdvanced &&
                <div>
                  <GethSettingsForm
                    intl={intl}
                    gethSettings={gethSettings}
                    handleGethDatadir={this.handleGethDatadir}
                    handleGethCacheSize={this.handleGethCacheSize}
                  />
                  <IpfsSettingsForm
                    intl={intl}
                    ipfsSettings={ipfsSettings}
                    handleIpfsPath={this.handleIpfsPath}
                  />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <FlatButton
                      label={intl.formatMessage(generalMessages.reset)}
                      onClick={settingsActions.resetSettings}
                    />
                  </div>
                </div>
              }
            </div>
          </PanelContainer>
        );
    }
}

Config.propTypes = {
    settingsActions: PropTypes.shape().isRequired,
    gethSettings: PropTypes.shape().isRequired,
    defaultGethSettings: PropTypes.shape().isRequired,
    ipfsSettings: PropTypes.shape().isRequired,
    defaultIpfsSettings: PropTypes.shape().isRequired,
    isAdvanced: PropTypes.bool.isRequired,
    configFlags: PropTypes.shape(),
    style: PropTypes.shape(),
    intl: PropTypes.shape(),
    eProcActions: PropTypes.shape()
};

Config.contextTypes = {
    muiTheme: React.PropTypes.shape().isRequired,
    router: React.PropTypes.object
};

Config.defaultProps = {
    style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
    }
};

export default injectIntl(Config);

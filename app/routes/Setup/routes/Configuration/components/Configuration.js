import React, { Component, PropTypes } from 'react';
import { remote } from 'electron';
import SetupHeader from '../../../components/setup-header';
import { RadioButton, RadioButtonGroup, RaisedButton } from 'material-ui';
import { injectIntl } from 'react-intl';
import { setupMessages, generalMessages } from 'locale-data/messages';
import { AdvancedSetupForm } from './advanced-setup-form';
import PanelContainer from 'shared-components/PanelContainer/panel-container';

const { dialog } = remote;

class Setup extends Component {
    constructor (props) {
        super(props);
        this.state = {
            gethLogs: []
        };
    }
    componentWillMount () {
        const { configFlags, gethSettings } = this.props;
        const cancelRequest = configFlags.get('requestStartupChange');
        console.log(gethSettings, cancelRequest, 'ready for sync');
        if (!cancelRequest && gethSettings) {
            return this.context.router.push('setup/sync-status');
        }
    }
    handleChange = (ev, value) => {
        const { settingsActions, isAdvanced } = this.props;
        const show = value === 'advanced';
        if (isAdvanced === show) {
            return;
        }
        settingsActions.toggleAdvancedSettings(show);
    };
    handleGethDatadir = (ev) => {
        ev.target.blur();
        ev.preventDefault();
        const { settingsActions } = this.props;
        if (!this.state.isDialogOpen) {
            this.showOpenDialog('geth data directory', (paths) => {
                this.setState({
                    isDialogOpen: false
                }, () => {
                    if (paths) {
                        settingsActions.setupGethDataDir(paths[0]);
                    }
                });
            });
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
    handleGethCacheSize = (ev) => {
        const { settingsActions, gethSettings, intl } = this.props;
        const target = ev.target;
        const currentCacheSize = gethSettings.get('cacheSize');
        if (currentCacheSize === target.value || !target.value) {
            return;
        }
        if (target.value < 512) {
            this.setState({
                cacheSizeError: intl.formatMessage(setupMessages.gethCacheSizeError)
            });
        } else {
            this.setState({
                cacheSizeError: null
            }, () => {
                settingsActions.setupGethCacheSize(target.value);
            });
        }
    };
    handleIpfsPath = (ev) => {
        const { settingsActions } = this.props;
        ev.target.blur();
        ev.stopPropagation();
        if (!this.state.isDialogOpen) {
            this.showOpenDialog('ipfs path', (paths) => {
                this.setState({
                    isDialogOpen: false
                }, () => {
                    if (paths) {
                        settingsActions.setupIPFSPath(paths[0]);
                    }
                });
            });
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
        const { settingsActions, gethSettings, ipfsSettings } = this.props;
        const { datadir, ipcpath, cache } = gethSettings.toJS();
        const { ipfsPath } = ipfsSettings.toJS();
        settingsActions.saveSettings({ name: 'geth', datadir, ipcpath, cache });
        settingsActions.saveSettings({ name: 'ipfs', ipfsPath });
        settingsActions.saveSettings({ name: 'flags', requestStartupChange: false });
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
        const { isAdvanced, intl, gethSettings, ipfsSettings } = this.props;
        const radioStyle = { marginTop: '10px', marginBottom: '10px' };
        const defaultSelected = !isAdvanced ? 'express' : 'advanced';
        return (
          <PanelContainer
            showBorder
            actions={[
              <RaisedButton
                key="next"
                label={intl.formatMessage(generalMessages.nextButtonLabel)}
                primary
                backgroundColor={this.context.muiTheme.raisedButton.secondaryColor}
                style={{ marginLeft: '12px' }}
                onClick={this.handleSubmit}
              />
            ]}
            header={
              <SetupHeader title={"AKASHA"} />
            }
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
                <AdvancedSetupForm
                  intl={intl}
                  style={this.props.style}
                  isAdvanced={isAdvanced}
                  gethSettings={gethSettings}
                  ipfsSettings={ipfsSettings}
                  cacheSizeError={this.state.cacheSizeError}
                  handleGethDatadir={this.handleGethDatadir}
                  handleGethIpc={this.handleGethIpc}
                  handleGethCacheSize={this.handleGethCacheSize}
                  handleIpfsPath={this.handleIpfsPath}
                  handleIpfsApiPort={this.handleIpfsApiPort}
                  handleIpfsGatewayPort={this.handleIpfsGatewayPort}
                />
              }
            </div>
          </PanelContainer>
        );
    }
}

Setup.propTypes = {
    settingsActions: PropTypes.shape().isRequired,
    gethSettings: PropTypes.shape().isRequired,
    ipfsSettings: PropTypes.shape().isRequired,
    isAdvanced: PropTypes.bool.isRequired,
    configFlags: PropTypes.shape().isRequired,
    style: PropTypes.shape(),
    intl: PropTypes.shape(),
};

Setup.contextTypes = {
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.object
};

Setup.defaultProps = {
    style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
    }
};

export default injectIntl(Setup);

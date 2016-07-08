import React, { Component, PropTypes } from 'react';
import { remote } from 'electron';
import LoginHeader from '../../components/ui/partials/LoginHeader';
import { RadioButton, RadioButtonGroup, RaisedButton } from 'material-ui';
import { injectIntl } from 'react-intl';
import { setupMessages, generalMessages } from '../../locale-data/messages';
import { AdvancedSetupForm } from '../ui/forms/advanced-setup-form.js';
const { dialog } = remote;

class Setup extends Component {
    constructor (props) {
        super(props);
        this.state = {
            gethLogs: []
        };
    }
    componentWillMount () {
        const { settingsActions, dispatcher } = this.props;
        settingsActions.getSettings('flags').then(() => {
            dispatcher((dispatch, getState) => {
                const flags = getState().settingsState.get('flags');
                if (flags.size > 0) {
                    const changeRequestFlags = flags.first().get('requestStartupChange');
                    if (!changeRequestFlags) {
                        return settingsActions.getSettings('geth').then(() => {
                            if (getState().settingsState.get('geth').size > 0) {
                                return this.context.router.replace('sync-status');
                            }
                            return null;
                        });
                    }
                }
                return null;
            });
        });
    }
    handleChange = (ev, value) => {
        const { setupActions, setupConfig } = this.props;
        const show = value === 'advanced';
        if (setupConfig.get('isAdvanced') === show) {
            return;
        }
        setupActions.toggleAdvancedSettings(show);
    };

    handleGethDatadir = (ev) => {
        ev.target.blur();
        ev.preventDefault();
        const { setupActions } = this.props;
        if (!this.state.isDialogOpen) {
            this.showOpenDialog('geth data directory', (paths) => {
                this.setState({
                    isDialogOpen: false
                }, () => {
                    if (paths) {
                        setupActions.setupGethDataDir(paths[0]);
                    }
                });
            });
        }
    };

    handleGethIpc = (ev) => {
        const { setupActions, setupConfig } = this.props;

        const target = ev.target;
        const currentIpcPath = setupConfig.getIn(['geth', 'ipcPath']);
        if (currentIpcPath === target.value || !target.value) {
            return;
        }
        setupActions.setupGethIPCPath(target.value);
    };
    handleGethCacheSize = (ev) => {
        const { setupActions, setupConfig } = this.props;
        const target = ev.target;
        const currentCacheSize = setupConfig.getIn(['geth', 'cacheSize']);
        if (currentCacheSize === target.value || !target.value) {
            return;
        }
        if (target.value < 512) {
            this.setState({
                cacheSizeError: 'Cache size should not be less than 512Mb'
            });
        } else {
            this.setState({
                cacheSizeError: null
            }, () => {
                setupActions.setupGethCacheSize(target.value);
            });
        }
    }
    handleIpfsPath = (ev) => {
        const { setupActions } = this.props;
        ev.target.blur();
        ev.stopPropagation();
        if (!this.state.isDialogOpen) {
            this.showOpenDialog('ipfs path', (paths) => {
                this.setState({
                    isDialogOpen: false
                }, () => {
                    if (paths) {
                        setupActions.setupIPFSPath(paths[0]);
                    }
                });
            });
        }
    }
    handleIpfsApiPort = (ev) => {
        const { setupActions, setupConfig } = this.props;

        const target = ev.target;
        const currentIpfsApiPort = setupConfig.getIn(['ipfs', 'apiPort']);
        if (currentIpfsApiPort === target.value || !target.value) {
            return;
        }
        setupActions.setupIPFSApiPort(target.value);
    };
    handleIpfsGatewayPort = (ev) => {
        const { setupActions, setupConfig } = this.props;
        const target = ev.target;
        const currentIpfsGatewayPort = setupConfig.getIn(['ipfs', 'gatewayPort']);
        if (currentIpfsGatewayPort === target.value || !target.value) {
            return;
        }
        setupActions.setupIPFSGatewayPort(target.value);
    }
    handleSubmit = () => {
        const { settingsActions, setupConfig } = this.props;
        const { dataDir, ipcPath, cache } = setupConfig.get('geth').toJS();
        const { ipfsPath } = setupConfig.get('ipfs').toJS();
        const p = [];
        p.push(settingsActions.saveSettings('geth', { dataDir, ipcPath, cache }));
        p.push(settingsActions.saveSettings('ipfs', { ipfsPath }));
        p.push(settingsActions.saveSettings('flags', { requestStartupChange: false }));
        Promise.all(p).then(() => {
            this.context.router.push('sync-status');
        });
    }
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
    }
    _getLogs = () => {}
    _retrySetup = () => {
        const { setupActions, setupConfig } = this.props;
        setupActions.retrySetup(setupConfig.get('isAdvanced'));
    }
    _sendReport = () => {}
    render () {
        const { style, setupConfig, intl } = this.props;
        const radioStyle = { marginTop: '10px', marginBottom: '10px' };
        const buttonsStyle = { padding: 0, position: 'absolute', bottom: 0, right: 0 };
        const defaultSelected = (!setupConfig.get('isAdvanced')) ? 'express' : 'advanced';
        const logListStyle = {
            maxHeight: 500,
            overflowY: 'scroll',
            paddingLeft: 4,
            overflowX: 'hidden',
            fontFamily: 'Consolas',
            backgroundColor: 'rgba(0,0,0,0.02)'
        };
        if (!setupConfig.getIn(['geth', 'started'])
                && setupConfig.getIn(['geth', 'status']) === false) {
            return (
              <div style={style}>
                <div className="start-xs" >
                  <div
                    className="col-xs"
                    style={{ flex: 1, padding: 0 }}
                  >
                    <LoginHeader />
                      {setupConfig.get('isAdvanced') &&
                        <div style={{ marginTop: '24px' }}>
                          Geth cannot start with your submitted configuration
                          <h4>Configuration:</h4>
                            {Object.keys(setupConfig.get('geth').toJS()).map((key) => (
                              <p key={key}>
                                <b>{key}: </b>
                                <b>{setupConfig.get('geth').toJS()[key]}</b>
                              </p>
                            ))}
                        </div>
                      }
                      {!setupConfig.get('isAdvanced') &&
                        <div>
                            Ouch, Geth cannot start!
                        </div>
                      }
                    <div>Logs:</div>
                    <div>
                      <ul style={logListStyle}>
                      {this.state.gethLogs.map((log, key) => (
                        <li key={key} style={{ marginBottom: '8px' }}>
                          <abbr title="Log Level">{log.level}</abbr>
                          <span> {new Date(log.timestamp).toLocaleString()} =></span>
                          <p>{log.message}</p>
                        </li>
                      ))}
                      </ul>
                    </div>
                    <div>
                      <RaisedButton label="Retry" onClick={this._retrySetup} />
                      <RaisedButton label="Send Report" onClick={this._sendReport} />
                    </div>
                  </div>
                </div>
              </div>
            );
        }
        return (
          <div style={style} >
            <div className="start-xs" >
              <div
                className="col-xs"
                style={{ flex: 1, padding: 0 }}
              >
                <LoginHeader />
                <h1 style={{ fontWeight: '400' }} >
                    {intl.formatMessage(setupMessages.firstTimeSetupTitle)}
                </h1>
                <div>
                  <p>{intl.formatMessage(setupMessages.akashaNextGenNetwork)}</p>
                  <p>
                    {intl.formatMessage(setupMessages.youHaveNotHeared)}
                  </p>
                  <p>
                    {intl.formatMessage(setupMessages.ifYouHaveEth)}
                  </p>
                </div>
                <div style={{ paddingLeft: '12px' }} >
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
                    {setupConfig.get('isAdvanced') &&
                      <AdvancedSetupForm
                        intl={intl}
                        setupConfig={setupConfig}
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
              </div>
            </div>
            <div
              className="end-xs"
              style={{ flex: 1 }}
            >
              <div
                className="col-xs"
                style={buttonsStyle}
              >
                <RaisedButton
                  label={intl.formatMessage(generalMessages.nextButtonLabel)}
                  primary
                  backgroundColor={this.context.muiTheme.raisedButton.secondaryColor}
                  style={{ marginLeft: '12px' }}
                  onClick={this.handleSubmit}
                />
              </div>
            </div>
          </div>
        );
    }
}

Setup.propTypes = {
    eProcActions: PropTypes.object.isRequired,
    setupActions: PropTypes.object.isRequired,
    settingsActions: PropTypes.object.isRequired,
    setupConfig: PropTypes.object.isRequired,
    style: PropTypes.object,
    intl: PropTypes.object,
    dispatcher: PropTypes.func
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

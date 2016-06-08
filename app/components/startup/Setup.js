import React, { Component, PropTypes } from 'react';
import LoginHeader from '../../components/ui/partials/LoginHeader';
import { RadioButton, RadioButtonGroup, RaisedButton, TextField } from 'material-ui';
import { hashHistory } from 'react-router';
import { Scrollbars } from 'react-custom-scrollbars';
import { injectIntl } from 'react-intl';
import { setupMessages, generalMessages } from '../../locale-data/messages';
import { AdvancedSetupForm } from '../ui/forms/advanced-setup-form.js';

class Setup extends Component {
    handleChange = (ev, value) => {
        const { actions, setupConfig } = this.props;
        const show = value === 'advanced';
        if (setupConfig.get('isAdvanced') === show) {
            return;
        }
        actions.toggleAdvancedSettings(show);
    };

    handleGethDatadir = (ev) => {
        const { actions, setupConfig } = this.props;

        const target = ev.target;
        const currentDatadir = setupConfig.getIn(['geth', 'dataDir']);
        if (currentDatadir === target.value || !target.value) {
            return;
        }
        actions.setupGethDataDir(target.value);
    };

    handleGethIpc = (ev) => {
        const { actions, setupConfig } = this.props;

        const target = ev.target;
        const currentIpcPath = setupConfig.getIn(['geth', 'ipcPath']);
        if (currentIpcPath === target.value || !target.value) {
            return;
        }
        actions.setupGethIPCPath(target.value);
    };
    handleGethCacheSize = (ev) => {
        const { actions, setupConfig } = this.props;

        const target = ev.target;
        const currentCacheSize = setupConfig.getIn(['geth', 'cacheSize']);
        if (currentCacheSize === target.value || !target.value) {
            return;
        }
        actions.setupGethCacheSize(target.value);
    }
    handleIpfsApiPort = (ev) => {
        const { actions, setupConfig } = this.props;

        const target = ev.target;
        const currentIpfsApiPort = setupConfig.getIn(['ipfs', 'apiPort']);
        if (currentIpfsApiPort === target.value || !target.value) {
            return;
        }
        actions.setupIPFSApiPort(target.value);
    };
    handleIpfsGatewayPort = (ev) => {
        const { actions, setupConfig } = this.props;
        const target = ev.target;
        const currentIpfsGatewayPort = setupConfig.getIn(['ipfs', 'gatewayPort']);
        if (currentIpfsGatewayPort === target.value || !target.value) {
            return;
        }
        actions.setupIPFSGatewayPort(target.value);
    }
    handleSubmit = () => {
        const { actions, setupConfig } = this.props;
        if (!setupConfig.get('isAdvanced')) {
            actions.startGeth();
        } else {
            actions.startGeth(setupConfig.get('geth'));
        }
    };

    render () {
        const { style, setupConfig, intl } = this.props;
        const radioStyle = { marginTop: '10px', marginBottom: '10px' };
        const buttonsStyle = { padding: 0, position: 'absolute', bottom: 0, right: 0 };
        const defaultSelected = (!setupConfig.get('isAdvanced')) ? 'express' : 'advanced';

        if (!setupConfig.getIn(['geth', 'started']) && !setupConfig.getIn(['geth', 'status'])) {
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
                                <b>{setupConfig.get('geth').toJS()[key].toString()}</b>
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
                    <div>Show some logs here</div>
                    <div>
                      <RaisedButton label="Retry" />
                      <RaisedButton label="Send Report" />
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
                <Scrollbars
                  style={{ height: 540 }}
                >
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
                        handleGethDatadir={this.handleGethDatadir}
                        handleGethIpc={this.handleGethIpc}
                        handleGethCacheSize={this.handleGethCacheSize}
                        handleIpfsApiPort={this.handleIpfsApiPort}
                        handleIpfsGatewayPort={this.handleIpfsGatewayPort}
                      />
                    }
                  </div>
                </Scrollbars>
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
    actions: PropTypes.object.isRequired,
    setupConfig: PropTypes.object.isRequired,
    style: PropTypes.object,
    intl: PropTypes.object
};

Setup.contextTypes = {
    muiTheme: React.PropTypes.object
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

import React, { Component, PropTypes } from 'react';
import LoginHeader from '../../components/ui/partials/LoginHeader';
import * as Colors from 'material-ui/styles/colors';
import { RadioButton, RadioButtonGroup, RaisedButton, TextField } from 'material-ui';
import { hashHistory } from 'react-router';
import { Scrollbars } from 'react-custom-scrollbars';
import { injectIntl } from 'react-intl';
import { setupMessages, generalMessages } from '../../locale-data/messages';


class Setup extends Component {

  handleChange = (event, value) => {
    const { actions, setupConfig } = this.props;
    const show = 'advanced' === value;
    if (setupConfig.get('toggleAdvanced') === show) {
      return;
    }
    actions.toggleAdvanced(show);
  };

  handleGethDatadir = (event) => {
    const { actions, setupConfig } = this.props;

    const target = event.target;
    const currentDatadir = setupConfig.get('gethPath');
    if (currentDatadir === target.value || !target.value) {
      return;
    }
    actions.setupGeth(target.value);
  };

  handleGethIpc = (event) => {
    const { actions, setupConfig } = this.props;

    const target = event.target;
    const currentIpcPath = setupConfig.get('gethPathIpc');
    if (currentIpcPath === target.value || !target.value) {
      return;
    }
    actions.setGethIpc(target.value);
  };

  handleIpfsPath = (event) => {
    const { actions, setupConfig } = this.props;

    const target = event.target;
    const currentIpfsApi = setupConfig.get('ipfsApiPath');
    if (currentIpfsApi === target.value || !target.value) {
      return;
    }
    actions.setupIPFS(target.value);

  };

  handleSubmit = () => {
    const { actions, setupConfig } = this.props;
    if (!setupConfig.get('toggleAdvanced')) {
      actions.startGeth(null);
    } else {
      actions.startGeth(setupConfig);
    }
    hashHistory.push('sync-status');
  };

  render () {
    let advancedOptions = '';

    const { style, setupConfig, intl } = this.props;

    const radioStyle = { marginTop: '10px', marginBottom: '10px' };
    const buttonsStyle = { padding: 0, position: 'absolute', bottom: 0, right: 0 };
    const errorStyle = { color: Colors.minBlack };
    const floatingLabelStyle = { color: Colors.lightBlack };
    const inputStyle = { color: Colors.darkBlack };
    const rootStyle = { width: '400px' };
    const defaultSelected = (!setupConfig.get('toggleAdvanced')) ? 'express' : 'advanced';

    if (setupConfig.get('toggleAdvanced')) {
      advancedOptions = (
        <div style={{ paddingLeft: '12px' }} >
          <TextField
            errorStyle={errorStyle}
            errorText={intl.formatMessage(setupMessages.changeGethDataDir)}
            floatingLabelStyle={floatingLabelStyle}
            floatingLabelText={intl.formatMessage(setupMessages.gethDataDirPath)}
            hintText={setupConfig.get('gethPath')}
            inputStyle={inputStyle}
            onBlur={this.handleGethDatadir}
            style={rootStyle}

          />
          <TextField
            errorStyle={errorStyle}
            errorText={intl.formatMessage(setupMessages.changeGethAlreadyStarted)}
            floatingLabelStyle={floatingLabelStyle}
            floatingLabelText={intl.formatMessage(setupMessages.gethIPCPath)}
            hintText={setupConfig.get('gethPathIpc')}
            inputStyle={inputStyle}
            onBlur={this.handleGethIpc}
            style={rootStyle}
          />
          <TextField
            errorStyle={errorStyle}
            errorText={intl.formatMessage(setupMessages.changeIfIpfsRunning)}
            floatingLabelStyle={floatingLabelStyle}
            floatingLabelText={intl.formatMessage(setupMessages.ipfsPath)}
            hintText={setupConfig.get('ipfsApiPath')}
            inputStyle={inputStyle}
            onBlur={this.handleIpfsPath}
            style={rootStyle}
          />
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
              <h1 style={{ fontWeight: '400' }} >{intl.formatMessage(setupMessages.firstTimeSetupTitle)}</h1>
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
                <RadioButtonGroup defaultSelected={defaultSelected}
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
                {advancedOptions}
              </div>
            </Scrollbars>
          </div>
        </div>
        <div className="end-xs"
             style={{ flex: 1 }}
        >
          <div className="col-xs"
               style={buttonsStyle}
          >
            <RaisedButton label={intl.formatMessage(generalMessages.nextButtonLabel)}
                          primary={true}
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
  style: PropTypes.object
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

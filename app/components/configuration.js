import React, { Component, PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { FlatButton, RadioButton, RadioButtonGroup, RaisedButton } from 'material-ui';
import { setupMessages, generalMessages } from '../locale-data/messages';
import { GethCacheSelectField, PathInputField } from 'shared-components';
import PanelContainerFooter from './PanelContainer/panel-container-footer';

const ADVANCED = 'advanced';
const EXPRESS = 'express';

class Config extends Component {
    state = {
        cache: null,
        gethDataDir: null,
        ipfsPath: null,
        isAdvanced: false
    };

    componentWillMount () {
        const { configurationSaved, gethSettings, ipfsSettings } = this.props;
        this.setState({
            cache: gethSettings.get('cache'),
            gethDataDir: gethSettings.get('datadir'),
            ipfsPath: ipfsSettings.get('storagePath'),
        });
        if (configurationSaved) {
            this.props.history.push('/sync');
        }
    }

    componentWillReceiveProps (nextProps) {
        const { configurationSaved, gethSettings, ipfsSettings } = nextProps;
        if (gethSettings.equals(this.props.gethSettings)
                || ipfsSettings.equals(this.props.ipfsSettings)) {
            this.setState({
                cache: gethSettings.get('cache'),
                gethDataDir: gethSettings.get('datadir'),
                ipfsPath: ipfsSettings.get('storagePath'),
            });
        }
        if (configurationSaved && this.props.location.pathname !== '/sync') {
            this.props.history.push('/sync');
        }
    }

    handleChange = (ev, value) => {
        this.setState({
            isAdvanced: value === ADVANCED
        });
    };

    handleGethDatadir = (gethDataDir) => {
        this.setState({
            gethDataDir
        });
    };

    handleGethCacheSize = (event, index, value) => {
        this.setState({
            cache: value
        });
    };

    handleIpfsPath = (ipfsPath) => {
        this.setState({
            ipfsPath
        });
    };

    handleReset = () => {
        const { defaultGethSettings, defaultIpfsSettings } = this.props;
        this.setState({
            cache: defaultGethSettings.get('cache'),
            gethDataDir: defaultGethSettings.get('datadir'),
            ipfsPath: defaultIpfsSettings.get('storagePath')
        });
    };

    handleSubmit = () => {
        const { defaultGethSettings, defaultIpfsSettings, saveConfiguration } = this.props;
        const { cache, gethDataDir, ipfsPath, isAdvanced } = this.state;
        const geth = isAdvanced ? { cache, datadir: gethDataDir } : defaultGethSettings.toJS();
        const ipfs = isAdvanced ? { storagePath: ipfsPath } : defaultIpfsSettings.toJS();
        saveConfiguration({ geth, ipfs });
    };

    render () {
        const { intl } = this.props;
        const { cache, gethDataDir, ipfsPath, isAdvanced } = this.state;
        const radioStyle = { marginTop: '10px', marginBottom: '10px' };
        return (
          <div>
            <div style={{ padding: '0 24px', backgroundColor: muiTheme.palette.canvasColor }}>
              <h1 style={{ fontWeight: '400' }}>
                {intl.formatMessage(setupMessages.firstTimeSetupTitle)}
              </h1>
              <div>
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
              <div style={{ paddingLeft: '12px', marginTop: '24px' }}>
                <RadioButtonGroup
                  valueSelected={isAdvanced ? ADVANCED : EXPRESS}
                  name="installType"
                  onChange={this.handleChange}
                >
                  <RadioButton
                    label={intl.formatMessage(setupMessages.expressSetup)}
                    style={radioStyle}
                    value={EXPRESS}
                  />
                  <RadioButton
                    label={intl.formatMessage(setupMessages.advancedSetup)}
                    style={radioStyle}
                    value={ADVANCED}
                  />
                </RadioButtonGroup>
                {isAdvanced &&
                  <div style={{ paddingBottom: '10px' }}>
                    <GethCacheSelectField
                      cache={cache}
                      hasErrorText
                      intl={intl}
                      onChange={this.handleGethCacheSize}
                    />
                    <PathInputField
                      errorText={intl.formatMessage(setupMessages.changeGethDataDir)}
                      floatingLabelText={intl.formatMessage(setupMessages.gethDataDirPath)}
                      onChange={this.handleGethDatadir}
                      path={gethDataDir}
                    />
                    <PathInputField
                      errorText={intl.formatMessage(setupMessages.changeIpfsStoragePath)}
                      floatingLabelText={intl.formatMessage(setupMessages.ipfsStoragePath)}
                      onChange={this.handleIpfsPath}
                      path={ipfsPath}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <FlatButton
                        label={intl.formatMessage(generalMessages.reset)}
                        onClick={this.handleReset}
                      />
                    </div>
                  </div>
                  }
              </div>
            </div>
            <PanelContainerFooter intl={intl} muiTheme={muiTheme} >
              <RaisedButton
                key="next"
                label={intl.formatMessage(generalMessages.nextButtonLabel)}
                primary
                backgroundColor={muiTheme.palette.secondaryColor}
                style={{ marginLeft: '12px' }}
                onClick={this.handleSubmit}
              />
            </PanelContainerFooter>
          </div>
        );
    }
}

Config.propTypes = {
    configurationSaved: PropTypes.bool,
    defaultGethSettings: PropTypes.shape().isRequired,
    defaultIpfsSettings: PropTypes.shape().isRequired,
    gethSettings: PropTypes.shape().isRequired,
    intl: PropTypes.shape(),
    ipfsSettings: PropTypes.shape().isRequired,
    saveConfiguration: PropTypes.func.isRequired,
    history: PropTypes.shape(),
    location: PropTypes.shape()
};

Config.defaultProps = {
    muiTheme: { palette: {} }
};

export default injectIntl(Config);

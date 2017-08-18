import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Button, Icon, Select, Switch } from 'antd';
import { connect } from 'react-redux';
import { settingsMessages } from '../locale-data/messages';
import { appSettingsToggle } from '../local-flux/actions/app-actions';
import { saveGeneralSettings } from '../local-flux/actions/settings-actions';

class AppSettings extends Component {
    constructor (props) {
        super(props);
        this.state = {
            locale: this.props.generalSettings.get('locale'),
            darkTheme: this.props.generalSettings.get('darkTheme')
        };
    }

    handleUpdate = () =>
    this.props.saveGeneralSettings({
        locale: this.state.locale,
        darkTheme: this.state.darkTheme
    });

    handleSelector = value => this.setState({ locale: value });

    handleSwitch = checked => this.setState({ darkTheme: checked });

    render () {
        const { generalSettings, intl, sidebar } = this.props;
        const Option = Select.Option;
        return (
          <div className={'app-settings ' + (sidebar ? 'app-settings_sidebar' : '')}>
            <div className="app-settings__close-wrapper">
              <Icon
                type="close"
                onClick={this.props.appSettingsToggle}
                style={{ fontSize: 30, cursor: 'pointer' }}
              />
            </div>
            <div className="app-settings__main">
              <div className="app-settings__title">
                {intl.formatMessage(settingsMessages.title)}
              </div>
              <div className="app-settings__description">
                {intl.formatMessage(settingsMessages.description)}
              </div>
              <div className="app-settings__lang">
                <div className="app-settings__lang-title">
                  {intl.formatMessage(settingsMessages.selectLanguage)}
                </div>
                <Select
                  defaultValue={generalSettings.get('locale')}
                  size="large"
                  style={{ width: '100%', fontWeight: '500' }}
                  onChange={this.handleSelector}
                >
                  <Option value="en">{intl.formatMessage(settingsMessages.english)}</Option>
                  <Option value="zh">{intl.formatMessage(settingsMessages.chinese)}</Option>
                  <Option value="ru">{intl.formatMessage(settingsMessages.russian)}</Option>
                </Select>
              </div>
              <div className="app-settings__theme">
                <div className="app-settings__theme-title">
                  {intl.formatMessage(settingsMessages.theme)}
                </div>
                <div className="app-settings__theme-switch-wrapper">
                  {intl.formatMessage(settingsMessages.darkTheme)}
                  <Switch
                    defaultChecked={generalSettings.get('darkTheme')}
                    onChange={this.handleSwitch}
                  />
                </div>
              </div>
              <div className="app-settings__update">
                <Button
                  size="large"
                  onClick={this.handleUpdate}
                >
                  <div className="app-settings__update-title">
                    {intl.formatMessage(settingsMessages.update)}
                  </div>
                </Button>
              </div>
            </div>
          </div>
        );
    }
}

AppSettings.propTypes = {
    saveGeneralSettings: PropTypes.func,
    appSettingsToggle: PropTypes.func,
    generalSettings: PropTypes.shape(),
    intl: PropTypes.shape(),
    sidebar: PropTypes.bool
};

function mapStateToProps (state) {
    return {
        generalSettings: state.settingsState.get('general')
    };
}

export default connect(
    mapStateToProps,
    {
        saveGeneralSettings,
        appSettingsToggle
    }
)(injectIntl(AppSettings));

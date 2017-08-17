import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Button, Icon, Select, Switch } from 'antd';
import { connect } from 'react-redux';
import { generalMessages } from '../locale-data/messages';
import { appSettingsToggle } from '../local-flux/actions/app-actions';
import { saveGeneralSettings } from '../local-flux/actions/settings-actions';

class AppSettings extends Component {
    constructor (props) {
        super(props);
        this.state = {
            locale: this.props.currentLocale,
            darkTheme: this.props.darkTheme
        };
    }

    render () {
        const { currentLocale, darkTheme, intl, sidebar } = this.props;
        const Option = Select.Option;
        return (
          <div className={'app-settings ' + (sidebar ? 'app-settings_sidebar' : '')}>
            <div className="app-settings__close-wrapper">
              <Icon
                type="close"
                onClick={() => this.props.appSettingsToggle()}
                style={{ fontSize: 30, cursor: 'pointer' }}
              />
            </div>
            <div className="app-settings__main">
              <div className="app-settings__title">
                {intl.formatMessage(generalMessages.appSettingsTitle)}
              </div>
              <div className="app-settings__description">
                {intl.formatMessage(generalMessages.appSettingsDescription)}
              </div>
              <div className="app-settings__lang">
                <div className="app-settings__lang-title">
                  {intl.formatMessage(generalMessages.appSettingsSelectLanguage)}
                </div>
                <Select
                  defaultValue={currentLocale}
                  size="large"
                  style={{ width: '100%', fontWeight: '500' }}
                  onChange={value => this.setState({ locale: value })}
                >
                  <Option value="en">{intl.formatMessage(generalMessages.appSettingsEnglish)}</Option>
                  <Option value="zh">{intl.formatMessage(generalMessages.appSettingsChinese)}</Option>
                  <Option value="ru">{intl.formatMessage(generalMessages.appSettingsRussian)}</Option>
                </Select>
              </div>
              <div className="app-settings__theme">
                <div className="app-settings__theme-title">
                  {intl.formatMessage(generalMessages.appSettingsTheme)}
                </div>
                <div className="app-settings__theme-switch-wrapper">
                  {intl.formatMessage(generalMessages.appSettingsDarkTheme)}
                  <Switch
                    defaultChecked={darkTheme}
                    onChange={checked => this.setState({ darkTheme: checked })}
                  />
                </div>
              </div>
              <div className="app-settings__update">
                <Button
                  size="large"
                  onClick={() =>
                    this.props.saveGeneralSettings({
                        locale: this.state.locale,
                        darkTheme: this.state.darkTheme
                    })
                  }
                >
                  <div className="app-settings__update-title">
                    {intl.formatMessage(generalMessages.appSettingsUpdate)}
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
    currentLocale: PropTypes.string,
    darkTheme: PropTypes.bool,
    intl: PropTypes.shape(),
    sidebar: PropTypes.bool
};

function mapStateToProps (state) {
    return {
        currentLocale: state.settingsState.getIn(['general', 'locale']),
        darkTheme: state.settingsState.getIn(['general', 'darkTheme'])
    };
}

export default connect(
    mapStateToProps,
    {
        saveGeneralSettings,
        appSettingsToggle
    }
)(injectIntl(AppSettings));

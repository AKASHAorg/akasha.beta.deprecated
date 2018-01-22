import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Button, Select, Radio } from 'antd';
import { connect } from 'react-redux';
import { settingsMessages } from '../../locale-data/messages';
import { showNotification } from '../../local-flux/actions/app-actions';
import { saveGeneralSettings } from '../../local-flux/actions/settings-actions';

const RadioGroup = Radio.Group;
const Option = Select.Option;

class AppPreferences extends Component {
    constructor (props) {
        super(props);
        this.state = {
            initLocale: this.props.generalSettings.get('locale'),
            initTheme: this.props.generalSettings.get('darkTheme'),
            locale: this.props.generalSettings.get('locale'),
            darkTheme: this.props.generalSettings.get('darkTheme'),
            isDirty: false,
            showThemeTip: false
        };
    }

    handleUpdate = () => {
        const { initTheme, darkTheme } = this.state;
        this.props.saveGeneralSettings({
            locale: this.state.locale,
            darkTheme: this.state.darkTheme
        });
        if (darkTheme !== initTheme) {
            this.props.showNotification({
                id: 'themeTips',
                duration: 4
            });
        }
        this.setState({ isDirty: false });
    }

    handleSelector = (value) => {
        const { darkTheme, initLocale, initTheme } = this.state;
        this.setState({
            locale: value,
            isDirty: true
        });
        if (initLocale === value && initTheme === darkTheme) {
            this.setState({ isDirty: false });
        }
    }

    handleThemeChange = (e) => {
        const { initLocale, initTheme, locale } = this.state;
        this.setState({
            isDirty: true,
            darkTheme: e.target.value,
        });
        if (initTheme === e.target.value && initLocale === locale) {
            this.setState({ isDirty: false });
        }
    }

    render () {
        const { generalSettings, intl } = this.props;
        const { isDirty } = this.state;
        return (
          <div className="app-preferences">
            <div className="app-preferences__main">
              <div className="app-preferences__title">
                {intl.formatMessage(settingsMessages.title)}
              </div>
              <div className="app-preferences__description">
                {intl.formatMessage(settingsMessages.description)}
              </div>
              <div className="app-preferences__lang">
                <div className="app-preferences__lang-title">
                  {intl.formatMessage(settingsMessages.language)}
                </div>
                <div className="app-preferences__lang-label">
                  {intl.formatMessage(settingsMessages.selectLanguage)}
                </div>
                <Select
                  defaultValue={generalSettings.get('locale')}
                  size="large"
                  style={{ width: '250px', fontWeight: '400' }}
                  dropdownClassName="app-preferences__select-dropdown"
                  onChange={this.handleSelector}
                >
                  <Option value="en">{intl.formatMessage(settingsMessages.english)}</Option>
                  <Option value="es">{intl.formatMessage(settingsMessages.spanish)}</Option>
                </Select>
              </div>
              <div className="app-preferences__theme">
                <div className="app-preferences__theme-title">
                  {intl.formatMessage(settingsMessages.theme)}
                </div>
                <div className="app-preferences__theme-label">
                  {intl.formatMessage(settingsMessages.themeLabel)}
                </div>
                <div className="app-preferences__theme-radio-wrap">
                  <RadioGroup onChange={this.handleThemeChange} value={this.state.darkTheme}>
                    <Radio value={false}>{intl.formatMessage(settingsMessages.lightTheme)}</Radio>
                    <Radio value>{intl.formatMessage(settingsMessages.darkTheme)}</Radio>
                  </RadioGroup>
                </div>
              </div>
            </div>
            <div className="app-preferences__update">
              <div className="app-preferences__update-btn">
                <Button
                  disabled={!isDirty}
                  type="primary"
                  onClick={this.handleUpdate}
                >
                  {intl.formatMessage(settingsMessages.update)}
                </Button>
              </div>
            </div>
          </div>
        );
    }
}

AppPreferences.propTypes = {
    saveGeneralSettings: PropTypes.func,
    generalSettings: PropTypes.shape(),
    intl: PropTypes.shape(),
    showNotification: PropTypes.func,
};

function mapStateToProps (state) {
    return {
        generalSettings: state.settingsState.get('general')
    };
}

export default connect(
    mapStateToProps,
    {
        showNotification,
        saveGeneralSettings
    }
)(injectIntl(AppPreferences));

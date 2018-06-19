import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Button, Select, Radio } from 'antd';
import { connect } from 'react-redux';
import { settingsMessages } from '../../locale-data/messages';
import { showNotification } from '../../local-flux/actions/app-actions';
import { saveGeneralSettings } from '../../local-flux/actions/settings-actions';
import { reloadPage } from '../../local-flux/actions/utils-actions';

const RadioGroup = Radio.Group;
const Option = Select.Option;

class AppPreferences extends Component {
    constructor (props) {
        super(props);
        this.state = {
            locale: this.props.generalSettings.get('locale'),
            darkTheme: this.props.generalSettings.get('darkTheme'),
            showThemeTip: false
        };
    }

    handleUpdate = () => {
        const { darkTheme } = this.state;
        const { generalSettings } = this.props;
        this.props.saveGeneralSettings({
            locale: this.state.locale,
            darkTheme: this.state.darkTheme
        });
        if (darkTheme !== generalSettings.darkTheme) {
            this.props.reloadPage();
        }
    }

    handleSelector = (value) => {
        this.setState({ locale: value });
    }

    handleThemeChange = (e) => {
        this.setState({ darkTheme: e.target.value });
    }

    render () {
        const { generalSettings, intl } = this.props;
        const { darkTheme, locale } = this.state;
        const isFormChanged = generalSettings.darkTheme !== darkTheme || generalSettings.locale !== locale;
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
                  <Option value="en-US">{intl.formatMessage(settingsMessages.english)}</Option>
                  <Option value="zh-CN">{intl.formatMessage(settingsMessages.chineseSimplified)}</Option>
                  <Option value="fi-FI">{intl.formatMessage(settingsMessages.finnish)}</Option>
                  <Option value="id-ID">{intl.formatMessage(settingsMessages.indonesian)}</Option>
                  <Option value="es-ES">{intl.formatMessage(settingsMessages.spanish)}</Option>
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
                  disabled={!isFormChanged}
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
    reloadPage: PropTypes.func.isRequired,
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
        reloadPage,
        showNotification,
        saveGeneralSettings
    }
)(injectIntl(AppPreferences));

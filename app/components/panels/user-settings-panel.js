import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Form, Select } from 'antd';
import { userSettingsSave } from '../../local-flux/actions/settings-actions';
import { selectAllLicenses, selectLoggedAccount } from '../../local-flux/selectors';
import { formMessages } from '../../locale-data/messages';
import { ProfilePanelsHeader, RememberPassphraseSelect } from '../';

const FormItem = Form.Item;
const { Option } = Select;

class UserSettingsPanel extends Component {
    constructor (props) {
        super(props);
        const pref = props.userSettings.passwordPreference;
        this.state = {
            defaultLicense: props.userSettings.get('defaultLicense') || '1',
            isDirty: false,
            passphraseReport: null,
            unlockTime: pref && pref.time ? pref.time : 5
        };
    }

    handleLicenseChange = (value) => {
        this.setState({
            defaultLicense: value,
            isDirty: true
        });
    };

    handleTimeChange = (value) => {
        this.setState({
            isDirty: true,
            unlockTime: Number(value)
        });
    };

    onSaveSettings = () => {
        const { loggedAccount } = this.props;
        const { defaultLicense, unlockTime } = this.state;
        const passwordPreference = { remember: true, time: unlockTime };
        const payload = { defaultLicense, passwordPreference };
        this.props.userSettingsSave(loggedAccount, payload);
        this.setState({
            isDirty: false
        });
    }

    render () {
        const { intl, licenses, savingUserSettings } = this.props;
        const { defaultLicense, isDirty, unlockTime } = this.state;

        return (
          <div className="panel">
            <ProfilePanelsHeader />
            <div className="panel__content user-settings-panel">
              <div className="user-settings-panel__form">
                <Form>
                  <FormItem
                    colon={false}
                    label="Passphrase report"
                  >
                    <Select value="1">
                      <Option key="1" value="1">
                        first Option
                      </Option>
                      <Option key="2" value="2">
                        second Option
                      </Option>
                    </Select>
                  </FormItem>
                  <FormItem
                    colon={false}
                    label="Remember passphrase for"
                  >
                    <RememberPassphraseSelect
                      handleTimeChange={this.handleTimeChange}
                      size="large"
                      unlockTime={unlockTime.toString()}
                    />
                  </FormItem>
                  <FormItem
                    colon={false}
                    label="Default license"
                  >
                    <Select
                      onChange={this.handleLicenseChange}
                      size="large"
                      value={defaultLicense}
                    >
                      {licenses.toList().map(license => (
                        <Option key={license.get('id')} value={license.get('id')}>
                          {license.get('label')}
                        </Option>
                      ))}
                    </Select>
                  </FormItem>
                </Form>
              </div>
              <div className="user-settings-panel__actions">
                <Button
                  disabled={savingUserSettings || !isDirty}
                  onClick={this.onSaveSettings}
                  size="large"
                  type="primary"
                >
                  {intl.formatMessage(formMessages.updateSettings)}
                </Button>
              </div>
            </div>
          </div>
        );
    }
}

UserSettingsPanel.propTypes = {
    intl: PropTypes.shape(),
    licenses: PropTypes.shape(),
    loggedAccount: PropTypes.string.isRequired,
    savingUserSettings: PropTypes.bool,
    userSettings: PropTypes.shape(),
    userSettingsSave: PropTypes.func.isRequired
};

function mapStateToProps (state) {
    return {
        licenses: selectAllLicenses(state),
        loggedAccount: selectLoggedAccount(state),
        savingUserSettings: state.settingsState.getIn(['flags', 'savingUserSettings']),
        userSettings: state.settingsState.get('userSettings')
    };
}

export default connect(
    mapStateToProps,
    {
        userSettingsSave
    }
)(injectIntl(UserSettingsPanel));

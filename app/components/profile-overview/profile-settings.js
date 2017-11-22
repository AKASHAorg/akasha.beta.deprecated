import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Checkbox, Form, Select, Radio } from 'antd';
import { userSettingsSave } from '../../local-flux/actions/settings-actions';
import { profileToggleDonations } from '../../local-flux/actions/profile-actions';
import { selectAllLicenses, selectLoggedEthAddress,
    selectLoggedProfileData } from '../../local-flux/selectors';
import { formMessages, settingsMessages } from '../../locale-data/messages';
import { RememberPassphraseSelect } from '../';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const { Option } = Select;

class ProfileSettings extends Component {
    constructor (props) {
        super(props);
        const pref = props.userSettings.passwordPreference;
        const license = props.userSettings.get('defaultLicense');
        this.state = {
            defaultLicenseParent: license.parent || '2',
            defaultLicenseId: license.id || '4',
            isDirty: false,
            rememberTime: pref && pref.remember ? pref.remember : false,
            unlockTime: pref && pref.time ? pref.time : 5,
            donationsValue: props.loggedProfileData.get('donationsEnabled')
        };
    }

    componentWillReceiveProps (nextProps) {
        const donationsEnabled = nextProps.loggedProfileData.get('donationsEnabled');
        if (donationsEnabled !== this.props.loggedProfileData.get('donationsEnabled')) {
            this.setState({ donationsValue: donationsEnabled });
        }
    }

    handleLicenseChange = licenceType =>
        (value) => {
            if (licenceType === 'parent') {
                this.setState({
                    defaultLicenseParent: value,
                    isDirty: true
                });
                if (value === '3') {
                    this.setState({ defaultLicenseId: '11' });
                } else if (value === '1') {
                    this.setState({ defaultLicenseId: null });
                }
            } else if (licenceType === 'id') {
                this.setState({
                    defaultLicenseId: value.target.value,
                    isDirty: true
                });
            }
        }

    handleTimeChange = (value) => {
        this.setState({
            isDirty: true,
            unlockTime: Number(value),
            rememberTime: true
        });
    };

    handleRememberTimeChange = (e) => {
        this.setState({
            isDirty: true,
            rememberTime: e.target.checked
        });
    };

    handleTipsChange = (e) => {
        this.setState({
            isDirty: true,
            donationsValue: e.target.value,
        });
    }

    onSaveSettings = () => {
        const { loggedEthAddress, loggedProfileData } = this.props;
        const { defaultLicenseId, defaultLicenseParent, donationsValue, unlockTime } = this.state;
        const passwordPreference = { remember: true, time: unlockTime };
        const defaultLicense = { id: defaultLicenseId, parent: defaultLicenseParent };
        const payload = { defaultLicense, passwordPreference };
        if (donationsValue !== loggedProfileData.get('donationsEnabled')) {
            this.props.profileToggleDonations(donationsValue);
        }
        this.props.userSettingsSave(loggedEthAddress, payload);
        this.setState({
            isDirty: false
        });
    }

    render () {
        const { intl, licenses, savingUserSettings } = this.props;
        const { defaultLicenseId, defaultLicenseParent, isDirty,
            unlockTime, rememberTime } = this.state;

        return (
          <div className="profile-settings">
            <div className="profile-settings__form">
              <Form>
                <div className="profile-settings__item">
                  <div className="profile-settings__item-title">
                    {intl.formatMessage(settingsMessages.passphraseOptions)}
                  </div>
                  <div className="profile-settings__item-description">
                    {intl.formatMessage(settingsMessages.passphraseOptionsDescription)}
                  </div>
                  <FormItem>
                    <div className="profile-settings__pass-wrap">
                      <Checkbox
                        checked={rememberTime}
                        onChange={this.handleRememberTimeChange}
                      >
                        {intl.formatMessage(formMessages.rememberPassFor)}
                      </Checkbox>
                      <div className="profile-settings__pass-select">
                        <RememberPassphraseSelect
                          isChecked={this.state.rememberTime}
                          handleCheck={this.handleRememberTimeChange}
                          handleTimeChange={this.handleTimeChange}
                          size="large"
                          unlockTime={unlockTime.toString()}
                        />
                      </div>
                    </div>
                  </FormItem>
                </div>
                <div className="profile-settings__item">
                  <div className="profile-settings__item-title">
                    {intl.formatMessage(settingsMessages.publishOptions)}
                  </div>
                  <div className="profile-settings__item-description">
                    {intl.formatMessage(settingsMessages.publishOptionsDescription)}
                  </div>
                  <FormItem>
                    <div className="profile-settings__license-container">
                      <Select
                        defaultValue={defaultLicenseParent}
                        style={{ width: '250px' }}
                        className="profile-settings__license-select"
                        onChange={this.handleLicenseChange('parent')}
                      >
                        {licenses.filter(lic => !lic.parent).map(parentLicense =>
                          (<Option
                            key={parentLicense.get('id')}
                            value={parentLicense.get('id')}
                          >
                            {parentLicense.get('label')}
                          </Option>)
                        ).toIndexedSeq()}
                      </Select>
                      {(licenses.filter(lic => lic.get('parent') === defaultLicenseParent).size > 0) &&
                        <RadioGroup
                          className="profile-settings__license-radio-group"
                          onChange={this.handleLicenseChange('id')}
                          value={defaultLicenseId}
                        >
                            {licenses.filter(lic => lic.get('parent') === defaultLicenseParent)
                              .map(childLic => (
                                <Radio
                                  className="profile-settings__license-radio"
                                  key={childLic.id}
                                  value={childLic.id}
                                >
                                  {childLic.label}
                                </Radio>
                              )).toIndexedSeq()}
                        </RadioGroup>
                      }
                    </div>
                  </FormItem>
                </div>
                <div className="profile-settings__item">
                  <div className="profile-settings__item-title">
                    {intl.formatMessage(settingsMessages.tipsOptions)}
                  </div>
                  <div className="profile-settings__item-description">
                    {intl.formatMessage(settingsMessages.tipsInfo)}
                  </div>
                  <div className="profile-settings__tips">
                    <RadioGroup onChange={this.handleTipsChange} value={this.state.donationsValue}>
                      <Radio value>{intl.formatMessage(settingsMessages.tipsAccept)}</Radio>
                      <Radio value={false}>{intl.formatMessage(settingsMessages.tipsDoNotAccept)}</Radio>
                    </RadioGroup>
                  </div>
                </div>
              </Form>
            </div>
            <div className="profile-settings__footer">
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
        );
    }
}

ProfileSettings.propTypes = {
    intl: PropTypes.shape(),
    licenses: PropTypes.shape(),
    loggedEthAddress: PropTypes.string.isRequired,
    loggedProfileData: PropTypes.shape().isRequired,
    savingUserSettings: PropTypes.bool,
    profileToggleDonations: PropTypes.func.isRequired,
    userSettings: PropTypes.shape(),
    userSettingsSave: PropTypes.func.isRequired
};

function mapStateToProps (state) {
    return {
        licenses: selectAllLicenses(state),
        loggedEthAddress: selectLoggedEthAddress(state),
        loggedProfileData: selectLoggedProfileData(state),
        savingUserSettings: state.settingsState.getIn(['flags', 'savingUserSettings']),
        userSettings: state.settingsState.get('userSettings')
    };
}

export default connect(
    mapStateToProps,
    {
        profileToggleDonations,
        userSettingsSave
    }
)(injectIntl(ProfileSettings));

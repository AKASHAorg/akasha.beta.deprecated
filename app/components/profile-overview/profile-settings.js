import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Checkbox, Form, Select, Tooltip, Radio } from 'antd';
import { toggleDonations } from '../../constants/action-types';
import { userSettingsSave } from '../../local-flux/actions/settings-actions';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { selectActionPending, selectAllLicenses, selectLoggedEthAddress,
    selectLoggedProfileData } from '../../local-flux/selectors';
import { formMessages, settingsMessages } from '../../locale-data/messages';
import { Icon, RememberPassphraseSelect } from '../';

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
        const { defaultLicenseId, defaultLicenseParent, donationsValue,
            unlockTime, rememberTime } = this.state;
        const passwordPreference = { remember: rememberTime, time: unlockTime };
        const defaultLicense = { id: defaultLicenseId, parent: defaultLicenseParent };
        const payload = { defaultLicense, passwordPreference };
        if (donationsValue !== loggedProfileData.get('donationsEnabled')) {
            this.props.actionAdd(loggedEthAddress, toggleDonations, { status: donationsValue });
        }
        this.props.userSettingsSave(loggedEthAddress, payload);
        this.setState({
            isDirty: false
        });
    }

    render () {
        const { intl, licenses, pendingToggleDonations, savingUserSettings } = this.props;
        const { defaultLicenseId, defaultLicenseParent, isDirty,
            unlockTime, rememberTime } = this.state;

        return (
          <div className="profile-settings">
            <div className="profile-settings__form">
              <Form>
                <div>
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
                <div>
                  <div className="profile-settings__item-title">
                    {intl.formatMessage(settingsMessages.licenseOptions)}
                  </div>
                  <div className="profile-settings__item-description">
                    {intl.formatMessage(settingsMessages.licenseOptionsDescription)}
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
                <div>
                  <div className="profile-settings__item-title">
                    {intl.formatMessage(settingsMessages.tipsOptions)}
                    <Tooltip
                      title={intl.formatMessage(settingsMessages.tipsInfo)}
                      placement="topLeft"
                      arrowPointAtCenter
                    >
                      <Icon type="questionCircle" className="profile-settings__info-icon" />
                    </Tooltip>
                  </div>
                  <div className="profile-settings__item-description">
                    {intl.formatMessage(settingsMessages.tipsDescription)}
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
                disabled={pendingToggleDonations || savingUserSettings || !isDirty}
                onClick={this.onSaveSettings}
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
    actionAdd: PropTypes.func,
    intl: PropTypes.shape(),
    licenses: PropTypes.shape(),
    loggedEthAddress: PropTypes.string,
    loggedProfileData: PropTypes.shape(),
    pendingToggleDonations: PropTypes.bool,
    savingUserSettings: PropTypes.bool,
    userSettings: PropTypes.shape(),
    userSettingsSave: PropTypes.func
};

function mapStateToProps (state) {
    return {
        licenses: selectAllLicenses(state),
        loggedEthAddress: selectLoggedEthAddress(state),
        loggedProfileData: selectLoggedProfileData(state),
        pendingToggleDonations: selectActionPending(state, toggleDonations),
        savingUserSettings: state.settingsState.getIn(['flags', 'savingUserSettings']),
        userSettings: state.settingsState.get('userSettings')
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
        userSettingsSave
    }
)(injectIntl(ProfileSettings));

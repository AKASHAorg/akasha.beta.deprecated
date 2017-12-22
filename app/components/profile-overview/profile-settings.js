import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Checkbox, Form, InputNumber, Select, Tooltip, Radio } from 'antd';
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
        const donations = props.loggedProfileData.get('akashaId') ?
            props.loggedProfileData.get('donationsEnabled') :
            true;
        const hideCommentContent = props.userSettings.get('hideCommentContent');
        const hideEntryContent = props.userSettings.get('hideEntryContent');
        this.state = {
            defaultLicenseParent: license.parent || '2',
            defaultLicenseId: license.id || '4',
            hideComments: hideCommentContent.checked,
            hideCommentsValue: hideCommentContent.value,
            hideEntries: hideEntryContent.checked,
            hideEntriesValue: hideEntryContent.value,
            rememberTime: pref && pref.remember ? pref.remember : false,
            unlockTime: pref && pref.time ? pref.time : 5,
            donationsValue: donations
        };
    }

    componentWillReceiveProps (nextProps) {
        const donationsEnabled = nextProps.loggedProfileData.get('donationsEnabled');
        if (this.props.loggedProfileData.get('donationsEnabled') !== donationsEnabled) {
            this.setState({ donationsValue: donationsEnabled });
        }
    }

    handleHideCommentsChange = (ev) => {
        this.setState({ hideComments: ev.target.checked });
    };

    handleHideCommentsValueChange = (value) => {
        this.setState({ hideCommentsValue: value });
    };

    handleHideEntriesChange = (ev) => {
        this.setState({ hideEntries: ev.target.checked });
    };

    handleHideEntriesValueChange = (value) => {
        this.setState({ hideEntriesValue: value });
    };

    handleLicenseChange = licenceType =>
        (value) => {
            const license = this.props.userSettings.get('defaultLicense');
            if (licenceType === 'parent') {
                this.setState({
                    defaultLicenseParent: value,
                });
                if (value === '3') {
                    const lic = (value === license.parent) ? license.id : '11';
                    this.setState({ defaultLicenseId: lic });
                } else if (value === '2') {
                    const lic = (value === license.parent) ? license.id : '4';
                    this.setState({ defaultLicenseId: lic });
                } else if (value === '1') {
                    this.setState({ defaultLicenseId: null });
                }
            } else if (licenceType === 'id') {
                this.setState({
                    defaultLicenseId: value.target.value,
                });
            }
        }

    handleTimeChange = (value) => {
        this.setState({
            unlockTime: Number(value),
            rememberTime: true
        });
    };

    handleRememberTimeChange = (e) => {
        this.setState({ rememberTime: e.target.checked });
    };

    handleTipsChange = (e) => {
        this.setState({ donationsValue: e.target.value });
    }

    onSaveSettings = () => {
        const { loggedEthAddress, loggedProfileData } = this.props;
        const { defaultLicenseId, defaultLicenseParent, donationsValue, hideComments,
            hideCommentsValue, hideEntries, hideEntriesValue, unlockTime, rememberTime } = this.state;
        const passwordPreference = { remember: rememberTime, time: unlockTime };
        const defaultLicense = { id: defaultLicenseId, parent: defaultLicenseParent };
        const hideCommentContent = { checked: hideComments, value: hideCommentsValue };
        const hideEntryContent = { checked: hideEntries, value: hideEntriesValue };
        const payload = { defaultLicense, hideCommentContent, hideEntryContent, passwordPreference };
        if (donationsValue !== loggedProfileData.get('donationsEnabled')) {
            this.props.actionAdd(loggedEthAddress, toggleDonations, { status: donationsValue });
        }
        this.props.userSettingsSave(loggedEthAddress, payload);
    }

    render () { // eslint-disable-line complexity
        const { intl, licenses, loggedProfileData, pendingToggleDonations, savingUserSettings,
            userSettings } = this.props;
        const { defaultLicenseId, defaultLicenseParent, hideComments, hideCommentsValue, hideEntries,
            hideEntriesValue, unlockTime, rememberTime } = this.state;
        const pref = userSettings.passwordPreference;
        const license = userSettings.get('defaultLicense');
        const hideCommentContent = userSettings.get('hideCommentContent');
        const hideEntryContent = userSettings.get('hideEntryContent');
        const donationsEnabled = loggedProfileData.get('akashaId') ?
            loggedProfileData.get('donationsEnabled') :
            true;
        const tipsDisabled = !loggedProfileData.get('akashaId');

        const formChanged = (
            pref.remember !== this.state.rememberTime ||
            pref.time !== this.state.unlockTime ||
            license.id !== this.state.defaultLicenseId ||
            license.parent !== this.state.defaultLicenseParent ||
            donationsEnabled !== this.state.donationsValue ||
            hideCommentContent.checked !== this.state.hideComments ||
            hideCommentContent.value !== this.state.hideCommentsValue ||
            hideEntryContent.checked !== this.state.hideEntries ||
            hideEntryContent.value !== this.state.hideEntriesValue
        );

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
                <div className="profile-settings__hide-content">
                  <div className="profile-settings__item-title">
                    {intl.formatMessage(settingsMessages.hideContent)}
                  </div>
                  <div className="profile-settings__item-description">
                    {intl.formatMessage(settingsMessages.hideContentDescription)}
                  </div>
                  <div className="profile-settings__hide-content-row">
                    <Checkbox
                      checked={hideEntries}
                      onChange={this.handleHideEntriesChange}
                    >
                      {intl.formatMessage(settingsMessages.hideEntriesLabel)}
                    </Checkbox>
                    <InputNumber
                      className="profile-settings__score-input"
                      onChange={this.handleHideEntriesValueChange}
                      step={1}
                      maxLength={22}
                      precision={0}
                      value={hideEntriesValue}
                    />
                  </div>
                  <div className="profile-settings__hide-content-row">
                    <Checkbox
                      checked={hideComments}
                      onChange={this.handleHideCommentsChange}
                    >
                      {intl.formatMessage(settingsMessages.hideCommentsLabel)}
                    </Checkbox>
                    <InputNumber
                      className="profile-settings__score-input"
                      onChange={this.handleHideCommentsValueChange}
                      step={1}
                      maxLength={22}
                      precision={0}
                      value={hideCommentsValue}
                    />
                  </div>
                </div>
                <div>
                  <div className="profile-settings__item-title">
                    {intl.formatMessage(settingsMessages.tipsOptions)}
                    <Tooltip
                      title={tipsDisabled ?
                          intl.formatMessage(settingsMessages.tipsDisabled) :
                          intl.formatMessage(settingsMessages.tipsInfo)
                      }
                      placement="topLeft"
                      arrowPointAtCenter
                    >
                      <Icon
                        type="questionCircle"
                        className="question-circle-icon profile-settings__info-icon"
                      />
                    </Tooltip>
                  </div>
                  <div className="profile-settings__item-description">
                    {intl.formatMessage(settingsMessages.tipsDescription)}
                  </div>
                  <div className="profile-settings__tips">
                    <RadioGroup
                      disabled={tipsDisabled}
                      onChange={this.handleTipsChange}
                      value={this.state.donationsValue}
                    >
                      <Radio value>{intl.formatMessage(settingsMessages.tipsAccept)}</Radio>
                      <Radio value={false}>{intl.formatMessage(settingsMessages.tipsDoNotAccept)}</Radio>
                    </RadioGroup>
                  </div>
                </div>
              </Form>
            </div>
            <div className="profile-settings__footer">
              <Button
                disabled={pendingToggleDonations || savingUserSettings || !formChanged}
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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import * as R from 'ramda';
import { Button, Checkbox, Form, InputNumber, Input, Modal, Select, Switch, Tooltip, Radio } from 'antd';
import { toggleDonations } from '../../constants/action-types';
import { userSettingsSave } from '../../local-flux/actions/settings-actions';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { selectActionPending, selectAllLicenses, selectLoggedEthAddress,
    selectLoggedProfileData } from '../../local-flux/selectors';
import { formMessages, settingsMessages, generalMessages, profileMessages,
    searchMessages } from '../../locale-data/messages';
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
        const notificationsPreference = props.userSettings.get('notificationsPreference');
        const trustedDomains = props.userSettings.get('trustedDomains').toJS();
        this.state = {
            defaultLicenseParent: license.parent || '2',
            defaultLicenseId: license.id || '4',
            hideComments: hideCommentContent.checked,
            hideCommentsValue: hideCommentContent.value,
            hideEntries: hideEntryContent.checked,
            hideEntriesValue: hideEntryContent.value,
            rememberTime: pref && pref.remember ? pref.remember : false,
            unlockTime: pref && pref.time ? pref.time : 5,
            donationsValue: donations,
            notifFeed: notificationsPreference.feed,
            notifComments: notificationsPreference.comments,
            notifDonations: notificationsPreference.donations,
            notifVotes: notificationsPreference.votes,
            trustedDomains,
            trustedDomainsModalVisible: false,
            search: '',
            filteredTrustedDomains: trustedDomains
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

    handleTrustedDomainsChange = (checkedValues) => {
        this.setState({ trustedDomains: checkedValues });
    }

    handleShowModal = () => {
        const { userSettings } = this.props;
        const initialTrustedDomains = userSettings.get('trustedDomains').toJS();
        this.setState({
            filteredTrustedDomains: initialTrustedDomains,
            search: '',
            trustedDomainsModalVisible: true
        });
    }

    handleOk = () => {
        this.onSaveSettings();
        this.setState({ trustedDomainsModalVisible: false });
    }

    handleCancel = () => {
        this.setState({ trustedDomainsModalVisible: false });
    }

    onSearchChange = (ev) => {
        const { userSettings } = this.props;
        const initialTrustedDomains = userSettings.get('trustedDomains').toJS();
        this.setState({ search: ev.target.value }, () => {
            const filtered = initialTrustedDomains.filter(domain => domain.includes(this.state.search));
            this.setState({ filteredTrustedDomains: filtered });
        });
    }

    showTrustedDomainsModal = (formChanged) => {
        const { intl } = this.props;
        const { search, trustedDomains, filteredTrustedDomains } = this.state;
        return (
          <Modal
            visible={this.state.trustedDomainsModalVisible}
            className={'trusted-domains-modal'}
            closable={false}
            width={450}
            onOk={this.onSaveSettings}
            onCancel={() => { this.setState({ trustedDomainsModalVisible: false }); }}
            footer={[
              <Button key="back" onClick={this.handleCancel}>
                {intl.formatMessage(generalMessages.cancel)}
              </Button>,
              <Button key="submit" type="primary" onClick={this.handleOk} disabled={!formChanged}>
                {intl.formatMessage(settingsMessages.update)}
              </Button>,
            ]}
          >
            <div>
              <div className="profile-settings__item-title">
                {intl.formatMessage(settingsMessages.trustedDomainsOptions)}
              </div>
              <div className="profile-settings__item-description">
                {intl.formatMessage(settingsMessages.trustedDomainsManage)}
              </div>
              <div className="trusted-domains-modal__search">
                <Input
                  onChange={this.onSearchChange}
                  value={search}
                  placeholder={intl.formatMessage(searchMessages.searchSomething)}
                  prefix={<Icon type="search" />}
                />
              </div>
              <div className="trusted-domains-modal__checkbox-wrap">
                <div className="trusted-domains-modal__overflow">
                  <Checkbox.Group
                    options={filteredTrustedDomains}
                    value={trustedDomains}
                    onChange={this.handleTrustedDomainsChange}
                  />
                </div>
              </div>
            </div>
          </Modal>
        );
    }

    onSaveSettings = () => {
        const { loggedEthAddress, loggedProfileData } = this.props;
        const { defaultLicenseId, defaultLicenseParent, donationsValue, hideComments,
            hideCommentsValue, hideEntries, hideEntriesValue, notifFeed, notifDonations,
            notifComments, notifVotes, unlockTime, rememberTime, trustedDomains } = this.state;
        const passwordPreference = { remember: rememberTime, time: unlockTime };
        const defaultLicense = { id: defaultLicenseId, parent: defaultLicenseParent };
        const hideCommentContent = { checked: hideComments, value: hideCommentsValue };
        const hideEntryContent = { checked: hideEntries, value: hideEntriesValue };
        const notificationsPreference = {
            feed: notifFeed,
            donations: notifDonations,
            comments: notifComments,
            votes: notifVotes
        };
        const payload = {
            defaultLicense,
            hideCommentContent,
            hideEntryContent,
            passwordPreference,
            notificationsPreference,
            trustedDomains
        };
        if (donationsValue !== loggedProfileData.get('donationsEnabled')) {
            this.props.actionAdd(loggedEthAddress, toggleDonations, { status: donationsValue });
        }
        this.props.userSettingsSave(loggedEthAddress, payload);
    }

    render () { // eslint-disable-line complexity
        const { intl, licenses, loggedProfileData, pendingToggleDonations, savingUserSettings,
            userSettings } = this.props;
        const { defaultLicenseId, defaultLicenseParent, hideComments, hideCommentsValue, hideEntries,
            hideEntriesValue, notifComments, notifDonations, notifFeed, notifVotes, unlockTime,
            rememberTime, donationsValue, trustedDomains } = this.state;
        const pref = userSettings.passwordPreference;
        const license = userSettings.get('defaultLicense');
        const hideCommentContent = userSettings.get('hideCommentContent');
        const hideEntryContent = userSettings.get('hideEntryContent');
        const donationsEnabled = loggedProfileData.get('akashaId') ?
            loggedProfileData.get('donationsEnabled') :
            true;
        const tipsDisabled = !loggedProfileData.get('akashaId');
        const notifPref = userSettings.notificationsPreference;
        const initialTrustedDomains = userSettings.get('trustedDomains').toJS();

        const formChanged = (
            pref.remember !== rememberTime ||
            pref.time !== unlockTime ||
            license.id !== defaultLicenseId ||
            license.parent !== defaultLicenseParent ||
            donationsEnabled !== donationsValue ||
            hideCommentContent.checked !== hideComments ||
            hideCommentContent.value !== hideCommentsValue ||
            hideEntryContent.checked !== hideEntries ||
            hideEntryContent.value !== hideEntriesValue ||
            notifPref.feed !== notifFeed ||
            notifPref.comments !== notifComments ||
            notifPref.donations !== notifDonations ||
            notifPref.votes !== notifVotes ||
            !R.equals(initialTrustedDomains.sort(), trustedDomains.sort())
        );

        return (
          <div className="profile-settings">
            {this.showTrustedDomainsModal(formChanged)}
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
                <div>
                  <div className="profile-settings__item-title">
                    {intl.formatMessage(generalMessages.notifications)}
                  </div>
                  <div className="profile-settings__item-description">
                    {intl.formatMessage(settingsMessages.notificationsInfo)}
                  </div>
                  <div className="profile-settings__notif-pref-list">
                    <div className="profile-settings__notif-pref">
                      {intl.formatMessage(profileMessages.followers)}
                      <Switch
                        size="small"
                        checked={notifFeed}
                        onChange={(checked) => {
                          this.setState({
                            notifFeed: checked
                          });
                          }
                        }
                      />
                    </div>
                    <div className="profile-settings__notif-pref">
                      {intl.formatMessage(generalMessages.comments)}
                      <Switch
                        size="small"
                        checked={notifComments}
                        onChange={(checked) => {
                          this.setState({
                            notifComments: checked
                          });
                          }
                        }
                      />
                    </div>
                    <div className="profile-settings__notif-pref">
                      {intl.formatMessage(settingsMessages.votes)}
                      <Switch
                        size="small"
                        checked={notifVotes}
                        onChange={(checked) => {
                          this.setState({
                            notifVotes: checked
                          });
                          }
                        }
                      />
                    </div>
                    <div className="profile-settings__notif-pref">
                      {intl.formatMessage(settingsMessages.tips)}
                      <Switch
                        size="small"
                        checked={notifDonations}
                        onChange={(checked) => {
                          this.setState({
                            notifDonations: checked
                          });
                          }
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="profile-settings__trusted-domains">
                  <div className="profile-settings__item-title">
                    {intl.formatMessage(settingsMessages.trustedDomainsOptions)}
                  </div>
                  <div className="profile-settings__item-description">
                    {intl.formatMessage(settingsMessages.trustedDomainsOptionsDescription)}
                  </div>
                  <div className="profile-settings__trusted-domains-description">
                    <div className="profile-settings__trusted-domains-left">
                      <div className="profile-settings__trusted-domains-count">
                        {initialTrustedDomains.length}
                      </div>
                      {intl.formatMessage(settingsMessages.trustedDomainsOptions)}
                    </div>
                    <div
                      className="profile-settings__trusted-domains-view"
                      onClick={this.handleShowModal}
                    >
                      {intl.formatMessage(generalMessages.viewAll)}
                    </div>
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

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import throttle from 'lodash.throttle';
import { Card, Spin, Icon } from 'antd';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { profileExists } from '../../local-flux/actions/profile-actions';
import { setTempProfile, tempProfileUpdate,
    tempProfileCreate } from '../../local-flux/actions/temp-profile-actions';
import ProfileForm from '../forms/profile-complete-form';
import { selectBalance, selectLoggedProfileData, selectLoggedEthAddress } from '../../local-flux/selectors';
import { setupMessages } from '../../locale-data/messages';
import * as actionTypes from '../../constants/action-types';

class ProfileComplete extends Component {
    state = {
        isScrolled: false
    }

    componentWillMount () {
        this._createTempProfile(this.props);
    }

    _createTempProfile = (props) => {
        const { ipfsBaseUrl, loggedProfileData } = props;
        let profileData = loggedProfileData.get('baseUrl') ?
            loggedProfileData :
            loggedProfileData.set('baseUrl', ipfsBaseUrl);
        profileData = !loggedProfileData.get('avatar') ?
            profileData.set('avatar', '') :
            profileData;
        this.props.setTempProfile(profileData);
    }

    _updateTempProfile = (updatedProfile) => {
        this.props.tempProfileUpdate(updatedProfile);
    }

    getFormContainerRef = (el) => {
        this.formContainer = el;
        if (!this.listenerRegistered && this.formContainer) {
            this.listenerRegistered = true;
            this.formContainer.addEventListener('scroll', this.throttledHandler);
        }
        if (!this.formContainer) {
            this.listenerRegistered = false;
        }
    };

    handleFormScroll = (ev) => {
        const { isScrolled } = this.state;
        if (ev.srcElement.scrollTop === 0 && isScrolled) {
            this.setState({
                isScrolled: false
            });
        } else if (ev.srcElement.scrollTop > 0 && !isScrolled) {
            this.setState({
                isScrolled: true
            });
        }
    };

    throttledHandler = throttle(this.handleFormScroll, 300);

    render () {
        const { faucet, intl, history, tempProfile, loggedProfileData,
            loggedEthAddress, profileExistsData } = this.props;
        const isUpdate = !!loggedProfileData.get('akashaId');
        const { isScrolled } = this.state;
        const withShadow = isScrolled && 'profile-complete__header_with-shadow';
        const spinIcon = <Icon type="loading-3-quarters" style={{ fontSize: 30 }} spin />;
        const self = this;

        function FaucetDiv (props) {
            const faucetState = props.faucet;
            if (faucet === 'success') {
                return (
                  <Card>
                    <div className="profile-complete__faucet-icon">
                      <Icon type="check" style={{ fontSize: 30 }} />
                    </div>
                    <div>{intl.formatMessage(setupMessages.faucetSuccess)}</div>
                  </Card>
                );
            }
            if (faucetState === 'error') {
                return (
                  <Card>
                    <div className="profile-complete__faucet-icon">
                      <Icon type="close" style={{ fontSize: 30 }} />
                    </div>
                    <div>{intl.formatMessage(setupMessages.faucetError)}</div>
                    <div
                      onClick={() => self.props.actionAdd(loggedEthAddress, actionTypes.faucet,
                        { ethAddress: loggedEthAddress })}
                      className="content-link"
                    >
                      {intl.formatMessage(setupMessages.faucetRetry)}
                    </div>
                  </Card>
                );
            }
            if (!faucetState) {
                return (
                  <Card>
                    <div className="profile-complete__faucet-icon">
                      <Spin indicator={spinIcon} />
                    </div>
                    <div>{intl.formatMessage(setupMessages.faucetPending)}</div>
                  </Card>
                );
            }
        }

        return (
          <div className="setup-content setup-content__column_full">
            <div className="profile-complete">
              <div className="profile-complete__left">
                <div className="profile-complete__left-bold-text">
                  {intl.formatMessage(setupMessages.authComplete)}
                </div>
                <span>{intl.formatMessage(setupMessages.completeProfile)}</span>
                <div className="profile-complete__faucet">
                  <FaucetDiv faucet={faucet} />
                </div>
              </div>
              <div className="profile-complete__right">
                <div className={`profile-complete__header ${withShadow}`} />
                <ProfileForm
                  actionAdd={this.props.actionAdd}
                  balance={this.props.balance}
                  intl={intl}
                  history={history}
                  isUpdate={isUpdate}
                  getFormContainerRef={this.getFormContainerRef}
                  loggedEthAddress={loggedEthAddress}
                  profileExists={this.props.profileExists}
                  profileExistsData={profileExistsData}
                  tempProfile={tempProfile}
                  tempProfileCreate={this.props.tempProfileCreate}
                  onProfileUpdate={this._updateTempProfile}
                />
              </div>
            </div>
          </div>
        );
    }
}

ProfileComplete.propTypes = {
    actionAdd: PropTypes.func,
    balance: PropTypes.shape(),
    faucet: PropTypes.string,
    intl: PropTypes.shape().isRequired,
    ipfsBaseUrl: PropTypes.string,
    history: PropTypes.shape().isRequired,
    loggedProfileData: PropTypes.shape(),
    loggedEthAddress: PropTypes.string,
    profileExists: PropTypes.func,
    profileExistsData: PropTypes.shape(),
    setTempProfile: PropTypes.func,
    tempProfile: PropTypes.shape(),
    tempProfileUpdate: PropTypes.func,
    tempProfileCreate: PropTypes.func
};

function mapStateToProps (state) {
    return {
        balance: selectBalance(state),
        faucet: state.profileState.get('faucet'),
        ipfsBaseUrl: state.externalProcState.getIn(['ipfs', 'status', 'baseUrl']),
        loggedEthAddress: selectLoggedEthAddress(state),
        firstDashboardReady: state.dashboardState.getIn(['flags', 'firstDashboardReady']),
        loggedProfileData: selectLoggedProfileData(state),
        profileExistsData: state.profileState.get('exists'),
        tempProfile: state.tempProfileState.get('tempProfile')
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
        profileExists,
        setTempProfile,
        tempProfileUpdate,
        tempProfileCreate
    }
)(injectIntl(ProfileComplete));

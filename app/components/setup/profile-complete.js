import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { actionAdd } from '../../local-flux/actions/action-actions';
import { setTempProfile, tempProfileGet,
    tempProfileUpdate, tempProfileCreate } from '../../local-flux/actions/temp-profile-actions';
import ProfileForm from '../forms/profile-complete-form';
import { selectBalance, selectLoggedProfileData } from '../../local-flux/selectors';
import { setupMessages } from '../../locale-data/messages';

class ProfileComplete extends Component {
    componentWillMount () {
        this._createTempProfile(this.props);
    }

    _createTempProfile = (props) => {
        const { ipfsBaseUrl, loggedProfileData, loggedProfile } = props;
        const profileData = loggedProfileData.get('baseUrl') ?
            loggedProfileData :
            loggedProfileData.set('baseUrl', ipfsBaseUrl);
        this.props.setTempProfile(profileData);
        this.props.tempProfileGet(loggedProfile.get('ethAddress'));
    }

    _updateTempProfile = (updatedProfile) => {
        this.props.tempProfileUpdate(updatedProfile);
    }

    render () {
        const { intl, history, tempProfile, loggedProfileData } = this.props;
        const isUpdate = !!loggedProfileData.get('akashaId');

        return (
          <div className="setup-content setup-content__column_full">
            <div className="profile-complete">
              <div className="profile-complete__left">
                <div>
                  <div className="profile-complete__left-bold-text">
                    {intl.formatMessage(setupMessages.authComplete)}
                  </div>
                  <span>{intl.formatMessage(setupMessages.completeProfile)}</span>
                </div>
              </div>
              <div className="profile-complete__right">
                <ProfileForm
                  actionAdd={this.props.actionAdd}
                  balance={this.props.balance}
                  intl={intl}
                  history={history}
                  isUpdate={isUpdate}
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
    intl: PropTypes.shape().isRequired,
    ipfsBaseUrl: PropTypes.string,
    loggedProfile: PropTypes.shape(),
    history: PropTypes.shape().isRequired,
    loggedProfileData: PropTypes.shape(),
    setTempProfile: PropTypes.func,
    tempProfile: PropTypes.shape(),
    tempProfileUpdate: PropTypes.func,
    tempProfileCreate: PropTypes.func,
    tempProfileGet: PropTypes.func
};

function mapStateToProps (state) {
    return {
        balance: selectBalance(state),
        ipfsBaseUrl: state.externalProcState.getIn(['ipfs', 'status', 'baseUrl']),
        loggedProfile: state.profileState.get('loggedProfile'),
        firstDashboardReady: state.dashboardState.getIn(['flags', 'firstDashboardReady']),
        loggedProfileData: selectLoggedProfileData(state),
        tempProfile: state.tempProfileState.get('tempProfile')
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
        setTempProfile,
        tempProfileUpdate,
        tempProfileCreate,
        tempProfileGet,
    }
)(injectIntl(ProfileComplete));

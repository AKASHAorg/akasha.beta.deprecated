import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Icon } from 'antd';
import { actionAdd } from '../local-flux/actions/action-actions';
import { setTempProfile, tempProfileGet,
    tempProfileUpdate, tempProfileCreate } from '../local-flux/actions/temp-profile-actions';
import { profileEditToggle, showTerms } from '../local-flux/actions/app-actions';
import ProfileForm from './forms/profile-edit-form';
import { profileMessages } from '../locale-data/messages';
import { selectLoggedProfileData } from '../local-flux/selectors';

class ProfileEdit extends Component {
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
        const { intl, tempProfile, loggedProfileData } = this.props;
        const isUpdate = !!loggedProfileData.get('akashaId');

        return (
          <div className="profile-edit">
            <div className="profile-edit__wrapper">
              <div className="profile-edit__title">
                {intl.formatMessage(profileMessages.editProfileTitle)}
                <Icon
                  type="close"
                  onClick={this.props.profileEditToggle}
                  style={{ fontSize: 20, cursor: 'pointer' }}
                />
              </div>
              <ProfileForm
                actionAdd={this.props.actionAdd}
                intl={intl}
                isUpdate={isUpdate}
                tempProfile={tempProfile}
                tempProfileCreate={this.props.tempProfileCreate}
                onProfileUpdate={this._updateTempProfile}
                onTermsShow={this.props.showTerms}
              />
            </div>
            <div className="profile-edit__grey-background" />
          </div>
        );
    }
}


ProfileEdit.propTypes = {
    actionAdd: PropTypes.func,
    intl: PropTypes.shape(),
    ipfsBaseUrl: PropTypes.string,
    loggedProfile: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    profileEditToggle: PropTypes.func,
    setTempProfile: PropTypes.func,
    showTerms: PropTypes.func,
    tempProfile: PropTypes.shape(),
    tempProfileUpdate: PropTypes.func,
    tempProfileCreate: PropTypes.func,
    tempProfileGet: PropTypes.func
};

const mapStateToProps = state => ({
    ipfsBaseUrl: state.externalProcState.getIn(['ipfs', 'status', 'baseUrl']),
    loggedProfile: state.profileState.get('loggedProfile'),
    loggedProfileData: selectLoggedProfileData(state),
    tempProfile: state.tempProfileState.get('tempProfile')
});


export default connect(
    mapStateToProps,
    {
        actionAdd,
        profileEditToggle,
        setTempProfile,
        showTerms,
        tempProfileUpdate,
        tempProfileCreate,
        tempProfileGet
    }
)(injectIntl(ProfileEdit));

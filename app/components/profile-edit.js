import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import throttle from 'lodash.throttle';
import { actionAdd } from '../local-flux/actions/action-actions';
import { profileExists } from '../local-flux/actions/profile-actions';
import { setTempProfile, tempProfileGet,
    tempProfileUpdate, tempProfileCreate, tempProfileDelete } from '../local-flux/actions/temp-profile-actions';
import { profileEditToggle, showTerms } from '../local-flux/actions/app-actions';
import ProfileForm from './forms/profile-edit-form';
import { profileMessages } from '../locale-data/messages';
import { selectLoggedProfileData } from '../local-flux/selectors';
import { Icon } from './';

class ProfileEdit extends Component {
    state = {
        isScrolled: false
    }

    componentWillMount () {
        this._createTempProfile(this.props);
    }

    componentWillUnmount () {
        this.formContainer.removeEventListener('scroll', this.throttledHandler);
        this.props.tempProfileDelete();
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
        const { intl, tempProfile, loggedProfileData, profileExistsData } = this.props;
        const isUpdate = !!loggedProfileData.get('akashaId');
        const { isScrolled } = this.state;
        const withBorder = isScrolled && 'profile-edit__title_with-border';

        return (
          <div className="profile-edit">
            <div className="profile-edit__wrapper">
              <div className={`profile-edit__title ${withBorder}`}>
                {intl.formatMessage(profileMessages.editProfileTitle)}
                <Icon
                  className="content-link profile-edit__close-icon"
                  type="close"
                  onClick={this.props.profileEditToggle}
                />
              </div>
              <ProfileForm
                actionAdd={this.props.actionAdd}
                intl={intl}
                isUpdate={isUpdate}
                getFormContainerRef={this.getFormContainerRef}
                loggedProfileData={loggedProfileData}
                profileExists={this.props.profileExists}
                profileExistsData={profileExistsData}
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
    profileExists: PropTypes.func,
    profileExistsData: PropTypes.shape(),
    setTempProfile: PropTypes.func,
    showTerms: PropTypes.func,
    tempProfile: PropTypes.shape(),
    tempProfileUpdate: PropTypes.func,
    tempProfileCreate: PropTypes.func,
    tempProfileDelete: PropTypes.func,
    tempProfileGet: PropTypes.func
};

const mapStateToProps = state => ({
    ipfsBaseUrl: state.externalProcState.getIn(['ipfs', 'status', 'baseUrl']),
    loggedProfile: state.profileState.get('loggedProfile'),
    loggedProfileData: selectLoggedProfileData(state),
    profileExistsData: state.profileState.get('exists'),
    tempProfile: state.tempProfileState.get('tempProfile')
});


export default connect(
    mapStateToProps,
    {
        actionAdd,
        profileEditToggle,
        profileExists,
        setTempProfile,
        showTerms,
        tempProfileUpdate,
        tempProfileCreate,
        tempProfileDelete,
        tempProfileGet
    }
)(injectIntl(ProfileEdit));

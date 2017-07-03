import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ProfileForm from '../forms/new-profile-form';
import { PanelContainerHeader } from '../';
import styles from './profile-edit.scss';

class EditProfile extends PureComponent {
    componentWillMount () {
        this._createTempProfile(this.props);
    }
    componentDidUpdate () {
        this._createTempProfile(this.props);
    }
    componentWillUnmount = () => {
        const { tempProfileDelete, tempProfile, appState } = this.props;
        const pendingActions = appState.get('pendingActions');
        // Delete temp profile if it`s not pending to publish
        const isTempProfilePending = pendingActions.find(action => action.get('entityType') === 'tempProfile');
        if (!isTempProfilePending) {
            tempProfileDelete({
                akashaId: tempProfile.get('akashaId')
            });
        }
    }
    _createTempProfile = (props) => {
        const { tempProfile, loggedProfileData, setTempProfile } = props;
        const tempAkashaId = tempProfile.get('akashaId');
        const akashaId = loggedProfileData.get('akashaId');
        if (tempAkashaId === '' && tempAkashaId !== akashaId) {
            setTempProfile(loggedProfileData);
        }
    }
    _handleSubmit = () => {
        const { publishEntity, tempProfile, appState } = this.props;
        const pendingActions = appState.get('pendingActions');
        if (tempProfile.get('localId') && pendingActions.has(tempProfile.get('localId'))) {
            return console.warn('profile upgrade is in progress. Wait untill it`s finished!');
        }
        if (pendingActions.find(action => action.entityType === 'tempProfile')) {
            return console.warn('There is already a profile update in progress. Please wait until it`s finished.');
        }
        return publishEntity({
            entityType: 'tempProfile',
            actionType: 'update',
            entityId: tempProfile.get('localId'),
            currentAction: 'TEMP_PROFILE_PUBLISH_START',
            publishTx: null,
            confirmed: false,
            published: false
        });
    }
    _handleAbort = () => {
        const { history } = this.props;
        history.goBack();
    }
    _updateTempProfile = (updatedProfile) => {
        const { tempProfileUpdate } = this.props;
        tempProfileUpdate(updatedProfile);
    }
    render () {
        const { intl, muiTheme, tempProfile, loggedProfileData } = this.props;
        return (
          <div className={`${styles.root} row`}>
            <PanelContainerHeader
              subTitle={`${loggedProfileData.firstName} ${loggedProfileData.lastName} > Edit Profile`}
              intl={intl}
              muiTheme={muiTheme}
              showBorder
              headerHeight={40}
              headerActions={
                <div className="col-xs-12">
                  <div className="row end-xs">
                    <div className="col-xs-4">
                      <button type="button">Settings</button>
                    </div>
                    <div className="col-xs-5">
                      <button type="button">Edit Profile</button>
                    </div>
                    <div className="col-xs-3">
                      <button type="button">Logout</button>
                    </div>
                  </div>
                </div>
              }
            />
            <ProfileForm
              intl={intl}
              muiTheme={muiTheme}
              isUpdate
              tempProfile={tempProfile}
              expandOptionalDetails
              onSubmit={this._handleSubmit}
              onCancel={this._handleAbort}
              onProfileUpdate={this._updateTempProfile}
            />
          </div>
        );
    }
}

EditProfile.propTypes = {
    appState: PropTypes.shape(),
    history: PropTypes.shape(),
    intl: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    muiTheme: PropTypes.shape(),
    publishEntity: PropTypes.func,
    setTempProfile: PropTypes.func,
    tempProfileDelete: PropTypes.func,
    tempProfile: PropTypes.shape(),
    tempProfileUpdate: PropTypes.func,
};

export default EditProfile;

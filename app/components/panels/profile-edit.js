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
        const { tempProfileDelete, tempProfile } = this.props;
        tempProfileDelete({
            akashaId: tempProfile.get('akashaId')
        });
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
        const { publishEntity, tempProfile } = this.props;
        publishEntity({
            entityType: 'tempProfile',
            actionType: 'update',
            entityId: tempProfile.get('localId'),
            currentAction: 'TEMP_PROFILE_PUBLISH_UPDATE',
            publishTx: null,
            confirmed: false,
            published: false
        });
    }
    _handleAbort = () => {
        const { history } = this.props;
        history.goBack();
    }
    render () {
        const { intl, muiTheme, tempProfile, tempProfileUpdate,
            loggedProfileData } = this.props;
        return (
          <div className={`${styles.root} row`}>
            <PanelContainerHeader
              title={'Edit profile'}
              subTitle={`@${loggedProfileData.akashaId}`}
              intl={intl}
              muiTheme={muiTheme}
              showBorder
              headerHeight={80}
            />
            <ProfileForm
              intl={intl}
              muiTheme={muiTheme}
              isUpdate
              tempProfile={tempProfile}
              expandOptionalDetails
              onSubmit={this._handleSubmit}
              onCancel={this._handleAbort}
              onProfileUpdate={tempProfileUpdate}
            />
          </div>
        );
    }
}

EditProfile.propTypes = {
    setTempProfile: PropTypes.func,
    history: PropTypes.shape(),
    intl: PropTypes.shape(),
    muiTheme: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    publishEntity: PropTypes.func,
    tempProfileDelete: PropTypes.func,
    tempProfile: PropTypes.shape(),
    tempProfileUpdate: PropTypes.func,

};

export default EditProfile;

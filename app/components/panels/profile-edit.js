import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { selectLoggedProfileData } from '../../local-flux/selectors';
import { setTempProfile, tempProfileDelete, tempProfileUpdate,
    publishEntity } from '../../local-flux/actions/temp-profile-actions';
import ProfileForm from '../forms/new-profile-form';
import styles from './profile-edit.scss';

class EditProfile extends Component {
    componentWillMount () {
        this._createTempProfile(this.props);
    }
    componentWillReceiveProps (nextProps) {
        this._createTempProfile(nextProps);
    }
    componentWillUnmount () {
        const { tempProfile, pendingActions } = this.props;
        // Delete temp profile if it`s not pending to publish
        // debugger;
        const isTempProfilePending = pendingActions.find(action =>
            action.get('entityType') === 'tempProfile'
        );
        if (!isTempProfilePending) {
            this.props.tempProfileDelete({
                akashaId: tempProfile.get('akashaId')
            });
        }
    }
    _createTempProfile = (props) => {
        const { tempProfile, loggedProfileData } = props;
        const tempAkashaId = tempProfile.get('akashaId');
        const akashaId = loggedProfileData.get('akashaId');
        if (tempAkashaId === '' && tempAkashaId !== akashaId) {
            this.props.setTempProfile(loggedProfileData);
        }
    }
    _handleSubmit = () => {
        const { tempProfile, pendingActions } = this.props;
        if (tempProfile.get('localId') && pendingActions.has(tempProfile.get('localId'))) {
            return console.warn('profile upgrade is in progress. Wait untill it`s finished!');
        }
        if (pendingActions.find(action => action.entityType === 'tempProfile')) {
            return console.warn('There is already a profile update in progress. Please wait until it`s finished.');
        }
        return this.props.publishEntity({
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
        this.props.tempProfileUpdate(updatedProfile);
    }
    render () {
        const { intl, tempProfile } = this.props;
        const { muiTheme } = this.context;
        return (
          <div className={`${styles.root} row`}>
            <ProfileForm
              intl={intl}
              muiTheme={muiTheme}
              isUpdate
              tempProfile={tempProfile}
              onSubmit={this._handleSubmit}
              onCancel={this._handleAbort}
              onProfileUpdate={this._updateTempProfile}
            />
          </div>
        );
    }
}

EditProfile.contextTypes = {
    muiTheme: PropTypes.shape()
};

EditProfile.propTypes = {
    history: PropTypes.shape(),
    intl: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    pendingActions: PropTypes.shape(),
    publishEntity: PropTypes.func,
    setTempProfile: PropTypes.func,
    tempProfileDelete: PropTypes.func,
    tempProfile: PropTypes.shape(),
    tempProfileUpdate: PropTypes.func,
};

const mapStateToProps = state => ({
    pendingActions: state.appState.get('pendingActions'),
    loggedProfileData: selectLoggedProfileData(state),
    tempProfile: state.tempProfileState.get('tempProfile')
});


export default connect(
    mapStateToProps,
    {
        setTempProfile,
        tempProfileDelete,
        tempProfileUpdate,
        publishEntity
    }
)(injectIntl(EditProfile));

import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { RaisedButton } from 'material-ui';
import { PanelContainerFooter, ProfilesList } from './';
import { generalMessages } from '../locale-data/messages';

class Auth extends Component {
    state = {
        hasTempProfile: false
    }
    componentDidMount () {
        const { gethStatus, profileDeleteLogged,
            profileGetLocal, tempProfileGetRequest } = this.props;
        tempProfileGetRequest();
        if (gethStatus.get('api')) {
            profileGetLocal();
        }
        profileDeleteLogged();
    }

    componentWillReceiveProps (nextProps) {
        const { tempProfile, loginErrors, gethStatus, ipfsStatus,
            profileGetLocal } = nextProps;
        const oldIpfsStatus = this.props.ipfsStatus;
        const ipfsStatusChanged = (ipfsStatus.get('started') && !oldIpfsStatus.get('started'))
            || (ipfsStatus.get('spawned') && !oldIpfsStatus.get('spawned'));
        const gethStatusChanged = gethStatus.get('api') && !this.props.gethStatus.get('api');

        if (gethStatusChanged || ipfsStatusChanged) {
            profileGetLocal();
        }
        if (loginErrors.size === 0 && tempProfile.get('akashaId')) {
            this.setState({
                hasTempProfile: true
            });
        }
    }

    componentWillUnmount () {
        this.props.profileClearLocal();
    }
    _getNewIdentityLabel = () => {
        const { hasTempProfile } = this.state;
        const { intl } = this.props;
        if (hasTempProfile) {
            return intl.formatMessage(generalMessages.resumeIdentityLabel);
        }
        return intl.formatMessage(generalMessages.createNewIdentityLabel);
    }
    _handleNewIdentity = () => {
        const { hasTempProfile } = this.state;
        const { history } = this.props;
        if (hasTempProfile) {
            return history.push('/setup/new-identity-status');
        }
        return this.props.history.push('/setup/new-identity');
    }
    render () {
        const { backupKeysRequest, backupPending, fetchingProfileList, gethStatus, intl, ipfsStatus,
            localProfiles, localProfilesFetched, showLoginDialog } = this.props;

        return (
          <div style={{ width: '100%' }}>
            <div style={{ width: '100%', height: '100%', padding: '12px 24px' }}>
              <ProfilesList
                fetchingProfiles={!localProfilesFetched || fetchingProfileList}
                gethStatus={gethStatus}
                handleSelect={showLoginDialog}
                intl={intl}
                ipfsStatus={ipfsStatus}
                profiles={localProfiles}
              />
            </div>
            <PanelContainerFooter >
              <RaisedButton
                disabled={backupPending}
                key="backup"
                label={intl.formatMessage(generalMessages.backup)}
                onClick={backupKeysRequest}
              />
              <RaisedButton
                key="createNewIdentity"
                label={this._getNewIdentityLabel()}
                primary
                onTouchTap={this._handleNewIdentity}
                style={{ marginLeft: '10px' }}
              />
              <Link to="/dashboard">
                <RaisedButton
                  key="guest"
                  label="Guest"
                  style={{ marginLeft: '10px' }}
                />
              </Link>
            </PanelContainerFooter>
          </div>
        );
    }
}

Auth.propTypes = {
    backupKeysRequest: PropTypes.func.isRequired,
    backupPending: PropTypes.bool,
    fetchingProfileList: PropTypes.bool,
    gethStatus: PropTypes.shape().isRequired,
    intl: PropTypes.shape(),
    ipfsStatus: PropTypes.shape().isRequired,
    localProfiles: PropTypes.shape().isRequired,
    localProfilesFetched: PropTypes.bool,
    loginErrors: PropTypes.shape().isRequired,
    profileClearLocal: PropTypes.func.isRequired,
    profileDeleteLogged: PropTypes.func.isRequired,
    profileGetLocal: PropTypes.func.isRequired,
    showLoginDialog: PropTypes.func.isRequired,
    tempProfile: PropTypes.shape().isRequired,
    tempProfileGetRequest: PropTypes.func.isRequired,
    history: PropTypes.shape().isRequired,
};

Auth.contextTypes = {
    muiTheme: PropTypes.shape(),
};

export default Auth;

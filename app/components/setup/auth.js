import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { RaisedButton } from 'material-ui';
import { ProfileList } from '../';
import { setupMessages } from '../../locale-data/messages';
import setupStyles from './setup.scss';

class Auth extends Component {
    state = {
        hasTempProfile: false
    }

    componentDidMount () {
        const { gethStatus, profileDeleteLogged, profileGetLocal, tempProfileGetRequest } = this.props;
        tempProfileGetRequest();
        if (gethStatus.get('api')) {
            profileGetLocal();
        }
        profileDeleteLogged();
    }

    componentWillReceiveProps (nextProps) {
        const { tempProfile, loginErrors, gethStatus, ipfsStatus, profileGetLocal } = nextProps;
        const oldIpfsStatus = this.props.ipfsStatus;
        const ipfsStatusChanged = (ipfsStatus.get('started') && !oldIpfsStatus.get('started'))
            || (ipfsStatus.get('process') && !oldIpfsStatus.get('process'));
        const gethStatusChanged = gethStatus.get('api') && !this.props.gethStatus.get('api');

        if (gethStatusChanged || ipfsStatusChanged) {
            profileGetLocal();
        }
        this.setState({
            hasTempProfile: (loginErrors.size === 0 && tempProfile.get('akashaId'))
        });
    }

    componentWillUnmount () {
        this.props.profileClearLocal();
    }

    handleNewIdentity = () => {
        const { hasTempProfile } = this.state;
        const { history, tempProfileCreate, tempProfile } = this.props;
        if (hasTempProfile) {
            tempProfileCreate(tempProfile);
            return history.push('/setup/new-identity-status');
        }
        return this.props.history.push('/setup/new-identity');
    };

    render () {
        const { backupKeysRequest, backupPending, fetchingProfileList, gethStatus, intl, ipfsStatus,
            localProfiles, localProfilesFetched, showLoginDialog } = this.props;
        const { palette } = this.context.muiTheme;
        return (
          <div className={`full-page ${setupStyles.fullColumn}`} style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ flex: '1 1 auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', padding: '24px' }}>
              <RaisedButton
                disabled={backupPending}
                key="backup"
                label={intl.formatMessage(setupMessages.backup)}
                onClick={backupKeysRequest}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '450px' }}>
              <div style={{ flex: '0 0 auto', padding: '24px', width: '100%' }}>
                <div style={{ fontSize: '22px' }}>
                  <b>{intl.formatMessage(setupMessages.login)}</b>
                </div>
                <div style={{ color: palette.disabledColor }}>
                  {intl.formatMessage(setupMessages.chooseIdentity)}
                </div>
              </div>
              <div style={{ position: 'relative', flex: '1 1 auto' }}>
                <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
                  <ProfileList
                    fetchingProfiles={!localProfilesFetched || fetchingProfileList}
                    gethStatus={gethStatus}
                    handleSelect={showLoginDialog}
                    intl={intl}
                    ipfsStatus={ipfsStatus}
                    profiles={localProfiles}
                  />
                </div>
              </div>
            </div>
            <div style={{ flex: '1 1 auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', padding: '24px' }}>
              <Link to="/setup/new-identity">
                <RaisedButton
                  label={intl.formatMessage(setupMessages.createIdentity)}
                />
              </Link>
            </div>
            {/*<PanelContainerFooter
              leftActions={[
                  <RaisedButton
                    disabled={backupPending}
                    key="backup"
                    label={intl.formatMessage(generalMessages.backup)}
                    onClick={backupKeysRequest}
                  />
              ]}
            >
              <RaisedButton
                key="createNewIdentity"
                label={this._getNewIdentityLabel()}
                primary
                onTouchTap={this._handleNewIdentity}
                style={{ marginLeft: '10px' }}
              />
            </PanelContainerFooter>
            */}
          </div>
        );
    }
}

Auth.contextTypes = {
    muiTheme: PropTypes.shape()
};

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
    tempProfileCreate: PropTypes.func,
    tempProfileGetRequest: PropTypes.func.isRequired,
    history: PropTypes.shape().isRequired,
};

export default Auth;

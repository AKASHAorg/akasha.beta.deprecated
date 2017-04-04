import React, { Component, PropTypes } from 'react';
import { RaisedButton } from 'material-ui';
import { injectIntl } from 'react-intl';
import { PanelContainerFooter, ProfilesList } from './';
import { generalMessages } from '../locale-data/messages';

class Auth extends Component {
    componentDidMount () {
        const { gethStatus, profileGetLocal, tempProfileRequest } = this.props;
        tempProfileRequest();
        if (gethStatus.get('api')) {
            profileGetLocal();
        }
    }

    componentWillReceiveProps (nextProps) {
        const { tempProfile, loginErrors, gethStatus, ipfsStatus, profileGetLocal } = nextProps;
        const oldIpfsStatus = this.props.ipfsStatus;
        const ipfsStatusChanged = (ipfsStatus.get('started') && !oldIpfsStatus.get('started'))
            || (ipfsStatus.get('spawned') && !oldIpfsStatus.get('spawned'));
        const gethStatusChanged = gethStatus.get('api') && !this.props.gethStatus.get('api');

        if (gethStatusChanged || ipfsStatusChanged) {
            profileGetLocal();
        }
        if (loginErrors.size === 0 && tempProfile.get('akashaId')) {
            this.context.router.push('/authenticate/new-profile-status');
        }
    }

    componentWillUnmount () {
        this.props.profileClearLocal();
    }

    handleIdentityCreate = (ev) => {
        ev.preventDefault();
        // hashHistory.push('authenticate/new-profile');
    };

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
                label={intl.formatMessage(generalMessages.createNewIdentityLabel)}
                onMouseUp={this.handleIdentityCreate}
                primary
                style={{ marginLeft: '10px' }}
              />
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
    profileGetLocal: PropTypes.func.isRequired,
    showLoginDialog: PropTypes.func.isRequired,
    tempProfile: PropTypes.shape().isRequired,
    tempProfileRequest: PropTypes.func.isRequired,
};

Auth.contextTypes = {
    muiTheme: PropTypes.shape(),
    router: PropTypes.shape()
};

export default injectIntl(Auth);

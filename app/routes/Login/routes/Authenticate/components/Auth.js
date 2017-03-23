import React, { Component, PropTypes } from 'react';
import {
    List,
    ListItem,
    FlatButton,
    RaisedButton,
    Avatar } from 'material-ui';
import { hashHistory } from 'react-router';
import { injectIntl } from 'react-intl';
import { LoginDialog, PanelContainer, PanelHeader } from 'shared-components';
import { setupMessages, generalMessages } from 'locale-data/messages'; /* eslint import/no-unresolved: 0*/
import debounce from 'lodash.debounce';
import { getInitials } from 'utils/dataModule';

class Auth extends Component {
    constructor (props, context) {
        super(props, context);
        this.state = {
            openModal: false,
            selectedIndex: false,
            avatar: {},
            unlockTimer: 5,
            unlockIsChecked: false
        };
    }
//     componentWillMount () {
//         const { profileActions, tempProfileActions, gethStatus } = this.props;
//         tempProfileActions.getTempProfile();
//         profileActions.clearLoggedProfile();
//         if (gethStatus.get('api')) {
//             profileActions.getLocalProfiles();
//         }
//     }
//     componentWillReceiveProps (nextProps) {
//         const {
//             profileActions,
//             tempProfile,
//             localProfiles,
//             loggedProfile,
//             loginErrors,
//             gethStatus,
//             ipfsStatus,
//             fetchingLocalProfiles,
//             passwordPreference } = nextProps;
//         const oldIpfsStatus = this.props.ipfsStatus;
//         const ipfsStatusChanged = (ipfsStatus.get('started') && !oldIpfsStatus.get('started'))
//             || (ipfsStatus.get('spawned') && !oldIpfsStatus.get('spawned'));
//         const profilesChanged = this.props.localProfiles.size !== nextProps.localProfiles.size;
//         const fetchingLocalProfilesChanged = !fetchingLocalProfiles &&
//             this.props.fetchingLocalProfiles;
//         if (gethStatus.get('api') && !this.props.gethStatus.get('api')) {
//             profileActions.getLocalProfiles();
//         }
//         if (loginErrors.size === 0) {
//             if (this.state.selectedProfile &&
//                 loggedProfile.get('account') === this.state.selectedProfile.get('ethAddress')) {
//                 this.context.router.replace(`/${this.state.selectedProfile.get('akashaId')}/explore/tag`);
//             }
//             if (tempProfile.get('akashaId') !== '') {
//                 return this.context.router.push('/authenticate/new-profile-status');
//             }
//         }
//         if ((ipfsStatus.get('started') || ipfsStatus.get('spawned')) && localProfiles.size > 0
//                 && (profilesChanged || ipfsStatusChanged || fetchingLocalProfilesChanged)) {
//             profileActions.getProfileData(localProfiles.toJS());
//         }
//         if (passwordPreference.remember !== this.props.passwordPreference.remember ||
//                 passwordPreference.time !== this.props.passwordPreference.time) {
//             this.setState({
//                 unlockTimer: passwordPreference.time || 5,
//                 unlockIsChecked: passwordPreference.remember || false
//             });
//         }
//         return null;
//     }
//     componentWillUnmount () {
//         this.props.profileActions.clearLocalProfiles();
//     }
    getPlaceholderMessage () {
        const { intl, gethStatus, ipfsStatus, localProfiles, localProfilesFetched } = this.props;
        let message;
        if (!gethStatus.get('api')) {
            message = intl.formatMessage(setupMessages.gethStopped);
        } else if (!ipfsStatus.get('spawned') && !ipfsStatus.get('started')) {
            message = intl.formatMessage(setupMessages.ipfsStopped);
        } else if (localProfiles.size === 0 && localProfilesFetched) {
            message = intl.formatMessage(setupMessages.noProfilesFound);
        } else if (localProfiles.size === 0 && !localProfilesFetched) {
            message = intl.formatMessage(setupMessages.findingProfiles);
        }
        if (message) {
            return (<div
              style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
            >
              <div style={{ maxWidth: '80%', textAlign: 'center' }}>
                {message}
              </div>
            </div>);
        }
        return null;
    }
//     handleTouchTap = (index) => {
//         const { localProfiles } = this.props;
//         const selectedProfile = localProfiles.get(index);
//         this.setState({ openModal: true, selectedProfile });
//     };
//     handleModalClose = () => {
//         this.props.profileActions.clearLoginErrors();
//         this.setState(({
//             openModal: false,
//             selectedProfile: null
//         }));
//     };
//     handleLogin = debounce(() => {
//         const { profileActions, settingsActions } = this.props;
//         const selectedProfile = this.state.selectedProfile;
//         let unlockInterval = 1;
//         if (this.state.unlockIsChecked) {
//             unlockInterval = this.state.unlockTimer;
//         }
//         const passwordPreference = {
//             remember: this.state.unlockIsChecked,
//             time: this.state.unlockTimer
//         };
//         settingsActions.savePasswordPreference(passwordPreference, selectedProfile.get('akashaId'));
//         profileActions.login({
//             account: selectedProfile.get('ethAddress'),
//             password: this.state.password,
//             rememberTime: unlockInterval,
//             akashaId: selectedProfile.get('akashaId')
//         });
//     }, 1000, { leading: true, trailing: false });
    _getLocalProfiles () {
        // const { localProfiles } = this.props;
        // const { palette } = this.context.muiTheme;
        // if (localProfiles.size === 0) {
        //     return this.getPlaceholderMessage();
        // }
        // return localProfiles.map((profile, index) => {
        //     const profileAddress = profile.get('ethAddress');
        //     const profileName = `${profile.get('firstName')} ${profile.get('lastName')}`;
        //     const userInitials = getInitials(profile.get('firstName'), profile.get('lastName'));
        //     const avatarImage = profile.get('avatar');
        //     let avtr;
        //     if (!profile.get('akashaId')) {
        //         return null;
        //     }
        //     if (avatarImage) {
        //         avtr = (
        //           <Avatar
        //             src={avatarImage}
        //             size={48}
        //             style={{ top: '12px', border: `1px solid ${palette.paperShadowColor}` }}
        //           />
        //         );
        //     } else {
        //         avtr = (
        //           <Avatar>
        //             {userInitials}
        //             {!userInitials && profile.get('akashaId') &&
        //                 profile.get('akashaId')
        //             }
        //           </Avatar>
        //         );
        //     }
        //     return (
        //       <ListItem
        //         key={index}
        //         leftAvatar={avtr}
        //         primaryText={
        //           <div
        //             style={{
        //                 marginLeft: 16,
        //                 whiteSpace: 'nowrap',
        //                 overflow: 'hidden',
        //                 textOverflow: 'ellipsis'
        //             }}
        //           >
        //             <b>{profileName}</b>
        //           </div>
        //         }
        //         secondaryText={
        //           <div style={{ marginLeft: 16 }}>
        //             @{profile.get('akashaId')}
        //           </div>
        //         }
        //         secondaryTextLines={1}
        //         value={profileAddress}
        //         onTouchTap={() => this.handleTouchTap(index)}
        //         className="col-xs-12"
        //         style={{ border: `1px solid ${palette.borderColor}`, marginBottom: 8 }}
        //       />
        //     );
        // });
    }
    _handleIdentityCreate = (ev) => {
        ev.preventDefault();
        hashHistory.push('authenticate/new-profile');
    };
//     _handlePasswordChange = (ev) => {
//         ev.preventDefault();
//         const { profileActions, loginErrors } = this.props;
//         if (loginErrors.size > 0) {
//             profileActions.clearLoginErrors();
//         }
//         this.setState({
//             password: ev.target.value
//         });
//     };
//     _handleDialogKeyPress = (ev) => {
//         if (ev.key === 'Enter') {
//             this.handleLogin();
//         }
//     };
//     _handleUnlockTimerChange = (key, payload) => {
//         this.setState({
//             unlockIsChecked: true,
//             unlockTimer: payload,
//         });
//     };
//     _handleUnlockCheck = (isUnlocked) => {
//         this.setState({
//             unlockIsChecked: isUnlocked
//         });
//     };
    render () {
        const { backupPending, gethStatus, intl, ipfsStatus, settingsActions, style,
            utilsActions } = this.props;
        const { openModal } = this.state;
        const isServiceStopped = !gethStatus.get('api') || gethStatus.get('stopped')
            || (!ipfsStatus.get('started') && !ipfsStatus.get('spawned'));
        const modalActions = [
            /* eslint-disable */
            <FlatButton
              label={intl.formatMessage(generalMessages.cancel)}
              onTouchTap={this.handleModalClose}
            />,
            <FlatButton
              label={intl.formatMessage(generalMessages.submit)}
              primary
              onTouchTap={this.handleLogin}
              disabled={isServiceStopped}
            />
            /* eslint-enable */
        ];
        const localProfiles = this._getLocalProfiles();
        const selectedProfile = this.state.selectedProfile;
        return (
          <PanelContainer
            showBorder
            style={style}
            header={<PanelHeader title={intl.formatMessage(setupMessages.logInTitle)} />}
            actions={[
                /* eslint-disable */
                <RaisedButton
                  key="backup"
                  label={intl.formatMessage(generalMessages.backup)}
                //   onClick={utilsActions.backupKeys}
                  disabled={backupPending}
                />,
                <RaisedButton
                  key="createNewIdentity"
                  label={intl.formatMessage(generalMessages.createNewIdentityLabel)}
                  primary
                  style={{ marginLeft: '10px' }}
                  onMouseUp={this._handleIdentityCreate}
                />
                /* eslint-enable */
            ]}
          >
            <div style={{ width: '100%', padding: '12px 24px' }}>
              {gethStatus.get('api') && (ipfsStatus.get('started') || ipfsStatus.get('spawned')) ?
                <List className="col-xs-12">
                  {localProfiles}
                </List> :
                <div> {this.getPlaceholderMessage()} </div>
              }
              {this.state.selectedProfile &&
                <LoginDialog
                  profile={selectedProfile}
                  cleanUserSettings={settingsActions.cleanUserSettings}
                  getUserSettings={settingsActions.getUserSettings}
                  isOpen={openModal}
                  modalActions={modalActions}
                  title={intl.formatMessage(setupMessages.logInTitle)}
                  onPasswordChange={this._handlePasswordChange}
                  onKeyPress={this._handleDialogKeyPress}
                  onUnlockTimerChange={this._handleUnlockTimerChange}
                  onUnlockCheck={this._handleUnlockCheck}
                  unlockTimerKey={this.state.unlockTimer}
                  isUnlockedChecked={this.state.unlockIsChecked}
                  loginErrors={this.props.loginErrors}
                />
                }
            </div>
          </PanelContainer>
        );
    }
// }

// Auth.propTypes = {
//     backupPending: PropTypes.bool,
//     fetchingLocalProfiles: PropTypes.bool,
//     gethStatus: PropTypes.shape().isRequired,
//     intl: PropTypes.shape(),
//     ipfsStatus: PropTypes.shape().isRequired,
//     localProfiles: PropTypes.shape().isRequired,
//     localProfilesFetched: PropTypes.bool,
//     loggedProfile: PropTypes.shape().isRequired,
//     loginErrors: PropTypes.shape().isRequired,
//     passwordPreference: PropTypes.shape(),
//     profileActions: PropTypes.shape().isRequired,
//     settingsActions: PropTypes.shape(),
//     style: PropTypes.shape(),
//     tempProfile: PropTypes.shape().isRequired,
//     tempProfileActions: PropTypes.shape().isRequired,
//     utilsActions: PropTypes.shape()
// };

// Auth.contextTypes = {
//     muiTheme: PropTypes.shape(),
//     router: PropTypes.shape()
// };

// Auth.defaultProps = {
//     style: {
//         width: '100%',
//         height: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         position: 'relative'
//     }
};

export default injectIntl(Auth);

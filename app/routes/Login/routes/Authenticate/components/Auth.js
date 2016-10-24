import React, { Component } from 'react';
import {
    List,
    ListItem,
    FlatButton,
    RaisedButton,
    Avatar } from 'material-ui';
import { hashHistory } from 'react-router';
import { injectIntl } from 'react-intl';
import { LoginDialog, PanelContainer } from 'shared-components';
import { setupMessages, generalMessages } from 'locale-data/messages'; /* eslint import/no-unresolved: 0*/
import LoginHeader from '../../../components/LoginHeader';

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
    componentWillMount () {
        const { profileActions, tempProfileActions } = this.props;
        tempProfileActions.getTempProfile();
        profileActions.clearLoggedProfile();
        profileActions.getLocalProfiles();
    }
    componentWillReceiveProps (nextProps) {
        const {
            profileActions,
            tempProfile,
            localProfiles,
            loggedProfile,
            loginErrors } = nextProps;

        if (loginErrors.size === 0) {
            if (this.state.selectedProfile &&
                loggedProfile.get('account') === this.state.selectedProfile.get('ethAddress')) {
                this.context.router.push(`/${this.state.selectedProfile.get('username')}`);
            }

            if (tempProfile.get('username') !== '') {
                return this.context.router.push('/authenticate/new-profile-status');
            }
        }
        if ((localProfiles.size > 0)) {
            profileActions.getProfileData(localProfiles.toJS());
        }
        return null;
    }
    handleTouchTap = (index) => {
        const { localProfiles } = this.props;
        const selectedProfile = localProfiles.get(index);
        this.setState({ openModal: true, selectedProfile });
    };
    handleModalClose = () => {
        this.setState(({ openModal: false }));
    };
    handleLogin = () => {
        const { profileActions } = this.props;
        const selectedProfile = this.state.selectedProfile;
        let unlockInterval = 1;
        if (this.state.unlockIsChecked) {
            unlockInterval = this.state.unlockTimer;
        }
        profileActions.login({
            account: selectedProfile.get('ethAddress'),
            password: this.state.password,
            rememberTime: unlockInterval
        });
    };
    _getLocalProfiles () {
        const { localProfiles, profilesFetched, intl } = this.props;
        if (localProfiles.size === 0 && profilesFetched) {
            return <div>{intl.formatMessage(setupMessages.noProfilesFound)}</div>;
        }
        if (localProfiles.size === 0 && !profilesFetched) {
            return <div>{intl.formatMessage(setupMessages.findingProfiles)}</div>;
        }
        return localProfiles.map((profile, index) => {
            const profileAddress = profile.get('ethAddress');
            const profileName = `${profile.get('firstName')} ${profile.get('lastName')}`;
            const userInitials = profileName.match(/\b\w/g);
            const avatarImage = profile.get('avatar');
            let avtr;
            if (avatarImage) {
                avtr = (
                  <Avatar src={avatarImage} size={48} style={{top: '12px', border: '1px solid #bcbcbc'}}/>
                );
            } else {
                avtr = (
                  <Avatar>
                    {userInitials &&
                      ((userInitials.shift() || '') + (userInitials.pop() || '')).toUpperCase()
                    }
                    {!userInitials && profile.get('username') &&
                        profile.get('username')
                    }
                  </Avatar>
                );
            }
            return (
              <ListItem
                key={index}
                leftAvatar={avtr}
                primaryText={
                  <div
                    style={{
                        marginLeft: 16,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}
                  >
                    <b>{profileName}</b>
                  </div>
                }
                secondaryText={
                  <div style={{ marginLeft: 16 }}>
                    @{profile.get('username')}
                  </div>
                }
                secondaryTextLines={1}
                value={profileAddress}
                onTouchTap={() => this.handleTouchTap(index)}
                className="col-xs-12"
                style={{ border: '1px solid #DDD', marginBottom: 8 }}
              />
            );
        });
    }
    _handleIdentityCreate = (ev) => {
        ev.preventDefault();
        hashHistory.push('authenticate/new-profile');
    };
    _handlePasswordChange = (ev) => {
        ev.preventDefault();
        const { profileActions } = this.props;
        profileActions.clearErrors();
        this.setState({
            password: ev.target.value
        });
    };
    _handleDialogKeyPress = (ev) => {
        if (ev.charCode === 13) {
            this.handleLogin();
        }
    };
    _handleUnlockTimerChange = (key, payload) => {
        this.setState({
            unlockTimer: payload,
        });
    };
    _handleUnlockCheck = (isUnlocked) => {
        this.setState({
            unlockIsChecked: isUnlocked
        });
    };
    render () {
        const { style, intl } = this.props;
        const { openModal } = this.state;
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
            />
            /* eslint-enable */
        ];
        const localProfiles = this._getLocalProfiles();
        const selectedProfile = this.state.selectedProfile;
        // console.log(selectedProfile.toJS(), 'selectedProfile');
        return (
          <PanelContainer
            showBorder
            style={style}
            header={<LoginHeader title={intl.formatMessage(setupMessages.logInTitle)} />}
            actions={[
                /* eslint-disable */
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
            <List className="col-xs-12">
              {localProfiles}
            </List>
            {this.state.selectedProfile &&
              <LoginDialog
                profile={selectedProfile}
                isOpen={openModal}
                modalActions={modalActions}
                title={'Log In'}
                onPasswordChange={this._handlePasswordChange}
                onKeyPress={this._handleDialogKeyPress}
                onUnlockTimerChange={this._handleUnlockTimerChange}
                onUnlockCheck={this._handleUnlockCheck}
                unlockTimerKey={this.state.unlockTimer}
                isUnlockedChecked={this.state.unlockIsChecked}
                errors={this.props.loginErrors}
              />
            }
          </PanelContainer>
        );
    }
}

Auth.propTypes = {
    profileActions: React.PropTypes.shape().isRequired,
    tempProfileActions: React.PropTypes.shape().isRequired,
    tempProfile: React.PropTypes.shape().isRequired,
    localProfiles: React.PropTypes.shape().isRequired,
    profilesFetched: React.PropTypes.bool,
    loggedProfile: React.PropTypes.shape().isRequired,
    loginErrors: React.PropTypes.shape().isRequired,
    style: React.PropTypes.shape(),
    intl: React.PropTypes.shape()
};

Auth.contextTypes = {
    muiTheme: React.PropTypes.object,
    router: React.PropTypes.object
};

Auth.defaultProps = {
    style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
    }
};

export default injectIntl(Auth);

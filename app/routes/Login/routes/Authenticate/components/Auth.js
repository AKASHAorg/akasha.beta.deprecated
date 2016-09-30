import React, { Component } from 'react';
import {
    List,
    ListItem,
    FlatButton,
    RaisedButton } from 'material-ui';
import { hashHistory } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Avatar, LoginDialog, PanelContainer } from 'shared-components';
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
        const { profileActions } = this.props;
        profileActions.getTempProfile();
    }
    componentDidMount () {
        const { profileActions } = this.props;
        profileActions.getLocalProfiles();
    }
    componentWillUpdate = (nextProps) => {
        const { tempProfile } = nextProps;
        if (tempProfile.get('username') !== '') {
            return this.context.router.push('/authenticate/new-profile-status');
        }
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
        const selectedProfile = this.state.selectedProfile.toJS();
        selectedProfile.password = this.state.password;
        let unlockInterval = 0;
        if (this.state.unlockIsChecked) {
            unlockInterval = this.state.unlockTimer;
        }
        profileActions.login(selectedProfile, unlockInterval, false);
    };
    _getLocalProfiles () {
        const { localProfiles, intl } = this.props;
        if (localProfiles.size === 0) {
            return <div>{intl.formatMessage(setupMessages.noProfilesFound)}</div>;
        }
        if (localProfiles.first().size <= 2) {
            return <div>{intl.formatMessage(setupMessages.findingProfiles)}</div>;
        }
        return localProfiles.map((profile, index) => {
            const profileAddress = profile.get('address');
            const optionalData = profile.get('optionalData');
            const profileName = `${profile.get('firstName')} ${profile.get('lastName')}`;
            const avatarProps = {
                editable: false,
                userName: profileName,
                image: optionalData ?
                    `data:image/gif;base64,${
                        btoa(String.fromCharCode.apply(null, optionalData.get('avatar')))
                        }` : null,
                radius: 48,
                className: 'col-xs-4 middle-xs',
                userInitialsStyle: { fontSize: 18 }
            };
            return (
              <ListItem
                key={index}
                leftAvatar={
                  <Avatar {...avatarProps} />
                }
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
                    {profile.get('userName')}
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
              />
            }
          </PanelContainer>
        );
    }
}

Auth.propTypes = {
    profileActions: React.PropTypes.shape().isRequired,
    tempProfile: React.PropTypes.shape().isRequired,
    localProfiles: React.PropTypes.shape().isRequired,
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

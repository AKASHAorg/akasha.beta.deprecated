import React, { Component } from 'react';
import {
    List,
    ListItem,
    FlatButton,
    RaisedButton } from 'material-ui';
import Avatar from '../ui/avatar/avatar-editor';
import LoginDialog from '../ui/dialogs/login-dialog';
import LoginHeader from '../../components/ui/partials/LoginHeader';
import { hashHistory } from 'react-router';
import { FormattedMessage, injectIntl } from 'react-intl';
import { setupMessages, generalMessages } from '../../locale-data/messages';

class Auth extends Component {

    constructor (props, context) {
        super(props, context);
        this.state = {
            openModal: false,
            selectedIndex: false,
            avatar: {}
        };
    }

    componentWillMount () {
        const { profileActions } = this.props;
        profileActions.checkTempProfile().then(() => {
            profileActions.checkLoggedProfile();
        });
    }

    handleTouchTap = (index) => {
        const { profileState } = this.props;
        const selectedProfile = profileState.get('profiles').get(index);
        this.setState({ openModal: true, selectedProfile });
    };

    handleModalClose = () => {
        this.setState(({ openModal: false }));
    };

    handleLogin = () => {
        const { profileActions } = this.props;
        const selectedProfile = this.state.selectedProfile.toJS();
        selectedProfile.password = this.state.password;
        profileActions.login(selectedProfile);
    };
    _getLocalProfiles () {
        const { profileState } = this.props;
        const profilesList = profileState.get('profiles');
        if (profilesList.size === 0) {
            return <div><FormattedMessage {...setupMessages.noProfilesFound} /></div>;
        }
        if (profilesList.first().size <= 2) {
            return <div>Finding Local Profiles</div>;
        }
        return profileState.get('profiles').map((profile, index) => {
            const profileAddress = profile.get('address');
            const optionalData = profile.get('optionalData');
            const profileName = `${profile.get('firstName')} ${profile.get('lastName')}`;
            // console.log(optionalData.get('avatar'))
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
                    {profile.get('username')}
                  </div>
                }
                secondaryTextLines={1}
                value={profileAddress}
                onTouchTap={() => this.handleTouchTap(index)}
                className="row"
                style={{ border: '1px solid #DDD', marginBottom: 8 }}
              />
            );
        });
    }
    _handleIdentityCreate = (ev) => {
        ev.preventDefault();
        hashHistory.push('new-profile');
    }
    _handlePasswordChange = (ev) => {
        ev.preventDefault();
        this.setState({
            password: ev.target.value
        });
    }
    _handleDialogKeyPress = (ev) => {
        if (ev.charCode === 13) {
            this.handleLogin();
        }
    }
    render () {
        const { style, profileState, intl } = this.props;
        const { openModal } = this.state;
        const modalActions = [
          <FlatButton label="Cancel" onTouchTap={this.handleModalClose} />,
          <FlatButton label="Submit" primary onTouchTap={this.handleLogin} />
        ];
        const localProfiles = this._getLocalProfiles();
        const selectedProfile = this.state.selectedProfile;
        return (
          <div style={style} >
            <div className="start-xs" >
              <div
                className="col-xs"
                style={{ flex: 1, padding: 0 }}
              >
                <LoginHeader title={intl.formatMessage(setupMessages.logInTitle)} />
                <div style={{ paddingTop: '30px' }} >
                  <List>
                    {localProfiles}
                  </List>
                </div>
                <div className="col-xs end-xs" >
                  <RaisedButton label={intl.formatMessage(generalMessages.importIdentityLabel)} />
                  <RaisedButton
                    label={intl.formatMessage(generalMessages.createNewIdentityLabel)}
                    primary
                    style={{ marginLeft: '10px' }}
                    onMouseUp={this._handleIdentityCreate}
                  />
                </div>
                {this.state.selectedProfile &&
                  <LoginDialog
                    profile={selectedProfile}
                    isOpen={openModal}
                    modalActions={modalActions}
                    title={'Log In'}
                    onPasswordChange={this._handlePasswordChange}
                    onKeyPress={this._handleDialogKeyPress}
                  />
                }
              </div>
            </div>
          </div>
        );
    }
}

Auth.propTypes = {
    profileActions: React.PropTypes.object.isRequired,
    profileState: React.PropTypes.object.isRequired,
    style: React.PropTypes.object
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



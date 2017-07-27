import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import debounce from 'lodash.debounce';
import { Checkbox, Dialog, FlatButton, MenuItem, SelectField, TextField } from 'material-ui';
import { Avatar } from '../../shared-components';
import { getInitials } from '../../utils/dataModule';
import { formMessages, generalMessages } from '../../locale-data/messages';
import { selectGethStatus, selectIpfsStatus, selectProfileByAccount,
    selectProfileFlag } from '../../local-flux/selectors';
import { hideLoginDialog } from '../../local-flux/actions/app-actions';
import { userSettingsClear, userSettingsRequest,
    userSettingsSave } from '../../local-flux/actions/settings-actions';
import { profileClearLoginErrors, profileLogin } from '../../local-flux/actions/profile-actions';

class LoginDialog extends Component {
    state = {
        password: '',
        unlockTimer: 5,
        unlockIsChecked: false
    };

    componentDidMount () {
        const { account } = this.props;
        this.props.userSettingsRequest(account);
    }

    componentWillReceiveProps (nextProps) {
        const { history, loggedProfile, passwordPreference } = nextProps;
        if (passwordPreference.remember !== this.props.passwordPreference.remember ||
                passwordPreference.time !== this.props.passwordPreference.time) {
            this.setState({
                unlockTimer: passwordPreference.time || 5,
                unlockIsChecked: passwordPreference.remember || false
            });
        }
        if (loggedProfile.get('account')) {
            this.props.hideLoginDialog();
            this.props.userSettingsClear();
            this.props.profileClearLoginErrors();
            history.push('/dashboard');
        }
    }

    handleLogin = debounce(() => {
        const { account } = this.props;
        let unlockInterval = 1;
        if (this.state.unlockIsChecked) {
            unlockInterval = this.state.unlockTimer;
        }
        const passwordPreference = {
            remember: this.state.unlockIsChecked,
            time: this.state.unlockTimer
        };
        this.props.userSettingsSave(account, { passwordPreference });
        this.props.profileLogin({
            account,
            password: this.state.password,
            rememberTime: unlockInterval
        });
    }, 1000, { leading: true, trailing: false });

    handlePasswordChange = (ev) => {
        ev.preventDefault();
        const { loginErrors } = this.props;
        if (loginErrors.size > 0) {
            this.props.profileClearLoginErrors();
        }
        this.setState({
            password: ev.target.value
        });
    };

    handleKeyPress = (ev) => {
        if (ev.key === 'Enter') {
            this.handleLogin();
        }
    };

    handleUnlockTimerChange = (ev, key, payload) => {
        this.setState({
            unlockIsChecked: true,
            unlockTimer: payload,
        });
    };

    handleUnlockCheck = (ev, isUnlocked) => {
        this.setState({
            unlockIsChecked: isUnlocked
        });
    };

    handleCancel = () => {
        this.props.hideLoginDialog();
        this.props.userSettingsClear();
        this.props.profileClearLoginErrors();
    };

    render () {
        const { account, gethStatus, intl, ipfsStatus, loginErrors, loginPending,
            profile } = this.props;
        const { palette } = this.context.muiTheme;
        const { password, unlockTimer, unlockIsChecked } = this.state;
        const userInitials = getInitials(profile.get('firstName'), profile.get('lastName'));
        const avatar = profile.get('avatar');
        const isServiceStopped = !gethStatus.get('api') || gethStatus.get('stopped')
            || (!ipfsStatus.get('started') && !ipfsStatus.get('process'));
        const modalActions = [
            /* eslint-disable react/jsx-indent */
            <FlatButton
              disabled={loginPending}
              label={intl.formatMessage(generalMessages.cancel)}
              onTouchTap={this.handleCancel}
            />,
            <FlatButton
              disabled={isServiceStopped || loginPending}
              label={intl.formatMessage(generalMessages.submit)}
              onTouchTap={this.handleLogin}
              primary
            />
            /* eslint-enable react/jsx-indent */
        ];

        return (
          <Dialog
            actions={modalActions}
            contentStyle={{ width: '620px' }}
            modal
            open
            title={intl.formatMessage(formMessages.logInTitle)}
          >
            <Avatar
              image={avatar}
              size={100}
              userInitials={userInitials}
              userInitialsStyle={{ color: palette.textColor }}
            />
            <div className="row" >
              <div className="col-xs-6" >
                <TextField
                  disabled
                  floatingLabelText={intl.formatMessage(formMessages.name)}
                  fullWidth
                  value={`${profile.get('firstName')} ${profile.get('lastName')}`}
                  style={{ cursor: 'default' }}
                />
              </div>
              <div className="col-xs-6" >
                <TextField
                  disabled
                  floatingLabelText={intl.formatMessage(formMessages.akashaId)}
                  fullWidth
                  value={`${profile.get('akashaId')}`}
                />
              </div>
            </div>
            <TextField
              disabled
              floatingLabelText={intl.formatMessage(formMessages.ethereumAddress)}
              fullWidth
              value={account}
            />
            <TextField
              autoFocus
              errorText={loginErrors.size ? loginErrors.first().message : null}
              errorStyle={{ position: 'absolute', bottom: '-8px' }}
              floatingLabelText={intl.formatMessage(formMessages.passphrase)}
              fullWidth
              onChange={this.handlePasswordChange}
              onKeyPress={this.handleKeyPress}
              type="password"
              value={password}
            />
            <div className="row middle-xs" >
              <div className="col-xs-6" style={{ paddingRight: 0 }} >
                <Checkbox
                  checked={unlockIsChecked}
                  label={intl.formatMessage(formMessages.rememberPassFor)}
                  onCheck={this.handleUnlockCheck}
                />
              </div>
              <div className="col-xs-3 start-xs" style={{ paddingLeft: 0, display: 'flex' }} >
                <SelectField
                  onChange={this.handleUnlockTimerChange}
                  style={{ width: '120px' }}
                  value={unlockTimer}
                >
                  <MenuItem
                    primaryText={intl.formatMessage(generalMessages.minCount, { minutes: 5 })}
                    value={5}
                  />
                  <MenuItem
                    primaryText={intl.formatMessage(generalMessages.minCount, { minutes: 10 })}
                    value={10}
                  />
                  <MenuItem
                    primaryText={intl.formatMessage(generalMessages.minCount, { minutes: 15 })}
                    value={15}
                  />
                  <MenuItem
                    primaryText={intl.formatMessage(generalMessages.minCount, { minutes: 30 })}
                    value={30}
                  />
                  <MenuItem
                    primaryText={intl.formatMessage(generalMessages.hoursCount, { hours: 1 })}
                    value={60}
                  />
                </SelectField>
              </div>
            </div>
          </Dialog>
        );
    }
}

LoginDialog.contextTypes = {
    muiTheme: PropTypes.shape()
};

LoginDialog.propTypes = {
    account: PropTypes.string.isRequired,
    gethStatus: PropTypes.shape().isRequired,
    hideLoginDialog: PropTypes.func.isRequired,
    history: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    ipfsStatus: PropTypes.shape().isRequired,
    loggedProfile: PropTypes.shape().isRequired,
    loginErrors: PropTypes.shape().isRequired,
    loginPending: PropTypes.bool,
    passwordPreference: PropTypes.shape(),
    profile: PropTypes.shape().isRequired,
    profileClearLoginErrors: PropTypes.func.isRequired,
    profileLogin: PropTypes.func.isRequired,
    userSettingsClear: PropTypes.func.isRequired,
    userSettingsRequest: PropTypes.func.isRequired,
    userSettingsSave: PropTypes.func.isRequired
};

function mapStateToProps (state) {
    const account = state.appState.get('showLoginDialog');
    const profile = selectProfileByAccount(state, account);
    return {
        account,
        gethStatus: selectGethStatus(state),
        ipfsStatus: selectIpfsStatus(state),
        loggedProfile: state.profileState.get('loggedProfile'),
        loginErrors: state.profileState.get('loginErrors'),
        loginPending: selectProfileFlag(state, 'loginPending'),
        passwordPreference: state.settingsState.getIn(['userSettings', 'passwordPreference']),
        profile
    };
}

export default connect(
    mapStateToProps,
    {
        hideLoginDialog,
        profileClearLoginErrors,
        profileLogin,
        userSettingsClear,
        userSettingsRequest,
        userSettingsSave
    }
)(withRouter(injectIntl(LoginDialog)));

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import { FlatButton } from 'material-ui';
import { formMessages, generalMessages } from '../../locale-data/messages';
import { profileClearLoginErrors, profileLogin } from '../../local-flux/actions/profile-actions';
import { userSettingsClear, userSettingsRequest,
    userSettingsSave } from '../../local-flux/actions/settings-actions';
import { selectGethStatus, selectIpfsStatus, selectLoggedAccount,
    selectProfileFlag } from '../../local-flux/selectors';
import { Input, RememberPassphrase } from '../';

class LoginForm extends Component {
    state = {
        isChecked: false,
        passphrase: '',
        unlockTime: 5
    };

    componentDidMount () {
        const { account } = this.props;
        this.props.userSettingsRequest(account);
    }

    componentWillReceiveProps (nextProps) {
        const { history, loggedAccount, passwordPreference } = nextProps;
        if (passwordPreference.remember !== this.props.passwordPreference.remember ||
                passwordPreference.time !== this.props.passwordPreference.time) {
            this.setState({
                isChecked: passwordPreference.remember || false,
                unlockTime: passwordPreference.time || 5
            });
        }
        if (loggedAccount) {
            this.props.userSettingsClear();
            this.props.profileClearLoginErrors();
            history.push('/dashboard');
        }
    }

    componentWillUnmount () {
        if (this.props.loginErrors.size) {
            this.props.profileClearLoginErrors();
        }
    }

    handleUnlockCheck = (ev, isUnlocked) => {
        this.setState({
            isChecked: isUnlocked
        });
    };

    handleUnlockTimeChange = (ev, key, payload) => {
        this.setState({
            isChecked: true,
            unlockTime: payload,
        });
    };

    onChange = (ev) => {
        ev.preventDefault();
        const { loginErrors } = this.props;
        if (loginErrors.size > 0) {
            this.props.profileClearLoginErrors();
        }
        this.setState({
            passphrase: ev.target.value
        });
    };

    handleCancel = () => {
        this.props.userSettingsClear();
        this.props.profileClearLoginErrors();
        this.props.onCancel();
    }

    handleLogin = (ev) => {
        ev.preventDefault();
        const { account } = this.props;
        let unlockTime = 1;
        if (this.state.isChecked) {
            unlockTime = this.state.unlockTime;
        }
        const passwordPreference = {
            remember: this.state.isChecked,
            time: this.state.unlockTime
        };
        this.props.userSettingsSave(account, { passwordPreference });
        this.props.profileLogin({
            account,
            password: this.state.passphrase,
            rememberTime: unlockTime
        });
    };

    render () {
        const { account, gethStatus, intl, ipfsStatus, loginErrors, loginPending } = this.props;
        const { palette } = this.context.muiTheme;
        const isServiceStopped = !gethStatus.get('api') || gethStatus.get('stopped')
            || (!ipfsStatus.get('started') && !ipfsStatus.get('process'));

        return (
          <div style={{ marginTop: '16px', overflow: 'hidden' }}>
            <form onSubmit={this.handleLogin}>
              <Input
                disabled
                label={intl.formatMessage(formMessages.ethereumAddress)}
                value={account}
              />
              <Input
                autoFocus
                errorText={loginErrors.size ? loginErrors.first().message : null}
                label={intl.formatMessage(formMessages.passphrase)}
                onChange={this.onChange}
                placeholder={intl.formatMessage(formMessages.passphrasePlaceholder)}
                type="password"
                value={this.state.passphrase}
              />
              <RememberPassphrase
                handleCheck={this.handleUnlockCheck}
                handleTimeChange={this.handleUnlockTimeChange}
                isChecked={this.state.isChecked}
                unlockTime={this.state.unlockTime}
              />
              <div
                style={{ marginTop: '20px', display: 'flex', height: '36px', justifyContent: 'flex-end' }}
              >
                <FlatButton
                  label={intl.formatMessage(generalMessages.cancel)}
                  labelStyle={{ color: palette.disabledColor }}
                  onClick={this.handleCancel}
                />
                <FlatButton
                  disabled={isServiceStopped || loginPending}
                  label={intl.formatMessage(generalMessages.submit)}
                  onClick={this.handleLogin}
                />
              </div>
            </form>
          </div>
        );
    }
}

LoginForm.contextTypes = {
    muiTheme: PropTypes.shape()
};

LoginForm.propTypes = {
    account: PropTypes.string.isRequired,
    gethStatus: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    ipfsStatus: PropTypes.shape().isRequired,
    loggedAccount: PropTypes.string,
    loginErrors: PropTypes.shape().isRequired,
    loginPending: PropTypes.bool,
    onCancel: PropTypes.func.isRequired,
    passwordPreference: PropTypes.shape(),
    profileClearLoginErrors: PropTypes.func.isRequired,
    profileLogin: PropTypes.func.isRequired,
    userSettingsClear: PropTypes.func.isRequired,
    userSettingsRequest: PropTypes.func.isRequired,
    userSettingsSave: PropTypes.func.isRequired
};

function mapStateToProps (state) {
    return {
        gethStatus: selectGethStatus(state),
        ipfsStatus: selectIpfsStatus(state),
        loggedAccount: selectLoggedAccount(state),
        loginErrors: state.profileState.get('loginErrors'),
        loginPending: selectProfileFlag(state, 'loginPending'),
        passwordPreference: state.settingsState.getIn(['userSettings', 'passwordPreference']),
    };
}

export default connect(
    mapStateToProps,
    {
        profileClearLoginErrors,
        profileLogin,
        userSettingsClear,
        userSettingsRequest,
        userSettingsSave
    }
)(withRouter(injectIntl(LoginForm)));

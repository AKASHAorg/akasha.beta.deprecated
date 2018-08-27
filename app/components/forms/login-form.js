import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import { Button, Form, Tooltip } from 'antd';
import { formMessages, generalMessages } from '../../locale-data/messages';
import { profileClearLoginErrors, profileLogin } from '../../local-flux/actions/profile-actions';
import { userSettingsClear, userSettingsRequest,
    userSettingsSave } from '../../local-flux/actions/settings-actions';
import { selectGethStatus, selectIpfsStatus, selectLoggedEthAddress,
    selectProfileFlag } from '../../local-flux/selectors';
import { Input, RememberPassphrase } from '../';

const FormItem = Form.Item;

class LoginForm extends Component {
    state = {
        isChecked: false,
        passphrase: '',
        unlockTime: 5
    };

    componentDidMount () {
        const { ethAddress } = this.props;
        this.props.userSettingsRequest(ethAddress);
    }

    componentWillReceiveProps (nextProps) {
        const { history, loggedEthAddress, passwordPreference } = nextProps;
        if (passwordPreference.remember !== this.props.passwordPreference.remember ||
                passwordPreference.time !== this.props.passwordPreference.time) {
            this.setState({
                isChecked: passwordPreference.remember || false,
                unlockTime: passwordPreference.time || 5
            });
        }
        if (loggedEthAddress) {
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

    handleUnlockCheck = (ev) => {
        this.setState({
            isChecked: ev.target.checked
        });
    };

    handleUnlockTimeChange = (val) => {
        this.setState({
            isChecked: true,
            unlockTime: Number(val),
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
        const { akashaId, ethAddress } = this.props;
        let unlockTime = 1;
        if (this.state.isChecked) {
            unlockTime = this.state.unlockTime;
        }
        const passwordPreference = {
            remember: this.state.isChecked,
            time: this.state.unlockTime
        };
        this.props.userSettingsSave(ethAddress, { passwordPreference });
        this.props.profileLogin({
            ethAddress,
            akashaId,
            password: this.state.passphrase,
            rememberTime: unlockTime
        });
    };
    getLoginButtonState = () => {
        const { loginPending, intl, gethStatus, ipfsStatus } = this.props;
        const isServiceStopped = !gethStatus.get('api') || gethStatus.get('stopped')
            || (!ipfsStatus.get('started') && !ipfsStatus.get('process'));
        let popoverTitle = '';
        if(isServiceStopped) {
            popoverTitle = 'one of the services is stopped';
        }
        if (loginPending) {
            popoverTitle = 'login is in progress';
        }
        return {
            disabled: isServiceStopped || loginPending,
            popoverTitle
        }
    }
    render () {
        const { ethAddress, getInputRef, intl, loginErrors } = this.props;

        return (
          <div className="login-form">
            <Form onSubmit={this.handleLogin}>
              <Input
                label={intl.formatMessage(formMessages.ethereumAddress)}
                readOnly
                size="large"
                value={ethAddress}
              />
              <FormItem
                className="login-form__form-item"
                validateStatus={loginErrors.size ? 'error' : ''}
                help={loginErrors.size ?
                  <span className="input-error">{loginErrors.first().message}</span> :
                  null
                }
              >
                <Input
                  getInputRef={getInputRef}
                  label={intl.formatMessage(formMessages.passphrase)}
                  onChange={this.onChange}
                  placeholder={intl.formatMessage(formMessages.passphrasePlaceholder)}
                  size="large"
                  type="password"
                  value={this.state.passphrase}
                />
              </FormItem>
              <RememberPassphrase
                handleCheck={this.handleUnlockCheck}
                handleTimeChange={this.handleUnlockTimeChange}
                isChecked={this.state.isChecked}
                unlockTime={this.state.unlockTime.toString()}
              />
              <div className="login-form__buttons-wrapper">
                <Button
                  className="login-form__button"
                  onClick={this.handleCancel}
                >
                  {intl.formatMessage(generalMessages.cancel)}
                </Button>
                <Tooltip
                  title={this.getLoginButtonState().popoverTitle}
                  defaultVisible={true}
                  trigger="hover"
                >
                  <Button
                    className="login-form__button"
                    disabled={this.getLoginButtonState().disabled}
                    htmlType="submit"
                    onClick={this.handleLogin}
                    type="primary"
                  >
                    {intl.formatMessage(generalMessages.submit)}
                  </Button>
                </Tooltip>
              </div>
            </Form>
          </div>
        );
    }
}

LoginForm.propTypes = {
    akashaId: PropTypes.string,
    ethAddress: PropTypes.string.isRequired,
    gethStatus: PropTypes.shape().isRequired,
    getInputRef: PropTypes.func.isRequired,
    history: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    ipfsStatus: PropTypes.shape().isRequired,
    loggedEthAddress: PropTypes.string,
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
        loggedEthAddress: selectLoggedEthAddress(state),
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

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import withRouter from 'react-router/withRouter';
import { injectIntl } from 'react-intl';
import { Button, Form, Tooltip, Icon } from 'antd';
import { formMessages, generalMessages } from '../../locale-data/messages';
import { profileClearLoginErrors, profileLogin } from '../../local-flux/actions/profile-actions';
import { userSettingsClear, userSettingsRequest,
    userSettingsSave } from '../../local-flux/actions/settings-actions';
import { selectGethStatus, selectIpfsStatus, selectLoggedEthAddress,
    selectProfileFlag, selectLoginErrors, getPasswordPreference } from '../../local-flux/selectors';
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
        const {intl, gethStatus, ipfsStatus } = this.props;
        const isGethStopped = !gethStatus.get('api') || gethStatus.get('stopped');
        const isIpfsStopped = !ipfsStatus.get('started') && !ipfsStatus.get('process');
        let popoverTitle = '';
        switch (true) {
            case isGethStopped:
                popoverTitle = intl.formatMessage(generalMessages.cannotLoginGethStopped);
                break;
            case isIpfsStopped:
                popoverTitle = intl.formatMessage(generalMessages.cannotLoginIpfsStopped);
                break;
            default:
                break;
        }
        return {
            disabled: isGethStopped || isIpfsStopped,
            popoverTitle
        }
    }
    render () {
        const { ethAddress, getInputRef, intl, loginErrors, loginPending } = this.props;

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
                <Button
                  className="login-form__button"
                  disabled={this.getLoginButtonState().disabled}
                  htmlType="submit"
                  onClick={this.handleLogin}
                  loading={loginPending}
                  type="primary"
                  >
                    {intl.formatMessage(generalMessages.submit)}
                </Button>
              </div>
            </Form>
            {this.getLoginButtonState().popoverTitle &&
              <div className="login-form__warning">
                <Icon type="exclamation-circle-o" />
                {this.getLoginButtonState().popoverTitle}
              </div>
            }
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
        loginErrors: selectLoginErrors(state),
        loginPending: selectProfileFlag(state, 'loginPending'),
        passwordPreference: getPasswordPreference(state),
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

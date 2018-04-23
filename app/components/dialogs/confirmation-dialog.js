import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Button, Form, Modal } from 'antd';
import * as actionTypes from '../../constants/action-types';
import { actionDelete, actionPublish, actionAdd } from '../../local-flux/actions/action-actions';
import { profileClearLoginErrors, profileLogin } from '../../local-flux/actions/profile-actions';
import { userSettingsSave } from '../../local-flux/actions/settings-actions';
import { selectNeedAuthAction, selectProfileFlag, selectTokenExpiration } from '../../local-flux/selectors';
import { confirmationMessages, formMessages, generalMessages } from '../../locale-data/messages';
import { Input, RememberPassphrase } from '../';
import { getDisplayName } from '../../utils/dataModule';

const FormItem = Form.Item;

class ConfirmationDialog extends Component {
    constructor (props) {
        super(props);
        this.state = {
            userPassword: '',
            unlockTimer: props.passwordPreference.time || 5,
            unlockIsChecked: props.passwordPreference.remember || false,
            userIsLoggedIn: Date.parse(props.tokenExpiration) - 3000 > Date.now()
        };
    }

    componentDidMount () {
        if (this.state.userIsLoggedIn) {
            this.focusTimeout = setTimeout(this.focusSubmitButton, 100);
        } else {
            this.focusTimeout = setTimeout(this.focusInput, 100);
        }
    }

    componentWillUnmount () {
        if (this.focusTimeout) {
            clearTimeout(this.focusTimeout);
        }
    }

    focusSubmitButton = () => {
        const button = document.getElementById('confirmation__submit-button');
        if (button) {
            button.focus();
        }
        this.focusTimeout = null;
    };

    focusInput = () => {
        const input = document.getElementById('confirmation__input');
        if (input) {
            input.focus();
        }
        this.focusTimeout = null;
    };

    onRememberPasswordToggle = () => {
        this.setState({
            unlockIsChecked: !this.state.unlockIsChecked
        });
    };

    onPasswordChange = (ev) => {
        const { loginErrors } = this.props;
        if (loginErrors.size > 0) {
            this.props.profileClearLoginErrors();
        }
        this.setState({
            userPassword: ev.target.value
        });
    };

    onunlockTimerChange = (val) => {
        this.setState({
            unlockIsChecked: true,
            unlockTimer: Number(val)
        });
    }

    onSubmit = () => {
        const { loggedProfile, tokenExpiration, needAuth } = this.props;
        const isLoggedIn = Date.parse(tokenExpiration) - 3000 > Date.now();
        if (isLoggedIn) {
            this.props.actionPublish(needAuth);
        } else if (this.state.userIsLoggedIn) {
            this.setState({ userIsLoggedIn: Date.parse(tokenExpiration) - 3000 > Date.now() });
        } else {
            const { unlockIsChecked, unlockTimer, userPassword } = this.state;
            const ethAddress = loggedProfile.get('ethAddress');
            const akashaId = loggedProfile.get('akashaId');
            const rememberTime = unlockIsChecked ? unlockTimer : 1;
            const passwordPreference = { remember: unlockIsChecked, time: unlockTimer };
            this.props.userSettingsSave(ethAddress, { passwordPreference });
            this.props.profileLogin({
                akashaId, ethAddress, password: userPassword, reauthenticate: true, rememberTime
            });
        }
    };

    handleCancel = () => {
        const { action } = this.props;
        this.props.profileClearLoginErrors();
        this.props.actionDelete(action.get('id'));
    };

    handleSubmit = (ev) => {
        ev.preventDefault();
        this.onSubmit();
    };

    handleKeyPress = (ev) => {
        if (ev.key === 'Enter') {
            this.onSubmit();
        }
    };

    renderFooter = () => {
        const { intl } = this.props;
        return (
          <div className="flex-center-y confirmation__footer">
            <Button className="confirmation__footer-button" onClick={this.handleCancel}>
              <span className="confirmation__button">
                {intl.formatMessage(generalMessages.cancel)}
              </span>
            </Button>
            <Button
              className="confirmation__footer-button"
              id="confirmation__submit-button"
              onClick={this.handleSubmit}
              type="primary"
            >
              <span className="confirmation__button">
                {intl.formatMessage(generalMessages.submit)}
              </span>
            </Button>
          </div>
        );
    };

    render () {
        const { action, intl, loginErrors, loginPending, needAuth } = this.props;
        const actionType = needAuth.substring(needAuth.indexOf('-') + 1);
        const actionTypeTitle = `${actionType}Title`;
        const payload = action.get('payload') ? action.get('payload').toJS() : action.get('payload');
        const types = [actionTypes.follow, actionTypes.sendTip, actionTypes.transferAeth,
            actionTypes.transferEth, actionTypes.unfollow];
        if (types.includes(actionType)) {
            payload.displayName = getDisplayName(payload);
        }
        if (actionType === actionTypes.batch) {
            payload.txCount = payload.actions.length;
        }
        return (
          <Modal
            visible
            title={
              <span className="confirmation__title">
                {intl.formatMessage(confirmationMessages[actionTypeTitle])}
              </span>
            }
            footer={this.renderFooter()}
            maskClosable={false}
            style={{ top: 60, marginRight: 10 }}
            confirmLoading={loginPending}
            wrapClassName="confirmation"
            width={450}
          >
            <div className="confirmation__message">
              {intl.formatMessage(confirmationMessages[actionType], { ...payload })}
            </div>
            {!this.state.userIsLoggedIn &&
              <div>
                <div className="confirmation__message">
                  {intl.formatMessage(confirmationMessages.passphrase)}
                </div>
                <div className="confirmation__login-form">
                  <Form>
                    <FormItem
                      validateStatus={loginErrors.size ? 'error' : ''}
                      help={loginErrors.size ?
                        <span className="input-error">{loginErrors.first().message}</span> :
                            null
                        }
                    >
                      <Input
                        className="confirmation__input"
                        id="confirmation__input"
                        onChange={this.onPasswordChange}
                        placeholder={intl.formatMessage(formMessages.passphrasePlaceholder)}
                        size="large"
                        type="password"
                        value={this.state.userPassword}
                        onKeyPress={this.handleKeyPress}
                      />
                    </FormItem>
                    <RememberPassphrase
                      handleCheck={this.onRememberPasswordToggle}
                      handleTimeChange={this.onunlockTimerChange}
                      isChecked={this.state.unlockIsChecked}
                      unlockTime={this.state.unlockTimer.toString()}
                    />
                  </Form>
                </div>
              </div>
            }
          </Modal>
        );
    }
}

ConfirmationDialog.propTypes = {
    action: PropTypes.shape(),
    actionDelete: PropTypes.func.isRequired,
    actionPublish: PropTypes.func,
    intl: PropTypes.shape(),
    loginPending: PropTypes.bool,
    loggedProfile: PropTypes.shape(),
    loginErrors: PropTypes.shape(),
    needAuth: PropTypes.string,
    passwordPreference: PropTypes.shape(),
    profileClearLoginErrors: PropTypes.func.isRequired,
    profileLogin: PropTypes.func.isRequired,
    tokenExpiration: PropTypes.string,
    userSettingsSave: PropTypes.func.isRequired,
};

function mapStateToProps (state) {
    return {
        action: selectNeedAuthAction(state),
        loginPending: selectProfileFlag(state, 'loginPending'),
        loggedProfile: state.profileState.get('loggedProfile'),
        loginErrors: state.profileState.get('loginErrors'),
        passwordPreference: state.settingsState.getIn(['userSettings', 'passwordPreference']),
        tokenExpiration: selectTokenExpiration(state),
    };
}

export default connect(
    mapStateToProps,
    {
        actionDelete,
        actionPublish,
        actionAdd,
        profileClearLoginErrors,
        profileLogin,
        userSettingsSave
    }
)(withRouter(ConfirmationDialog));

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Form, Modal } from 'antd';
import * as actionTypes from '../../constants/action-types';
import { actionDelete, actionPublish, actionAdd } from '../../local-flux/actions/action-actions';
import { profileClearLoginErrors, profileLogin, profileFaucet } from '../../local-flux/actions/profile-actions';
import { userSettingsSave } from '../../local-flux/actions/settings-actions';
import { selectNeedAuthAction, selectProfileFlag, selectTokenExpiration, selectBalance } from '../../local-flux/selectors';
import { confirmationMessages, formMessages, generalMessages } from '../../locale-data/messages';
import { Input, RememberPassphrase, NoMana, NoEth } from '../';
import { getDisplayName } from '../../utils/dataModule';
import { balanceToNumber } from '../../utils/number-formatter';

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

    componentWillReceiveProps (nextProps) {
        const { action, faucet } = nextProps;
        if (faucet === 'success' && this.props.faucet !== 'success') {
            this.props.actionDelete(action.get('id'));
        }
    }

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
        const { balance, publishingCost, needAuth, action, loggedProfile, faucet } = this.props;
        const actionType = needAuth.substring(needAuth.indexOf('-') + 1);
        const hasEthers = parseFloat(balance.get('eth')) >= 0.12;
        const hasEnoughMana = this._calculateMana(actionType, balance, publishingCost);
        ev.preventDefault();
        if (!hasEthers && (!faucet || faucet === 'error')) {
            this.props.profileFaucet({
                ethAddress: loggedProfile.get('ethAddress'),
                actionId: actionTypes.faucet
            });
            return;
        }
        if (!hasEnoughMana && hasEthers) {
            this.props.actionDelete(action.get('id'));
            window.location.href = 'http://akasha.helpscoutdocs.com/article/21-how-to-manafy-aeth';
            return;
        }
        if (hasEnoughMana && hasEthers) {
            this.onSubmit();
        }
    };

    handleKeyPress = (ev) => {
        if (ev.key === 'Enter') {
            this.onSubmit();
        }
    }

    _calculateMana = (actionType, balance, costs) => {
        const remainingMana = balanceToNumber(balance.getIn(['mana', 'remaining']));
        const entryManaCost = parseFloat(costs.getIn(['entry', 'cost']));
        const commentManaCost = parseFloat(costs.getIn(['comments', 'cost']));
        switch (actionType) {
            case (actionTypes.draftPublish || actionTypes.draftPublishUpdate):
                return remainingMana >= entryManaCost;
            case actionTypes.comment:
                return remainingMana >= commentManaCost;
            default:
                return true;
        }
    }

    render () {
        const { action, intl, loginErrors, loginPending, needAuth,
            balance, publishingCost, faucet } = this.props;
        const actionType = needAuth.substring(needAuth.indexOf('-') + 1);
        const actionTypeTitle = `${actionType}Title`;
        const payload = action.get('payload') ? action.get('payload').toJS() : action.get('payload');
        const types = [actionTypes.follow, actionTypes.sendTip, actionTypes.transferAeth,
            actionTypes.transferEth, actionTypes.unfollow];
        if (types.includes(actionType)) {
            payload.displayName = getDisplayName(payload);
        }
        const hasEthers = parseFloat(balance.get('eth')) >= 0.12;
        const hasEnoughMana = this._calculateMana(actionType, balance, publishingCost);
        return (
          <Modal
            visible
            title={
              <span className="confirmation__title">
                {intl.formatMessage(confirmationMessages[actionTypeTitle])}
              </span>
            }
            okText={
              <span className="confirmation__button">
                {hasEthers && hasEnoughMana && intl.formatMessage(generalMessages.submit)}
                {!hasEthers && intl.formatMessage(generalMessages.requestTestEthers)}
                {!hasEnoughMana && hasEthers && intl.formatMessage(generalMessages.learnMore)}
              </span>
            }
            cancelText={
              <span className="confirmation__button">
                {hasEthers && hasEnoughMana && intl.formatMessage(generalMessages.cancel)}
              </span>
            }
            onOk={this.handleSubmit}
            onCancel={this.handleCancel}
            maskClosable={false}
            style={{ top: 60, marginRight: 10 }}
            confirmLoading={loginPending}
            wrapClassName={`confirmation confirmation${(!hasEthers || !hasEnoughMana) ? '__no-funds' : ''}`}
            width={450}
          >
            {hasEnoughMana && hasEthers &&
              <div className="confirmation__message">
                {intl.formatMessage(confirmationMessages[actionType], { ...payload })}
              </div>
            }
            {!hasEthers &&
              <div className="confirmation__message"><NoEth faucet={faucet} /></div>
            }
            {!hasEnoughMana && hasEthers &&
              <div className="confirmation__message"><NoMana /></div>
            }
            {!this.state.userIsLoggedIn && hasEthers && hasEnoughMana &&
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
                        autoFocus
                        className="confirmation__input"
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
    balance: PropTypes.shape(),
    faucet: PropTypes.string,
    intl: PropTypes.shape(),
    loginPending: PropTypes.bool,
    loggedProfile: PropTypes.shape(),
    loginErrors: PropTypes.shape(),
    needAuth: PropTypes.string,
    passwordPreference: PropTypes.shape(),
    profileClearLoginErrors: PropTypes.func.isRequired,
    profileLogin: PropTypes.func.isRequired,
    profileFaucet: PropTypes.func,
    publishingCost: PropTypes.shape(),
    tokenExpiration: PropTypes.string,
    userSettingsSave: PropTypes.func.isRequired,
};

function mapStateToProps (state) {
    return {
        action: selectNeedAuthAction(state),
        faucet: state.profileState.get('faucet'),
        loginPending: selectProfileFlag(state, 'loginPending'),
        loggedProfile: state.profileState.get('loggedProfile'),
        loginErrors: state.profileState.get('loginErrors'),
        passwordPreference: state.settingsState.getIn(['userSettings', 'passwordPreference']),
        tokenExpiration: selectTokenExpiration(state),
        balance: selectBalance(state),
        publishingCost: state.profileState.get('publishingCost'),
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
        profileFaucet,
        userSettingsSave
    }
)(withRouter(ConfirmationDialog));

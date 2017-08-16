import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextField, Dialog, RaisedButton, Checkbox, SelectField, MenuItem } from 'material-ui';
import { toggleAuthDialog } from '../../local-flux/actions/app-actions';
import { actionDelete } from '../../local-flux/actions/action-actions';
import { profileClearLoginErrors, profileLogin } from '../../local-flux/actions/profile-actions';
import { userSettingsSave } from '../../local-flux/actions/settings-actions';
import { selectNeedAuthAction } from '../../local-flux/selectors';
import { formMessages, generalMessages } from '../../locale-data/messages';

class AuthDialog extends Component {

    constructor (props) {
        super(props);
        this.state = {
            userPassword: '',
            unlockTimer: props.passwordPreference.time || 5,
            unlockIsChecked: props.passwordPreference.remember || false
        };
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

    onunlockTimerChange = (ev, index, value) => {
        this.setState({
            unlockIsChecked: true,
            unlockTimer: value
        });
    }

    onSubmit = () => {
        const { loggedProfile } = this.props;
        const { unlockIsChecked, unlockTimer, userPassword } = this.state;
        const account = loggedProfile.get('account');
        const akashaId = loggedProfile.get('akashaId');
        const profile = loggedProfile.get('profile');
        const rememberTime = unlockIsChecked ? unlockTimer : 1;
        const passwordPreference = { remember: unlockIsChecked, time: unlockTimer };
        this.props.userSettingsSave(loggedProfile.get('account'), { passwordPreference });
        this.props.profileLogin({
            account, akashaId, password: userPassword, profile, reauthenticate: true, rememberTime
        });
    };

    onCancel = () => {
        const { action } = this.props;
        this.props.profileClearLoginErrors();
        this.props.actionDelete(action.get('id'));
        this.props.toggleAuthDialog();
    };

    handleSubmit = (ev) => {
        ev.preventDefault();
        this.onSubmit();
    };

    render () {
        const { intl, loginErrors } = this.props;

        const dialogActions = [
          <RaisedButton // eslint-disable-line
            label={intl.formatMessage(generalMessages.cancel)}
            style={{ marginRight: 8 }}
            onTouchTap={this.onCancel}
          />,
          <RaisedButton // eslint-disable-line
            label={intl.formatMessage(generalMessages.confirm)}
            primary
            onTouchTap={this.onSubmit}
          />
        ];
        return (
          <Dialog
            contentStyle={{ width: '40%', maxWidth: '520px' }}
            actions={dialogActions}
            title={intl.formatMessage(formMessages.confirmPassphrase)}
            open
          >
            <form onSubmit={this.handleSubmit}>
              <div>{intl.formatMessage(formMessages.confirmPassphraseToContinue)}</div>
              <TextField
                autoFocus
                errorText={loginErrors.size ? loginErrors.first().message : null}
                floatingLabelText={intl.formatMessage(formMessages.passphrase)}
                fullWidth
                onChange={this.onPasswordChange}
                type="password"
                value={this.state.userPassword}
              />
              <div className="row middle-xs">
                <div className="col-xs-8" style={{ paddingRight: 0 }}>
                  <Checkbox
                    label={intl.formatMessage(formMessages.rememberPassFor)}
                    checked={this.state.unlockIsChecked}
                    onCheck={this.onRememberPasswordToggle}
                  />
                </div>
                <div className="col-xs-3 start-xs" style={{ paddingLeft: 0, display: 'flex' }}>
                  <SelectField
                    onChange={this.onunlockTimerChange}
                    style={{ width: '120px' }}
                    value={this.state.unlockTimer}
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
            </form>
          </Dialog>
        );
    }
}

AuthDialog.propTypes = {
    action: PropTypes.shape(),
    actionDelete: PropTypes.func.isRequired,
    intl: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    loginErrors: PropTypes.shape(),
    passwordPreference: PropTypes.shape(),
    profileClearLoginErrors: PropTypes.func.isRequired,
    profileLogin: PropTypes.func.isRequired,
    toggleAuthDialog: PropTypes.func.isRequired,
    userSettingsSave: PropTypes.func.isRequired,
};

function mapStateToProps (state) {
    return {
        action: selectNeedAuthAction(state),
        loggedProfile: state.profileState.get('loggedProfile'),
        loginErrors: state.profileState.get('errors').filter(err => err.get('type') === 'login'),
        passwordPreference: state.settingsState.getIn(['userSettings', 'passwordPreference']),
        showAuthDialog: state.appState.get('showAuthDialog'),
    };
}

export default connect(
    mapStateToProps,
    {
        actionDelete,
        profileClearLoginErrors,
        profileLogin,
        toggleAuthDialog,
        userSettingsSave
    }
)(AuthDialog);

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TextField, Dialog, RaisedButton, Checkbox, SelectField, MenuItem } from 'material-ui';
import debounce from 'lodash.debounce';
import { AppActions, ProfileActions, SettingsActions } from '../../local-flux';
import { formMessages, generalMessages } from '../../locale-data/messages';

class AuthDialog extends Component {
    state = {
        userPassword: '',
        rememberTime: 5,
        rememberChecked: false
    };

    componentWillMount () {
        const { passwordPreference } = this.props;
        this.setState({
            rememberChecked: passwordPreference.remember,
            rememberTime: passwordPreference.time || 5
        });
    }

    onRememberPasswordToggle = () => {
        this.setState({
            rememberChecked: !this.state.rememberChecked
        });
    };

    onPasswordChange = (ev) => {
        const { loginErrors, profileActions } = this.props;
        if (loginErrors.size > 0) {
            profileActions.clearErrors();
        }
        this.setState({
            userPassword: ev.target.value
        });
    };

    onRememberTimeChange = (ev, index, value) => {
        this.setState({
            rememberChecked: true,
            rememberTime: value
        });
    }

    onSubmit = debounce(() => {
        const { loggedProfile, profileActions, settingsActions } = this.props;
        const { rememberTime, userPassword, rememberPasswordChecked } = this.state;
        const account = loggedProfile.get('account');
        const akashaId = loggedProfile.get('akashaId');
        const remember = rememberPasswordChecked ? rememberTime : 1;
        const passwordPreference = { remember: rememberPasswordChecked, time: rememberTime };
        settingsActions.savePasswordPreference(passwordPreference);
        profileActions.login({
            account, password: userPassword, rememberTime: remember, akashaId, reauthenticate: true
        });
    }, 1000, { leading: true, trailing: false });

    onCancel = () => {
        const { appActions, profileActions, showAuthDialog } = this.props;
        profileActions.clearLoginErrors();
        appActions.deletePendingAction(showAuthDialog);
        appActions.hideAuthDialog();
    };

    handleSubmit = (ev) => {
        ev.preventDefault();
        this.onSubmit();
    };

    render () {
        const { intl, loginErrors } = this.props;

        const dialogActions = [
          <RaisedButton // eslint-disable-line indent
            label={intl.formatMessage(generalMessages.cancel)}
            style={{ marginRight: 8 }}
            onTouchTap={this.onCancel}
          />,
          <RaisedButton // eslint-disable-line indent
            label={intl.formatMessage(generalMessages.confirm)}
            primary
            onTouchTap={this.onSubmit}
          />
        ];
        const minute = 'min';
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
                fullWidth
                floatingLabelText={intl.formatMessage(formMessages.passphrase)}
                autoFocus
                onChange={this.onPasswordChange}
                type="password"
                value={this.state.userPassword}
                errorText={loginErrors.size ? loginErrors.first().message : null}
              />
              <div className="row middle-xs">
                <div className="col-xs-8" style={{ paddingRight: 0 }}>
                  <Checkbox
                    label={intl.formatMessage(formMessages.rememberPassFor)}
                    checked={this.state.rememberChecked}
                    onCheck={this.onRememberPasswordToggle}
                  />
                </div>
                <div className="col-xs-3 start-xs" style={{ paddingLeft: 0, display: 'flex' }}>
                  <SelectField
                    value={this.state.rememberTime}
                    style={{ width: 120 }}
                    onChange={this.onRememberTimeChange}
                  >
                    <MenuItem value={5} primaryText={`5 ${minute}`} />
                    <MenuItem value={10} primaryText={`10 ${minute}`} />
                    <MenuItem value={15} primaryText={`15 ${minute}`} />
                    <MenuItem value={30} primaryText={`30 ${minute}`} />
                    <MenuItem value={60} primaryText="1 hour" />
                  </SelectField>
                </div>
              </div>
            </form>
          </Dialog>
        );
    }
}

AuthDialog.propTypes = {
    appActions: PropTypes.shape(),
    intl: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    loginErrors: PropTypes.shape(),
    passwordPreference: PropTypes.shape(),
    profileActions: PropTypes.shape(),
    settingsActions: PropTypes.shape(),
    showAuthDialog: PropTypes.number,
};

function mapStateToProps (state) {
    return {
        loggedProfile: state.profileState.get('loggedProfile'),
        loginErrors: state.profileState.get('errors').filter(err => err.get('type') === 'login'),
        passwordPreference: state.settingsState.getIn(['userSettings', 'passwordPreference']),
        showAuthDialog: state.appState.get('showAuthDialog'),
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        profileActions: new ProfileActions(dispatch),
        settingsActions: new SettingsActions(dispatch),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthDialog);

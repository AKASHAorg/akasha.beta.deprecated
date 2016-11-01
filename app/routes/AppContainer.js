import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { SettingsActions, AppActions, ProfileActions, EProcActions } from 'local-flux';
import { getMuiTheme } from 'material-ui/styles';
import { Snackbar } from 'material-ui';
import { AuthDialog, ConfirmationDialog } from 'shared-components';
import { notificationMessages } from 'locale-data/messages';

import lightTheme from '../layouts/AkashaTheme/lightTheme';
import darkTheme from '../layouts/AkashaTheme/darkTheme';

class App extends Component {
    constructor (props) {
        super(props);
        this.state = {
            userPassword: '',
            rememberPasswordChecked: false,
            rememberTime: 5,
            voteWeight: 1,
            theme: props.theme,
            notification: ''
        };
    }
    getChildContext = () => {
        return {
            muiTheme: getMuiTheme(this.state.theme === 'light' ? lightTheme : darkTheme)
        };
    };
    componentWillMount () {
        const { eProcActions, settingsActions } = this.props;
        eProcActions.registerStopGethListener();
        eProcActions.registerStopIpfsListener();
        settingsActions.getSettings('general');
    }
    componentDidMount () {
        const { appActions, eProcActions } = this.props;
        const timestamp = new Date().getTime();
        appActions.setTimestamp(timestamp);
        setTimeout(() => {
            eProcActions.getGethOptions();
            eProcActions.getIpfsConfig();
        }, 0);
    }
    componentWillReceiveProps (nextProps) {
        const { intl } = nextProps;
        const showAuthDialog = nextProps.appState.get('showAuthDialog');
        const notifications = nextProps.profileState.get('notifications').toJS();
        if (nextProps.theme !== this.props.theme) {
            this.setState({
                theme: nextProps.theme
            });
        }
        if (!showAuthDialog && this.props.appState.get('showAuthDialog')) {
            this.setState({
                rememberPasswordChecked: false,
                rememberTime: 5,
                userPassword: ''
            });
        }
        const notification = Object.keys(notifications).find(key => notifications[key] === true);
        if (notification) {
            this.setState({
                notification: intl.formatMessage(notificationMessages[notification])
            });
            nextProps.profileActions.hideNotification(notification);
        }
    }
    hideNotification = () => {
        this.setState({
            notification: ''
        });
    }
    _handleSendReport = () => {
    };
    _handleErrorClose = () => {
        const { appActions } = this.props;
        appActions.clearErrors();
    };
    _handleConfirmation = () => {
        const { profileState, profileActions } = this.props;
        const { rememberTime, userPassword, rememberPasswordChecked } = this.state;
        const account = profileState.get('loggedProfile').get('account');
        const remember = rememberPasswordChecked ? rememberTime : 1;
        profileActions.login({
            account, password: userPassword, rememberTime: remember, reauthenticate: true
        });
    };
    _setRememberPassword = () => {
        this.setState({
            rememberPasswordChecked: !this.state.rememberPasswordChecked
        });
    };
    _setPassword = (ev) => {
        const { profileState, profileActions } = this.props;
        if (profileState.get('errors').size > 0) {
            profileActions.clearErrors();
        }
        this.setState({
            userPassword: ev.target.value
        });
    };
    _setRememberTime = (ev, index, value) => {
        this.setState({
            rememberTime: value
        });
    };
    _handleCancellation = () => {
        const { appActions } = this.props;
        appActions.hideAuthDialog();
    };
    _handleVoteWeightChange = (ev, index, value) => {
        this.setState({
            voteWeight: value
        });
    };
    _handleConfirmationDialogCancel = () => {
        const { appActions } = this.props;
        appActions.hideConfirmationDialog();
        this.setState({
            voteWeight: 1
        });
    };
    _handleConfirmationDialogConfirm = (ev, actionType, entryAddress) => {
        const { voteWeight } = this.state;
        console.log('cast', actionType, 'of', voteWeight, 'to', entryAddress);
        this.setState({
            voteWeight: 1
        });
    };
    render () {
        const { appState, profileState } = this.props;
        const loginErrors = profileState.get('errors');
        const error = appState.get('error');
        const confirmationDialog = appState.get('confirmationDialog');
        const errorMessage = error.get('code')
            ? `Error ${error.get('code')}: ${error.get('message')}` : '';
        const isAuthDialogVisible = appState.get('showAuthDialog');
        const isConfirmationDialogVisible = confirmationDialog !== null;
        return (
          <div className="fill-height" >
            {this.props.children}
            <Snackbar
              style={{ maxWidth: 500 }}
              autoHideDuration={3000}
              action=""
              onActionTouchTap={this._handleSendReport}
              message={this.state.notification}
              open={!!this.state.notification}
              onRequestClose={this.hideNotification}
            />
            <AuthDialog
              password={this.state.userPassword}
              onPasswordChange={this._setPassword}
              rememberChecked={this.state.rememberPasswordChecked}
              onRememberPasswordCheck={this._setRememberPassword}
              rememberTime={this.state.rememberTime}
              onRememberTimeChange={this._setRememberTime}
              isVisible={isAuthDialogVisible}
              onSubmit={this._handleConfirmation}
              onCancel={this._handleCancellation}
              errors={loginErrors}
              loginRequested={profileState.get('loginRequested')}
            />
            <ConfirmationDialog
              isOpen={isConfirmationDialogVisible}
              modalDetails={confirmationDialog}
              onVoteWeightChange={this._handleVoteWeightChange}
              voteWeight={this.state.voteWeight}
              onCancel={this._handleConfirmationDialogCancel}
              onConfirm={this._handleConfirmationDialogConfirm}
            />
          </div>
        );
    }
}
App.propTypes = {
    appState: PropTypes.shape(),
    appActions: PropTypes.shape(),
    eProcActions: PropTypes.shape(),
    profileState: PropTypes.shape(),
    profileActions: PropTypes.shape(),
    settingsActions: PropTypes.shape(),
    theme: PropTypes.string,
    children: PropTypes.element
};
App.contextTypes = {
    router: React.PropTypes.object
};
App.childContextTypes = {
    muiTheme: PropTypes.object
};

function mapStateToProps (state) {
    return {
        appState: state.appState,
        profileState: state.profileState,
        routeState: state.reduxAsyncConnect,
        theme: state.settingsState.get('general').get('theme')
    };
}
function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch),
        settingsActions: new SettingsActions(dispatch),
        appActions: new AppActions(dispatch),
        eProcActions: new EProcActions(dispatch)
    };
}
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(App));

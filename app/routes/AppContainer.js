import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { SettingsActions, AppActions, ProfileActions, EProcActions } from 'local-flux';
import { getMuiTheme } from 'material-ui/styles';
import { Snackbar } from 'material-ui';
import { AuthDialog, ConfirmationDialog } from 'shared-components';

import lightTheme from '../layouts/AkashaTheme/lightTheme';
import darkTheme from '../layouts/AkashaTheme/darkTheme';

class App extends Component {
    constructor (props) {
        super(props);
        this.state = {
            userPassword: '',
            voteWeight: 1,
            theme: props.theme
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
        if (nextProps.theme !== this.props.theme) {
            this.setState({
                theme: nextProps.theme
            });
        }
    }
    _handleSendReport = () => {
    };
    _handleErrorClose = () => {
        const { appActions } = this.props;
        appActions.clearErrors();
    };
    _handleConfirmation = () => {
        const { profileState, profileActions, appActions } = this.props;
        const loggedProfile = profileState.get('loggedProfile');
        const address = loggedProfile.get('address');
        const password = this.state.userPassword;
        profileActions.login({ address, password }).then(() => {
            const nextAction = profileState.get('afterAuthAction');
            return appActions[nextAction]();
        });
    };
    _setUnlockInterval = () => {};
    _setPassword = (ev) => {
        this.setState({
            userPassword: ev.target.value
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
        const { appState } = this.props;
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
              action="send report"
              onActionTouchTap={this._handleSendReport}
              message={errorMessage}
              open={(!error.fatal && error.code !== 0)}
              onRequestClose={this._handleErrorClose}
            />
            <AuthDialog
              password={this.state.userPassword}
              onUnlockCheck={this._setUnlockInterval}
              onPasswordChange={this._setPassword}
              isVisible={isAuthDialogVisible}
              onSubmit={this._handleConfirmation}
              onCancel={this._handleCancellation}
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
)(App);

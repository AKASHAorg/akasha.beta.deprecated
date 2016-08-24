import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { SettingsActions, BootstrapBundleActions, AppActions, ProfileActions } from 'local-flux';
import { getMuiTheme } from 'material-ui/styles';
import { Snackbar } from 'material-ui';
import AuthDialog from 'shared-components/Dialogs/auth-dialog';
import AkashaTheme from '../layouts/AkashaTheme';
import DevTools from './DevTools';

class App extends Component {
    constructor (props) {
        super(props);
        this.state = {
            userPassword: ''
        };
    }
    getChildContext () {
        return {
            muiTheme: getMuiTheme(AkashaTheme)
        };
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
    render () {
        const { appState } = this.props;
        const error = appState.get('error');
        const errorMessage = error.get('code')
            ? `Error ${error.get('code')}: ${error.get('message')}` : '';
        const isAuthDialogVisible = appState.get('showAuthDialog');
        return (
          <div className="fill-height" >
            {this.props.children}
            <Snackbar
              style={{ maxWidth: 500 }}
              action="send report"
              onActionTouchTap={this._handleSendReport}
              message={errorMessage}
              open={(this.props.appState.get('error').size > 0)}
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
            {(process.env.NODE_ENV !== 'production') &&
              <DevTools />
            }
          </div>
        );
    }
}
App.propTypes = {
    appState: PropTypes.object,
    appActions: PropTypes.object,
    settingsActions: PropTypes.object,
    bootstrapActions: PropTypes.object,
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
        routeState: state.reduxAsyncConnect
    };
}
function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch),
        settingsActions: new SettingsActions(dispatch),
        appActions: new AppActions(dispatch),
    };
}
export default asyncConnect([{
    promise: ({ store: { dispatch, getState } }) => {
        const bootstrapActions = new BootstrapBundleActions(dispatch);
        return Promise.resolve(bootstrapActions.initApp(getState));
    }
}])(connect(
    mapStateToProps,
    mapDispatchToProps
)(App));

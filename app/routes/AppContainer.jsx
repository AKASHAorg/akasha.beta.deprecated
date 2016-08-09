import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { SettingsActions, BootstrapActions, AppActions } from 'local-flux';
import AkashaTheme from '../layouts/AkashaTheme';
import { getMuiTheme } from 'material-ui/styles';
import { Snackbar } from 'material-ui';

class App extends Component {
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
    render () {
        const { appState } = this.props;
        const error = appState.get('error');
        const errorMessage = error.get('code')
            ? `Error ${error.get('code')}: ${error.get('message')}` : '';
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
                {(process.env.NODE_ENV !== 'production') &&
                React.createElement(require('./DevTools'))
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
        routeState: state.reduxAsyncConnect
    };
}
function mapDispatchToProps (dispatch) {
    return {
        settingsActions: new SettingsActions(dispatch),
        appActions: new AppActions(dispatch),
        bootstrapActions: new BootstrapActions(dispatch),
    };
}
export default asyncConnect([{
    promise: ({ store: { dispatch, getState } }) =>
        Promise.resolve(new BootstrapActions(dispatch).initApp(getState))
}])(connect(
    mapStateToProps,
    mapDispatchToProps
)(App));

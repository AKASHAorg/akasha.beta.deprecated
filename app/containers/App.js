import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { SettingsActions } from '../actions/SettingsActions';
import { AppActions } from '../actions/AppActions';
import AkashaTheme from '../layouts/AkashaTheme';
import { getMuiTheme } from 'material-ui/styles';
import { Snackbar } from 'material-ui';

class App extends Component {
    static propTypes = {
        children: PropTypes.element.isRequired
    };

    static childContextTypes = {
        muiTheme: PropTypes.object
    };
    getChildContext () {
        return {
            muiTheme: getMuiTheme(AkashaTheme)
        };
    }
    componentDidMount () {
        // check if geth settings are already stored
        const { settingsActions, settingsState } = this.props;
        settingsActions.getSettings('geth').then(() => {
            console.log(settingsState);
        });
    }
    _handleSendReport = () => {

    }
    _handleErrorClose = () => {
        const { appActions } = this.props;
        appActions.clearErrors();
    }
    _handleSendReport = () => {

    }
    _handleErrorClose = () => {
        const { appActions } = this.props;
        appActions.clearErrors();
    }
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
    settingsActions: PropTypes.object
};
function mapStateToProps (state) {
    return {
        appState: state.appState
    };
}
function mapDispatchToProps (dispatch) {
    return {
        settingsActions: new SettingsActions(dispatch),
        appActions: new AppActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

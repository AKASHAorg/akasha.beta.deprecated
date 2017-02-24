import React, { Component, PropTypes } from 'react';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { AppActions } from 'local-flux';
import { bootstrapApp } from 'local-flux/actions/app-actions';
import { getMuiTheme } from 'material-ui/styles';
import { AuthDialog, WeightConfirmDialog, PublishConfirmDialog,
    TransferConfirmDialog } from 'shared-components';
import TermsPanel from './components/terms-panel';
import NotificationBar from './components/notification-bar';
import lightTheme from '../layouts/AkashaTheme/lightTheme';
import darkTheme from '../layouts/AkashaTheme/darkTheme';

class App extends Component {
    constructor (props) {
        super(props);
        this.state = {
            theme: props.theme,
        };
    }

    getChildContext = () => ({
        muiTheme: getMuiTheme(this.state.theme === 'light' ? lightTheme : darkTheme)
    });

    componentDidMount () {
        this.props.bootstrapApp();
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.theme !== this.props.theme) {
            this.setState({
                theme: nextProps.theme
            });
        }
    }

    render () {
        const { appState, appActions, intl } = this.props;
        const isAuthDialogVisible = !!appState.get('showAuthDialog');
        const weightConfirmDialog = appState.get('weightConfirmDialog');
        const isWeightConfirmationDialogVisible = weightConfirmDialog !== null;
        const isPublishConfirmationDialogVisible = appState.get('publishConfirmDialog') !== null;
        const isTransferConfirmationDialogVisible = appState.get('transferConfirmDialog') !== null;

        return (
          <div className="fill-height" >
            {this.props.children}
            <NotificationBar
              appState={appState}
              appActions={appActions}
            />
            {isAuthDialogVisible && <AuthDialog intl={intl} />}
            {isWeightConfirmationDialogVisible && <WeightConfirmDialog intl={intl} />}
            {isPublishConfirmationDialogVisible && <PublishConfirmDialog intl={intl} />}
            {isTransferConfirmationDialogVisible && <TransferConfirmDialog intl={intl} />}
            {appState.get('showTerms') && <TermsPanel hideTerms={appActions.hideTerms} />}
            <ReactTooltip delayShow={300} class="generic_tooltip" place="bottom" effect="solid" />
          </div>
        );
    }
}

App.propTypes = {
    appState: PropTypes.shape(),
    appActions: PropTypes.shape(),
    bootstrapApp: PropTypes.func,
    theme: PropTypes.string,
    children: PropTypes.element,
    intl: PropTypes.shape(),
};

App.childContextTypes = {
    muiTheme: PropTypes.shape()
};

function mapStateToProps (state) {
    return {
        appState: state.appState,
        theme: state.settingsState.get('general').get('theme')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        bootstrapApp: () => dispatch(bootstrapApp())
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(injectIntl(App));

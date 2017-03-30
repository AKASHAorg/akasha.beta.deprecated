/* import React, { Component, PropTypes } from 'react';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import Route from 'react-router-dom/Route';
import { injectIntl } from 'react-intl';
import { getMuiTheme } from 'material-ui/styles';
import { AuthDialog, DataLoader, GethDetailsModal, IpfsDetailsModal, PublishConfirmDialog,
    TransferConfirmDialog, WeightConfirmDialog } from 'shared-components';
import { hideNotification, hideTerms } from 'local-flux/actions/app-actions'; // eslint-disable-line import/no-unresolved, import/extensions
import { errorDeleteFatal, errorDeleteNonFatal } from 'local-flux/actions/error-actions'; // eslint-disable-line import/no-unresolved, import/extensions
import TermsPanel from './components/terms-panel';
import NotificationBar from './components/notification-bar';
import ErrorBar from './components/error-bar'; // eslint-disable-line import/no-unresolved, import/extensions
import FatalErrorModal from './components/fatal-error-modal'; // eslint-disable-line import/no-unresolved, import/extensions
import lightTheme from '../layouts/AkashaTheme/lightTheme';
import darkTheme from '../layouts/AkashaTheme/darkTheme';
import CreateProfileContainer from '../containers/create-profile-container';

export class App extends Component {
    constructor (props) {
        super(props);
        this.state = {
            theme: props.theme,
        };
    }

    getChildContext = () => ({
        muiTheme: getMuiTheme(this.state.theme === 'light' ? lightTheme : darkTheme)
    });

    componentWillReceiveProps (nextProps) {
        if (nextProps.theme !== this.props.theme) {
            this.setState({
                theme: nextProps.theme
            });
        }
    }

    render () {
        const { appState, errorDeleteFatal, errorDeleteNonFatal, errorState,
            hideNotification, hideTerms, intl } = this.props;
        const isAuthDialogVisible = !!appState.get('showAuthDialog');
        const weightConfirmDialog = appState.get('weightConfirmDialog');
        const isWeightConfirmationDialogVisible = weightConfirmDialog !== null;
        const isPublishConfirmationDialogVisible = appState.get('publishConfirmDialog') !== null;
        const isTransferConfirmationDialogVisible = appState.get('transferConfirmDialog') !== null;
        const showGethDetailsModal = appState.get('showGethDetailsModal');
        const showIpfsDetailsModal = appState.get('showIpfsDetailsModal');
        return (
          <DataLoader flag={!appState.get('appReady')} size={80} style={{ paddingTop: '-50px' }}>
            <div className="fill-height" >
              {this.props.children}
              <NotificationBar
                hideNotification={hideNotification}
                intl={intl}
                notifications={appState.get('notifications')}
              />
              {!!errorState.get('nonFatalErrors').size &&
                <ErrorBar
                  deleteError={errorDeleteNonFatal}
                  error={errorState.getIn(['byId', errorState.get('nonFatalErrors').first()])}
                  intl={intl}
                />
              }
              {!!errorState.get('fatalErrors').size &&
                <FatalErrorModal
                  deleteError={errorDeleteFatal}
                  error={errorState.getIn(['byId', errorState.get('fatalErrors').first()])}
                  intl={intl}
                />
              }
              {showGethDetailsModal && <GethDetailsModal />}
              {showIpfsDetailsModal && <IpfsDetailsModal />}
              {isAuthDialogVisible && <AuthDialog intl={intl} />}
              {isWeightConfirmationDialogVisible && <WeightConfirmDialog intl={intl} />}
              {isPublishConfirmationDialogVisible && <PublishConfirmDialog intl={intl} />}
              {isTransferConfirmationDialogVisible && <TransferConfirmDialog intl={intl} />}
              {appState.get('showTerms') && <TermsPanel hideTerms={hideTerms} />}
              <ReactTooltip delayShow={300} class="generic_tooltip" place="bottom" effect="solid" />
              <Route path="/new-profile" component={CreateProfileContainer} />
            </div>
          </DataLoader>
        );
    }
}

App.propTypes = {
    appState: PropTypes.shape().isRequired,
    children: PropTypes.element.isRequired,
    errorDeleteFatal: PropTypes.func.isRequired,
    errorDeleteNonFatal: PropTypes.func.isRequired,
    errorState: PropTypes.shape().isRequired,
    hideNotification: PropTypes.func.isRequired,
    hideTerms: PropTypes.func.isRequired,
    intl: PropTypes.shape(),
    theme: PropTypes.string,
};

App.childContextTypes = {
    muiTheme: PropTypes.shape()
};

function mapStateToProps (state) {
    return {
        appState: state.appState,
        errorState: state.errorState,
        theme: state.settingsState.getIn(['general', 'theme'])
    };
}

export default connect(
    mapStateToProps,
    {
        errorDeleteFatal,
        errorDeleteNonFatal,
        hideNotification,
        hideTerms
    }
)(injectIntl(App)); */

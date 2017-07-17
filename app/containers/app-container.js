import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Redirect, Route, Switch } from 'react-router-dom';
import { getMuiTheme } from 'material-ui/styles';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { DataLoader, GethDetailsModal, IpfsDetailsModal, PublishConfirmDialog,
    TransferConfirmDialog, WeightConfirmDialog } from '../shared-components';
import { hideNotification, hideTerms, hideReportModal, bootstrapHome,
    showLoginDialog } from '../local-flux/actions/app-actions';
import { entryVoteCost } from '../local-flux/actions/entry-actions';
import { gethGetStatus } from '../local-flux/actions/external-process-actions';
import { licenseGetAll } from '../local-flux/actions/license-actions';
import { errorDeleteFatal, errorDeleteNonFatal } from '../local-flux/actions/error-actions';
import { AuthContainer, ConfigurationContainer, DashboardPage, EntryPageContainer, NewIdentityContainer,
    SidebarContainer, SynchronizationContainer } from './';
import { AuthDialog, LoginDialog } from '../components/dialogs';
import { DashboardSecondarySidebar, ErrorBar, ErrorReportingModal, FatalErrorModal, NotificationBar,
    PageContent, SecondarySidebar, SetupHeader, TermsPanel, TopBar } from '../components';
import { selectEntryFlag, selectFullEntry } from '../local-flux/selectors';
import lightTheme from '../layouts/AkashaTheme/lightTheme';
import darkTheme from '../layouts/AkashaTheme/darkTheme';

class AppContainer extends Component {
    bootstrappingHome = false;
    // pass previousLocation to Switch when we need to render Entry Page as an overlay
    previousLocation = this.props.location;

    componentDidMount () {
        this._bootstrapApp(this.props);
    }

    componentWillReceiveProps (nextProps) {
        this._bootstrapApp(nextProps);
    }

    componentWillUpdate (nextProps) {
        const { location } = this.props;
        // set previousLocation if props.location is not overlay
        if (nextProps.history.action !== 'POP' &&
            (!location.state || !location.state.overlay)
        ) {
            this.previousLocation = this.props.location;
        }
    }

    // all bootstrapping logic should be here
    // avoid spreading it over multiple components/containers
    _bootstrapApp = (props) => {
        const { location, appState } = props;
        const nonLoginRoutes = ['/setup'];
        const shouldBootstrapHome = !nonLoginRoutes.every(route =>
            location.pathname === '/' || location.pathname.includes(route)
        );

        // when home bootstrapping finishes reset the flag
        if (appState.get('homeReady') && this.bootstrappingHome) {
            this.bootstrappingHome = false;
        }

        // check if wee need to bootstrap home
        if (shouldBootstrapHome && !this.bootstrappingHome && !appState.get('homeReady')) {
            this.props.bootstrapHome();
            this.props.entryVoteCost();
            this.props.licenseGetAll();

            // make requests for geth status every 30s for updating the current block
            this.props.gethGetStatus();
            if (!this.interval) {
                this.interval = setInterval(() => {
                    this.props.gethGetStatus();
                }, 30000);
            }
            this.bootstrappingHome = true;
        }
    }

    componentWillUnmount () {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    render () {
        /* eslint-disable no-shadow */
        const { activeDashboard, appState, errorDeleteFatal, errorDeleteNonFatal, errorState, fullEntry,
            hideNotification, hideTerms, hideReportModal, history, intl, location,
            theme } = this.props;
        /* eslint-enable no-shadow */
        const isAuthDialogVisible = !!appState.get('showAuthDialog');
        const weightConfirmDialog = appState.get('weightConfirmDialog');
        const isWeightConfirmationDialogVisible = weightConfirmDialog !== null;
        const isPublishConfirmationDialogVisible = appState.get('publishConfirmDialog') !== null;
        const isTransferConfirmationDialogVisible = appState.get('transferConfirmDialog') !== null;
        const showGethDetailsModal = appState.get('showGethDetailsModal');
        const showIpfsDetailsModal = appState.get('showIpfsDetailsModal');
        const muiTheme = getMuiTheme(theme === 'light' ? lightTheme : darkTheme);
        const isOverlay = location.state && location.state.overlay && this.previousLocation !== location;
        return (
          <MuiThemeProvider muiTheme={muiTheme}>
            <DataLoader flag={!appState.get('appReady')} size={80} style={{ paddingTop: '100px' }}>
              <div
                className="container fill-height"
                style={{
                    backgroundColor: muiTheme.palette.canvasColor
                }}
              >
                {location.pathname === '/' && <Redirect to="/setup/configuration" />}
                {!location.pathname.startsWith('/setup') &&
                  <DataLoader flag={!appState.get('homeReady')} size={80} style={{ paddingTop: '100px' }}>
                    <div>
                      {activeDashboard && location.pathname === '/dashboard' &&
                        <Redirect to={`/dashboard/${activeDashboard}`} />
                      }
                      <SecondarySidebar>
                        <Route path="/dashboard/:dashboardName?" component={DashboardSecondarySidebar} />
                      </SecondarySidebar>
                      <PageContent>
                        <Switch location={isOverlay ? this.previousLocation : location}>
                          <Route path="/dashboard/:dashboardName?" component={DashboardPage} />
                          <Route path="/@:akashaId/:entryId(\d+)" component={EntryPageContainer} />
                        </Switch>
                        {isOverlay &&
                          <Route path="/@:akashaId/:entryId(\d+)" component={EntryPageContainer} />
                        }
                      </PageContent>
                      <TopBar
                        fullEntryPage={!!fullEntry}
                        location={location}
                        history={history}
                        intl={intl}
                      />
                    </div>
                  </DataLoader>
                }
                <Route path="/setup" component={SetupHeader} />
                <Route path="/setup/configuration" component={ConfigurationContainer} />
                <Route path="/setup/synchronization" component={SynchronizationContainer} />
                <Route path="/setup/authenticate" component={AuthContainer} />
                <Route path="/setup/new-identity" component={NewIdentityContainer} />
                <SidebarContainer {...this.props} />
                {!!appState.get('notifications').size &&
                  <NotificationBar
                    hideNotification={hideNotification}
                    intl={intl}
                    notification={appState.get('notifications').first()}
                  />
                }
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
                <ErrorReportingModal
                  open={!!appState.get('showReportModal')}
                  error={errorState.get('reportError')}
                  intl={intl}
                  onClose={hideReportModal}
                />
                {appState.get('showLoginDialog') && <LoginDialog />}
                {showGethDetailsModal && <GethDetailsModal />}
                {showIpfsDetailsModal && <IpfsDetailsModal />}
                {isAuthDialogVisible && <AuthDialog intl={intl} />}
                {isWeightConfirmationDialogVisible && <WeightConfirmDialog intl={intl} />}
                {isPublishConfirmationDialogVisible && <PublishConfirmDialog intl={intl} />}
                {isTransferConfirmationDialogVisible && <TransferConfirmDialog intl={intl} />}
                {appState.get('showTerms') && <TermsPanel hideTerms={hideTerms} />}
                <ReactTooltip delayShow={300} class="generic-tooltip" place="bottom" effect="solid" />
              </div>
            </DataLoader>
          </MuiThemeProvider>
        );
    }
}

AppContainer.propTypes = {
    activeDashboard: PropTypes.string,
    appState: PropTypes.shape().isRequired,
    bootstrapHome: PropTypes.func,
    entryVoteCost: PropTypes.func,
    errorDeleteFatal: PropTypes.func.isRequired,
    errorDeleteNonFatal: PropTypes.func.isRequired,
    errorState: PropTypes.shape().isRequired,
    fullEntry: PropTypes.bool,
    gethGetStatus: PropTypes.func,
    hideNotification: PropTypes.func.isRequired,
    hideReportModal: PropTypes.func.isRequired,
    hideTerms: PropTypes.func.isRequired,
    history: PropTypes.shape(),
    intl: PropTypes.shape(),
    licenseGetAll: PropTypes.func,
    location: PropTypes.shape().isRequired,
    theme: PropTypes.string,
};

function mapStateToProps (state) {
    return {
        activeDashboard: state.dashboardState.get('activeDashboard'),
        appState: state.appState,
        errorState: state.errorState,
        fullEntry: !!selectFullEntry(state) || !!selectEntryFlag(state, 'fetchingFullEntry'),
        theme: state.settingsState.getIn(['general', 'theme']),
    };
}

export { AppContainer };
export default connect(
    mapStateToProps,
    {
        bootstrapHome,
        entryVoteCost,
        errorDeleteFatal,
        errorDeleteNonFatal,
        gethGetStatus,
        hideNotification,
        hideTerms,
        hideReportModal,
        licenseGetAll,
        showLoginDialog,
    }
)(injectIntl(AppContainer));

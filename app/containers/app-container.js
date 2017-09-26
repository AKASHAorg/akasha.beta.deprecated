import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { notification } from 'antd';
import { Redirect, Route, Switch } from 'react-router-dom';
import { getMuiTheme } from 'material-ui/styles';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { hideTerms, hideReportModal,
    bootstrapHome } from '../local-flux/actions/app-actions';
import { entryVoteCost } from '../local-flux/actions/entry-actions';
import { gethGetStatus } from '../local-flux/actions/external-process-actions';
import { licenseGetAll } from '../local-flux/actions/license-actions';
import { errorDeleteFatal } from '../local-flux/actions/error-actions';
import { DashboardPage, EntryPageContainer, EntrySearchPage,
     TagSearchPage, SidebarContainer, ProfileContainer } from './';
import { AppSettings, ConfirmationDialog, DashboardSecondarySidebar, DataLoader, ErrorNotification,
    ErrorReportingModal, FatalErrorModal, GethDetailsModal, Highlights, IpfsDetailsModal, MyBalance,
    Notification, PageContent, ProfileOverview, ProfileOverviewSecondarySidebar,
    SearchSecondarySidebar, SecondarySidebar, SetupPages, TermsPanel, TopBar } from '../components';
import lightTheme from '../layouts/AkashaTheme/lightTheme';
import darkTheme from '../layouts/AkashaTheme/darkTheme';

notification.config({
    top: 60,
    duration: 0
});

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

    renderNotifications = () => {
        // const { appState, intl } = this.props;
        // const notifications = appState.get('notifications');
        // notifications.forEach((notif) => {
        //     notification.success({
        //         message: 'Success',
        //         description: intl.formatMessage(notificationMessages[notif.get('id')]),
        //         onClose: () => this.props.hideNotification(notif.get('id'))
        //     });
        // });
    };

    render () {
        /* eslint-disable no-shadow */
        const { activeDashboard, appState, errorDeleteFatal, errorState,
            hideTerms, hideReportModal, intl, location, needAuth, theme } = this.props;
        /* eslint-enable no-shadow */
        const showGethDetailsModal = appState.get('showGethDetailsModal');
        const showIpfsDetailsModal = appState.get('showIpfsDetailsModal');
        const muiTheme = getMuiTheme(theme === 'light' ? lightTheme : darkTheme);
        const isOverlay = location.state && location.state.overlay && this.previousLocation !== location;

        return (
          <MuiThemeProvider muiTheme={muiTheme}>
            <DataLoader flag={!appState.get('appReady')} size="large" style={{ paddingTop: '100px' }}>
              <div
                className="container fill-height"
                style={{
                    backgroundColor: muiTheme.palette.canvasColor
                }}
              >
                {location.pathname === '/' && <Redirect to="/setup/configuration" />}
                {location.pathname === '/search' && <Redirect to="/search/entries" />}
                {!location.pathname.startsWith('/setup') &&
                  <DataLoader flag={!appState.get('homeReady')} size="large" style={{ paddingTop: '100px' }}>
                    <div>
                      {activeDashboard && location.pathname === '/dashboard' &&
                        <Redirect to={`/dashboard/${activeDashboard}`} />
                      }
                      <SecondarySidebar>
                        <Route path="/dashboard/:dashboardName?" component={DashboardSecondarySidebar} />
                        <Route path="/profileoverview/:title" component={ProfileOverviewSecondarySidebar} />
                        <Route path="/search/:topic/:query?" component={SearchSecondarySidebar} />
                      </SecondarySidebar>
                      <PageContent>
                        <Route path="/profileoverview/overview" component={ProfileOverview} />
                        <Route path="/profileoverview/mybalance" component={MyBalance} />
                        <Route path="/profileoverview/highlights" component={Highlights} />
                        <Route path="/search/entries/:query?" component={EntrySearchPage} />
                        <Route path="/search/tags/:query?" component={TagSearchPage} />
                        <Switch location={isOverlay ? this.previousLocation : location}>
                          <Route exact path="/@:akashaId" component={ProfileContainer} />
                          <Route path="/dashboard/:dashboardName?" component={DashboardPage} />
                          <Route path="/@:akashaId/:entryId(\d+)" component={EntryPageContainer} />
                        </Switch>
                        {isOverlay &&
                          <div>
                            <Route exact path="/@:akashaId" component={ProfileContainer} />
                            <Route path="/@:akashaId/:entryId(\d+)" component={EntryPageContainer} />
                          </div>
                        }
                      </PageContent>
                      <TopBar />
                    </div>
                  </DataLoader>
                }
                <SidebarContainer {...this.props} />
                <Route path="/setup" component={SetupPages} />
                <Notification />
                <ErrorNotification />
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
                {appState.get('showAppSettings') &&
                  <AppSettings sidebar={!location.pathname.startsWith('/setup')} />
                }
                {showGethDetailsModal && <GethDetailsModal />}
                {showIpfsDetailsModal && <IpfsDetailsModal />}
                {needAuth && <ConfirmationDialog intl={intl} needAuth={needAuth} />}
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
    errorState: PropTypes.shape().isRequired,
    gethGetStatus: PropTypes.func,
    hideReportModal: PropTypes.func.isRequired,
    hideTerms: PropTypes.func.isRequired,
    history: PropTypes.shape(),
    intl: PropTypes.shape(),
    licenseGetAll: PropTypes.func,
    location: PropTypes.shape().isRequired,
    needAuth: PropTypes.string,
    theme: PropTypes.string,
};

function mapStateToProps (state) {
    return {
        activeDashboard: state.dashboardState.get('activeDashboard'),
        appState: state.appState,
        errorState: state.errorState,
        needAuth: state.actionState.get('needAuth'),
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
        gethGetStatus,
        hideTerms,
        hideReportModal,
        licenseGetAll,
    }
)(injectIntl(AppContainer));

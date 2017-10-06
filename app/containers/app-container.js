import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { notification, Modal } from 'antd';
import { Redirect, Route, Switch } from 'react-router-dom';
import { getMuiTheme } from 'material-ui/styles';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { hideTerms, bootstrapHome } from '../local-flux/actions/app-actions';
import { entryVoteCost } from '../local-flux/actions/entry-actions';
import { draftCreate } from '../local-flux/actions/draft-actions';
import { gethGetStatus } from '../local-flux/actions/external-process-actions';
import { licenseGetAll } from '../local-flux/actions/license-actions';
import { errorDeleteFatal } from '../local-flux/actions/error-actions';
import { errorMessages, generalMessages } from '../locale-data/messages';
import { DashboardPage, EntryPageContainer, EntrySearchPage, NewTextEntryPage, NewLinkEntryPage,
    TagSearchPage, SidebarContainer } from './';
import { AppSettings, ConfirmationDialog, DashboardSecondarySidebar, DataLoader, ErrorNotification,
    GethDetailsModal, Highlights, IpfsDetailsModal, MyBalance, MyEntries, NewEntrySecondarySidebar,
    Notification, PageContent, ProfileOverview, ProfileOverviewSecondarySidebar, ProfilePage,
    SearchSecondarySidebar, SecondarySidebar, SetupPages, Terms, TopBar } from '../components';
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
        const { errorState, intl } = nextProps;
        this._bootstrapApp(nextProps);
        if (errorState.get('fatalErrors').size) {
            const error = errorState.getIn(['byId', errorState.get('fatalErrors').first()]);
            const content = error.get('messageId') ?
                intl.formatMessage(errorMessages[error.get('messageId')]) :
                error.get('message');
            const modal = Modal.error({
                content,
                okText: intl.formatMessage(generalMessages.ok),
                onOk: () => { this.props.errorDeleteFatal(); modal.destroy(); },
                title: intl.formatMessage(errorMessages.fatalError),
            });
        }
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
        const { activeDashboard, appState, hideTerms, intl,
            location, needAuth, theme } = this.props;
        /* eslint-enable no-shadow */
        const showGethDetailsModal = appState.get('showGethDetailsModal');
        const showIpfsDetailsModal = appState.get('showIpfsDetailsModal');
        const muiTheme = getMuiTheme(theme === 'light' ? lightTheme : darkTheme);
        const isOverlay = location.state && location.state.overlay && this.previousLocation !== location;

        return (
          <MuiThemeProvider muiTheme={muiTheme}>
            <DataLoader flag={!appState.get('appReady')} size="large" style={{ paddingTop: '100px' }}>
              <div className="container fill-height app-container">
                {location.pathname === '/' && <Redirect to="/setup/configuration" />}
                {location.pathname === '/search' && <Redirect to="/search/entries" />}
                {!location.pathname.startsWith('/setup') &&
                  <DataLoader flag={!appState.get('homeReady')} size="large" style={{ paddingTop: '100px' }}>
                    <div>
                      {activeDashboard && location.pathname === '/dashboard' &&
                        <Redirect to={`/dashboard/${activeDashboard}`} />
                      }
                      <SecondarySidebar shown={appState.get('showSecondarySidebar')}>
                        <Route path="/dashboard/:dashboardName?" component={DashboardSecondarySidebar} />
                        <Route path="/draft/:draftType/:draftId" component={NewEntrySecondarySidebar} />
                        <Route path="/profileoverview/:title" component={ProfileOverviewSecondarySidebar} />
                        <Route path="/search/:topic/:query?" component={SearchSecondarySidebar} />
                      </SecondarySidebar>
                      <PageContent showSecondarySidebar={appState.get('showSecondarySidebar')}>
                        <Route path="/profileoverview/overview" component={ProfileOverview} />
                        <Route path="/profileoverview/mybalance" component={MyBalance} />
                        <Route path="/profileoverview/myentries" component={MyEntries} />
                        <Route path="/profileoverview/highlights" component={Highlights} />
                        <Route path="/search/entries/:query?" component={EntrySearchPage} />
                        <Route path="/search/tags/:query?" component={TagSearchPage} />
                        <Switch location={isOverlay ? this.previousLocation : location}>
                          <Route exact path="/@:akashaId" component={ProfilePage} />
                          <Route path="/dashboard/:dashboardName?" component={DashboardPage} />
                          <Route path="/draft/article/:draftId" component={NewTextEntryPage} />
                          <Route path="/draft/link/:draftId" component={NewLinkEntryPage} />
                          <Route path="/@:akashaId/:entryId(\d+)" component={EntryPageContainer} />
                        </Switch>
                        {isOverlay &&
                          <div>
                            <Route exact path="/@:akashaId" component={ProfilePage} />
                            <Route path="/@:akashaId/:entryId(\d+)" component={EntryPageContainer} />
                          </div>
                        }
                      </PageContent>
                      <TopBar
                        showSecondarySidebar={appState.get('showSecondarySidebar')}
                        location={location}
                        history={history}
                        intl={intl}
                      />
                    </div>
                  </DataLoader>
                }
                <SidebarContainer {...this.props} />
                <Route path="/setup" component={SetupPages} />
                <Notification />
                <ErrorNotification />
                {/* <ErrorReportingModal
                  open={!!appState.get('showReportModal')}
                  error={errorState.get('reportError')}
                  intl={intl}
                  onClose={hideReportModal}
                /> */}
                {appState.get('showAppSettings') &&
                  <AppSettings sidebar={!location.pathname.startsWith('/setup')} />
                }
                {showGethDetailsModal && <GethDetailsModal />}
                {showIpfsDetailsModal && <IpfsDetailsModal />}
                {needAuth && <ConfirmationDialog intl={intl} needAuth={needAuth} />}
                {appState.get('showTerms') && <Terms hideTerms={hideTerms} />}
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
    // hideReportModal: PropTypes.func.isRequired,
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
        draftCreate,
        entryVoteCost,
        errorDeleteFatal,
        gethGetStatus,
        hideTerms,
        // hideReportModal,
        licenseGetAll,
    }
)(injectIntl(AppContainer));

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { notification, Modal } from 'antd';
import { Redirect, Route, Switch } from 'react-router-dom';
import { bootstrapHome, hideTerms, toggleAethWallet, toggleOutsideNavigation,
    toggleEthWallet, navForwardCounterReset, navCounterIncrement } from '../local-flux/actions/app-actions';
import { entryVoteCost } from '../local-flux/actions/entry-actions';
import { gethGetStatus } from '../local-flux/actions/external-process-actions';
import { licenseGetAll } from '../local-flux/actions/license-actions';
import { errorDeleteFatal } from '../local-flux/actions/error-actions';
import { errorMessages, generalMessages } from '../locale-data/messages';
import { DashboardPage, EntryPageContainer, SearchPage, NewTextEntryPage, NewLinkEntryPage } from './';
import { AppSettings, ConfirmationDialog, FaucetAndManafyModal, NavigateAwayModal, DashboardSecondarySidebar,
    DataLoader, ErrorNotification, GethDetailsModal, Highlights, IpfsDetailsModal, Lists, ListEntries,
    MyEntries, NewEntrySecondarySidebar, Notification, PageContent, PreviewPanel, ProfileOverview,
    ProfileOverviewSecondarySidebar, ProfilePage, ProfileEdit, SecondarySidebar, SetupPages, Sidebar,
    Terms, TopBar, TransactionsLogPanel, ProfileSettings, WalletPanel } from '../components';

notification.config({
    top: 60,
    duration: 0
});

/*
const AppRoute = ({ component: Component, layout: Layout, ...rest }) => (
    <Route {...rest} render={props => (
        <Layout>
            <Component {...props} />
        </Layout>
    )} />
)
usage <AppRoute exact path="/foo" layout={MainLayout} component={Foo} />
*/

class AppContainer extends Component {
    bootstrappingHome = false;
    // pass previousLocation to Switch when we need to render Entry Page as an overlay
    previousLocation = this.props.location;

    componentDidMount () {
        const { history } = this.props;
        this._bootstrapApp(this.props);
        // keep track of location so we can block navigation when it would logout
        // on app refresh counters get reset
        // we also reset the back navigation counter whenever user logs out in auth.js
        // or when a new profile is created, in new-identity-interests
        history.listen((historyLocation, action) => {
            if (action === 'PUSH') {
                this.props.navCounterIncrement('back');
                this.props.navForwardCounterReset();
            }
        });
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

        // check if we need to bootstrap home
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
        const { activeDashboard, appState, hideTerms, history, intl,
            location, needAuth, needEth, needAeth, needMana } = this.props;
        /* eslint-enable no-shadow */
        const showGethDetailsModal = appState.get('showGethDetailsModal');
        const showIpfsDetailsModal = appState.get('showIpfsDetailsModal');
        const showWallet = appState.get('showWallet');
        const isOverlay = location.state && location.state.overlay && this.previousLocation !== location;
        const needFunds = needEth || needAeth || needMana;

        return (
          <div className="flex-center-x app-container__root">
            <DataLoader flag={!appState.get('appReady')} size="large" style={{ paddingTop: '100px' }}>
              <div className="container fill-height app-container">
                {location.pathname === '/' && <Redirect to="/setup/configuration" />}
                {!location.pathname.startsWith('/setup') &&
                  <DataLoader flag={!appState.get('homeReady')} size="large" style={{ paddingTop: '100px' }}>
                    <div>
                      {activeDashboard && location.pathname === '/dashboard' &&
                        <Redirect to={`/dashboard/${activeDashboard}`} />
                      }
                      <SecondarySidebar shown={appState.get('showSecondarySidebar')}>
                        <Route path="/dashboard/:dashboardId?" component={DashboardSecondarySidebar} />
                        <Route path="/draft/:draftType/:draftId" component={NewEntrySecondarySidebar} />
                        <Route path="/profileoverview/:title" component={ProfileOverviewSecondarySidebar} />
                      </SecondarySidebar>
                      <PageContent showSecondarySidebar={appState.get('showSecondarySidebar')}>
                        <Route exact path="/@:akashaId" component={ProfilePage} />
                        <Route exact path="/0x:ethAddress" component={ProfilePage} />
                        <Route path="/profileoverview/overview" component={ProfileOverview} />
                        <Route path="/profileoverview/myentries" component={MyEntries} />
                        <Route path="/profileoverview/highlights" component={Highlights} />
                        <Route exact path="/profileoverview/lists" component={Lists} />
                        <Route path="/profileoverview/lists/:listId" component={ListEntries} />
                        <Route path="/profileoverview/settings" component={ProfileSettings} />
                        <Switch location={isOverlay ? this.previousLocation : location}>
                          <Route path="/dashboard/:dashboardId?" component={DashboardPage} />
                          <Route path="/draft/article/:draftId" component={NewTextEntryPage} />
                          <Route path="/draft/link/:draftId" component={NewLinkEntryPage} />
                          <Route path="/@:akashaId/:entryId/:version?" component={EntryPageContainer} />
                          <Route path="/0x:ethAddress/:entryId/:version?" component={EntryPageContainer} />
                          <Route path="/search" component={SearchPage} />
                        </Switch>
                        {isOverlay &&
                          <div>
                            <Route path="/@:akashaId/:entryId/:version?" component={EntryPageContainer} />
                            <Route path="/0x:ethAddress/:entryId/:version?" component={EntryPageContainer} />
                          </div>
                        }
                      </PageContent>
                      <TopBar
                        history={history}
                        intl={intl}
                        location={location}
                        showSecondarySidebar={appState.get('showSecondarySidebar')}
                      />
                      {!!showWallet &&
                        <WalletPanel
                          showWallet={showWallet}
                          toggleAethWallet={this.props.toggleAethWallet}
                          toggleEthWallet={this.props.toggleEthWallet}
                        />
                      }
                      {!!appState.get('showPreview') &&
                        <PreviewPanel />
                      }
                      {appState.get('showTransactionsLog') &&
                        <TransactionsLogPanel />
                      }
                    </div>
                  </DataLoader>
                }
                <Sidebar />
                <Route path="/setup" component={SetupPages} />
                <Notification />
                <ErrorNotification />
                {appState.get('showAppSettings') &&
                  <AppSettings sidebar={!location.pathname.startsWith('/setup')} />
                }
                <NavigateAwayModal
                  navigation={appState.get('outsideNavigation')}
                  onClick={this.props.toggleOutsideNavigation}
                />
                {needFunds && <FaucetAndManafyModal />}
                {showGethDetailsModal && <GethDetailsModal />}
                {showIpfsDetailsModal && <IpfsDetailsModal />}
                {needAuth && !needFunds && <ConfirmationDialog intl={intl} needAuth={needAuth} />}
                {appState.get('showTerms') && <Terms hideTerms={hideTerms} />}
                {appState.get('showProfileEditor') && <ProfileEdit />}
              </div>
            </DataLoader>
          </div>
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
    hideTerms: PropTypes.func.isRequired,
    history: PropTypes.shape(),
    intl: PropTypes.shape(),
    licenseGetAll: PropTypes.func,
    location: PropTypes.shape().isRequired,
    needAuth: PropTypes.string,
    needEth: PropTypes.bool,
    needAeth: PropTypes.bool,
    needMana: PropTypes.bool,
    toggleAethWallet: PropTypes.func.isRequired,
    toggleEthWallet: PropTypes.func.isRequired,
    toggleOutsideNavigation: PropTypes.func,
    navForwardCounterReset: PropTypes.func,
    navCounterIncrement: PropTypes.func
};

function mapStateToProps (state) {
    return {
        activeDashboard: state.dashboardState.get('activeDashboard'),
        appState: state.appState,
        errorState: state.errorState,
        faucet: state.profileState.get('faucet'),
        needAuth: state.actionState.get('needAuth'),
        needEth: state.actionState.get('needEth'),
        needAeth: state.actionState.get('needAeth'),
        needMana: state.actionState.get('needMana'),
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
        licenseGetAll,
        toggleAethWallet,
        toggleEthWallet,
        toggleOutsideNavigation,
        navCounterIncrement,
        navForwardCounterReset
    }
)(injectIntl(AppContainer));

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { notification, Modal } from 'antd';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Redirect from 'react-router-dom/Redirect';
import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import { hot } from 'react-hot-loader'
import { bootstrapApp, bootstrapHome, hideTerms, toggleAethWallet, toggleEthWallet,
    toggleNavigationModal, toggleOutsideNavigation, navForwardCounterReset,
    navCounterIncrement, showNotification } from '../local-flux/actions/app-actions';
import { entryVoteCost } from '../local-flux/actions/entry-actions';
import { gethGetStatus } from '../local-flux/actions/external-process-actions';
import { licenseGetAll } from '../local-flux/actions/license-actions';
import { userSettingsAddTrustedDomain } from '../local-flux/actions/settings-actions';
import { reloadPage } from '../local-flux/actions/utils-actions';
import { errorDeleteFatal } from '../local-flux/actions/error-actions';
import { errorMessages, generalMessages } from '../locale-data/messages';
import { DashboardPage, EntryPageContainer, SearchPage, NewTextEntryPage, NewLinkEntryPage } from './';
import { AppErrorBoundary, AppPreferences, CommentPage, ConfirmationDialog, FaucetAndManafyModal,
    NavigateAwayModal, DataLoader, ErrorNotification, GethDetailsModal, Highlights, IpfsDetailsModal,
    Lists, ListEntries, MyEntries, NavigationModal, NewEntrySecondarySidebar, Notification,
    NotificationsPanel, NewDashboardModal, PageContent, PreviewPanel,
    ProfileOverviewSecondarySidebar, ProfilePage, ProfileEdit, SecondarySidebar, SetupPages, Sidebar,
    Terms, TopBar, TransactionsLogPanel, ProfileSettings, WalletPanel, FullSizeImageViewer,
    CustomDragLayer } from '../components';
import { isInternalLink, removePrefix } from '../utils/url-utils';
import { dashboardSelectors, actionSelectors, profileSelectors } from '../local-flux/selectors';
import withRequest from '../components/high-order-components/with-request';
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
        const { history, getActionStatus, dispatchAction } = this.props;

        dispatchAction(bootstrapApp());
        dispatchAction(bootstrapHome(), () => (getActionStatus(bootstrapApp().type) === 'success'));
        dispatchAction(entryVoteCost(), () => (getActionStatus(bootstrapApp().type) === 'success'));
        dispatchAction(licenseGetAll(), () => (getActionStatus(bootstrapApp().type) === 'success'));

        // keep track of location so we can block navigation when it would logout
        // on app refresh counters get reset
        // we also reset the back navigation counter whenever user logs out in auth.js
        // or when a new profile is created, in new-identity-interests
        history.listen((location, action) => {
            const isInternal = isInternalLink(location.pathname);
            if (isInternal) {
                location.pathname = removePrefix(location.pathname);
            }
            if (action === 'PUSH' || isInternal) {
                this.props.navCounterIncrement('back');
                this.props.navForwardCounterReset();
            }
        });
    }

    componentWillReceiveProps (nextProps) {
        const { errorState, intl } = nextProps;

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

    componentWillUnmount () {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    render () { // eslint-disable-line complexity
        /* eslint-disable no-shadow */
        const { activeDashboard, appState, hideTerms, history, intl,
            location, loggedEthAddress, needAuth, needEth, needAeth, needMana } = this.props;
        /* eslint-enable no-shadow */
        const showGethDetailsModal = appState.get('showGethDetailsModal');
        const showIpfsDetailsModal = appState.get('showIpfsDetailsModal');
        const showWallet = appState.get('showWallet');
        const isOverlay = location.state && location.state.overlay && this.previousLocation !== location;
        const needFunds = needEth || needAeth || needMana;
        return (
          <div className="flex-center-x app-container__root">
            <DataLoader flag={false} size="large" style={{ paddingTop: '100px' }}>
              <div className="container fill-height app-container">
                <AppErrorBoundary
                  reloadPage={this.props.reloadPage}
                  showNotification={this.props.showNotification}
                >
                  {location.pathname === '/' && <Redirect to="/setup/configuration" />}
                  {isInternalLink(location.pathname) && <Redirect to={removePrefix(location.pathname)} />}
                  {!location.pathname.startsWith('/setup') &&
                    <DataLoader
                      flag={false}
                      size="large"
                      style={{ paddingTop: '100px' }}
                    >
                      <div>
                        {activeDashboard && location.pathname === '/dashboard' &&
                          <Redirect to={`/dashboard/${activeDashboard}`} />
                        }
                        <SecondarySidebar shown={appState.get('showSecondarySidebar')}>
                          <Route path="/draft/:draftType/:draftId" component={NewEntrySecondarySidebar} />
                          <Route path="/profileoverview/:title" component={ProfileOverviewSecondarySidebar} />
                        </SecondarySidebar>
                        <PageContent showSecondarySidebar={appState.get('showSecondarySidebar')}>
                          <Route exact path="/@:akashaId" component={ProfilePage} />
                          {/* <Route exact path="/0x:ethAddress" component={ProfilePage} /> */}
                          {/* <Route path="/profileoverview/overview" component={ProfileOverview} /> */}
                          <Route path="/profileoverview/myentries" component={MyEntries} />
                          <Route path="/profileoverview/highlights" component={Highlights} />
                          <Route exact path="/profileoverview/lists" component={Lists} />
                          <Route path="/profileoverview/lists/:listId" component={ListEntries} />
                          <Route path="/profileoverview/settings" component={ProfileSettings} />
                          <Route path="/profileoverview/preferences" component={AppPreferences} />
                          <Switch location={isOverlay ? this.previousLocation : location}>
                            <Route exact path="/0x:ethAddress" component={ProfilePage} />
                            <Route path="/dashboard/:dashboardId?" component={DashboardPage} />
                            <Route path="/draft/article/:draftId" component={NewTextEntryPage} />
                            <Route path="/draft/link/:draftId" component={NewLinkEntryPage} />
                            <Route path="/@:akashaId/:entryId/comment/:commentId" component={CommentPage} />
                            <Route path="/0x:ethAddress/:entryId/comment/:commentId" component={CommentPage} />
                            <Route path="/@:akashaId/:entryId/:version?" component={EntryPageContainer} />
                            <Route path="/0x:ethAddress/:entryId/:version?" component={EntryPageContainer} />
                            <Route path="/search" component={SearchPage} />
                          </Switch>
                          {isOverlay &&
                            <Switch>
                              <Route path="/@:akashaId/:entryId/comment/:commentId" component={CommentPage} />
                              <Route path="/0x:ethAddress/:entryId/comment/:commentId" component={CommentPage} />
                              <Route path="/@:akashaId/:entryId/:version?" component={EntryPageContainer} />
                              <Route path="/0x:ethAddress/:entryId/:version?" component={EntryPageContainer} />
                            </Switch>
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
                        {appState.get('showNotificationsPanel') &&
                          <NotificationsPanel />
                        }
                      </div>
                    </DataLoader>
                  }
                  {/* <Sidebar /> */}
                  <Route path="/setup" component={SetupPages} />
                  <FullSizeImageViewer />
                  <ErrorNotification />
                  <NavigateAwayModal
                    loggedEthAddress={loggedEthAddress}
                    userSettingsAddTrustedDomain={this.props.userSettingsAddTrustedDomain}
                    navigation={appState.get('outsideNavigation')}
                    onClick={this.props.toggleOutsideNavigation}
                  />
                  {needFunds && <FaucetAndManafyModal />}
                  {showGethDetailsModal && <GethDetailsModal />}
                  {showIpfsDetailsModal && <IpfsDetailsModal />}
                  {appState.get('showNavigationModal') &&
                    <NavigationModal toggleNavigationModal={this.props.toggleNavigationModal} />
                  }
                  {appState.get('showNewDashboardModal') &&
                    <NewDashboardModal />
                  }
                  {needAuth && !needFunds && <ConfirmationDialog intl={intl} needAuth={needAuth} />}
                  {appState.get('showTerms') && <Terms hideTerms={hideTerms} />}
                  {appState.get('showProfileEditor') && <ProfileEdit />}
                </AppErrorBoundary>
                <CustomDragLayer />
                <Notification />
              </div>
            </DataLoader>
          </div>
        );
    }
}

AppContainer.propTypes = {
    activeDashboard: PropTypes.string,
    userSettingsAddTrustedDomain: PropTypes.func,
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
    loggedEthAddress: PropTypes.string,
    needAuth: PropTypes.string,
    needEth: PropTypes.bool,
    needAeth: PropTypes.bool,
    needMana: PropTypes.bool,
    toggleAethWallet: PropTypes.func.isRequired,
    toggleEthWallet: PropTypes.func.isRequired,
    toggleNavigationModal: PropTypes.func.isRequired,
    toggleOutsideNavigation: PropTypes.func,
    navForwardCounterReset: PropTypes.func,
    navCounterIncrement: PropTypes.func,
    reloadPage: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired
};

function mapStateToProps (state) {
    return {
        activeDashboard: dashboardSelectors.selectActiveDashboardId(state),
        appState: state.appState,
        errorState: state.errorState,
        faucet: profileSelectors.selectFaucet(state),
        loggedEthAddress: profileSelectors.selectLoggedEthAddress(state),
        needAuth: actionSelectors.getNeedAuthAction(state),
        needEth: actionSelectors.selectNeedEth(state),
        needAeth: actionSelectors.selectNeedAeth(state),
        needMana: actionSelectors.selectNeedMana(state),
    };
}

export { AppContainer };
export default hot(module)(DragDropContext(HTML5Backend)(connect(
    mapStateToProps,
    {
        userSettingsAddTrustedDomain,
        // bootstrapHome,
        // entryVoteCost,
        errorDeleteFatal,
        // gethGetStatus,
        hideTerms,
        // licenseGetAll,
        toggleAethWallet,
        toggleEthWallet,
        toggleNavigationModal,
        toggleOutsideNavigation,
        navCounterIncrement,
        navForwardCounterReset,
        reloadPage,
        showNotification
    }
)(injectIntl(withRequest(AppContainer)))));

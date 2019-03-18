// @flow
import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { notification, Modal } from "antd";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import Redirect from "react-router-dom/Redirect";
import Route from "react-router-dom/Route";
import Switch from "react-router-dom/Switch";
import { hot } from "react-hot-loader";
import { Provider, Fill } from "react-slot-fill";
import {
    bootstrapApp,
    bootstrapHome,
    hideTerms,
    toggleAethWallet,
    toggleEthWallet,
    toggleNavigationModal,
    toggleOutsideNavigation,
    navForwardCounterReset,
    navCounterIncrement,
    showNotification
} from "../local-flux/actions/app-actions";
import { entryVoteCost } from "../local-flux/actions/entry-actions";
// import { gethGetStatus } from '../local-flux/actions/external-process-actions';
import { licenseGetAll } from "../local-flux/actions/license-actions";
import { userSettingsAddTrustedDomain } from "../local-flux/actions/settings-actions";
import { reloadPage } from "../local-flux/actions/utils-actions";
import { errorDeleteFatal } from "../local-flux/actions/error-actions";
import { errorMessages, generalMessages } from "../locale-data/messages";

import {
    DashboardPage,
    EditorPage,
    EntryPage,
    MyProfilePage,
    ProfilePage,
    SearchPage
} from "../components/pages";

import { AppbarLayout, SidebarLayout } from "../components/layouts";
import { SIDEBAR_SLOTS, APPBAR_SLOTS } from "../components/layouts/slot-names";
import {
    AppErrorBoundary,
    CommentPage,
    ConfirmationDialog,
    FaucetAndManafyModal,
    NavigateAwayModal,
    // DataLoader,
    ErrorNotification,
    GethDetailsModal,
    Highlights,
    IpfsDetailsModal,
    Lists,
    ListEntries,
    MyEntries,
    NavigationModal,
    NewEntrySecondarySidebar,
    Notification,
    NotificationsPanel,
    NewDashboardModal,
    PageContent,
    PreviewPanel,
    ProfileOverviewSecondarySidebar,
    // ProfilePage,
    ProfileEdit,
    SecondarySidebar,
    // SetupPages,
    // Sidebar,
    Terms,
    TransactionsLogPanel,
    ProfileSettings,
    WalletPanel,
    FullSizeImageViewer,
    CustomDragLayer,
    ServiceStatusBar,
    UserNotification
} from "../components";
import { isInternalLink, removePrefix } from "../utils/url-utils";
import { dashboardSelectors, actionSelectors, profileSelectors } from "../local-flux/selectors";
import withRequest from "../components/high-order-components/with-request";

notification.config({
    top: 60,
    duration: 0
});

/*::
    import type {RouterHistory} from 'react-router';
    type Props = {
        history: RouterHistory,
        getActionStatus: Object,
        dispatchAction: void
    }
*/

/* @Note
 * Changed route paths a bit (more SPA like)
 * "/" (root) => have a logic to determine what screen should display
 *               (login, config, sync, etc). Check index.js
 * "/" (root) => load the active dashboard here (no need to redirect to /dashboard/dashboardId)\
 */

class AppContainer extends Component /*:: <Props> */ {
    // pass previousLocation to Switch when we need to render Entry Page as an overlay
    previousLocation = this.props.location;

    componentDidMount () {
        const { history, getActionStatus, dispatchAction } = this.props;
        dispatchAction(bootstrapApp());
        dispatchAction(bootstrapHome(), () => getActionStatus(bootstrapApp().type) === "success");
        dispatchAction(entryVoteCost(), () => getActionStatus(bootstrapApp().type) === "success");
        dispatchAction(licenseGetAll(), () => getActionStatus(bootstrapApp().type) === "success");

        // keep track of location so we can block navigation when it would logout
        // on app refresh counters get reset
        // we also reset the back navigation counter whenever user logs out in auth.js
        // or when a new profile is created, in new-identity-interests
        history.listen((location, action) => {
            const isInternal = isInternalLink(location.pathname);
            if (isInternal) {
                location.pathname = removePrefix(location.pathname);
            }
            if (action === "PUSH" || isInternal) {
                this.props.navCounterIncrement("back");
                this.props.navForwardCounterReset();
            }
        });
    }

    componentWillReceiveProps (nextProps) {
        const { errorState, intl } = nextProps;

        if (errorState.get("fatalErrors").size) {
            const error = errorState.getIn(["byId", errorState.get("fatalErrors").first()]);
            const content = error.get("messageId")
                ? intl.formatMessage(errorMessages[error.get("messageId")])
                : error.get("message");
            const modal = Modal.error({
                content,
                okText: intl.formatMessage(generalMessages.ok),
                onOk: () => {
                    this.props.errorDeleteFatal();
                    modal.destroy();
                },
                title: intl.formatMessage(errorMessages.fatalError)
            });
        }
    }

    componentWillUpdate (nextProps) {
        const { location } = this.props;
        // set previousLocation if props.location is not overlay
        if (nextProps.history.action !== "POP" && (!location.state || !location.state.overlay)) {
            this.previousLocation = this.props.location;
        }
    }

    componentWillUnmount () {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    // eslint-disable-next-line complexity
    render () {
        const {
            activeDashboard,
            appState,
            hideTerms,
            history,
            intl,
            location,
            loggedEthAddress,
            needAuth,
            needEth,
            needAeth,
            needMana,
            active
        } = this.props;
        /* eslint-enable no-shadow */
        const showGethDetailsModal = appState.get("showGethDetailsModal");
        const showIpfsDetailsModal = appState.get("showIpfsDetailsModal");
        const showWallet = appState.get("showWallet");
        const isOverlay = location.state && location.state.overlay && this.previousLocation !== location;
        const needFunds = needEth || needAeth || needMana;
        console.log("application is active:", active);
        if (!active) {
            return null;
        }
        return (
            <>
                <AppErrorBoundary
                    reloadPage={this.props.reloadPage}
                    showNotification={this.props.showNotification}
                >
                    {isInternalLink(location.pathname) && <Redirect to={removePrefix(location.pathname)} />}
                    <Provider>
                        {/* Common application parts */}
                        <AppbarLayout />
                        <SidebarLayout />
                        {/* Page Layouts */}
                        <DashboardPage />
                        <EditorPage />
                        <EntryPage />
                        <MyProfilePage />
                        <ProfilePage />
                        <SearchPage />
                        {/* Populate common sections/slots */}
                        <>
                            <Fill name={SIDEBAR_SLOTS.TOP}>
                                <>Sidebar top</>
                            </Fill>
                            <Fill name={APPBAR_SLOTS.SERVICE_STATUS}>
                                <ServiceStatusBar />
                            </Fill>
                            <Fill name={APPBAR_SLOTS.NOTIFICATION}>
                                <UserNotification />
                            </Fill>
                            <Fill name={APPBAR_SLOTS.WALLET}>
                                <>WLT</>
                            </Fill>
                        </>
                    </Provider>
                    <>
                        {/* {activeDashboard && location.pathname === "/" && (
                                <Redirect to={`/dashboard/${activeDashboard}`} />
                            )} */}
                        {/* <PageContent showSecondarySidebar={appState.get("showSecondarySidebar")}>
                            <Switch location={isOverlay ? this.previousLocation : location}>
                                <Route
                                    path="/@:akashaId/:entryId/comment/:commentId"
                                    component={CommentPage}
                                />
                                <Route
                                    path="/0x:ethAddress/:entryId/comment/:commentId"
                                    component={CommentPage}
                                />
                            </Switch>
                            {isOverlay && (
                                <Switch>
                                    <Route
                                        path="/@:akashaId/:entryId/comment/:commentId"
                                        component={CommentPage}
                                    />
                                    <Route
                                        path="/0x:ethAddress/:entryId/comment/:commentId"
                                        component={CommentPage}
                                    />
                                </Switch>
                            )}
                        </PageContent> */}
                        {/* {!!showWallet && (
                            <WalletPanel
                                showWallet={showWallet}
                                toggleAethWallet={this.props.toggleAethWallet}
                                toggleEthWallet={this.props.toggleEthWallet}
                            />
                        )}
                        {!!appState.get("showPreview") && <PreviewPanel />}
                        {appState.get("showTransactionsLog") && <TransactionsLogPanel />}
                        {appState.get("showNotificationsPanel") && <NotificationsPanel />} */}
                    </>
                    {/* <FullSizeImageViewer />
                    <ErrorNotification />
                    <NavigateAwayModal
                        loggedEthAddress={loggedEthAddress}
                        userSettingsAddTrustedDomain={this.props.userSettingsAddTrustedDomain}
                        navigation={appState.get("outsideNavigation")}
                        onClick={this.props.toggleOutsideNavigation}
                    />
                    {needFunds && <FaucetAndManafyModal />}
                    {showGethDetailsModal && <GethDetailsModal />}
                    {showIpfsDetailsModal && <IpfsDetailsModal />}
                    {appState.get("showNavigationModal") && (
                        <NavigationModal toggleNavigationModal={this.props.toggleNavigationModal} />
                    )}
                    {appState.get("showNewDashboardModal") && <NewDashboardModal />}
                    {needAuth && !needFunds && <ConfirmationDialog intl={intl} needAuth={needAuth} />}
                    {appState.get("showTerms") && <Terms hideTerms={hideTerms} />}
                    {appState.get("showProfileEditor") && <ProfileEdit />} */}
                </AppErrorBoundary>
                <CustomDragLayer />
                <Notification />
            </>
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
    showNotification: PropTypes.func.isRequired,
    getActionStatus: PropTypes.func,
    dispatchAction: PropTypes.func
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
        needMana: actionSelectors.selectNeedMana(state)
    };
}

export { AppContainer };
export default hot(module)(
    DragDropContext(HTML5Backend)(
        connect(
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
        )(injectIntl(withRequest(AppContainer)))
    )
);

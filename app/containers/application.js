// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { notification } from 'antd';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { hot } from 'react-hot-loader';
import { Fill, Provider } from 'react-slot-fill';
import * as appActions from '../local-flux/actions/app-actions';
import * as settingsActions from '../local-flux/actions/settings-actions';
import { reloadPage } from '../local-flux/actions/utils-actions';
import * as profileActions from '../local-flux/actions/profile-actions';
import {
    AppbarLayout,
    DashboardPageLayout,
    MyProfilePageLayout,
    SidebarLayout
} from '../components/layouts';

import {
    DashboardPage,
    EditorPage,
    EntryPage,
    MyProfilePage,
    ProfilePage,
    SearchPage
} from '../components/pages';
import { APPBAR_SLOTS, SIDEBAR_SLOTS } from '../components/layouts/slot-names';
import {
    AppbarBalance,
    AppErrorBoundary,
    ProfileEditPanel,
    ServiceStatusBar,
    SidebarBottomMenu,
    SidebarTopMenu,
    UserNotification
} from '../components';
import {
    actionSelectors,
    dashboardSelectors,
    externalProcessSelectors,
    profileSelectors
} from '../local-flux/selectors';
import withRequest from '../components/high-order-components/with-request';

notification.config({
    top: 60,
    duration: 0
});

/*::
    import type {RouterHistory} from 'react-router';

    type Props = {
        history: RouterHistory,
        getActionStatus: (state: Object) => boolean,
        dispatchAction: (Object, ?boolean | () => boolean) => void,
        gethIsSynced: boolean
    }
*/

/* @Note
 * Changed route paths a bit (more SPA like)
 * "/" (root) => have a logic to determine what screen should display
 *               (login, config, sync, etc). Check index.js
 * "/" (root) => load the active dashboard here (no need to redirect to /dashboard/dashboardId)\
 */

const Application = (props /* :Props */) => {
    const { dispatchAction, getActionStatus, gethIsSynced, showNotification, loggedEthAddress } = props;
    const [profileEditPanelVisible, setProfileEditPanelVisible] = React.useState(false);

    const onReload = () => dispatchAction(reloadPage());

    React.useEffect(() => {
        const { getCurrentProfile } = profileActions;
        const { selectGethSyncStatus } = externalProcessSelectors;
        dispatchAction(
            getCurrentProfile(),
            newState => !loggedEthAddress && selectGethSyncStatus(newState).get('synced')
        );
    }, [gethIsSynced, !loggedEthAddress]);
    return (
        <>
            <AppErrorBoundary reloadPage={ onReload } showNotification={ showNotification }>
                <Provider>
                    {/* load layouts here */ }
                    <AppbarLayout/>
                    <SidebarLayout profilePanelOpen={ profileEditPanelVisible }/>
                    <DashboardPageLayout/>
                    <MyProfilePageLayout/>
                    {/* Populate layout (Pages) */ }
                    <DashboardPage/>
                    <EditorPage/>
                    <EntryPage/>
                    <MyProfilePage/>
                    <ProfilePage/>
                    <SearchPage/>
                    {/* Populate common sections/slots */ }
                    <>
                        <Fill name={ SIDEBAR_SLOTS.TOP }>
                            <SidebarTopMenu/>
                        </Fill>
                        <Fill name={ SIDEBAR_SLOTS.BOTTOM }>
                            <SidebarBottomMenu
                                onProfileEdit={ () => setProfileEditPanelVisible(!profileEditPanelVisible) }
                            />
                        </Fill>
                        <Fill name={ SIDEBAR_SLOTS.PROFILE_EDIT_PANEL }>
                            <ProfileEditPanel visible={ profileEditPanelVisible }/>
                        </Fill>
                        <Fill name={ APPBAR_SLOTS.SERVICE_STATUS }>
                            <ServiceStatusBar/>
                        </Fill>
                        <Fill name={ APPBAR_SLOTS.NOTIFICATION }>
                            <UserNotification/>
                        </Fill>
                        <Fill name={ APPBAR_SLOTS.WALLET }>
                            <>
                                <AppbarBalance/>
                            </>
                        </Fill>
                    </>
                </Provider>
            </AppErrorBoundary>
        </>
    );
};

function mapStateToProps (state) {
    return {
        activeDashboard: dashboardSelectors.selectActiveDashboardId(state),
        appState: state.appState,
        errorState: state.errorState,
        faucet: profileSelectors.selectFaucet(state),
        loggedEthAddress: profileSelectors.selectLoggedEthAddress(state),
        needAuth: actionSelectors.getNeedAuthAction(state),
        // needEth: actionSelectors.selectNeedEth(state),
        // needAeth: actionSelectors.selectNeedAeth(state),
        // needMana: actionSelectors.selectNeedMana(state)
        gethIsSynced: externalProcessSelectors.selectGethSyncStatus(state).get('synced')
    };
}

export { Application };
export default hot(module)(
    DragDropContext(HTML5Backend)(
        connect(
            mapStateToProps,
            {
                userSettingsAddTrustedDomain: settingsActions.userSettingsAddTrustedDomain,
                hideTerms: appActions.hideTerms,
                navCounterIncrement: appActions.navCounterIncrement,
                navForwardCounterReset: appActions.navForwardCounterReset
            }
        )(withRequest(Application))
    )
);

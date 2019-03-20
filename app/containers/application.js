// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { notification } from 'antd';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { hot } from 'react-hot-loader';
import { Provider, Fill } from 'react-slot-fill';
import {
    bootstrapApp,
    bootstrapHome,
    hideTerms,
    navForwardCounterReset,
    navCounterIncrement
} from '../local-flux/actions/app-actions';
import { entryVoteCost } from '../local-flux/actions/entry-actions';
import { gethGetSyncStatus, gethGetStatus } from '../local-flux/actions/external-process-actions';
import { licenseGetAll } from '../local-flux/actions/license-actions';
import { userSettingsAddTrustedDomain } from '../local-flux/actions/settings-actions';
import { reloadPage } from '../local-flux/actions/utils-actions';
import { errorDeleteFatal } from '../local-flux/actions/error-actions';
import { getCurrentProfile } from '../local-flux/actions/profile-actions';

import {
    DashboardPage,
    EditorPage,
    EntryPage,
    MyProfilePage,
    ProfilePage,
    SearchPage
} from '../components/pages';

import { AppbarLayout, SidebarLayout } from '../components/layouts';
import { SIDEBAR_SLOTS, APPBAR_SLOTS } from '../components/layouts/slot-names';
import {
    AppErrorBoundary,
    AppbarBalance,
    CustomDragLayer,
    ServiceStatusBar,
    UserNotification
} from '../components';
import { dashboardSelectors, actionSelectors, profileSelectors } from '../local-flux/selectors';
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
    }
*/

/* @Note
 * Changed route paths a bit (more SPA like)
 * "/" (root) => have a logic to determine what screen should display
 *               (login, config, sync, etc). Check index.js
 * "/" (root) => load the active dashboard here (no need to redirect to /dashboard/dashboardId)\
 */

const Application = (props /* :Props */) => {
    const { dispatchAction, getActionStatus } = props;
    const onReload = () => dispatchAction(reloadPage());
    React.useEffect(() => {
        dispatchAction(bootstrapApp(), getActionStatus(bootstrapApp().type) === null);
        dispatchAction(
            bootstrapHome(),
            !getActionStatus(bootstrapHome().type) === null &&
                getActionStatus(bootstrapApp().type === 'success')
        );
        // dispatchAction(gethGetStatus(), getActionStatus(gethGetStatus().type) === null);
        dispatchAction(
            getCurrentProfile(),
            getActionStatus(getCurrentProfile().type) === null &&
                getActionStatus(gethGetSyncStatus().type) === null
        );

        // dispatchAction(entryVoteCost(), () => getActionStatus(bootstrapApp().type) === "success");
    }, []);
    return (
        <>
            <AppErrorBoundary reloadPage={onReload} showNotification={props.showNotification}>
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
                            <>
                                <AppbarBalance />
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
        needEth: actionSelectors.selectNeedEth(state),
        needAeth: actionSelectors.selectNeedAeth(state),
        needMana: actionSelectors.selectNeedMana(state)
    };
}

export { Application };
export default hot(module)(
    DragDropContext(HTML5Backend)(
        connect(
            mapStateToProps,
            {
                userSettingsAddTrustedDomain,
                errorDeleteFatal,
                hideTerms,
                navCounterIncrement,
                navForwardCounterReset
            }
        )(withRequest(Application))
    )
);

// @flow strict

import * as React from 'react';
import Route from 'react-router-dom/Route';
import { connect } from 'react-redux';
import { Fill } from 'react-slot-fill';
import ColumnList from '../columns/column-list';
import { APPBAR_SLOTS, DASHBOARD_SLOTS } from '../layouts/slot-names';
import { DashboardTopBar, CustomDragLayer } from '../';
import withRequest from '../high-order-components/with-request';
import { dashboardSelectors, profileSelectors } from '../../local-flux/selectors';
import { dashboardActions } from '../../local-flux/actions';
/*::
    type Props = {||};
*/
function DashboardPage (props /* : Props */) {
    const { loggedEthAddress, dispatchAction } = props;

    React.useEffect(() => {
        dispatchAction(dashboardActions.dashboardGetAll({ ethAddress: loggedEthAddress }));
    }, [loggedEthAddress]);

    return (
        <>
            <Route
                path="/"
                exact
                render={() => (
                    <>
                        <Fill name={APPBAR_SLOTS.LEFT}>
                            <>
                                <DashboardTopBar />
                            </>
                        </Fill>
                        <Fill name={DASHBOARD_SLOTS.COLUMN}>
                            <>Column 1</>
                            <>Column 2</>
                        </Fill>
                        <Fill name={DASHBOARD_SLOTS.NEW_COLUMN}>
                            <>New Column</>
                        </Fill>
                        <CustomDragLayer />
                    </>
                )}
            />
        </>
    );
}

const mapStateToProps = state => ({
    activeDashboard: dashboardSelectors.getActiveDashboard(state),
    loggedEthAddress: profileSelectors.selectLoggedEthAddress(state)
});

export default connect(mapStateToProps)(withRequest(DashboardPage));

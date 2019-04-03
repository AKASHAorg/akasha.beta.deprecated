// @flow strict

import * as React from 'react';
import Route from 'react-router-dom/Route';
import { Fill } from 'react-slot-fill';
import { DashboardPageLayout } from '../layouts';
import ColumnList from '../columns/column-list';
import { APPBAR_SLOTS, DASHBOARD_SLOTS } from '../layouts/slot-names';
import { DashboardTopBar, CustomDragLayer } from '../';
/*::
    type Props = {||};
*/
function DashboardPage (props /* : Props */) {
    return (
        <>
            <Route
                path="/"
                render={() => (
                    <>
                        <Fill name={APPBAR_SLOTS.LEFT}>
                            <>
                                <DashboardTopBar />
                            </>
                        </Fill>
                        <DashboardPageLayout>
                            <div className="dashboard-layout__column dashboard-layout__column_new">
                                Add new column
                            </div>
                        </DashboardPageLayout>
                        <Fill name={DASHBOARD_SLOTS.COLUMN}>
                            <>Column 1</>
                        </Fill>
                        <Fill name={DASHBOARD_SLOTS.COLUMN}>
                            <>Column 2</>
                        </Fill>
                        <CustomDragLayer />
                    </>
                )}
            />
        </>
    );
}

export default DashboardPage;

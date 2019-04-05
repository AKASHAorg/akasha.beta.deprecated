// @flow strict

import * as React from 'react';
import Route from 'react-router-dom/Route';
import { Fill } from 'react-slot-fill';
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

export default DashboardPage;

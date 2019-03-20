// @flow strict

import * as React from 'react';
import { Slot } from 'react-slot-fill';
import { DASHBOARD_SLOTS } from '../slot-names';
/*::
    type Props = {
        children: React.Node
    };
*/

/**
 *  Layout used for Dashboard page
 */
function DashboardLayout (props /* : Props */) {
    return (
        <>
            <div className="dashboard-layout">
                <Slot name={DASHBOARD_SLOTS.COLUMN}>
                    {items => (
                        <>
                            {items.map((column, idx) => (
                                <div className="dashboard-layout__column" key={idx}>
                                    {column}
                                </div>
                            ))}
                        </>
                    )}
                </Slot>
                {props.children}
            </div>
        </>
    );
}

export default DashboardLayout;

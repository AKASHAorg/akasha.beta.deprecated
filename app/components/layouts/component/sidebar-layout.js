// @flow strict

import * as React from "react";
import { Slot } from "react-slot-fill";
import { SIDEBAR_SLOTS } from "../slot-names";
/*::
    type Props = {||};
*/

function SidebarLayout (props /* : Props */) {
    return (
        <div className="sidebar-layout sidebar-layout_main">
            <div className="sidebar-layout_top">
                <Slot name={SIDEBAR_SLOTS.TOP} />
            </div>
            <div className="sidebar-layout_bottom">
                <Slot name={SIDEBAR_SLOTS.BOTTOM} />
            </div>
        </div>
    );
}

export default SidebarLayout;

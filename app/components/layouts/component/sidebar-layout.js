// @flow strict

import * as React from 'react';
import { Slot } from 'react-slot-fill';
import classNames from 'classnames';
import { SIDEBAR_SLOTS } from '../slot-names';
/*::
    type Props = {||};
*/

function SidebarLayout (props /* : Props */) {
    const editProfilePanelClass = classNames('sidebar-layout_profile-edit-panel', {
        'sidebar-layout_profile-edit-panel__open': props.profilePanelOpen
    });
    const sidebarPanelClass = classNames('sidebar-layout_panel', {
        'sidebar-layout_panel__open': props.panelOpen
    });
    const panelOverlayClass = classNames('sidebar-layout_panel-overlay', {
        'sidebar-layout_panel-overlay__open': props.profilePanelOpen || props.panelOpen
    });
    return (
        <div className="sidebar-layout sidebar-layout_main">
            <div className="sidebar-layout_sidebar">
                <div className="sidebar-layout_top">
                    <Slot name={SIDEBAR_SLOTS.TOP} />
                </div>
                <div className="sidebar-layout_bottom">
                    <Slot name={SIDEBAR_SLOTS.BOTTOM} />
                </div>
            </div>
            <div className={editProfilePanelClass}>
                <Slot name={SIDEBAR_SLOTS.PROFILE_EDIT_PANEL} />
            </div>
            <div className={sidebarPanelClass}>
                <Slot name={SIDEBAR_SLOTS.SIDEBAR_PANEL} />
            </div>
            <div className={panelOverlayClass} />
        </div>
    );
}

export default SidebarLayout;

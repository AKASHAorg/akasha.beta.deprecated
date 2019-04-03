// @flow strict

import * as React from 'react';
import { Popover } from 'antd';
import { injectIntl } from 'react-intl';
import { Icon, SidebarIcon } from '../';
import { generalMessages } from '../../locale-data/messages';

/*:: type Props = {|
    intl: Object,
    activeDashboard: string
|}; */
const getEntryMenu = () => <>Entry Menu</>;

function SidebarTopMenu (props /* : Props */) {
    const { intl, activeDashboard } = props;
    return (
        <div className="sidebar__top-icons">
            <div className="flex-center-x sidebar__new-entry">
                <Popover
                    arrowPointAtCenter
                    placement="right"
                    content={getEntryMenu()}
                    overlayClassName="entry-menu-popover"
                >
                    <div className="content-link flex-center sidebar__new-entry-wrapper">
                        <Icon className="sidebar__new-entry-icon" type="newEntry" />
                    </div>
                </Popover>
            </div>
            <SidebarIcon
                activePath="/dashboard"
                linkTo={`/dashboard/${activeDashboard || ''}`}
                iconType="dashboard"
                tooltipTitle={intl.formatMessage(generalMessages.sidebarTooltipDashboard)}
            />
            <SidebarIcon
                activePath="/profileoverview"
                className="sidebar__profile-icon"
                linkTo="/profileoverview/myentries"
                iconType="profileOverview"
                tooltipTitle={intl.formatMessage(generalMessages.sidebarTooltipProfile)}
            />
            {/* <SidebarIcon
                activePath="/community"
                linkTo="/community"
                iconType="community"
                tooltipTitle={intl.formatMessage(generalMessages.sidebarTooltipCommunity)}
                disabled
              /> */}
            <SidebarIcon
                activePath="/search"
                linkTo="/search/entries"
                iconType="search"
                tooltipTitle={intl.formatMessage(generalMessages.sidebarTooltipSearch)}
            />
            <SidebarIcon
                activePath="/chat"
                linkTo="/chat"
                iconType="chat"
                tooltipTitle={intl.formatMessage(generalMessages.sidebarTooltipChat)}
                disabled
            />
        </div>
    );
}

export default injectIntl(SidebarTopMenu);

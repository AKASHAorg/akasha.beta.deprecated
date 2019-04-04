// @flow strict

import * as React from 'react';
import { Button, Popover } from 'antd';
import { injectIntl } from 'react-intl';
import { Icon, SidebarIcon } from '../';
import { generalMessages, entryMessages } from '../../locale-data/messages';

/*:: type Props = {|
    intl: Object,
    activeDashboard: string
|}; */
const getEntryMenu = (intl, onNavigation, onDraftsClick) => (
    <div className="sidebar__entry-menu">
        <ul className="sidebar__entry-menu-buttons">
            <li className="sidebar__entry-menu-buttons_wrapper">
                <Button
                    type="entry-menu-button"
                    size="large"
                    className="borderless"
                    icon="file"
                    ghost
                    onClick={onNavigation('/draft/article/new')}
                />
                <div className="sidebar__entry-menu-buttons_text">
                    {intl.formatMessage(generalMessages.sidebarEntryTypeArticle)}
                </div>
            </li>
            <li className="sidebar__entry-menu-buttons_wrapper">
                <Button
                    type="entry-menu-button"
                    size="large"
                    className="borderless"
                    icon="link"
                    ghost
                    onClick={onNavigation('/draft/link/new')}
                />
                <div className="sidebar__entry-menu-buttons_text">
                    {intl.formatMessage(generalMessages.sidebarEntryTypeLink)}
                </div>
            </li>
            <li className="sidebar__entry-menu-buttons_wrapper sidebar__entry-menu-buttons_wrapper-disabled">
                <Button
                    type="entry-menu-button-disabled"
                    size="large"
                    className="borderless"
                    icon="picture"
                    ghost
                    disabled
                    onClick={() => {}}
                />
                <div className="sidebar__entry-menu-buttons_text">
                    {intl.formatMessage(generalMessages.sidebarEntryTypeImage)}
                </div>
            </li>
        </ul>
        <div>
            <div className="sidebar__entry-menu-buttons_draft-button" onClick={onDraftsClick}>
                <Icon type="draft" className="sidebar__entry-menu-buttons_draft-button-icon" />
                <span className="sidebar__entry-menu-buttons_draft-button-label">
                    {intl.formatMessage(entryMessages.gotoMyDrafts)}
                </span>
            </div>
        </div>
    </div>
);

function SidebarTopMenu (props /* : Props */) {
    const { intl, activeDashboard } = props;
    const onNavigate = path => _ => {
        console.log('navigate to ', path);
    };
    const onDraftsClick = () => {
        console.log('draft clicked!');
    };
    return (
        <>
            <div className="sidebar__new-entry sidebar__icon">
                <Popover
                    arrowPointAtCenter
                    placement="right"
                    content={getEntryMenu(intl, onNavigate, onDraftsClick)}
                    overlayClassName="entry-menu-popover"
                >
                    <div className="content-link sidebar__new-entry-wrapper flex-center">
                        <Icon className="sidebar__new-entry-icon sidebar-icon__icon" type="newEntry" />
                    </div>
                </Popover>
            </div>
            <SidebarIcon
                activePath="/dashboard"
                linkTo={`/dashboard/${activeDashboard || ''}`}
                iconType="dashboard"
                tooltipTitle={intl.formatMessage(generalMessages.sidebarTooltipDashboard)}
                linkClassName="sidebar__icon"
            />
            <SidebarIcon
                activePath="/profileoverview"
                className="sidebar__profile-icon"
                linkTo="/profileoverview/myentries"
                iconType="profileOverview"
                tooltipTitle={intl.formatMessage(generalMessages.sidebarTooltipProfile)}
                linkClassName="sidebar__icon"
            />
            <SidebarIcon
                activePath="/search"
                linkTo="/search/entries"
                iconType="search"
                tooltipTitle={intl.formatMessage(generalMessages.sidebarTooltipSearch)}
                linkClassName="sidebar__icon"
            />
        </>
    );
}

export default injectIntl(SidebarTopMenu);

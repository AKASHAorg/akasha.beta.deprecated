// @flow strict

import * as React from 'react';
import { Fill } from 'react-slot-fill';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import classnames from 'classnames';
import { APPBAR_SLOTS } from '../layouts/slot-names';
import { generalMessages } from '../../locale-data/messages';
import { notificationSelectors } from '../../local-flux/selectors';
import { Tooltip } from 'antd';
import { Icon, NotificationsPanel } from '../';
import { useTogglerWithClickAway } from '../../utils/clickAway';

/*::
    type OwnProps = {|
        setOpenDrawer: (drawerName: ?string) => void,
        openDrawer: ?string,
        intl: Object,
        className: ?string,
    |};
    type MappedStateProps = {|
        notificationsLoaded: boolean,
        unreadNotifications: number,
    |};
    type Props = {|
        ...OwnProps,
        ...MappedStateProps
    |};
*/

function UserNotification (props /* : Props */) {
    const elRef = React.useRef(null);
    const togglerRef = React.useRef(null);
    const [openDrawer, setOpenDrawer] = React.useState(false);

    useTogglerWithClickAway(togglerRef, elRef, setOpenDrawer, openDrawer);
    // console.log(openDrawer, "the open drawer");
    const iconClass = classnames(props.className, 'notification-icon', {
        'notification-icon_active': openDrawer
    });
    return (
        <>
            <Tooltip title={ props.intl.formatMessage(generalMessages.notifications) }>
                <Icon className={ `${ iconClass }` } ref={ togglerRef } type="notifications"/>
            </Tooltip>
            { props.notificationsLoaded && !!props.unreadNotifications && (
                <div className="flex-center top-bar-right__notifications-indicator"
                     ref={ togglerRef }>
                    { props.unreadNotifications }
                </div>
            ) }
            { openDrawer && (
                <Fill name={ APPBAR_SLOTS.RIGHT_PANEL }>
                    <>
                        <NotificationsPanel/>
                    </>
                </Fill>
            ) }
        </>
    );
}

const mapStateToProps = state => ({
    unreadNotifications: notificationSelectors.selectUnreadNotifications(state),
    notificationsLoaded: true
});

export default connect/*:: <Function, _, Function, _, MappedStateProps, _> */(mapStateToProps)(
    injectIntl(UserNotification)
);

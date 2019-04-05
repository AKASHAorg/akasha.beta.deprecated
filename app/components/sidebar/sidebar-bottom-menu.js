// @flow strict

import * as React from 'react';
import Link from 'react-router-dom/Link';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Popover } from 'antd';
import { generalMessages } from '../../locale-data/messages';
import { profileSelectors } from '../../local-flux/selectors';
import withRequest from '../high-order-components/with-request';
import { ManaPopover, EssencePopover, KarmaPopover, Avatar } from '../';
import { profileActions } from '../../local-flux/actions';
/*:: type Props = {||}; */

const getMenu = props => (
    <div onClick={() => props.onPopoverClick()}>
        <Link className="popover-menu__item" to={`/${props.loggedProfileEthAddress}`}>
            {props.intl.formatMessage(generalMessages.viewProfile)}
        </Link>
        <div onClick={() => props.onProfileEdit()} className="popover-menu__item">
            {props.intl.formatMessage(generalMessages.editProfile)}
        </div>
        <div className="popover-menu__item">
            <Link className="unstyled-link" to="/profileoverview/settings">
                {props.intl.formatMessage(generalMessages.userSettings)}
            </Link>
        </div>
        <div className="popover-menu__item">
            <Link className="unstyled-link" to="/profileoverview/preferences">
                {props.intl.formatMessage(generalMessages.appPreferences)}
            </Link>
        </div>
        <div onClick={props.onLogout} className="popover-menu__item">
            {props.intl.formatMessage(generalMessages.logout)}
        </div>
    </div>
);

function SidebarBottomMenu (props /* : Props */) {
    const [popoverMenuVisible, setPopoverMenuVisible] = React.useState(false);
    const {
        loggedProfileData,
        loggedProfileEthAddress,
        onProfileEdit,
        intl,
        dispatchAction,
        getActionStatus
    } = props;

    const onLogout = () => {};
    const handlePopoverClick = () => setPopoverMenuVisible(false);

    React.useEffect(() => {
        if (loggedProfileEthAddress) {
            dispatchAction(
                profileActions.profileGetData({ ethAddress: loggedProfileEthAddress }),
                getActionStatus(profileActions.profileGetData().type === null)
            );
        }
    }, [loggedProfileEthAddress]);

    if (!loggedProfileEthAddress) {
        return null;
    }

    return (
        <div>
            <div className="flex-center-x content-link sidebar__progress-wrapper">
                {/* <ManaPopover /> */}
            </div>
            <div className="flex-center-x content-link sidebar__progress-wrapper">
                {/* <EssencePopover /> */}
            </div>
            <div className="flex-center-x content-link sidebar__progress-wrapper">
                {/* <KarmaPopover /> */}
            </div>
            <div className="flex-center-x sidebar__avatar">
                <Popover
                    arrowPointAtCenter
                    placement="topRight"
                    content={getMenu({
                        intl,
                        loggedProfileEthAddress,
                        onProfileEdit,
                        onPopoverClick: handlePopoverClick
                    })}
                    trigger="click"
                    overlayClassName="popover-menu"
                    visible={popoverMenuVisible}
                    onVisibleChange={visible => setPopoverMenuVisible(visible)}
                >
                    <Avatar
                        firstName={loggedProfileData && loggedProfileData.get('firstName')}
                        image={loggedProfileData && loggedProfileData.get('avatar')}
                        lastName={loggedProfileData && loggedProfileData.get('lastName')}
                        size="small"
                    />
                </Popover>
            </div>
        </div>
    );
}
const mapStateToProps = state => ({
    loggedProfile: profileSelectors.getLoggedProfileData(state),
    loggedProfileEthAddress: profileSelectors.selectLoggedEthAddress(state)
});
export default connect(mapStateToProps)(injectIntl(withRequest(SidebarBottomMenu)));

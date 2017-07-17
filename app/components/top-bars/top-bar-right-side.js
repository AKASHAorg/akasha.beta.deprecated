import PropTypes from 'prop-types';
import React from 'react';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import { IconButton, SvgIcon } from 'material-ui';
import { Avatar, Balance, ServiceStatusBar } from '../';
import { getInitials } from '../../utils/dataModule';

const TopBarRightSide = ({
    balance,
    canEditProfile,
    loggedProfileData,
    history,
    location,
    onPanelNavigate,
    openNotificationPanel
}, { muiTheme }) => (
  <div style={{ display: 'flex', flex: '0 0 auto' }}>
    <div style={{ flex: '0 0 auto' }}>
      <ServiceStatusBar />
    </div>
    <div style={{ margin: '0 10px', width: '2px', backgroundColor: muiTheme.palette.borderColor }} />
    <div style={{ flex: '0 0 auto', marginRight: '10px' }}>
      <IconButton
        iconStyle={{ width: '24px', height: '24px' }}
        style={{ width: '32px', height: '32px', padding: '0px' }}
        onClick={openNotificationPanel}
      >
        <SvgIcon viewBox="0 0 18 18">
          <NotificationsIcon />
        </SvgIcon>
      </IconButton>
    </div>
    <div style={{ flex: '0 0 auto', marginRight: '10px', minWidth: '60px' }}>
      <Balance
        balance={balance}
        onClick={onPanelNavigate('wallet')}
      />
    </div>
    <div style={{ flex: '0 0 auto' }}>
      <Avatar
        image={loggedProfileData.avatar}
        radius={32}
        style={{ cursor: 'pointer' }}
        userInitials={getInitials(loggedProfileData.firstName, loggedProfileData.lastName)}
        userInitialsStyle={{ fontSize: '20px' }}
        onClick={
            onPanelNavigate(canEditProfile ? 'uprofile' : 'editprofile', history, location)
        }
      />
    </div>
  </div>
);

TopBarRightSide.contextTypes = {
    muiTheme: PropTypes.shape()
};

TopBarRightSide.propTypes = {
    balance: PropTypes.string,
    canEditProfile: PropTypes.bool,
    history: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    location: PropTypes.shape(),
    onPanelNavigate: PropTypes.func,
    openNotificationPanel: PropTypes.func,
};

export default TopBarRightSide;

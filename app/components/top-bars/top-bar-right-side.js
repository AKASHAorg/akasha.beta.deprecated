import React, { PropTypes } from 'react';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';
import { IconButton, SvgIcon } from 'material-ui';
import { Avatar, Balance, ServiceStatusBar } from '../';
import { getInitials } from '../../utils/dataModule';

const TopBarRightSide = ({ balance, loggedProfileData }, { muiTheme }) => (
  <div style={{ display: 'flex', flex: '0 0 auto' }}>
    <div style={{ flex: '0 0 auto' }}>
      <ServiceStatusBar />
    </div>
    <div style={{ margin: '0 10px', width: '2px', backgroundColor: muiTheme.palette.borderColor }} />
    <div style={{ flex: '0 0 auto', marginRight: '10px' }}>
      <IconButton
        iconStyle={{ width: '24px', height: '24px' }}
        style={{ width: '32px', height: '32px', padding: '0px' }}
      >
        <SvgIcon viewBox="0 0 18 18">
          <NotificationsIcon />
        </SvgIcon>
      </IconButton>
    </div>
    <div style={{ flex: '0 0 auto', marginRight: '10px', minWidth: '60px' }}>
      <Balance balance={balance} loggedAkashaId={loggedProfileData.get('akashaId')} />
    </div>
    <div style={{ flex: '0 0 auto' }}>
      <Avatar
        image={loggedProfileData.avatar}
        radius={32}
        style={{ cursor: 'pointer' }}
        userInitials={getInitials(loggedProfileData.firstName, loggedProfileData.lastName)}
        userInitialsStyle={{ fontSize: '20px' }}
      />
    </div>
  </div>
);

TopBarRightSide.contextTypes = {
    muiTheme: PropTypes.shape()
};

TopBarRightSide.propTypes = {
    balance: PropTypes.string,
    loggedProfileData: PropTypes.shape()
};

export default TopBarRightSide;

import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from 'antd';
import { Avatar, Balance, PanelLink, ServiceStatusBar } from '../';

const TopBarRightSide = ({
    balance,
    canEditProfile,
    loggedProfileData,
    openNotificationPanel,
    profileEditToggle
}, { muiTheme }) => (
  <div style={{ display: 'flex', flex: '0 0 auto' }}>
    <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center' }}>
      <ServiceStatusBar />
    </div>
    <div style={{ margin: '0 10px', width: '2px', backgroundColor: muiTheme.palette.borderColor }} />
    <div className="flex-center-y" style={{ flex: '0 0 auto', marginRight: '10px' }}>
      <Icon
        className="content-link"
        onClick={openNotificationPanel}
        style={{ fontSize: '20px' }}
        type="bell"
      />
    </div>
    <div style={{ flex: '0 0 auto', marginRight: '10px', minWidth: '60px' }}>
      <PanelLink to="wallet">
        <Balance balance={balance.get('eth')} short type="eth" />
      </PanelLink>
    </div>
    <div style={{ flex: '0 0 auto', marginRight: '10px', minWidth: '60px' }}>
      <PanelLink to="wallet">
        <Balance balance={balance.getIn(['aeth', 'free'])} short type="aeth" />
      </PanelLink>
    </div>
  </div>
);

TopBarRightSide.contextTypes = {
    muiTheme: PropTypes.shape()
};

TopBarRightSide.propTypes = {
    balance: PropTypes.shape().isRequired,
    canEditProfile: PropTypes.bool,
    loggedProfileData: PropTypes.shape(),
    openNotificationPanel: PropTypes.func,
    profileEditToggle: PropTypes.func
};

export default TopBarRightSide;

import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from 'antd';
import { Balance, ServiceStatusBar } from '../';

const TopBarRight = ({ balance, toggleAethWallet, toggleEthWallet }) => (
  <div className="top-bar-right">
    <div className="flex-center-y top-bar-right__services">
      <ServiceStatusBar />
    </div>
    <div className="top-bar-right__divider" />
    <div className="flex-center-y top-bar-right__notifications">
      <Icon
        className="content-link top-bar-right__notifications-icon"
        onClick={() => {}}
        type="bell"
      />
    </div>
    <div className="top-bar-right__balance" onClick={toggleEthWallet}>
      <Balance balance={balance.get('eth')} short type="eth" />
    </div>
    <div className="top-bar-right__balance" onClick={toggleAethWallet}>
      <Balance balance={balance.getIn(['aeth', 'free'])} short type="aeth" />
    </div>
  </div>
);

TopBarRight.propTypes = {
    balance: PropTypes.shape().isRequired,
    toggleAethWallet: PropTypes.func.isRequired,
    toggleEthWallet: PropTypes.func.isRequired,
};

export default TopBarRight;

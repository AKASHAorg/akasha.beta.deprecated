import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { Balance, Icon, ServiceStatusBar } from '../';

const TopBarRight = (props) => {
    const { balance, showTransactionsLog, showWallet, toggleAethWallet, toggleEthWallet } = props;
    const ethClass = classNames('top-bar-right__balance', {
        'top-bar-right__balance_selected': showWallet === 'ETH'
    });
    const aethClass = classNames('top-bar-right__balance', {
        'top-bar-right__balance_selected': showWallet === 'AETH'
    });
    return (
      <div className="top-bar-right">
        <div className="flex-center-y top-bar-right__services">
          <ServiceStatusBar />
        </div>
        <div className="flex-center-y top-bar-right__notifications">
          <Icon
            className="content-link top-bar-right__notifications-icon"
            onClick={() => {}}
            type="notifications"
          />
        </div>
        <div className="flex-center-y top-bar-right__notifications">
          <Icon
            className="content-link top-bar-right__notifications-icon"
            onClick={showTransactionsLog}
            type="notifications"
          />
        </div>
        <div className={ethClass} onClick={toggleEthWallet}>
          <Balance balance={balance.get('eth')} short type="eth" />
        </div>
        <div className={aethClass} onClick={toggleAethWallet}>
          <Balance balance={balance.getIn(['aeth', 'free'])} short type="aeth" />
        </div>
      </div>
    );
};

TopBarRight.propTypes = {
    balance: PropTypes.shape().isRequired,
    showTransactionsLog: PropTypes.func.isRequired,
    showWallet: PropTypes.string,
    toggleAethWallet: PropTypes.func.isRequired,
    toggleEthWallet: PropTypes.func.isRequired,
};

export default TopBarRight;

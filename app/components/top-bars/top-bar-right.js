import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import { Balance, Icon, ServiceStatusBar } from '../';
import { generalMessages, profileMessages } from '../../locale-data/messages';

const TopBarRight = (props) => {
    const { balance, cyclingStates, hasPendingActions, intl, notificationsLoaded, notificationsPanelOpen,
        showNotificationsPanel, showTransactionsLog, showWallet, toggleAethWallet, toggleEthWallet,
        transactionsLogOpen, unreadNotifications } = props;
    const ethClass = classNames('top-bar-right__balance', {
        'top-bar-right__balance_selected': showWallet === 'ETH'
    });
    const aethClass = classNames('top-bar-right__balance', {
        'top-bar-right__balance_selected': showWallet === 'AETH'
    });
    const activityClass = classNames('content-link top-bar-right__activity-icon', {
        'top-bar-right__activity-icon_selected': transactionsLogOpen
    });
    const notificationsClass = classNames('content-link top-bar-right__notifications-icon', {
        'top-bar-right__notifications-icon_selected': notificationsPanelOpen
    });
    const hasCycledAeth = !!(+cyclingStates.getIn(['available', 'total']));
    return (
      <div className="top-bar-right">
        <div className="flex-center-y top-bar-right__services">
          <ServiceStatusBar />
        </div>
        <div className="flex-center-y top-bar-right__icon-wrapper">
          <Tooltip title={intl.formatMessage(generalMessages.notifications)}>
            <Icon
              className={notificationsClass}
              onClick={showNotificationsPanel}
              type="notifications"
            />
          </Tooltip>
          {notificationsLoaded && !!unreadNotifications &&
            <div
              className="flex-center top-bar-right__notifications-indicator"
              onClick={showNotificationsPanel}
            >
              {unreadNotifications}
            </div>
          }
        </div>
        <div className="flex-center-y top-bar-right__icon-wrapper">
          <Tooltip title={intl.formatMessage(profileMessages.transactionsLog)}>
            <Icon
              className={activityClass}
              onClick={showTransactionsLog}
              type="activity"
            />
          </Tooltip>
          {hasPendingActions &&
            <div className="top-bar-right__pending-indicator" onClick={showTransactionsLog} />
          }
        </div>
        <div className={ethClass} onClick={toggleEthWallet}>
          <Balance balance={balance.get('eth')} short type="eth" />
        </div>
        <div className={aethClass} onClick={toggleAethWallet}>
          {hasCycledAeth &&
            <div className="top-bar-right__cycled-indicator" />
          }
          <Balance balance={balance.getIn(['aeth', 'free'])} short type="aeth" />
        </div>
      </div>
    );
};

TopBarRight.propTypes = {
    balance: PropTypes.shape().isRequired,
    cyclingStates: PropTypes.shape().isRequired,
    hasPendingActions: PropTypes.bool,
    intl: PropTypes.shape().isRequired,
    notificationsLoaded: PropTypes.bool,
    notificationsPanelOpen: PropTypes.bool,
    showNotificationsPanel: PropTypes.func.isRequired,
    showTransactionsLog: PropTypes.func.isRequired,
    showWallet: PropTypes.string,
    toggleAethWallet: PropTypes.func.isRequired,
    toggleEthWallet: PropTypes.func.isRequired,
    transactionsLogOpen: PropTypes.bool,
    unreadNotifications: PropTypes.number.isRequired,
};

export default injectIntl(TopBarRight);

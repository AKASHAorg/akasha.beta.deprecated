import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import Waypoint from 'react-waypoint';
import { Icon, Tabs, Timeline } from 'antd';
import classNames from 'classnames';
import { DataLoader, TransactionLog } from '../';
import { actionClearHistory, actionGetAllHistory } from '../../local-flux/actions/action-actions';
import { hideTransactionsLog } from '../../local-flux/actions/app-actions';
import { generalMessages, profileMessages } from '../../locale-data/messages';
import { selectActionsHistory, selectFetchingHistory, selectFetchingMoreHistory, selectLoggedEthAddress,
    selectPublishingActions } from '../../local-flux/selectors';
import clickAway from '../../utils/clickAway';

const PENDING = 'pending';
const HISTORY = 'history';

const { TabPane } = Tabs;
const { Item } = Timeline;

class TransactionsLogPanel extends Component {
    state = {
        activeTab: PENDING
    };

    componentDidMount () {
        this.props.actionGetAllHistory();
    }

    componentWillUnmount () {
        this.props.actionClearHistory();
    }

    componentClickAway = () => {
        this.props.hideTransactionsLog();
    };

    selectTab = (activeTab) => { this.setState({ activeTab }); };

    onEnter = () => {
        this.props.actionGetAllHistory(true);
    };

    renderHistoryActions = () => {
        const { darkTheme, fetchingHistory, fetchingMoreHistory, historyActions, intl,
            loggedEthAddress } = this.props;
        const imgClass = classNames('transactions-log-panel__placeholder', {
            'transactions-log-panel__placeholder_dark': darkTheme
        });

        return (
          <div className="transactions-log-panel__timeline-wrapper">
            <DataLoader flag={fetchingHistory}>
              <Timeline>
                {historyActions.map((action) => {
                    if (action.get('status') !== 'published') {
                        return null;
                    }
                    const iconClassName = action.get('success') ?
                        'transactions-log-panel__success' :
                        'transactions-log-panel__failed';
                    const iconType = action.get('success') ?
                        'check-circle-o' :
                        'close-circle-o';
                    return (
                      <Item
                        dot={<Icon className={iconClassName} type={iconType} />}
                        key={action.get('id')}
                      >
                        <TransactionLog
                          action={action}
                          key={action.get('id')}
                          loggedEthAddress={loggedEthAddress}
                        />
                      </Item>
                    );
                })}
              </Timeline>
              {!historyActions.size &&
                <div className="flex-center transactions-log-panel__placeholder-wrapper">
                  <div className={imgClass} />
                  <div className="transactions-log-panel__placeholder-message">
                    {intl.formatMessage(profileMessages.noTransactions)}
                  </div>
                </div>
              }
              {!!historyActions.size &&
                <DataLoader flag={fetchingMoreHistory} size="small">
                  <Waypoint onEnter={this.onEnter} />
                </DataLoader>
              }
            </DataLoader>
          </div>
        );
    }

    renderPendingActions = () => {
        const { darkTheme, intl, loggedEthAddress, pendingActions } = this.props;
        const imgClass = classNames('transactions-log-panel__placeholder', {
            'transactions-log-panel__placeholder_dark': darkTheme
        });
        return (
          <div className="transactions-log-panel__timeline-wrapper">
            <Timeline>
              {pendingActions.map(action => (
                <Item
                  dot={<Icon className="transactions-log-panel__pending" type="clock-circle-o" />}
                  key={action.get('id')}
                >
                  <TransactionLog
                    action={action}
                    key={action.get('id')}
                    loggedEthAddress={loggedEthAddress}
                  />
                </Item>
              ))}
            </Timeline>
            {!pendingActions.size &&
              <div className="flex-center transactions-log-panel__placeholder-wrapper">
                <div className={imgClass} />
                <div className="transactions-log-panel__placeholder-message">
                  {intl.formatMessage(profileMessages.noPendingTransactions)}
                </div>
              </div>
            }
          </div>
        );
    };

    render () {
        const { intl, pendingActions } = this.props;
        const { activeTab } = this.state;
        const pendingTab = (
          <span className="flex-center">
            {intl.formatMessage(generalMessages.pending)}
            <span className="flex-center transactions-log-panel__pending-count">{pendingActions.size}</span>
          </span>
        );

        return (
          <div className="transactions-log-panel">
            <div className="transactions-log-panel__header">
              <div className="transactions-log-panel__title">
                {intl.formatMessage(profileMessages.transactionsLog)}
              </div>
              <div className="transactions-log-panel__subtitle">
                {intl.formatMessage(profileMessages.transactionsLogSubtitle)}
              </div>
            </div>
            <Tabs
              activeKey={activeTab}
              onChange={this.selectTab}
              tabBarStyle={{ height: '40px', marginBottom: '0px' }}
              type="card"
            >
              <TabPane key={PENDING} tab={pendingTab}>
                {this.renderPendingActions()}
              </TabPane>
              <TabPane key={HISTORY} tab={intl.formatMessage(generalMessages.history)}>
                {this.renderHistoryActions()}
              </TabPane>
            </Tabs>
          </div>
        );
    }
}

TransactionsLogPanel.propTypes = {
    actionClearHistory: PropTypes.func.isRequired,
    actionGetAllHistory: PropTypes.func.isRequired,
    darkTheme: PropTypes.bool,
    fetchingHistory: PropTypes.bool,
    fetchingMoreHistory: PropTypes.bool,
    hideTransactionsLog: PropTypes.func.isRequired,
    historyActions: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    loggedEthAddress: PropTypes.string.isRequired,
    pendingActions: PropTypes.shape().isRequired,
};

function mapStateToProps (state) {
    return {
        darkTheme: state.settingsState.getIn(['general', 'darkTheme']),
        fetchingHistory: selectFetchingHistory(state),
        fetchingMoreHistory: selectFetchingMoreHistory(state),
        historyActions: selectActionsHistory(state),
        loggedEthAddress: selectLoggedEthAddress(state),
        pendingActions: selectPublishingActions(state),
    };
}

export default connect(
    mapStateToProps,
    {
        actionClearHistory,
        actionGetAllHistory,
        hideTransactionsLog
    }
)(injectIntl(clickAway(TransactionsLogPanel)));

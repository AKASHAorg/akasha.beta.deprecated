import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Tabs } from 'antd';
import { HistoryTable, Icon, TransferForm } from '../';
import { sendTip, transferEth } from '../../constants/action-types';
import { showNotification, toggleEthWallet } from '../../local-flux/actions/app-actions';
import { actionAdd, actionClearHistory, actionGetHistory } from '../../local-flux/actions/action-actions';
import { profileGetBalance } from '../../local-flux/actions/profile-actions';
import { searchProfiles, searchResetResults } from '../../local-flux/actions/search-actions';
import { getActionHistory, selectBalance, selectLoggedEthAddress,
    selectPendingActionByType, selectProfileSearchResults } from '../../local-flux/selectors';
import { generalMessages, profileMessages } from '../../locale-data/messages';
import clickAway from '../../utils/clickAway';

const { TabPane } = Tabs;
const WALLET = 'wallet';
const HISTORY = 'history';

class EthWallet extends Component {
    state = {
        activeTab: WALLET
    };

    componentDidMount () {
        this.props.actionGetHistory([sendTip, transferEth]);
        this.props.profileGetBalance();
    }

    componentWillUnmount () {
        this.props.actionClearHistory();
        this.props.searchResetResults();
    }

    componentClickAway = () => {
        this.props.toggleEthWallet();
    };

    selectTab = (activeTab) => { this.setState({ activeTab }); };

    onSubmit = (payload) => {
        const { loggedEthAddress } = this.props;
        this.props.actionAdd(loggedEthAddress, transferEth, payload);
    };

    renderHistory = () => {
        const { intl, sentTransactions } = this.props;
        const transactions = sentTransactions.filter(action => !!action.getIn(['payload', 'value']));
        const rows = transactions.map(action => ({
            action: (
              <span className="flex-center-y">
                <Icon className="eth-wallet__sent-icon" type="arrowUp" />
                {action.type === sendTip ?
                    intl.formatMessage(profileMessages.sentTip) :
                    intl.formatMessage(generalMessages.sent)
                }
              </span>
            ),
            amount: <span>{action.getIn(['payload', 'value'])} ETH</span>,
            blockNumber: action.get('blockNumber'),
            id: action.get('id'),
            success: action.get('success')
        }));

        return (
          <HistoryTable rows={rows} />
        );
    };

    render () {
        const { balance, intl, loggedEthAddress, pendingTransfer, profileResults } = this.props;
        const { activeTab } = this.state;
        return (
          <div className="eth-wallet">
            <div className="eth-wallet__header">
              <div>{intl.formatMessage(profileMessages.totalBalance)}</div>
              <div>
                <span className="eth-wallet__balance">{balance.get('eth')}</span>
                <span>{intl.formatMessage(generalMessages.eth)}</span>
              </div>
            </div>
            <Tabs
              activeKey={activeTab}
              onChange={this.selectTab}
              tabBarStyle={{ height: '40px', marginBottom: '0px' }}
              type="card"
            >
              <TabPane key={WALLET} tab={intl.formatMessage(generalMessages.wallet)}>
                <TransferForm
                  balance={balance.get('eth')}
                  dataSource={profileResults}
                  ethAddress={loggedEthAddress}
                  onCancel={this.props.toggleEthWallet}
                  onSubmit={this.onSubmit}
                  pendingTransfer={pendingTransfer}
                  searchProfiles={this.props.searchProfiles}
                  showNotification={this.props.showNotification}
                  type="eth"
                />
              </TabPane>
              <TabPane key={HISTORY} tab={intl.formatMessage(generalMessages.history)}>
                {this.renderHistory()}
              </TabPane>
            </Tabs>
          </div>
        );
    }
}

EthWallet.propTypes = {
    actionAdd: PropTypes.func.isRequired,
    actionClearHistory: PropTypes.func.isRequired,
    actionGetHistory: PropTypes.func.isRequired,
    balance: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    loggedEthAddress: PropTypes.string.isRequired,
    pendingTransfer: PropTypes.bool,
    profileGetBalance: PropTypes.func.isRequired,
    profileResults: PropTypes.shape().isRequired,
    searchProfiles: PropTypes.func.isRequired,
    searchResetResults: PropTypes.func.isRequired,
    sentTransactions: PropTypes.shape().isRequired,
    showNotification: PropTypes.func.isRequired,
    toggleEthWallet: PropTypes.func.isRequired,
};

function mapStateToProps (state) {
    return {
        balance: selectBalance(state),
        loggedEthAddress: selectLoggedEthAddress(state),
        pendingTransfer: selectPendingActionByType(state, transferEth),
        profileResults: selectProfileSearchResults(state),
        sentTransactions: getActionHistory(state)
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
        actionClearHistory,
        actionGetHistory,
        profileGetBalance,
        searchProfiles,
        searchResetResults,
        showNotification,
        toggleEthWallet,
    }
)(injectIntl(clickAway(EthWallet)));

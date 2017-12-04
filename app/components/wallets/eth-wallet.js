import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Tabs } from 'antd';
import { HistoryTable, Icon, TransferForm } from '../';
import { transferEth } from '../../constants/action-types';
import { toggleEthWallet } from '../../local-flux/actions/app-actions';
import { actionAdd, actionClearHistory, actionGetHistory } from '../../local-flux/actions/action-actions';
import { selectActionsHistory, selectBalance, selectLoggedEthAddress,
    selectPendingActionByType } from '../../local-flux/selectors';
import { generalMessages, profileMessages } from '../../locale-data/messages';

const { TabPane } = Tabs;
const WALLET = 'wallet';
const HISTORY = 'history';

class EthWallet extends Component {
    state = {
        activeTab: WALLET
    };

    componentDidMount () {
        this.props.actionGetHistory([transferEth]);
    }

    componentWillUnmount () {
        this.props.actionClearHistory();
    }

    selectTab = (activeTab) => { this.setState({ activeTab }); };

    onSubmit = (payload) => {
        const { loggedEthAddress } = this.props;
        this.props.actionAdd(loggedEthAddress, transferEth, payload);
    };

    renderHistory = () => {
        const { sentTransactions } = this.props;
        const rows = sentTransactions.map(action => ({
            action: (
              <span className="flex-center-y">
                <Icon className="eth-wallet__sent-icon" type="arrowUp" />
                Sent
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
        const { balance, intl, loggedEthAddress, pendingTransfer } = this.props;
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
                  ethAddress={loggedEthAddress}
                  balance={balance.get('eth')}
                  onCancel={this.props.toggleEthWallet}
                  onSubmit={this.onSubmit}
                  pendingTransfer={pendingTransfer}
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
    sentTransactions: PropTypes.shape().isRequired,
    toggleEthWallet: PropTypes.func.isRequired,
};

function mapStateToProps (state) {
    return {
        balance: selectBalance(state),
        loggedEthAddress: selectLoggedEthAddress(state),
        pendingTransfer: selectPendingActionByType(state, transferEth),
        sentTransactions: selectActionsHistory(state)
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
        actionClearHistory,
        actionGetHistory,
        toggleEthWallet
    }
)(injectIntl(EthWallet));

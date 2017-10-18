import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Icon, Tabs } from 'antd';
import { HistoryTable, TransferEthForm } from '../';
import { transferEth } from '../../constants/action-types';
import { toggleEthWallet } from '../../local-flux/actions/app-actions';
import { actionAdd, actionGetByType } from '../../local-flux/actions/action-actions';
import { selectActionsByType, selectBalance, selectLoggedEthAddress,
    selectPendingTransferEth } from '../../local-flux/selectors';
import { generalMessages, profileMessages } from '../../locale-data/messages';

const { TabPane } = Tabs;
const WALLET = 'wallet';
const HISTORY = 'history';

class EthWallet extends Component {
    state = {
        activeTab: WALLET
    };

    componentDidMount () {
        this.props.actionGetByType(transferEth);
    }

    selectTab = (activeTab) => { this.setState({ activeTab }); };

    onSubmit = (payload) => {
        const { loggedEthAddress } = this.props;
        this.props.actionAdd(loggedEthAddress, transferEth, payload);
    };

    renderHistory = () => {
        const { pendingTransactions, sentTransactions } = this.props;
        const rows = sentTransactions.map(action => ({
            action: <span><Icon className="eth-wallet__sent-icon" type="arrow-up" />Sent</span>,
            amount: <span>{action.getIn(['payload', 'value'])} ETH</span>,
            blockNumber: action.get('blockNumber'),
            id: action.get('id'),
            success: action.get('success')
        }));

        return (
          <HistoryTable rows={rows} />
        );
    }

    render () {
        const { balance, intl, loggedEthAddress } = this.props;
        const { activeTab } = this.state;
        return (
          <div className="eth-wallet">
            <div className="eth-wallet__header">
              <div>{intl.formatMessage(profileMessages.totalBalance)}</div>
              <div>
                <span className="eth-wallet__balance">{balance.get('eth')}</span>
                <span>ETH</span>
              </div>
            </div>
            <Tabs
              activeKey={activeTab}
              onChange={this.selectTab}
              tabBarStyle={{ height: '60px', marginBottom: '0px' }}
              type="card"
            >
              <TabPane key={WALLET} tab={intl.formatMessage(generalMessages.wallet)}>
                <TransferEthForm
                  ethAddress={loggedEthAddress}
                  ethBalance={balance.get('eth')}
                  onCancel={this.props.toggleEthWallet}
                  onSubmit={this.onSubmit}
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
    actionGetByType: PropTypes.func.isRequired,
    balance: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    loggedEthAddress: PropTypes.string.isRequired,
    pendingTransactions: PropTypes.shape().isRequired,
    sentTransactions: PropTypes.shape().isRequired,
    toggleEthWallet: PropTypes.func.isRequired,
};

function mapStateToProps (state) {
    return {
        balance: selectBalance(state),
        loggedEthAddress: selectLoggedEthAddress(state),
        pendingTransactions: selectPendingTransferEth(state),
        sentTransactions: selectActionsByType(state, transferEth)
    };
}

export default connect(
    mapStateToProps,
    {
        actionAdd,
        actionGetByType,
        toggleEthWallet
    }
)(injectIntl(EthWallet));

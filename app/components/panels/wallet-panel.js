import PropTypes from 'prop-types';
import React from 'react';
import { AethWallet, EthWallet } from '../';

const WalletPanel = (props) => {
    const { showWallet } = props;
    return (
      <div className="wallet-panel">
        {showWallet === 'AETH' && <AethWallet />}
        {showWallet === 'ETH' && <EthWallet />}
      </div>
    );
};

WalletPanel.propTypes = {
    showWallet: PropTypes.string.isRequired,
};

export default WalletPanel;

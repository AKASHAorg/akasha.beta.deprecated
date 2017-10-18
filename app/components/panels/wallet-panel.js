import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { EthWallet } from '../';
import clickAway from '../../utils/clickAway';

class WalletPanel extends Component {
    componentClickAway () {
        const { showWallet, toggleAethWallet, toggleEthWallet } = this.props;
        if (showWallet === 'AETH') {
            toggleAethWallet();
        } else if (showWallet === 'ETH') {
            toggleEthWallet();
        }
    }

    render () {
        const { showWallet } = this.props;
        return (
          <div className="wallet-panel">
            {showWallet === 'AETH' &&
              <div>AETH wallet</div>
            }
            {showWallet === 'ETH' &&
              <EthWallet

              />
            }
          </div>
        );
    }
}

WalletPanel.propTypes = {
    showWallet: PropTypes.string.isRequired,
    toggleAethWallet: PropTypes.func.isRequired,
    toggleEthWallet: PropTypes.func.isRequired
};

export default clickAway(WalletPanel);

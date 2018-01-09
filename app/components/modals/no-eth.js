import React from 'react';
import PropTypes from 'prop-types';

const NoEth = (props) => {
    const { faucet } = props;
    return (
      <div>
        {!faucet &&
            'You don`t have enough test ETH. Please request some by clicking the button below!'
        }
        {faucet === 'requested' &&
           'Test ETH requested, please wait for transaction confirmation!'
        }
        {faucet === 'success' &&
            'Test ETH received.'
        }
        {faucet === 'error' &&
            'Cannot request test ETH. Please try again later!'
        }
      </div>
    );
};

NoEth.propTypes = {
    faucet: PropTypes.string,
};

export default NoEth;

import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { generalMessages } from '../locale-data/messages';
import { formatBalance } from '../utils/number-formatter';

const Balance = ({ balance, intl }) => {
    if (!balance) {
        return null;
    }

    return (
      <div className="flex-center-y" style={{ height: '100%' }}>
        <div style={{ flex: '1 1 auto', marginRight: '5px' }}>
          {balance && formatBalance(balance, 7)}
        </div>
        <div style={{ flex: '0 0 auto' }}>
          {intl.formatMessage(generalMessages.aeth)}
        </div>
      </div>
    );
};

Balance.propTypes = {
    balance: PropTypes.string,
    intl: PropTypes.shape(),
};

export default injectIntl(Balance);

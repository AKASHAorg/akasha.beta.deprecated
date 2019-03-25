import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { generalMessages } from '../locale-data/messages';
import { formatBalance } from '../utils/number-formatter';

const Balance = ({ balance, intl, short, type }) => {
    if (!balance) {
        return null;
    }
    const length = short ? 4 : 7;
    return (
        <div className="content-link flex-center-y balance">
            <div className="balance__value">{balance && formatBalance(balance, length)}</div>
            <div className="balance__symbol">{intl.formatMessage(generalMessages[type])}</div>
        </div>
    );
};

Balance.propTypes = {
    balance: PropTypes.string,
    intl: PropTypes.shape(),
    short: PropTypes.bool,
    type: PropTypes.string.isRequired
};

export default injectIntl(Balance);

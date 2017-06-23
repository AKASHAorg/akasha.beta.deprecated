import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { generalMessages } from '../locale-data/messages';

const Balance = ({ balance, intl, loggedAkashaId }) => {
    if (!loggedAkashaId) {
        return null;
    }

    return (
      <div className="flex-center-y" style={{ height: '100%' }}>
        <div style={{ flex: '1 1 auto', marginRight: '5px' }}>
          {balance && balance.slice(0, 6)}
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
    loggedAkashaId: PropTypes.string
};

export default injectIntl(Balance);

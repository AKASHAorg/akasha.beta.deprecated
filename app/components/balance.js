import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { generalMessages } from '../locale-data/messages';

const Balance = ({ balance, intl, loggedAkashaId, onClick }) => {
    if (!loggedAkashaId) {
        return null;
    }
    return (
      <div className="flex-center-y" style={{ height: '100%', cursor: 'pointer' }} onClick={onClick}>
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
    loggedAkashaId: PropTypes.string,
    onClick: PropTypes.func
};

export default injectIntl(Balance);

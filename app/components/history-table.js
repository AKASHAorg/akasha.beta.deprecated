import PropTypes from 'prop-types';
import React from 'react';
import { injectIntl } from 'react-intl';
import { Icon, Spin, Tooltip } from 'antd';
import { generalMessages } from '../locale-data/messages';

const HistoryTable = ({ intl, rows }) => {
    const getBlockNumber = (row) => {
        if (!row.blockNumber) {
            return <Spin className="flex-center" delay={200} size="small" />;
        }
        if (row.success) {
            return row.blockNumber;
        }
        return (
          <div className="flex-center-x">
            <Tooltip title={intl.formatMessage(generalMessages.transactionFailed)}>
              <Icon className="history-table__error-icon" type="close-circle-o" />
            </Tooltip>
          </div>
        );
    };

    return (
      <div className="history-table">
        <div className="history-table__inner">
          <div className="flex-center-y history-table__header">
            <div className="history-table__action">
              {intl.formatMessage(generalMessages.action)}
            </div>
            <div className="history-table__amount">
              {intl.formatMessage(generalMessages.amount)}
            </div>
            <div className="history-table__block-number">
              {intl.formatMessage(generalMessages.block)}
            </div>
          </div>
          <div className="history-table__body">
            {rows.map(row => (
              <div className="flex-center-y history-table__row" key={row.id}>
                <div className="history-table__action">{row.action}</div>
                <div className="history-table__amount">{row.amount}</div>
                <div className="history-table__block-number">{getBlockNumber(row)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
};

HistoryTable.propTypes = {
    intl: PropTypes.shape().isRequired,
    rows: PropTypes.shape().isRequired
};

export default injectIntl(HistoryTable);

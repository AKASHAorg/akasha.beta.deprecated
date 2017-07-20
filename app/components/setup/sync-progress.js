import PropTypes from 'prop-types';
import React from 'react';
import { Progress } from 'antd';
import { MenuEthereum } from '../svg';

function SyncProgress ({ value }) {
    return (
      <div className="sync-progress">
        <Progress
          type="circle"
          percent={value}
          showInfo={false}
          strokeWidth={4}
          width={140}
        />
        <div className="sync-progress__icon-container">
          <svg className="sync-progress__icon" viewBox="0 0 32 32">
            <MenuEthereum style={{ fill: '#777' }} />
          </svg>
        </div>
      </div>
    );
}

SyncProgress.propTypes = {
    value: PropTypes.number
};

export default SyncProgress;

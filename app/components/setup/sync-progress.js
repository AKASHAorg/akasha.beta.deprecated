import PropTypes from 'prop-types';
import React from 'react';
import { Progress } from 'antd';

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
      </div>
    );
}

SyncProgress.propTypes = {
    value: PropTypes.number
};

export default SyncProgress;

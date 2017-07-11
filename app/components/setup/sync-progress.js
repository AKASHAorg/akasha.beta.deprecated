import PropTypes from 'prop-types';
import React from 'react';
import { CircularProgress } from '../';
import { MenuEthereum } from '../svg';

function SyncProgress ({ value, strokeWidth }, { muiTheme }) {
    return (
      <CircularProgress
        mode="determinate"
        strokeWidth={strokeWidth}
        size={4}
        value={value}
      >
        <MenuEthereum style={{ fill: muiTheme.palette.textColor }} />
      </CircularProgress>
    );
}

SyncProgress.propTypes = {
    strokeWidth: PropTypes.number,
    value: PropTypes.number
};

SyncProgress.contextTypes = {
    muiTheme: PropTypes.shape().isRequired
};

SyncProgress.defaultProps = {
    value: 1,
    strokeWidth: 1
};

export default SyncProgress;

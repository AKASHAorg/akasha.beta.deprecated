import PropTypes from 'prop-types';
import React from 'react';
import { LogsList } from '../shared-components';

const LogDetails = (props) => {
    const { gethLogs, gethStartLogger, gethStopLogger } = props;
    return (
      <div style={{ width: '100%' }}>
        <LogsList
          logs={gethLogs}
          startLogger={gethStartLogger}
          stopLogger={gethStopLogger}
        />
      </div>
    );
};

LogDetails.propTypes = {
    gethLogs: PropTypes.shape(),
    gethStartLogger: PropTypes.func,
    gethStopLogger: PropTypes.func,
};

export default LogDetails;

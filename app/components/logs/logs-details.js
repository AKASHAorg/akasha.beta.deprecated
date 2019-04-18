import PropTypes from 'prop-types';
import React from 'react';
import { LogsList } from '../';

const LogsDetails = (props) => {
    const { gethLogs, gethStartLogger, gethStopLogger } = props;
    return (
        <div style={ { width: '100%' } }>
            <LogsList
                logs={ gethLogs }
                startLogger={ gethStartLogger }
                stopLogger={ gethStopLogger }
            />
        </div>
    );
};

LogsDetails.propTypes = {
    gethLogs: PropTypes.shape(),
    gethStartLogger: PropTypes.func,
    gethStopLogger: PropTypes.func,
};

export default LogsDetails;

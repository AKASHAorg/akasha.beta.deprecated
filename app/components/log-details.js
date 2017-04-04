import React, { PropTypes } from 'react';
import { RaisedButton } from 'material-ui';
import { LogsList } from '../shared-components';
import PanelContainerFooter from '../components/PanelContainer/panel-container-footer';

const LogDetails = (props) => {
    const { gethLogs, gethStartLogger, gethStopLogger,
        timestamp } = props;
    return (
      <div>
        <LogsList
          logs={gethLogs}
          startLogger={gethStartLogger}
          stopLogger={gethStopLogger}
          timestamp={timestamp}
        />
        <PanelContainerFooter
          leftActions={
            <RaisedButton label={'Hide details'} onClick={() => props.history.goBack()} />
          }
        />
      </div>
    );
};
LogDetails.propTypes = {
    gethLogs: PropTypes.shape(),
    gethStartLogger: PropTypes.func,
    gethStopLogger: PropTypes.func,
    timestamp: PropTypes.number,
    history: PropTypes.shape()
};

export default LogDetails;

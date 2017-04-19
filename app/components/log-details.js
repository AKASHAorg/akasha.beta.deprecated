import React, { PropTypes } from 'react';
import { RaisedButton } from 'material-ui';
import { setupMessages } from '../locale-data/messages';
import { LogsList } from '../shared-components';
import { PanelContainerFooter } from './';

const LogDetails = (props) => {
    const { gethLogs, gethStartLogger, gethStopLogger, history, intl, timestamp } = props;
    return (
      <div style={{ width: '100%' }}>
        <LogsList
          logs={gethLogs}
          startLogger={gethStartLogger}
          stopLogger={gethStopLogger}
          timestamp={timestamp}
        />
        <PanelContainerFooter
          leftActions={
            <RaisedButton
              label={intl.formatMessage(setupMessages.hideDetails)}
              onClick={() => history.goBack()}
            />
          }
        />
      </div>
    );
};
LogDetails.propTypes = {
    gethLogs: PropTypes.shape(),
    gethStartLogger: PropTypes.func,
    gethStopLogger: PropTypes.func,
    history: PropTypes.shape(),
    intl: PropTypes.shape(),
    timestamp: PropTypes.number,
};

export default LogDetails;

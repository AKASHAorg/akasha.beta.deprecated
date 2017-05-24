import PropTypes from 'prop-types';
import React from 'react';
import { RaisedButton } from 'material-ui';
import { setupMessages } from '../locale-data/messages';
import { LogsList } from '../shared-components';
import { PanelContainerFooter } from './';

const LogDetails = (props) => {
    const { gethLogs, gethStartLogger, gethStopLogger, history, intl } = props;
    return (
      <div style={{ width: '100%' }}>
        <LogsList
          logs={gethLogs}
          startLogger={gethStartLogger}
          stopLogger={gethStopLogger}
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
};

export default LogDetails;

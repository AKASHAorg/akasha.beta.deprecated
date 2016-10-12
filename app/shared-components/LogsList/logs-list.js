import React, { Component, PropTypes } from 'react';
import { hoursMinutesSeconds } from '../../utils/dateFormatter';

const listStyle = {
    paddingLeft: 4,
    fontFamily: 'Consolas',
    listStyle: 'none',
    overflowY: 'auto'
};

class LogsList extends Component {

    componentWillMount () {
        const { eProcActions, timestamp } = this.props;
        eProcActions.startGethLogger(timestamp);
    }

    componentWillUnmount () {
        const { eProcActions } = this.props;
        eProcActions.stopGethLogger();
    }

    getLabelStyle (log) {
        let backgroundColor;
        switch (log.get('level')) {
            case 'warn':
                backgroundColor = 'orange';
                break;
            case 'error':
                backgroundColor = 'red';
                break;
            case 'info':
                backgroundColor = 'lightblue';
                break;
            default:
                backgroundColor = 'transparent';
                break;
        }
        return {
            flex: '0 0 auto',
            backgroundColor
        };
    }

    render () {
        const { gethLogs } = this.props;
        return <ul style={listStyle} className="col-xs-12">
          {gethLogs.map((log, key) => (
            <li key={key} style={{ marginBottom: '8px' }} >
              <div style={{ display: 'flex' }}>
                <abbr
                  title="Log Level"
                  style={this.getLabelStyle(log)}
                >
                  {log.get('level')}
                </abbr>
                <span style={{ flex: '1 1 auto', textAlign: 'right' }}>
                  {hoursMinutesSeconds(new Date(log.get('timestamp')))}
                </span>
              </div>
              <p style={{ marginTop: '7px' }}>{log.get('message')}</p>
            </li>)
          )
          }
        </ul>;
    }
}

LogsList.propTypes = {
    gethLogs: PropTypes.shape().isRequired,
    eProcActions: PropTypes.shape().isRequired,
    timestamp: PropTypes.number
};

export default LogsList;

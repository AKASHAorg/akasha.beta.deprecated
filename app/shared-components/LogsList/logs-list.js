import React, { Component, PropTypes } from 'react';
import { hoursMinutesSeconds } from '../../utils/dateFormatter';

const listStyle = {
    paddingLeft: 4,
    fontFamily: 'Consolas',
    listStyle: 'none',
    overflowY: 'auto',
    wordWrap: 'break-word'
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
        const { palette } = this.context.muiTheme;
        let backgroundColor;
        switch (log.get('level')) {
            case 'warn':
                backgroundColor = palette.accent2Color;
                break;
            case 'error':
                backgroundColor = palette.accent1Color;
                break;
            case 'info':
                backgroundColor = palette.primary1Color;
                break;
            default:
                backgroundColor = 'transparent';
                break;
        }
        return {
            flex: '0 0 auto',
            padding: '0 5px',
            color: palette.alternateTextColor,
            backgroundColor
        };
    }

    render () {
        const { gethLogs } = this.props;
        const style = Object.assign({}, listStyle, this.props.style);
        return (<ul style={style} className="col-xs-12">
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
        </ul>);
    }
}

LogsList.propTypes = {
    gethLogs: PropTypes.shape().isRequired,
    eProcActions: PropTypes.shape().isRequired,
    timestamp: PropTypes.number,
    style: PropTypes.shape()
};

LogsList.contextTypes = {
    muiTheme: PropTypes.shape().isRequired
};

export default LogsList;

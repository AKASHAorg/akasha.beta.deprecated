import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { hoursMinutesSeconds } from '../../utils/dateFormatter';

const listStyle = {
    paddingLeft: 4,
    fontFamily: 'Consolas',
    listStyle: 'none',
    overflowY: 'auto',
    wordWrap: 'break-word',
    margin: 0,
    padding: '16px'
};

class LogsList extends Component {

    componentWillMount () {
        const { startLogger } = this.props;
        startLogger();
    }

    componentWillUnmount () {
        const { stopLogger } = this.props;
        stopLogger();
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

    renderListItem (log, key) {
        return (
          <li key={`${key}-${log.get('timestamp')}`} style={{ marginBottom: '8px' }} >
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
            <p style={{ marginTop: '7px' }}>
              {log.get('message')}
            </p>
          </li>
        );
    }

    render () {
        const { logs } = this.props;
        const style = Object.assign({}, listStyle, this.props.style);
        const listItems = [];
        logs.forEach((value, key) => listItems.unshift(this.renderListItem(value, key)));
        return (
          <ul style={style}>
            {listItems}
          </ul>
        );
    }
}

LogsList.propTypes = {
    logs: PropTypes.shape().isRequired,
    startLogger: PropTypes.func.isRequired,
    stopLogger: PropTypes.func.isRequired,
    style: PropTypes.shape(),
};

LogsList.contextTypes = {
    muiTheme: PropTypes.shape().isRequired
};

export default LogsList;

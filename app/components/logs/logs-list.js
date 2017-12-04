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
    padding: '16px 0'
};

class LogsList extends Component {
    componentDidMount () {
        const { startLogger } = this.props;
        startLogger();
    }

    componentWillUnmount () {
        const { stopLogger } = this.props;
        stopLogger();
    }

    renderListItem = (log, key) => (
      <li key={`${key}-${log.get('timestamp')}`} style={{ marginBottom: '16px' }} >
        <div
          style={{
              display: 'flex',
              color: '#aaa',
              textTransform: 'uppercase',
              fontSize: '13px'
          }}
        >
          <span
            style={{
                flex: '0 0 auto'
            }}
          >
            {log.get('level')}
          </span>
          <span style={{ flex: '1 1 auto', textAlign: 'right' }}>
            {hoursMinutesSeconds(new Date(log.get('timestamp')))}
          </span>
        </div>
        <p style={{ marginTop: '6px' }}>
          {log.get('message')}
        </p>
      </li>
    );

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

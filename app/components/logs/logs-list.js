import PropTypes from 'prop-types';
import React, { Component } from 'react';
import classNames from 'classnames';
import { hoursMinutesSeconds } from '../../utils/dateFormatter';

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
      <li key={`${key}-${log.get('timestamp')}`} className="logs-list__list-item" >
        <div className="logs-list__list-item-header">
          <span className="logs-list__log-level">
            {log.get('level')}
          </span>
          <span className="logs-list__timestamp">
            {hoursMinutesSeconds(new Date(log.get('timestamp')))}
          </span>
        </div>
        <p className="logs-list__message">
          {log.get('message')}
        </p>
      </li>
    );

    render () {
        const { logs, modal } = this.props;
        const listItems = [];
        logs.forEach((value, key) => listItems.unshift(this.renderListItem(value, key)));
        const className = classNames('logs-list', {
            'logs-list_modal': modal
        });
        return (
          <ul className={className}>
            {listItems}
          </ul>
        );
    }
}

LogsList.propTypes = {
    logs: PropTypes.shape().isRequired,
    modal: PropTypes.bool,
    startLogger: PropTypes.func.isRequired,
    stopLogger: PropTypes.func.isRequired,
};

export default LogsList;

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import { Tooltip } from 'antd';
import { generalMessages } from '../../locale-data/messages';
import { Icon } from '../';

class Navigation extends Component {
    goBack = () => {
        const historyLocation = JSON.parse(localStorage.getItem('historyLocation'));
        if (historyLocation[historyLocation.length - 2] === '/setup/authenticate' ||
          historyLocation[historyLocation.length - 2] === '/setup/new-identity-interests' ||
          historyLocation.length === 1) {
            return;
        }
        this.props.history.goBack();
    }

    goForward = () => {
        const historyLocation = JSON.parse(localStorage.getItem('historyLocation'));
        if (historyLocation.length === 1) {
            return;
        }
        this.props.history.goForward();
    }

    render () {
        const { intl } = this.props;
        return (
          <div className="flex-center-y navigation">
            <Tooltip mouseEnterDelay={0.3} title={intl.formatMessage(generalMessages.back)}>
              <Icon className="content-link navigation__icon" onClick={this.goBack} type="back" />
            </Tooltip>
            <Tooltip mouseEnterDelay={0.3} title={intl.formatMessage(generalMessages.forward)}>
              <Icon className="content-link navigation__icon" onClick={this.goForward} type="forward" />
            </Tooltip>
          </div>
        );
    }
}

Navigation.propTypes = {
    history: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
};

export default withRouter(injectIntl(Navigation));

import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import { Tooltip } from 'antd';
import { generalMessages } from '../../locale-data/messages';
import { Icon } from '../';

const Navigation = ({ history, intl }) => (
  <div className="flex-center-y navigation">
    <Tooltip mouseEnterDelay={0.3} title={intl.formatMessage(generalMessages.back)}>
      <Icon className="content-link navigation__icon" onClick={history.goBack} type="back" />
    </Tooltip>
    <Tooltip mouseEnterDelay={0.3} title={intl.formatMessage(generalMessages.forward)}>
      <Icon className="content-link navigation__icon" onClick={history.goForward} type="forward" />
    </Tooltip>
  </div>
);

Navigation.propTypes = {
    history: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
};

export default withRouter(injectIntl(Navigation));

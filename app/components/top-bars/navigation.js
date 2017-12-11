import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { Icon } from '../';

const Navigation = ({ history }) => (
  <div className="flex-center-y navigation">
    <Icon className="content-link navigation__icon" onClick={history.goBack} type="back" />
    <Icon className="content-link navigation__icon" onClick={history.goForward} type="forward" />
  </div>
);

Navigation.propTypes = {
    history: PropTypes.shape().isRequired,
};

export default withRouter(Navigation);

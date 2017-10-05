import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import { dashboardAddNewColumn } from '../../local-flux/actions/dashboard-actions';
import { Breadcrumbs } from '../';

const DashboardTopBar = props => (
  <div className="flex-center-y">
    <Breadcrumbs />
    <Icon
      className="content-link"
      onClick={props.dashboardAddNewColumn}
      style={{ fontSize: '18px', fontWeight: 600, margin: '0px 8px' }}
      type="plus-circle-o"
    />
  </div>
);

DashboardTopBar.propTypes = {
    dashboardAddNewColumn: PropTypes.func.isRequired,
};

export default connect(
    null,
    {
        dashboardAddNewColumn
    }
)(DashboardTopBar);

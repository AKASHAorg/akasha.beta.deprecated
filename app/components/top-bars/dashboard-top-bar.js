import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { IconButton, SvgIcon } from 'material-ui';
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline';
import { dashboardAddNewColumn } from '../../local-flux/actions/dashboard-actions';
import { Breadcrumbs } from '../';

const DashboardTopBar = props => (
  <div className="flex-center-y">
    <Breadcrumbs />
    <IconButton
      iconStyle={{ width: '24px', height: '24px' }}
      onClick={props.dashboardAddNewColumn}
      style={{ width: '32px', height: '32px', padding: '0px', margin: '0 10px' }}
    >
      <SvgIcon viewBox="0 0 18 18">
        <AddIcon />
      </SvgIcon>
    </IconButton>
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

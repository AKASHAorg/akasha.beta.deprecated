import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { Column, NewColumn } from './';

const smallColumn = 360;
const largeColumn = 720;

const Dashboard = (props) => {
    const { columns, dashboards, getDashboardRef, match } = props;
    const dashboardId = match.params.dashboardId;
    const activeDashboard = dashboards.get(dashboardId);

    return (
      <div className="dashboard" id="dashboard-container" ref={getDashboardRef}>
        {activeDashboard && activeDashboard.get('columns').map((id) => {
            const column = columns.get(id);
            if (!column) {
                return null;
            }
            const baseWidth = column.get('large') ? largeColumn : smallColumn;
            const width = `${baseWidth}px`;

            return (
              <div
                className="dashboard__column"
                id={id}
                key={id}
                style={{ width }}
              >
                <Column
                  column={column}
                  baseWidth={baseWidth}
                />
              </div>
            );
        })}
        {activeDashboard && <NewColumn />}
      </div>
    );
};

Dashboard.propTypes = {
    columns: PropTypes.shape(),
    dashboards: PropTypes.shape(),
    getDashboardRef: PropTypes.func.isRequired,
    match: PropTypes.shape(),
};

export default withRouter(Dashboard);

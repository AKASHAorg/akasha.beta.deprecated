import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { Column, NewColumn } from './';

const smallColumn = 360;
const largeColumn = 720;

const Dashboard = (props) => {
    const { columns, dashboards, getDashboardRef, match, updateNewColumn } = props;
    const name = match.params.dashboardName;
    const activeDashboard = dashboards.get(name);

    return (
      <div className="dashboard" ref={getDashboardRef}>
        {activeDashboard && activeDashboard.get('columns').map((id, index) => {
            const column = columns.get(id);
            if (!column) {
                return null;
            }
            const baseWidth = column.get('large') ? largeColumn : smallColumn;
            const width = `${baseWidth}px`;

            return (
              <div
                className="dashboard__column"
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
        <NewColumn />
      </div>
    );
};

Dashboard.propTypes = {
    columns: PropTypes.shape(),
    dashboards: PropTypes.shape(),
    getDashboardRef: PropTypes.func.isRequired,
    match: PropTypes.shape(),
    updateNewColumn: PropTypes.func.isRequired
};

export default withRouter(Dashboard);

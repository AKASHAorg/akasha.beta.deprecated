import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { Column } from './';

const Dashboard = ({ columns, dashboards, match }) => {
    const name = match.params.dashboardName;
    const activeDashboard = dashboards.get(name);

    return (
      <div
        style={{
            position: 'absolute', display: 'flex', padding: '0 20px', height: '100%', overflowX: 'auto', left: 0, right: 0
        }}
      >
        {activeDashboard && activeDashboard.get('columns').map((id) => {
            const column = columns.get(id);
            if (!column) {
                return null;
            }
            const width = column.get('large') ? '720px' : '360px';
            return (
              <div key={id} style={{ flex: '0 0 auto', marginRight: '5px', width }}>
                <Column column={column} />
              </div>
            );
        })}
      </div>
    );
};

Dashboard.propTypes = {
    columns: PropTypes.shape(),
    dashboards: PropTypes.shape(),
    match: PropTypes.shape()
};

export default withRouter(Dashboard);

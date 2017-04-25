import PropTypes from 'prop-types';
import React from 'react';
import { Column } from './';

const Dashboard = ({ columns, activeDashboard }) => (
  <div style={{ display: 'flex', padding: '0 20px', height: '100%', backgroundColor: '#f7f7f7', overflowX: 'auto' }}>
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

Dashboard.propTypes = {
    activeDashboard: PropTypes.shape(),
    columns: PropTypes.shape(),
};

export default Dashboard;

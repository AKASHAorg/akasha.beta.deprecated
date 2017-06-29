import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { Column, NewColumn } from './';

const smallColumn = 360;
const largeColumn = 720;

const Dashboard = (props) => {
    const { columns, dashboards, getDashboardRef, match, newColumn, updateNewColumn } = props;
    const name = match.params.dashboardName;
    const activeDashboard = dashboards.get(name);

    return (
      <div
        ref={getDashboardRef}
        style={{
            position: 'absolute',
            display: 'flex',
            padding: '20px 20px 0',
            height: '100%',
            overflowX: 'auto',
            left: 0,
            right: 0
        }}
      >
        {activeDashboard && activeDashboard.get('columns').map((id, index) => {
            const column = columns.get(id);
            if (!column) {
                return null;
            }
            const isLast = !newColumn && index === activeDashboard.get('columns').size - 1;
            const baseWidth = column.get('large') ? largeColumn : smallColumn;
            const width = isLast ? `${baseWidth + 20}px` : `${baseWidth}px`;

            return (
              <div
                key={id}
                style={{ flex: '0 0 auto', marginRight: '5px', width, paddingRight: isLast ? '20px' : 0 }}
              >
                <Column column={column} />
              </div>
            );
        })}
        {newColumn &&
          <NewColumn
            column={newColumn}
            updateNewColumn={updateNewColumn}
          />
        }
      </div>
    );
};

Dashboard.propTypes = {
    columns: PropTypes.shape(),
    dashboards: PropTypes.shape(),
    getDashboardRef: PropTypes.func.isRequired,
    match: PropTypes.shape(),
    newColumn: PropTypes.shape(),
    updateNewColumn: PropTypes.func.isRequired
};

export default withRouter(Dashboard);

import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { Column, NewColumn } from './';
import { dashboardMessages } from '../locale-data/messages/dashboard-messages';

const smallColumn = 320;
const largeColumn = 480;

const Dashboard = (props) => {
    const { columns, darkTheme, dashboardCreateNew, dashboards, getDashboardRef, intl, match } = props;
    const dashboardId = match.params.dashboardId;
    const activeDashboard = dashboards.get(dashboardId);
    const imgClass = classNames('dashboard__empty-placeholder-img', {
        'dashboard__empty-placeholder-img_dark': darkTheme
    });

    return (
      <div className="dashboard" id="dashboard-container" ref={getDashboardRef}>
        {activeDashboard && activeDashboard.get('columns').map((id) => {
            const column = columns.get(id);
            if (!column) {
                return null;
            }
            const baseWidth = column.get('large') ? largeColumn : smallColumn;
            const width = column.get('large') ? '540px' : '360px';

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
                  type={column.get('type')}
                />
              </div>
            );
        })}
        {activeDashboard && <NewColumn dashboardId={dashboardId} />}
        {!activeDashboard &&
          <div className="flex-center dashboard__empty-placeholder">
            <div className={imgClass} />
            <span className="dashboard__placeholder-text">
              {intl.formatMessage(dashboardMessages.noDashboards)}
            </span>
            <span className="content-link dashboard__create-button" onClick={dashboardCreateNew}>
              {intl.formatMessage(dashboardMessages.createOneNow)}
            </span>
          </div>
        }
      </div>
    );
};

Dashboard.propTypes = {
    columns: PropTypes.shape(),
    darkTheme: PropTypes.bool,
    dashboardCreateNew: PropTypes.func.isRequired,
    dashboards: PropTypes.shape(),
    getDashboardRef: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    match: PropTypes.shape(),
};

export default withRouter(injectIntl(Dashboard));

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Icon, Tooltip } from 'antd';
import * as columnTypes from '../../constants/columns';
import { dashboardAddNewColumn } from '../../local-flux/actions/dashboard-actions';
import { selectActiveDashboardColumns } from '../../local-flux/selectors';
import { dashboardMessages } from '../../locale-data/messages';
import { getDisplayAddress, isEthAddress } from '../../utils/dataModule';
import { ColumnLatest, ColumnProfile, ColumnStream, ColumnTag } from '../svg';

const DashboardTopBar = (props) => {
    const { columns, history, intl } = props;
    const icons = {
        [columnTypes.latest]: <ColumnLatest />,
        [columnTypes.profile]: <ColumnProfile />,
        [columnTypes.stream]: <ColumnStream />,
        [columnTypes.tag]: <ColumnTag />
    };
    const scrollColumnIntoView = (id) => {
        const dashboard = document.getElementById('dashboard-container');
        const column = document.getElementById(id);
        const columnLeftOffset = column.offsetLeft;
        const scrollLeft = (columnLeftOffset - (dashboard.clientWidth / 2)) + (column.clientWidth / 2);
        dashboard.scrollLeft = scrollLeft;
    };
    const getTooltip = (column) => {
        const type = column.get('type');
        const value = column.get('value');
        switch (type) {
            case columnTypes.latest:
                return intl.formatMessage(dashboardMessages.latest);
            case columnTypes.profile:
                return isEthAddress(value) ? getDisplayAddress(value) : `@${value}`;
            case columnTypes.stream:
                return intl.formatMessage(dashboardMessages.stream);
            case columnTypes.tag:
                return `#${value}`;
            default:
                return '';
        }
    };

    return (
      <div className="flex-center-y dashboard-top-bar">
        <div className="flex-center-y dashboard-top-bar__navigation">
          <Icon className="content-link" onClick={history.goBack} type="left" />
          <Icon className="content-link" onClick={history.goForward} type="right" />
        </div>
        {columns.map(column => (
          <Tooltip key={column.get('id')} title={() => getTooltip(column)}>
            <svg
              className="content-link dashboard-top-bar__column-icon"
              onClick={() => scrollColumnIntoView(column.get('id'))}
              viewBox="0 0 18 18"
            >
              {icons[column.get('type')]}
            </svg>
          </Tooltip>
        ))}
        <Icon
          className="content-link dashboard-top-bar__add-icon"
          onClick={props.dashboardAddNewColumn}
          type="plus-square"
        />
      </div>
    );
};

DashboardTopBar.propTypes = {
    columns: PropTypes.shape().isRequired,
    dashboardAddNewColumn: PropTypes.func.isRequired,
    history: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired
};

function mapStateToProps (state) {
    return {
        columns: selectActiveDashboardColumns(state)
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardAddNewColumn
    }
)(injectIntl(DashboardTopBar));

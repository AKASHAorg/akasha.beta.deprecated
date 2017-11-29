import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Tooltip } from 'antd';
import * as columnTypes from '../../constants/columns';
import { dashboardAddNewColumn } from '../../local-flux/actions/dashboard-actions';
import { selectActiveDashboardColumns } from '../../local-flux/selectors';
import { dashboardMessages } from '../../locale-data/messages';
import { getDisplayAddress, isEthAddress } from '../../utils/dataModule';
import { Icon, Navigation, PlusSquareIcon } from '../';

const iconsTypes = {
    [columnTypes.latest]: 'entries',
    [columnTypes.profile]: 'user',
    [columnTypes.stream]: 'entries',
    [columnTypes.tag]: 'tag',
    [columnTypes.list]: 'entries'
};

const DashboardTopBar = (props) => {
    const { columns, intl } = props;
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
        <Navigation />
        {columns.map(column => (
          <Tooltip key={column.get('id')} title={() => getTooltip(column)}>
            <Icon
              className="content-link dark-icon dashboard-top-bar__column-icon"
              onClick={() => scrollColumnIntoView(column.get('id'))}
              type={iconsTypes[column.get('type')]}
            />
          </Tooltip>
        ))}
        <Tooltip title={intl.formatMessage(dashboardMessages.addColumn)}>
          <div onClick={props.dashboardAddNewColumn}>
            <PlusSquareIcon />
          </div>
        </Tooltip>
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

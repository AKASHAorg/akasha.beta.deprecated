import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Tooltip } from 'antd';
import * as columnTypes from '../../constants/columns';
import { dashboardAddNewColumn } from '../../local-flux/actions/dashboard-actions';
import { selectActiveDashboard, selectActiveDashboardColumns } from '../../local-flux/selectors';
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

const removeClass = (id) => {
    const column = document.getElementById(id);
    if (column) {
        const className = column.getAttribute('class');
        const newClassName = className.replace('column_focused', '');
        column.setAttribute('class', newClassName);
    }
};

const DashboardTopBar = (props) => {
    const { activeDashboard, columns, intl, lists } = props;
    const addColumnTooltip = activeDashboard ?
        intl.formatMessage(dashboardMessages.addColumn) :
        intl.formatMessage(dashboardMessages.createDashboardFirst);
    const scrollColumnIntoView = (id) => {
        const dashboard = document.getElementById('dashboard-container');
        const column = document.getElementById(id);
        const className = column.getAttribute('class');
        column.setAttribute('class', `${className} column_focused`);
        setTimeout(() => removeClass(id), 500);
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
            case columnTypes.list:
                return lists.getIn([value, 'name']);
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
              className="content-link dashboard-top-bar__column-icon"
              onClick={() => scrollColumnIntoView(column.get('id'))}
              type={iconsTypes[column.get('type')]}
            />
          </Tooltip>
        ))}
        <Tooltip title={addColumnTooltip}>
          <div onClick={activeDashboard ? props.dashboardAddNewColumn : undefined}>
            <PlusSquareIcon disabled={!activeDashboard} />
          </div>
        </Tooltip>
      </div>
    );
};

DashboardTopBar.propTypes = {
    activeDashboard: PropTypes.shape(),
    columns: PropTypes.shape().isRequired,
    dashboardAddNewColumn: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    lists: PropTypes.shape().isRequired,
};

function mapStateToProps (state) {
    return {
        activeDashboard: selectActiveDashboard(state),
        columns: selectActiveDashboardColumns(state),
        lists: state.listState.get('byId')
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardAddNewColumn
    }
)(injectIntl(DashboardTopBar));

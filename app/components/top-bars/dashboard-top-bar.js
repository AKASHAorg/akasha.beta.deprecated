import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Tooltip } from 'antd';
import { symmetricDifference, pick } from 'ramda';
import * as columnTypes from '../../constants/columns';
import { dashboardAddNewColumn, dashboardReorderColumn } from '../../local-flux/actions/dashboard-actions';
import { selectActiveDashboard, selectActiveDashboardId,
    selectActiveDashboardColumns } from '../../local-flux/selectors';
import { dashboardMessages } from '../../locale-data/messages';
import { getDisplayAddress, isEthAddress } from '../../utils/dataModule';
import { DashboardPopover, Navigation, PlusSquareIcon, TopBarIcon } from '../';

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

class DashboardTopBar extends Component {
    componentWillReceiveProps (nextProps) {
        const { history } = this.props;
        if (nextProps.activeDashboardId !== this.props.activeDashboardId &&
            nextProps.match.params.dashboardId !== nextProps.activeDashboardId
        ) {
            history.push(`/dashboard/${nextProps.activeDashboardId}`);
        }
    }

    shouldComponentUpdate (nextProps) {
        return !!(symmetricDifference([this.props], [pick(Object.keys(this.props), nextProps)])).length;
    }

    render () {
        const { activeDashboard, columns, intl, lists } = this.props;
        const addColumnTooltip = activeDashboard ?
            intl.formatMessage(dashboardMessages.addColumn) :
            intl.formatMessage(dashboardMessages.createDashboardFirst);
        const scrollColumnIntoView = (id) => {
            const dashboard = document.getElementById('dashboard-container');
            const column = document.getElementById(id);
            const className = column.getAttribute('class');
            column.setAttribute('class', `${className} column_focused`);
            setTimeout(() => removeClass(id), 500);
            const columnLeftOffset = column.style.left.replace('"', '').replace('px', '');
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
            <DashboardPopover />
            {columns.map((column, i) => (
              <TopBarIcon
                key={column.get('id')}
                id={column.get('id')}
                index={i}
                title={() => getTooltip(column)}
                iconType={iconsTypes[column.get('type')]}
                scrollIntoView={() => scrollColumnIntoView(column.get('id'))}
                dashboardReorderColumn={
                    (source, target) =>
                        this.props.dashboardReorderColumn(this.props.activeDashboardId, source, target)
                }
              />
            ))}
            <Tooltip title={addColumnTooltip}>
              <div onClick={activeDashboard ? this.props.dashboardAddNewColumn : undefined}>
                <PlusSquareIcon disabled={!activeDashboard} large />
              </div>
            </Tooltip>
          </div>
        );
    }
}

DashboardTopBar.propTypes = {
    activeDashboard: PropTypes.shape(),
    activeDashboardId: PropTypes.string,
    columns: PropTypes.shape().isRequired,
    dashboardAddNewColumn: PropTypes.func.isRequired,
    dashboardReorderColumn: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    history: PropTypes.shape(),
    match: PropTypes.shape(),
    lists: PropTypes.shape().isRequired,
};

function mapStateToProps (state) {
    return {
        activeDashboard: selectActiveDashboard(state),
        activeDashboardId: selectActiveDashboardId(state),
        columns: selectActiveDashboardColumns(state),
        lists: state.listState.get('byId')
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardAddNewColumn,
        dashboardReorderColumn
    }
)(injectIntl(DashboardTopBar));

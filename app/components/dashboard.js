import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { List } from 'immutable';
import { equals } from 'ramda';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { DropTarget } from 'react-dnd';
import { Column, NewColumn } from './';
import { dashboardMessages } from '../locale-data/messages/dashboard-messages';
import * as dragItemTypes from '../constants/drag-item-types';
import { largeColumnWidth, smallColumnWidth } from '../constants/columns';

class Dashboard extends Component {
    state = {
        draggingColumn: {
            id: null,
            large: false,
        },
        columnPlaceholder: {
            drag: null,
            hover: null,
        },
    }

    shouldComponentUpdate = (nextProps, nextState) => {
        return !equals(nextState.draggingColumn, this.state.draggingColumn) ||
            !equals(nextState.columnPlaceholder, this.state.columnPlaceholder) ||
            !nextProps.dashboards.equals(this.props.dashboards) ||
            equals(nextProps.match.params, this.props.match.params);
    }

    _handleBeginDrag = (column) => {
        this.setState({
            draggingColumn: {
                id: column.get('id'),
                large: column.get('large'),
            }
        });
    }
    _handleEndDrag = () => {
        const { dashboardReorderColumn, match, dashboards } = this.props;
        const { columnPlaceholder } = this.state;
        const { dashboardId } = match.params;
        const activeDashboard = dashboards.get(dashboardId);
        if (columnPlaceholder.drag !== columnPlaceholder.hover) {
            dashboardReorderColumn(
                activeDashboard.get('id'),
                columnPlaceholder.drag,
                columnPlaceholder.hover
            );
        }
        this.setState({
            draggingColumn: {
                id: null,
                large: false
            },
            columnPlaceholder: {
                drag: null,
                hover: null
            }
        });
    }
    _handleDragHover = () => {
        // console.log('hover over', column);
    }
    _handleIsDragging = () => {
        // console.log('is dragging', column);
    }
    _handleNeighbourHover = (dragIndex, hoverIndex) => {
        this.setState({
            columnPlaceholder: {
                drag: dragIndex,
                hover: hoverIndex,
            },
        });
    }
    _getColumns = (cols) => {
        const { columnPlaceholder } = this.state;
        const { drag, hover } = columnPlaceholder;
        const dragCard = cols.get(columnPlaceholder.drag);
        return cols.delete(drag).insert(hover, dragCard);
    }
    render () {
        const { columns, darkTheme, dashboardCreateNew, dashboards, getDashboardRef,
            intl, match, connectDropTarget } = this.props;
        const { draggingColumn, columnPlaceholder } = this.state;
        const { dashboardId } = match.params;
        const activeDashboard = dashboards.get(dashboardId);
        const imgClass = classNames('dashboard__empty-placeholder-img', {
            'dashboard__empty-placeholder-img_dark': darkTheme
        });
        let activeDashboardColumns = new List();
        if (activeDashboard && activeDashboard.get('columns')) {
            activeDashboardColumns = activeDashboard.get('columns');
        }
        if (activeDashboardColumns.size && columnPlaceholder.hover !== null) {
            activeDashboardColumns = this._getColumns(activeDashboardColumns);
        }
        // console.log('active cols:', activeDashboardColumns.toJS());
        return connectDropTarget(
          <div className="dashboard" id="dashboard-container" ref={getDashboardRef}>
            {activeDashboardColumns.map((id, index) => {
                const column = columns.get(id);
                if (!column) {
                    return null;
                }
                const baseWidth = column.get('large') ? largeColumnWidth : smallColumnWidth;
                const width = column.get('large') ? largeColumnWidth : smallColumnWidth;
                const isDragging = column.get('id') === draggingColumn.id;
                return (
                  <div
                    className={
                        `dashboard__column
                        dashboard__column${isDragging ? '_dragging' : ''}`
                    }
                    id={id}
                    key={id}
                    style={{ width }}
                  >
                    <Column
                      column={column}
                      baseWidth={baseWidth}
                      type={column.get('type')}
                      onBeginDrag={this._handleBeginDrag}
                      onEndDrag={this._handleEndDrag}
                      isColumnDragging={this._handleIsDragging}
                      onDragHover={this._handleDragHover}
                      onNeighbourHover={this._handleNeighbourHover}
                      inDragMode={isDragging}
                      columnIndex={index}
                      intl={intl}
                      large={column.get('large')}
                      draggable
                    />
                  </div>
                );
            })}
            {activeDashboard && <NewColumn />}
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
    }
}

Dashboard.propTypes = {
    columns: PropTypes.shape(),
    darkTheme: PropTypes.bool,
    dashboardCreateNew: PropTypes.func.isRequired,
    dashboards: PropTypes.shape(),
    getDashboardRef: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    match: PropTypes.shape(),
    connectDropTarget: PropTypes.func,
    dashboardReorderColumn: PropTypes.func,
};

export default withRouter(DropTarget(dragItemTypes.COLUMN, {}, connect => ({
    connectDropTarget: connect.dropTarget(),
}))(injectIntl(Dashboard)));

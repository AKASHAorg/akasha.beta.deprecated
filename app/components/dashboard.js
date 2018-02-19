import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { DropTarget } from 'react-dnd';
import { Column, NewColumn } from './';
import { dashboardMessages } from '../locale-data/messages/dashboard-messages';

const smallColumn = 320;
const largeColumn = 480;

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
    _handleBeginDrag = (column) => {
        // console.log('dragging column', column);
        this.setState({
            draggingColumn: {
                id: column.get('id'),
                large: column.get('large'),
            }
        });
    }
    _handleEndDrag = (column) => {
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
    _handleDragHover = (column) => {
        // console.log('hover over', column);
    }
    _handleIsDragging = (column) => {
        // console.log('is dragging', column);
    }
    _handleNeighbourHover = (dragIndex, hoverIndex) => {
        // console.log('just entered', dragIndex, hoverIndex, 'with hover');
        this.setState({
            columnPlaceholder: {
                drag: dragIndex,
                hover: hoverIndex,
            },
        });
        // const { match, dashboards } = this.props;
        // const { draggingColumn } = this.state;
        // const dashboardId = match.params.dashboardId;
        // const activeDashboard = dashboards.get(dashboardId);
        // const columns = activeDashboard.get('columns');
        // const neighbourColumnId = neighbourColumn.get('id');
        // const neighbourColumnIndex = columns.findIndex(colId => colId === neighbourColumnId);
        // const currentColumnIndex = columns.findIndex(colId => colId === draggingColumn.id);
        // const placeholderPosition = currentColumnIndex > neighbourColumnIndex ? 'before' : 'after';
        // // console.log('insert placeholder', placeholderPosition, neighbourColumnIndex);
        // this.setState({
        //     columnPlaceholder: {
        //         index: neighbourColumnIndex,
        //         position: placeholderPosition
        //     }
        // });
    }
    _getColumns = (cols) => {
        const { columnPlaceholder } = this.state;
        const { drag, hover } = columnPlaceholder;
        const dragCard = cols.get(columnPlaceholder.drag);
        return cols.splice(drag, 1, cols.splice(hover, 0, dragCard));
    }
    render () {
        const { columns, darkTheme, dashboardCreateNew, dashboards, getDashboardRef,
            intl, match, connectDropTarget } = this.props;
        const { draggingColumn, columnPlaceholder } = this.state;
        const dashboardId = match.params.dashboardId;
        const activeDashboard = dashboards.get(dashboardId);
        let activeDashboardColumns = activeDashboard && activeDashboard.get('columns');
        const imgClass = classNames('dashboard__empty-placeholder-img', {
            'dashboard__empty-placeholder-img_dark': darkTheme
        });
        console.log(this._getColumns(activeDashboardColumns));
        if (activeDashboardColumns.size && columnPlaceholder.hoverIndex) {
            activeDashboardColumns = this._getColumns(activeDashboardColumns);
        }
        // console.log(activeDashboardColumns, 'adc');
        return connectDropTarget(
          <div className="dashboard" id="dashboard-container" ref={getDashboardRef}>
            {activeDashboardColumns.map((id, index) => {
                const column = columns.get(id);
                if (!column) {
                    return null;
                }
                const baseWidth = column.get('large') ? largeColumn : smallColumn;
                const width = column.get('large') ? '540px' : '360px';
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
};

export default withRouter(injectIntl(DropTarget('COLUMN', {}, connect => ({
    connectDropTarget: connect.dropTarget(),
}))(Dashboard)));

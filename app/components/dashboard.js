import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Map, List } from 'immutable';
import { equals } from 'ramda';
import { withRouter } from 'react-router';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { DropTarget } from 'react-dnd';
import throttle from 'lodash.throttle';
import { Column, NewColumn } from './';
import { dashboardMessages } from '../locale-data/messages/dashboard-messages';
import * as dragItemTypes from '../constants/drag-item-types';
import { largeColumnWidth, smallColumnWidth } from '../constants/columns';

class Dashboard extends Component {
    constructor (props) {
        super(props);
        this.state = {
            draggingColumn: {
                id: null,
                large: false,
            },
            columnPlaceholder: {
                drag: null,
                hover: null,
            },
            viewportScrolledWidth: 0,
            columnOrder: new Map(),
        };
        this.columnData = new Map();
        this._throttledScroll = throttle(this._handleDashboardScroll, 150, { trailing: true });
    }

    columnMarginLeft = 12;
    /**
     * set initial column order in state
     */
    componentWillMount () {
        const { match } = this.props;
        const { dashboardId } = match.params;
        if(dashboardId && !this.state.columnOrder.get(dashboardId)) {
            this.setState({
                columnOrder: this.state.columnOrder.set(dashboardId, new Map())
            });
        }
        window.removeEventListener('resize', this._throttledScroll);
    }

    componentDidMount () {
        const { match, dashboards, columns } = this.props;
        const { dashboardId } = match.params;
        const activeDashboard = dashboards.get(dashboardId);
        window.addEventListener('resize', this._throttledScroll);
        if(this._dashboardNode && activeDashboard) {
            this._calculateColumnData(activeDashboard.get('columns'), dashboardId, columns);
        }
        if (dashboardId && activeDashboard) {
            this._mapColumnsToState(activeDashboard.get('columns'), dashboardId);
        }
    }

    componentWillReceiveProps (nextProps) {
        const { match, dashboards, columns } = nextProps;
        const { dashboardId } = match.params;
        const activeDashboard = dashboards.get(dashboardId);
        const isNewDashboard = dashboardId && (dashboardId !== this.props.match.params.dashboardId);
        const columnsChanged = activeDashboard && !activeDashboard.get('columns')
            .equals(this.props.dashboards.getIn([dashboardId, 'columns']));
        if(!activeDashboard) {
            return;
        }
        if (dashboardId && !this.state.columnOrder.get(dashboardId)) {
            return this.setState({
                columnOrder: this.state.columnOrder.set(dashboardId, new Map())
            });
        }
        if (isNewDashboard || columnsChanged) {
            if(this._dashboardNode) {
                return this._calculateColumnData(activeDashboard.get('columns'), dashboardId, columns, () => {
                    this._mapColumnsToState(activeDashboard.get('columns'), dashboardId);
                });
            }
            this._mapColumnsToState(activeDashboard.get('columns'), dashboardId);
        }
    }

    /**
     * set column order in state
     */
    _mapColumnsToState = (columnList, dashboardId) => {
        const { columnOrder } = this.state;
        if (dashboardId && columnList.size) {
            const newOrder = columnOrder.set(dashboardId, columnList);
            this.setState(() => ({
                columnOrder: newOrder
            }));
        }
    }
    /**
     * calculate left position and other column data and store it
     */
    _calculateColumnData = (columnOrder, dashboardId, columns, cb) => {
        const { viewportScrolledWidth } = this.state;
        const dashboardWidth = this._dashboardNode.getBoundingClientRect().width;
        let accWidth = 0;
        if(!columnOrder.size) {
            return this.columnData = this.columnData.delete(dashboardId);
        }
        if(this.columnData.get(dashboardId) && columnOrder.size !== this.columnData.get(dashboardId).size) {
            this.columnData = this.columnData.set(dashboardId, new Map());
        }
        columnOrder.forEach((colId, index) => {
            const colData = columns.get(colId);
            this.columnData = this.columnData.setIn([dashboardId, colData.id], {
                id: colData.id,
                large: colData.large,
                left: accWidth,
                inViewport: accWidth <= (viewportScrolledWidth + dashboardWidth)
            });
            accWidth += (colData.large ? largeColumnWidth : smallColumnWidth) + this.columnMarginLeft;
            if(index === columnOrder.size - 1) {
                if(typeof cb === 'function') {
                    cb();
                }
            }
        });
    }

    shouldComponentUpdate = (nextProps, nextState) =>
        !nextState.columnOrder.equals(this.state.columnOrder) ||
        !equals(nextState.draggingColumn, this.state.draggingColumn) ||
        !equals(nextState.columnPlaceholder, this.state.columnPlaceholder) ||
        !equals(nextState.viewportScrolledWidth, this.state.viewportScrolledWidth) ||
        !equals(nextProps.match.params, this.props.match.params) ||
        !nextProps.columns.equals(this.props.columns); // ||
        // nextProps.dashboards.size !== this.props.dashboards.size;

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
        const { columnPlaceholder, draggingColumn } = this.state;
        const { hover } = columnPlaceholder;
        const { dashboardId } = match.params;
        const cols = dashboards.getIn([dashboardId, 'columns']);
        const activeDashboard = dashboards.get(dashboardId);
        if (columnPlaceholder.drag !== columnPlaceholder.hover) {
            dashboardReorderColumn(
                activeDashboard.get('id'),
                cols.indexOf(draggingColumn.id),
                hover
            );
        }
        this.setState({
            draggingColumn: {
                id: null,
                large: false,
            },
            columnPlaceholder: {
                drag: null,
                hover: null,
            }
        });
    }
    _reorderColumns = () => {
        const { columnOrder, columnPlaceholder } = this.state;
        const { match, columns } = this.props;
        const { dashboardId } = match.params;
        const { drag, hover } = columnPlaceholder;
        const newOrderedColumns = this._getColumns(columnOrder.get(dashboardId), drag, hover);
        this._calculateColumnData(newOrderedColumns, dashboardId, columns, () => {
            this._mapColumnsToState(newOrderedColumns, dashboardId);
        });
    }
    _handleNeighbourHover = (dragIndex, hoverIndex) => {
        this.setState({
            columnPlaceholder: {
                drag: dragIndex,
                hover: hoverIndex,
            },
        }, () => {
            this._reorderColumns();
        });
    }

    _getDashboardRef = (node) => {
        this._dashboardNode = node;
        if (typeof this.props.getDashboardRef === 'function') {
            this.props.getDashboardRef(node);
        }
    }

    _getColumns = (cols, drag, hover) => {
        const { dashboardId } = this.props.match.params;
        const dragCard = cols.get(drag);
        let columns = cols.toJS();
        if (drag !== hover && dashboardId) {
            columns = columns.filter((c, i) => i !== drag);
            columns.splice(hover, 0, dragCard);
        }
        return new List(columns);
    }

    _handleDashboardScroll = () => {
        const { match, columns } = this.props;
        const { dashboardId } = match.params;
        const { offsetWidth, scrollLeft } = this._dashboardNode;
        this.setState({
            viewportScrolledWidth: offsetWidth + scrollLeft
        }, () => {
            this._calculateColumnData(this.state.columnOrder.get(dashboardId), dashboardId, columns);
        });
    }
    _getNewColumnPosition = (lastColumn) => {
        let newColumnPositionLeft = 0;
        if(lastColumn) {
            newColumnPositionLeft = ((lastColumn.large ? largeColumnWidth : smallColumnWidth) +
                lastColumn.left + this.columnMarginLeft);
        }
        return newColumnPositionLeft;
    }
    _handleColumnSizeChange = () => {
        const { match, dashboards, columns } = this.props;
        const { dashboardId } = match.params;
        const activeDashboard = dashboards.get(dashboardId);
        if(this._dashboardNode) {
            this._calculateColumnData(activeDashboard.get('columns'), dashboardId, columns);
        }
        this.forceUpdate();
    }
    render () {
        const {
            columns, darkTheme, dashboardCreateNew, dashboards,
            intl, match, connectDropTarget
        } = this.props;
        const { dashboardId } = match.params;
        const { draggingColumn } = this.state;
        const colData = this.columnData.get(dashboardId);
        const columnOrderMap = this.state.columnOrder.get(dashboardId);
        const newColumnPositionLeft = this._getNewColumnPosition(
            columnOrderMap &&
            columnOrderMap.size &&
            colData &&
            colData.get(columnOrderMap.last())
        );
        const activeDashboard = dashboards.get(dashboardId);
        const imgClass = classNames('dashboard__empty-placeholder-img', {
            'dashboard__empty-placeholder-img_dark': darkTheme
        });
        return connectDropTarget(
          <div
            className="dashboard"
            id="dashboard-container"
            ref={this._getDashboardRef}
            onScroll={this._throttledScroll}
          >
            {activeDashboard && colData && columnOrderMap && colData.map((col, colId) => {
                const colIndex = columnOrderMap.indexOf(colId);
                const column = columns.get(colId);
                if (!column || !col) {
                    return null;
                }
                const width = column.get('large') ? largeColumnWidth : smallColumnWidth;
                const isDragging = draggingColumn.id && (colId === draggingColumn.id);
                const { left, inViewport } = col;
                return (
                  <div
                    className={
                        `dashboard__column
                        dashboard__column${isDragging ? '_dragging' : ''}`
                    }
                    id={colId}
                    key={colId}
                    style={{
                        width,
                        transform: `translate(${left}px, 0)`
                    }}
                  >
                    <Column
                      columnId={column.id}
                      type={column.get('type')}
                      onBeginDrag={this._handleBeginDrag}
                      onEndDrag={this._handleEndDrag}
                      onNeighbourHover={this._handleNeighbourHover}
                      inDragMode={isDragging}
                      columnIndex={colIndex}
                      intl={intl}
                      large={column.get('large')}
                      isVisible={inViewport}
                      draggable
                      onSizeChange={this._handleColumnSizeChange}
                    />
                  </div>
                );
            }).toIndexedSeq()}
            {activeDashboard &&
              <div
                className="dashboard-column"
                style={{
                  transform: `translate(${newColumnPositionLeft}px, 0px)`,
                  position: 'absolute',
                  top: 20,
                  bottom: 0
                }}
              >
                <NewColumn />
              </div>}
            {!activeDashboard &&
              <div className="flex-center dashboard__empty-placeholder">
                <div className={imgClass} />
                <span className="dashboard__placeholder-text">
                  {intl.formatMessage(dashboardMessages.noDashboards)}
                </span>
                <span
                  className="content-link dashboard__create-button"
                  onClick={dashboardCreateNew}
                >
                  {intl.formatMessage(dashboardMessages.createOneNow)}
                </span>
              </div>
            }
          </div>);
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

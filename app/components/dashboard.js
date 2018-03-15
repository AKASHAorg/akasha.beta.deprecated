import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { List, Map } from 'immutable';
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
            preparingColumns: true,
        };
        this.colPositions = new Map();
        this._throttledScroll = throttle(this._handleDashboardScroll, 150, { trailing: true });
    }
    columnMarginLeft = 12;
    componentWillMount () {
        this.colPositions = this.colPositions.set(this.props.match.params.dashboardId, new Map());
    }
    componentDidMount () {
        const { match, dashboards, columns } = this.props;
        const { dashboardId } = match.params;
        const { columnPlaceholder } = this.state;
        const activeDashboard = dashboards.get(dashboardId);
        let activeDashboardColumns = new List();
        if (activeDashboard && activeDashboard.get('columns')) {
            activeDashboardColumns = activeDashboard.get('columns');
        }
        if (activeDashboardColumns.size && columnPlaceholder.hover !== null) {
            activeDashboardColumns = this._getColumns(activeDashboardColumns);
        }
        this._calculateColumnPosition(columns, activeDashboardColumns);
    }
    componentWillReceiveProps () {
        const { match, dashboards, columns } = this.props;
        const { dashboardId } = match.params;
        const { columnPlaceholder } = this.state;
        const activeDashboard = dashboards.get(dashboardId);
        let activeDashboardColumns = new List();
        console.log('update column positions when order changes!!!!!');
        if (activeDashboardColumns.size && columnPlaceholder.hover !== null) {
            activeDashboardColumns = this._getColumns(activeDashboardColumns);
        }
        this._calculateColumnPosition(columns, activeDashboardColumns);
    }
    shouldComponentUpdate = (nextProps, nextState) =>
        !equals(nextState.preparingColumns, this.state.preparingColumns) ||
        !equals(nextState.draggingColumn, this.state.draggingColumn) ||
            !equals(nextState.columnPlaceholder, this.state.columnPlaceholder) ||
            !equals(nextState.viewportScrolledWidth, this.state.viewportScrolledWidth) ||
            !nextProps.dashboards.equals(this.props.dashboards) ||
            !equals(nextProps.match.params, this.props.match.params);

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
    _handleNeighbourHover = (dragIndex, hoverIndex) => {
        this.setState({
            columnPlaceholder: {
                drag: dragIndex,
                hover: hoverIndex,
            },
        });
    }
    _getDashboardRef = (node) => {
        this._dashboardNode = node;
        if (typeof this.props.getDashboardRef === 'function') {
            this.props.getDashboardRef(node);
        }
    }
    _getColumns = (cols) => {
        const { columnPlaceholder } = this.state;
        const { drag, hover } = columnPlaceholder;
        const dragCard = cols.get(columnPlaceholder.drag);
        if (drag !== hover) {
            return cols.delete(drag).insert(hover, dragCard);
        }
        return cols;
    }
    // calculate left position of each column and
    // if it`s in viewport or not;
    // first column has left = 0 and is in viewport for sure :)
    _calculateColumnPosition = (columns, order) => {
        // note that viewportScrolledWidth is the viewportWidth + scrollLeft;
        const { viewportScrolledWidth } = this.state;
        const { dashboardId } = this.props.match.params;
        let orderedColumns = order;
        let viewportWidth = viewportScrolledWidth;
        if (this._dashboardNode) {
            viewportWidth += this._dashboardNode.getBoundingClientRect().width;
        }
        const colItems = orderedColumns.reduce((prevMap, colId) => {
            const col = columns.get(colId);
            const width = col.large ? largeColumnWidth : smallColumnWidth;
            let left = 0;
            // first column is always at 0px left
            if(colId !== orderedColumns.first()) {
                left = prevMap.last().left + width + this.columnMarginLeft;
            }
            return prevMap.set(colId, {
                id: colId,
                left,
                inViewport: left <= viewportWidth
            });
        }, new Map().set(orderedColumns.first(), {
            id: orderedColumns.first(),
            left: 0,
            inViewport: true
        }));
        this.colPositions = this.colPositions.set(dashboardId, colItems);
        this.setState({
            preparingColumns: false
        });
    }

    _handleDashboardScroll = () => {
        const { offsetWidth, scrollLeft } = this._dashboardNode;
        this.setState({
            viewportScrolledWidth: offsetWidth + scrollLeft
        });
    }

    render () {
        const {
            columns, darkTheme, dashboardCreateNew, dashboards,
            intl, match, connectDropTarget
        } = this.props;
        const { draggingColumn, preparingColumns } = this.state;
        const { dashboardId } = match.params;
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
            {!preparingColumns && this.colPositions.get(dashboardId).map((columnPos, index) => {
                const column = columns.get(columnPos.id);
                if (!column) {
                    return null;
                }
                const width = column.get('large') ? largeColumnWidth : smallColumnWidth;
                const columnId = column.id;
                const isDragging = columnId === draggingColumn.id;
                const { left, inViewport } = columnPos
                return (
                  <div
                    className={
                        `dashboard__column
                        dashboard__column${isDragging ? '_dragging' : ''}`
                    }
                    id={column.id}
                    key={column.id}
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
                      columnIndex={index}
                      intl={intl}
                      large={column.get('large')}
                      isVisible={inViewport}
                      draggable
                    />
                  </div>
                );
            }).toIndexedSeq()}
            {!preparingColumns && activeDashboard &&
              <div
                style={{
                  left: this.colPositions.get(dashboardId).last() ?
                    this.colPositions.get(dashboardId).last().left + 360 + (this.columnMarginLeft * 2) : 0,
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

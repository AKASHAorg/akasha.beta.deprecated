import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'antd';
import classNames from 'classnames';
import { DragSource, DropTarget } from 'react-dnd';
import { Icon } from '../index';

const dragSource = {
    beginDrag (props) {
        return {
            id: props.id,
            index: props.index
        };
    }
};

const cardTarget = {
    hover (props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;
        if (dragIndex === hoverIndex) {
            return;
        }
        props.dashboardReorderColumn(dragIndex, hoverIndex);
        monitor.getItem().index = hoverIndex;
    }
};

function collect (connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

function collectDrop (connect) {
    return {
        connectDropTarget: connect.dropTarget()
    };
}

class DashboardTopBarIcon extends Component {
    render () {
        const {
            connectDragSource,
            connectDropTarget,
            isDragging,
            id,
            title,
            scrollIntoView,
            iconType
        } = this.props;
        return connectDragSource(
            connectDropTarget(
                <div
                    className={classNames('flex-center dashboard-top-bar-icon', {
                        'dashboard-top-bar-icon_dragging': isDragging
                    })}
                    onClick={scrollIntoView}
                >
                    <Tooltip key={id} title={title}>
                        <Icon className="dashboard-top-bar__column-icon" type={iconType} />
                    </Tooltip>
                </div>
            )
        );
    }
}

DashboardTopBarIcon.propTypes = {
    id: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    iconType: PropTypes.string.isRequired,
    scrollIntoView: PropTypes.func.isRequired,
    title: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    dashboardReorderColumn: PropTypes.func.isRequired
};

export default DropTarget('dragElement', cardTarget, collectDrop)(
    DragSource('dragElement', dragSource, collect)(DashboardTopBarIcon)
);

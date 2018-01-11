import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import { Tooltip } from 'antd';
import { DragSource, DropTarget } from 'react-dnd';
import { Icon } from '../index';

const dragSource = {
    beginDrag(props) {
        return {
            id: props.id,
            index: props.index,
        }
    }
};
const cardTarget = {
    hover(props, monitor, component) {
        const dragIndex = monitor.getItem().index
        const hoverIndex = props.index

        // Don't replace items with themselves
        if (dragIndex === hoverIndex) {
            return
        }

        // Determine rectangle on screen
        const hoverBoundingRect = findDOMNode(component).getBoundingClientRect()

        // Get vertical middle
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

        // Determine mouse position
        const clientOffset = monitor.getClientOffset()

        // Get pixels to the top
        const hoverClientY = clientOffset.y - hoverBoundingRect.top

        // Only perform the move when the mouse has crossed half of the items height
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%

        // Dragging downwards
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
            return
        }

        // Dragging upwards
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
            return
        }

        console.log(dragIndex, hoverIndex);

    },
}

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

function collectDrop(connect) {
    return {
        connectDropTarget: connect.dropTarget(),
    };
}

class DashboardTopBarIcon extends Component {
    render () {
        const { connectDragSource, connectDropTarget, isDragging, id, title, scrollIntoView, iconType } = this.props;
        return connectDragSource(connectDropTarget(
            <div style={{
                opacity: isDragging ? 0.5 : 1,
                fontSize: 25,
                fontWeight: 'bold',
                cursor: 'move'
            }}
            >
                <Tooltip key={id} title={title}>
                    <Icon
                      className="content-link dashboard-top-bar__column-icon"
                      onClick={scrollIntoView}
                      type={iconType}
                    />
                </Tooltip>
            </div>
        ));
    }
};

DashboardTopBarIcon.propTypes = {
    id: PropTypes.string.isRequired,
    iconType: PropTypes.string.isRequired,
    scrollIntoView: PropTypes.func.isRequired,
    title: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired
};

export default DropTarget('dragElement', cardTarget, collectDrop)(DragSource('dragElement', dragSource, collect)(DashboardTopBarIcon));

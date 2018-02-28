import React, { Component } from 'react';
import { DragLayer } from 'react-dnd';
import { ColumnHeader } from './';
import * as itemTypes from '../constants/drag-item-types';

const collect = (monitor) => {
    return {
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        isDragging: monitor.isDragging(),
        currentOffset: monitor.getSourceClientOffset(),
        initialOffset: monitor.getInitialSourceClientOffset(),
    };
};

const getItemStyles = (initialOffset, currentOffset) => {
    if (!initialOffset || !currentOffset) {
        return {
            display: 'none'
        };
    }
    const { x, y } = currentOffset;
    const transform = `translate(${x}px, ${y}px)`;
    return {
        transform,
        WebkitTransform: transform
    };
};

class CustomDragLayer extends Component {
    renderItem = (type, item) => {
        switch (type) {
            case itemTypes.COLUMN:
                return (
                  <div
                    style={{ opacity: 1 }}
                    className="custom-drag-layer__column-preview"
                  >
                    <ColumnHeader
                      readOnly
                      onRefresh={() => {}}
                      iconType={item.iconType}
                      title={item.title}
                      draggable={false}
                    >
                      <div className="custom-drag-layer__column-placeholder" />
                    </ColumnHeader>
                  </div>);
            default:
                break;
        }
    }
    render () {
        const {
            item, itemType, isDragging, initialOffset, currentOffset
        } = this.props;
        if (!isDragging) {
            return null;
        }
        return (
          <div
            className="custom-drag-layer"
            style={{
                ...getItemStyles(initialOffset, currentOffset),
                maxWidth: item.colWidth || ''
            }}
          >
            {this.renderItem(itemType, item)}
          </div>
        );
    }
}

export default DragLayer(collect)(CustomDragLayer);

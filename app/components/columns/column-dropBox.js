const dropBox = {
    /* eslint-disable consistent-return */
    hover (props, monitor) {
        const draggedItem = monitor.getItem();
        const draggedItemId = draggedItem.columnId;
        const hoverItemId = props.column.get('id');
        const dragIndex = draggedItem.columnIndex;
        let hoverIndex = props.columnIndex;
        if (hoverItemId && draggedItemId !== hoverItemId) {
            props.onNeighbourHover(dragIndex, hoverIndex);
            monitor.getItem().columnIndex = hoverIndex;
        }
    }
};

export default dropBox;

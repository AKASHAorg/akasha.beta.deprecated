const dropBox = {
    /* eslint-disable consistent-return */
    hover (props, monitor) {
        const draggedItem = monitor.getItem();
        const draggedItemId = draggedItem.columnId;
        const hoverItemId = props.column.get('id');
        const dragIndex = draggedItem.columnIndex;
        let hoverIndex = props.columnIndex;
        if (hoverItemId && draggedItemId !== hoverItemId) {
            const hoveredColumn = document.getElementById(props.column.get('id'));
            const colSize = hoveredColumn.getBoundingClientRect();
            const hoverMiddleX = (colSize.right - colSize.left) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientX = clientOffset.x - colSize.left;
            if (dragIndex < hoverIndex) {
                if (hoverClientX < hoverMiddleX) {
                    hoverIndex -= 1;
                }
            }
            if (dragIndex > hoverIndex) {
                if (hoverClientX > hoverMiddleX) {
                    hoverIndex += 1;
                }
            }
            return props.onNeighbourHover(dragIndex, hoverIndex);
        }
    }
};

export default dropBox;

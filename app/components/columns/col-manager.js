import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { symmetricDifferenceWith, eqBy, prop, propEq, indexOf,
    findIndex, update } from 'ramda';
import CellManager from './cell-manager';
import EntryCard from '../cards/entry-card';

const MORE_ITEMS_TRIGGER_SIZE = 10;
const BOTTOM_HIDE_ITEM_OFFSET = 5; // hide after 4 items below visible area
const ITEM_BUFFER_TOP = 3;
const ITEM_BUFFER_BOTTOM = 3;

class ColManager extends Component {
    constructor (props) {
        super(props);
        this.state = {
            items: [],
            avgItemHeight: this.props.initialItemHeight,
            itemCount: 0,
            bottomOffsetHeight: 0,
            bottomIndexFrom: -1,
            topIndexTo: 0
        };
        this.loadingMore = false;
        this.containerHeight = this.props.columnHeight;
    }
    componentWillMount = () => {
        const { column } = this.props;
        if (column.entriesList.size === 0) {
            this.props.onItemRequest(column.get('id'));
        } else {
            this._mapItemsToState(column.get('entriesList'));
        }
    }
    componentWillReceiveProps = (nextProps) => {
        const { column } = nextProps;
        const oldItems = this.props.column.get('entriesList');
        if (column.get('entriesList').size !== oldItems.size) {
            this._mapItemsToState(column.get('entriesList'));
            this.loadingMore = false;
        }
    }
    _mapItemsToState = (items) => {
        const mappedItems = this.state.items;
        const jsItems = items.toJS().map(v => ({ id: v }));
        const eqKey = eqBy(prop('id'));
        const diff = symmetricDifferenceWith(eqKey, jsItems, mappedItems).map(v => ({
            id: v.id,
            height: this.state.avgItemHeight
        }));
        this.setState(prevState => ({
            items: prevState.items.concat(diff),
            itemCount: prevState.itemCount + diff.length
        }));
    }

    // calculate average
    _calculateAverage = newSize =>
        ((this.state.avgItemHeight * (this.state.itemCount - 1)) + newSize) / this.state.itemCount;
    /* eslint-disable max-statements */
    _loadMoreIfNeeded = (scrollTop, containerHeight) => {
        const { onItemMoreRequest, column } = this.props;
        const { items, topIndexTo, bottomIndexFrom, avgItemHeight } = this.state;
        const totalItemsHeight = items.slice(topIndexTo, bottomIndexFrom)
            .reduce((prev, curr) => (prev + curr.height), 0);
        const bottomIndexInRange = (this.state.bottomIndexFrom < 0 ||
            (this.state.bottomIndexFrom >= 0 && this.state.bottomIndexFrom < items.length - 3));
        const inflatedContainerSize = (scrollTop + containerHeight +
            (MORE_ITEMS_TRIGGER_SIZE * avgItemHeight));
        const shouldLoadMore = totalItemsHeight <= inflatedContainerSize && bottomIndexInRange;
        // console.log(shouldLoadMore, 'should load more');
        if (shouldLoadMore && !this.loadingMore) {
            this.loadingMore = true;
            onItemMoreRequest(column.get('id'));
        }
        /**
         * update bottomIndexFrom, leaving only x amounts on items below visible area
         */
        this._recalcOffsets();
    }
    _recalcOffsets = (scrollDelta) => {
        const { avgItemHeight, items, topIndexTo, bottomIndexFrom } = this.state;
        const { scrollTop, scrollHeight } = this._rootNodeRef;
        const containerHeight = this._rootNodeRef.getBoundingClientRect().height;
        const scrollBottom = scrollHeight - scrollTop - containerHeight;
        const visibleItemsHeight = items.slice(topIndexTo.bottomIndexFrom)
            .reduce((prev, curr) => prev + curr.height, 0);
        let topIndexToCutFrom;
        let bottomIndexToCutFrom;
        const shouldCutFromTop = scrollTop > (avgItemHeight * ITEM_BUFFER_TOP);
        const shouldCutFromBottom = scrollTop > (avgItemHeight * ITEM_BUFFER_BOTTOM);

        // console.log(scrollDelta, scrollDelta / -100, 'scroll delta');
        requestAnimationFrame(() => {
            this.setState((prevState) => {
                if (shouldCutFromTop && scrollDelta && prevState.topIndexTo >= 0) {
                    return {
                        topIndexTo: prevState.topIndexTo + (scrollDelta / -100),
                        bottomIndexFrom: prevState.bottomIndexFrom + (scrollDelta / 100)
                    };
                }
            });
        });
        // this.setState((prevState) => {
        //     return {
        //         topIndexTo: (shouldCutFromTop && scrollDelta) ? prevState.topIndexTo + (scrollDelta / -100) : prevState.topIndexTo,
        //         bottomIndexFrom: (shouldCutFromBottom && scrollDelta) ? prevState.bottomIndexFrom + (scrollDelta / 100) : prevState.bottomIndexFrom
        //     };
        // });
        // if (scrollDelta < 0) {
        // scrolling down
            // cut from top and add to bottom
            // console.log('is scroll down');
        // } else if (scrollDelta > 0) {
            // scrolling up 1075 2370
            // add to top and cut from bottom
            // console.log('is scroll up');
        // }
        // if (scrollTop > (avgItemHeight * ITEM_BUFFER_TOP)) {
            // console.log('should cut items from top');
        // }
        // if (scrollBottom > (avgItemHeight * ITEM_BUFFER_BOTTOM)) {
            // console.log('should cut from bottom');
        // }
        // const maxHeightToKeep = scrollTop + containerHeight + (ITEM_BUFFER_BOTTOM * avgItemHeight);
        // // console.log('scrollBottom:', scrollBottom);
        // this.accHeight = 0;
        // let bottomHiddenIndex;
        // for (let i = 0; i < items.length; i++) {
        //     const element = items[i];
        //     this.accHeight += element.height;
        //     if ((this.accHeight - maxHeightToKeep) > 0) {
        //         this.accHeight = 0;
        //         bottomHiddenIndex = indexOf(element, items);
        //         break;
        //     }
        // }
        // if (bottomHiddenIndex) {
        //     this.setState({
        //         bottomIndexFrom: bottomHiddenIndex,
        //         bottomOffsetHeight: items.slice(bottomHiddenIndex)
        //             .reduce((prev, curr) => prev + curr.height, 0)
        //     });
        // }
    };
    // update the height of the cell (called on cell`s didMount lifecycle)
    _handleCellMount = cellId =>
        (cellSize) => {
            const { items } = this.state;
            const cellHeight = cellSize.height;
            const propFind = propEq('id', cellId);
            const stateCellIdx = findIndex(propFind)(items);
            const sameHeight = (stateCellIdx > -1) && items[stateCellIdx].height === cellHeight;
            if (!sameHeight) {
                // functional setState is mandatory here to prevent batching!
                this.setState(prevState => ({
                    items: update(stateCellIdx, { id: cellId, height: cellHeight }, prevState.items),
                    avgItemHeight: Math.ceil(this._calculateAverage(cellHeight)),
                }), () => {
                    this._loadMoreIfNeeded();
                });
            }
        }
    _handleCellSizeChange = cellId =>
        (cellSize) => {
            // this will be called when an item changes his size (aka. receives data)
            this._handleCellMount(cellId)(cellSize);
        }
    _handleScroll = (ev) => {
        let delta;
        if (ev.wheelDelta) {
            delta = ev.wheelDelta;
        } else {
            delta = -1 * ev.deltaY;
        }
        this._onScrollMove(delta);
    }
    _onScrollMove = (delta) => {
        const { items } = this.state;
        if (this.state.bottomIndexFrom < items.length - 3) {
            const { scrollTop } = this._rootNodeRef;
            this._loadMoreIfNeeded(scrollTop);
        }
        this._recalcOffsets(delta);
    }
    _createRootNodeRef = (node) => {
        this._rootNodeRef = node;
    }
    render () {
        const { items, topIndexTo, bottomIndexFrom, bottomOffsetHeight } = this.state;
        const { column, baseWidth, onItemrequest, onItemMoreRequest, ...other } = this.props;

        console.error(
            'top index',
            this.state.topIndexTo,
            'bottom index',
            this.state.bottomIndexFrom,
            'itemCount:',
            this.state.itemCount,
            'actual entries size:',
            other.entries.size
        );
        return (
          <div
            onWheel={this._handleScroll}
            ref={this._createRootNodeRef}
            style={{
                height: '100%',
                overflowY: 'auto'
            }}
          >
            <div className="col-manager__top-offset" />
            {items.slice(topIndexTo, bottomIndexFrom).map(item => (
              <CellManager
                key={item.id}
                id={item.id}
                onMount={this._handleCellMount(item.id)}
                onSizeChange={this._handleCellSizeChange(item.id)}
              >
                {cellProps => React.cloneElement(this.props.itemCard, {
                    ...cellProps,
                    ...other,
                    entry: other.entries.get(item.id)
                })}
              </CellManager>
            ))}
            <div
              className="col-manager__bottom-offset"
              style={{ height: bottomOffsetHeight }}
            />
          </div>
        );
    }
}

ColManager.defaultProps = {
    initialItemHeight: 170,
    itemCard: <EntryCard />,
    columnHeight: 600
};

ColManager.propTypes = {
    column: PropTypes.shape(),
    onItemRequest: PropTypes.func,
    onItemMoreRequest: PropTypes.func,
    initialItemHeight: PropTypes.number,
    itemCard: PropTypes.node,
    columnHeight: PropTypes.number,
};

export default ColManager;

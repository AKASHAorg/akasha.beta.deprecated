import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { symmetricDifferenceWith, eqBy, prop, propEq, findIndex, update, indexOf, remove } from 'ramda';
import throttle from 'lodash.throttle';
import CellManager from './cell-manager';
import EntryCard from '../cards/entry-card';
import * as columnTypes from '../../constants/columns';

const MORE_ITEMS_TRIGGER_SIZE = 4;
const VIEWPORT_VISIBLE_BUFFER_SIZE = 4;

class ColManager extends Component {
    constructor (props) {
        super(props);
        this.state = {
            topIndexTo: 0
        };
        this.avgItemHeight = this.props.initialItemHeight;
        this.loadingMore = [];
        this.containerHeight = this.props.columnHeight;
        this.items = [];
        this.itemCount = 0;
        this.lastScrollTop = {};
        this._debouncedScroll = throttle(this._handleScroll, 150, { trailing: true });
        this._debouncedResize = throttle(this._onResize, 100, { trailing: true });
        this.poolingInterval = null;
        this.poolingTimeout = null;
        this.poolingDelay = 60000;
    }

    componentWillMount = () => {
        const { column, isVisible, fetching } = this.props;
        const { id } = column;
        this.lastScrollTop[id] = 0;
        const shouldRequestItems = column.entriesList.size === 0 &&
            !this.loadingMore.includes(column.id) && isVisible;
        if (typeof onItemPooling === 'function' && !this.poolingInterval) {
            this._createRequestPooling();
        }
        if (shouldRequestItems && !fetching) {
            this.props.onItemRequest(column);
            this.loadingMore.push(column.id);
        } else {
            this._mapItemsToState(column.entriesList);
        }
    }

    componentDidMount = () => {
        const { column, onItemPooling } = this.props;
        const { id } = column;
        const newContainerHeight = this._rootNodeRef.getBoundingClientRect().height;
        window.addEventListener('resize', this._debouncedResize);
        if (typeof onItemPooling === 'function' && !this.poolingInterval) {
            this._createRequestPooling();
        }
        if (newContainerHeight !== this.containerHeight) {
            this.containerHeight = newContainerHeight;
            this._updateOffsets(this.lastScrollTop[id]);
        }
    }

    _createRequestPooling = () => {
        this.interval = setInterval(() => {
            this.props.onItemPooling(this.props.column);
        }, this.poolingDelay);
    }

    shouldComponentUpdate (nextProps, nextState) {
        return nextState.topIndexTo !== this.state.topIndexTo ||
        !nextProps.column.equals(this.props.column) ||
        nextProps.ethAddress !== this.props.ethAddress ||
        !!(nextProps.pendingEntries && !nextProps.pendingEntries.equals(this.props.pendingEntries));
    }

    _clearIntervals = () => {
        const { onItemPooling } = this.props;
        if (typeof onItemPooling === 'function') {
            if (this.poolingInterval) {
                clearInterval(this.poolingInterval);
            }
            this.timeout = setTimeout(this._createRequestPooling, this.poolingDelay);
        }
    }

    componentWillReceiveProps = (nextProps) => {
        const { column, isVisible, ethAddress, fetching } = nextProps;
        const { entriesList, id } = column;
        const oldItems = this.props.column.entriesList;
        const oldEthAddress = this.props.ethAddress;
        const isNewColumn = (ethAddress !== oldEthAddress) ||
            (nextProps.column.value !== this.props.column.value);
        const shouldRequestItems = entriesList.size === 0 &&
            !this.loadingMore.includes(column.id) && isVisible && !this.props.fetching;
        if (isNewColumn) {
            this.items = [];
            this.itemCount = 0;
            this.lastScrollTop[id] = 0;
            this.setState({
                topIndexTo: 0
            });
        }
        if ((isNewColumn || shouldRequestItems) && !fetching) {
            this.props.onItemRequest(column);
            this._clearIntervals();
            this.loadingMore.push(column.id);
        } else if (!entriesList.equals(oldItems)) {
            this._mapItemsToState(entriesList);
            this.loadingMore = remove(indexOf(id, this.loadingMore), 1, this.loadingMore);
        }
    }

    componentWillUnmount () {
        if (this.poolingInterval) {
            clearInterval(this.poolingInterval);
        }
        if (this.poolingTimeout) {
            clearTimeout(this.poolingTimeout);
        }
    }

    _onResize = () => {
        const { id } = this.props.column;
        const newContainerHeight = this._rootNodeRef.getBoundingClientRect().height;
        if (newContainerHeight !== this.containerHeight) {
            this.containerHeight = newContainerHeight;
            this._updateOffsets(this.lastScrollTop[id]);
        }
    }

    _mapItemsToState = (items) => {
        const { id } = this.props.column;
        const mappedItems = this.items.slice();
        const jsItems = items.toJS().map(v => ({ id: v }));
        const eqKey = eqBy(prop('id'));
        const diff = symmetricDifferenceWith(eqKey, jsItems, mappedItems).map(v => ({
            id: v.id,
            height: this.avgItemHeight
        }));
        this.items = mappedItems.concat(diff);
        this.itemCount = mappedItems.length + diff.length;
        this._updateOffsets(this.lastScrollTop[id]);
    }

    // calculate an average of the cells height
    _calculateAverage = newSize =>
        ((this.avgItemHeight * (this.itemCount - 1)) + newSize) / this.itemCount;

    // load more entries
    _loadMoreIfNeeded = () => {
        const { props } = this;
        const { onItemMoreRequest, column, isVisible, fetchingMore } = props;
        const { id } = column;
        if (!this.loadingMore.includes(id) && isVisible && !fetchingMore) {
            onItemMoreRequest(column);
            this.loadingMore.push(id);
        }
    }
    /**
     * this method slices the items based on the user's current scroll position
     * it is called onScroll and on cellUpdate handler;
     */
    _updateOffsets = (scrollTop) => {
        const { items, state } = this;
        const { topIndexTo } = state;
        let accHeight = 0;
        let topIndex = topIndexTo;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (accHeight >= scrollTop - (this.avgItemHeight * VIEWPORT_VISIBLE_BUFFER_SIZE)) {
                topIndex = i;
                accHeight = 0;
                break;
            }
            accHeight += item.height;
        }

        if (this.state.topIndexTo !== topIndex) {
            window.requestIdleCallback(() => {
                this.setState(() => ({
                    topIndexTo: topIndex
                }));
            }, { timeout: 500 });
        }
        const shouldLoadMore = this._getBottomIndex(topIndex) >= (items.length - MORE_ITEMS_TRIGGER_SIZE);
        if (shouldLoadMore) {
            this._loadMoreIfNeeded();
        }
    }
    /**
     * get the index of the last visible element based on top index;
     *
     */
    _getBottomIndex = (topIndex) => {
        const { containerHeight } = this;
        const { items } = this;
        const { id } = this.props.column;
        let accHeight = this._getSliceMeasure(0, topIndex);
        let bottomIndex = items.length;
        const bufferHeight = this.avgItemHeight * VIEWPORT_VISIBLE_BUFFER_SIZE;
        for (let i = topIndex; i < items.length; i++) {
            const item = items[i];
            if (accHeight + item.height > (containerHeight + this.lastScrollTop[id] + bufferHeight)) {
                bottomIndex = i;
                accHeight = 0;
                break;
            }
            accHeight += item.height;
        }
        return bottomIndex;
    }
    /**
     * update the height of the cell (called on cell`s didMount lifecycle)
     */
    _handleCellMount = cellId =>
        (cellSize) => {
            const { items, props } = this;
            const { id } = props.column;
            const cellHeight = cellSize.height;
            const propFind = propEq('id', cellId);
            const stateCellIdx = findIndex(propFind)(items);
            const sameHeight = (stateCellIdx > -1) && items[stateCellIdx].height === cellHeight;
            if (!sameHeight) {
                this.avgItemHeight = Math.ceil(this._calculateAverage(cellHeight));
                this.items = update(stateCellIdx, { id: cellId, height: cellHeight }, this.items);
                this._updateOffsets(this.lastScrollTop[id]);
            }
        }

    _handleCellSizeChange = cellId => this._handleCellMount(cellId);

    _handleScroll = () => {
        let delta = null;
        const { scrollTop } = this._rootNodeRef;
        const { id } = this.props.column;
        if (scrollTop > this.lastScrollTop[id]) {
            delta = 'down';
        } else {
            delta = 'up';
        }
        window.requestIdleCallback(() => {
            this._onScrollMove(delta, scrollTop);
            this.lastScrollTop[id] = scrollTop;
        }, { timeout: 1000 });
    }
    _onScrollMove = (delta, scrollTop) => {
        this._updateOffsets(scrollTop);
    }
    _createRootNodeRef = (node) => {
        this._rootNodeRef = node;
    }
    _getSliceMeasure = (begin, end) => {
        const { items } = this;
        return items.slice(begin, end).reduce((prev, curr) => prev + curr.height, 0);
    }
    render () {
        const { items, state, props } = this;
        const { topIndexTo } = state;
        const { column, baseWidth, type, ...other } = props;
        const bottomIndexFrom = this._getBottomIndex(topIndexTo);
        // console.log(items, 'the column');
        return (
          <div
            onScroll={this._debouncedScroll}
            ref={this._createRootNodeRef}
            className="column-manager"
          >
            <div
              className="col-manager__top-offset"
              style={{
                  height: this._getSliceMeasure(0, topIndexTo)
              }}
            />
            {items.slice(topIndexTo, bottomIndexFrom).map((item) => {
                const entry = other.entries.get(item.id);
                let author;
                let profile;
                if (type === columnTypes.profileFollowings || type === columnTypes.profileFollowers) {
                    profile = other.profiles && other.profiles.get(entry.ethAddress);
                } else {
                    author = other.profiles && entry && other.profiles.get(entry.author.ethAddress);
                }
                return (
                  <CellManager
                    key={item.id}
                    id={item.id}
                    onMount={this._handleCellMount(item.id)}
                    onSizeChange={this._handleCellSizeChange(item.id)}
                  >
                    {cellProps => React.cloneElement(this.props.itemCard, {
                        ...cellProps,
                        ...other,
                        entry,
                        author,
                        profile,
                        isPending: other.pendingEntries && other.pendingEntries.get(item.id)
                    })}
                  </CellManager>
                );
                })}
            <div
              className="col-manager__bottom-offset"
              style={{
                height: this._getSliceMeasure(bottomIndexFrom, items.length)
              }}
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
    isVisible: PropTypes.bool,
    ethAddress: PropTypes.string,
    fetching: PropTypes.bool,
    fetchingMore: PropTypes.bool,
    onItemPooling: PropTypes.func,
    pendingEntries: PropTypes.shape(),
};

export default ColManager;

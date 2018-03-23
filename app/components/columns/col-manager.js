import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { symmetricDifferenceWith, eqBy, prop, propEq, findIndex, update, indexOf, remove } from 'ramda';
import throttle from 'lodash.throttle';
import CellManager from './cell-manager';
import EntryCard from '../cards/entry-card';
import * as columnTypes from '../../constants/columns';

const MORE_ITEMS_TRIGGER_SIZE = 3;
const VIEWPORT_VISIBLE_BUFFER_SIZE = 6;

class ColManager extends Component {
    constructor (props) {
        super(props);
        this.state = {
            topIndexTo: 0
        };
        this.avgItemHeight = this.props.initialItemHeight;
        this.loadingMore = [];
        this.containerHeight = this.props.columnHeight;
        this.items = {};
        this.itemCount = 0;
        this.lastScrollTop = {};
        this._debouncedScroll = throttle(this._handleScroll, 100, { trailing: true });
        this._debouncedResize = throttle(this._onResize, 100, { trailing: true });
        this.poolingInterval = null;
        this.poolingTimeout = null;
        this.poolingDelay = 60000;
        this._debouncedOffsetUpdate = throttle(this._updateOffsets, 150, {trailing: true});
        this.colFirstEntry = new Map();
    }

    componentWillMount = () => {
        const { column, isVisible } = this.props;
        const { id } = column;
        this.lastScrollTop[id] = 0;
        this.items[id] = [];
        if (typeof onItemPooling === 'function' && !this.poolingInterval) {
            this._createRequestPooling();
        }
        const shouldRequestItems = column.entriesList.size === 0 &&
            !this.loadingMore.includes(column.id) && isVisible;
        if (shouldRequestItems) {
            this.props.onItemRequest(this.props.column);
            this.loadingMore.push(column.id);
        }
    }

    componentDidMount = () => {
        const { column, onItemPooling, isVisible } = this.props;
        const { id } = column;
        window.addEventListener('resize', this._debouncedResize);
        this._rootNodeRef.addEventListener('scroll', this._debouncedScroll, {passive: true});
        const newContainerHeight = this._rootNodeRef.getBoundingClientRect().height;
        if (typeof onItemPooling === 'function' && !this.poolingInterval && isVisible) {
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
        this._prepareUpdates(nextProps, { canUpdateState: true, isNext: true });
        if(nextProps.large !== this.props.large) {
            if(this.props.onSizeChange) {
                this.props.onSizeChange();
            }
        }
    }

    componentDidUpdate (prevProps) {
        // do not update the state!
        this._prepareUpdates(prevProps, { canUpdateState: false });
    }

    _prepareUpdates = (passedProps, options) => {
        const { isNext } = options;
        let newerProps = this.props;
        let olderProps = passedProps;
        if (isNext) {
            newerProps = passedProps;
            olderProps = this.props;
        }
        const { column, isVisible, ethAddress, fetching } = newerProps;
        const { entriesList } = column;
        const oldItems = olderProps.column.entriesList;
        const oldEthAddress = olderProps.ethAddress;
        const isNewColumn = ((oldEthAddress !== ethAddress) ||
            (column.value !== olderProps.column.value));
        const shouldRequestItems = entriesList.size === 0 &&
            !this.loadingMore.includes(column.id) && isVisible && !fetching;
        this._doUpdates({
            isNewColumn,
            shouldRequestItems,
            hasNewItems: !column.entriesList.equals(oldItems),
            column,
            options
        });
    }
    /**
     * WARNING! passed props can be new props or old props
     */
    _doUpdates = (updateParams) => {
        const { isNewColumn, shouldRequestItems, hasNewItems, column, options } = updateParams;
        const { canUpdateState } = options;
        const { id } = column;
        if (isNewColumn && canUpdateState) {
            this.items[id] = [];
            this.itemCount = 0;
            this.lastScrollTop[id] = 0;
            this.setState({
                topIndexTo: 0
            });
        }
        if ((isNewColumn || shouldRequestItems) && canUpdateState) {
            window.requestAnimationFrame(() => {
                this.props.onItemRequest(this.props.column);
            });
            this._clearIntervals();
            this.loadingMore.push(column.id);
        } else if (hasNewItems) {
            ReactDOM.unstable_deferredUpdates(() => {
                this._mapItemsToState(this.props.column.entriesList);
            });
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
        const { props, itemCount } = this;
        const { id } = props.column;
        const mappedItems = this.items[id].slice();
        const jsItems = items.toJS().map(v => ({ id: v }));
        const eqKey = eqBy(prop('id'));
        const diff = symmetricDifferenceWith(eqKey, jsItems, mappedItems).map(v => ({
            id: v.id,
            height: this.avgItemHeight
        }));
        this.items[id] = mappedItems.concat(diff);
        this.itemCount = mappedItems.length + diff.length;

        if(itemCount !== this.itemCount) {
            this._updateOffsets(this.lastScrollTop[id]);
        }
    }

    // calculate an average of the cells height
    _calculateAverage = newSize =>
        ((this.avgItemHeight * (this.itemCount - 1)) + newSize) / this.itemCount;

    // load more entries
    _loadMoreIfNeeded = () => {
        const { props } = this;
        const { column, isVisible, fetchingMore } = props;
        const { id } = column;
        if (!this.loadingMore.includes(id) && isVisible && !fetchingMore) {
            this.props.onItemMoreRequest(column.toJS());
            this.loadingMore.push(id);
        }
    }
    /**
     * this method slices the items based on the user's current scroll position
     * it is called onScroll and on cellUpdate handler;
     */
    _updateOffsets = (scrollTop) => {
        const { items, state, props } = this;
        const { id } = props.column;
        const { topIndexTo } = state;
        let accHeight = 0;
        let topIndex = topIndexTo;
        for (let i = 0; i < items[id].length; i++) {
            const item = items[id][i];
            if (accHeight >= scrollTop - (this.avgItemHeight * VIEWPORT_VISIBLE_BUFFER_SIZE)) {
                topIndex = i;
                accHeight = 0;
                break;
            }
            accHeight += item.height;
        }

        if (this.state.topIndexTo !== topIndex) {
            this.setState(() => ({
                topIndexTo: topIndex
            }));
        }
        const shouldLoadMore = this._getBottomIndex(topIndex) + MORE_ITEMS_TRIGGER_SIZE >= items[id].length;
        if (shouldLoadMore) {
            this._loadMoreIfNeeded();
        }
    }
    /**
     * get the index of the last visible element based on top index;
     *
     */
    _getBottomIndex = (topIndex) => {
        const { containerHeight, items, props } = this;
        const { id } = props.column;
        let accHeight = this._getSliceMeasure(0, topIndex);
        let bottomIndex = items[id].length;
        const bufferHeight = this.avgItemHeight * VIEWPORT_VISIBLE_BUFFER_SIZE;
        for (let i = topIndex; i < items[id].length; i++) {
            const item = items[id][i];
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
            const stateCellIdx = findIndex(propFind)(items[id]);
            const sameHeight = (stateCellIdx > -1) && items[id][stateCellIdx].height === cellHeight;
            if (!sameHeight) {
                this.avgItemHeight = Math.ceil(this._calculateAverage(cellHeight));
                this.items[id] = update(stateCellIdx, { id: cellId, height: cellHeight }, this.items[id]);
                // this._updateOffsets(this.lastScrollTop[id]);
            }
        }

    _handleCellSizeChange = cellSize => this._handleCellMount(cellSize);

    _handleScroll = () => {
        const { scrollTop } = this._rootNodeRef;
        const { id } = this.props.column;
        this._onScrollMove(scrollTop);
        this.lastScrollTop[id] = scrollTop;
    }

    _onScrollMove = (scrollTop) => {
        this._debouncedOffsetUpdate(scrollTop);
    }

    _createRootNodeRef = (node) => {
        this._rootNodeRef = node;
    }

    _getSliceMeasure = (begin, end) => {
        const { items, props } = this;
        const { id } = props.column;
        const measure = items[id].slice(begin, end).reduce((prev, curr) => prev + curr.height, 0);
        return measure;
    }

    render () {
        const { items, state, props } = this;
        const { topIndexTo } = state;
        const { column, type, ...other } = props;
        const { id } = column;
        const bottomIndexFrom = this._getBottomIndex(topIndexTo);
        return (
          <div
            ref={this._createRootNodeRef}
            className="column-manager"
          >
            <div
              className="col-manager__top-offset"
              style={{
                  height: Math.ceil(this._getSliceMeasure(0, topIndexTo))
              }}
            />
            {items[id].slice(topIndexTo, bottomIndexFrom).map((item) => {
                const entry = other.entries.get(item.id);
                let author;
                let profile;
                if ((type === columnTypes.profileFollowings || type === columnTypes.profileFollowers)) {
                    profile = other.profiles && other.profiles.get(entry.ethAddress);
                } else {
                    author = other.profiles && entry && other.profiles.get(entry.author.ethAddress);
                }
                const isPending = other.pendingEntries ? other.pendingEntries.get(item.id) : false;
                return (
                  <CellManager
                    key={item.id}
                    id={item.id}
                    onMount={this._handleCellMount(item.id)}
                    onSizeChange={this._handleCellSizeChange(item.id)}
                    isPending={isPending}
                  >
                    {cellProps => React.cloneElement(this.props.itemCard, {
                        ...cellProps,
                        ...other,
                        entry,
                        author,
                        profile,
                        isPending,
                    })}
                  </CellManager>
                );
                })}
            <div
              className="col-manager__bottom-offset"
              style={{
                height: Math.ceil(this._getSliceMeasure(bottomIndexFrom, items[id].length))
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
    onSizeChange: PropTypes.func,
    initialItemHeight: PropTypes.number,
    itemCard: PropTypes.node,
    columnHeight: PropTypes.number,
    isVisible: PropTypes.bool,
    ethAddress: PropTypes.string,
    fetching: PropTypes.bool,
    fetchingMore: PropTypes.bool,
    onItemPooling: PropTypes.func,
    pendingEntries: PropTypes.shape(),
    large: PropTypes.bool,
};

export default ColManager;

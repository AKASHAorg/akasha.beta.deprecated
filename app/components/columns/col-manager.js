import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { differenceWith, propEq, findIndex, update, indexOf, remove } from 'ramda';
import throttle from 'lodash.throttle';
import { Map } from 'immutable';
import CellManager from './cell-manager';
import EntryCard from '../cards/entry-card';
import { DataLoader } from '../';
import * as columnTypes from '../../constants/columns';

const VIEWPORT_VISIBLE_BUFFER_SIZE = 5;

class ColManager extends Component {
    constructor (props) {
        super(props);
        this.state = {
            [props.column.id]: 0
        };
        this.avgItemHeight = this.props.initialItemHeight;
        this.loadingMore = [];
        this.initialRequests = [];
        this.containerHeight = this.props.columnHeight;
        this.items = {};
        this.itemCount = 0;
        this.lastScrollTop = {};
        this._debouncedScroll = throttle(this._handleScroll, 100, { trailing: true });
        this._debouncedResize = throttle(this._onResize, 100, { trailing: true });
        this.poolingInterval = {};
        this.poolingTimeout = null;
        this.poolingDelay = 10000;
        this.colFirstEntry = new Map();
        this.scrollPending = -1;
        this.requestPoolingTimeout = -1;
        this.alreadyRendered = [];
    }

    componentWillMount = () => {
        const { column, isVisible } = this.props;
        const { id } = column;
        this.lastScrollTop[id] = 0;
        this.items[id] = [];
        const isPooling = this.poolingInterval[id] > 0;
        if (typeof onItemPooling === 'function' && !isPooling) {
            this._createRequestPooling(id);
        }
        const shouldRequestItems = column.entriesList.size === 0 &&
            !this.loadingMore.includes(column.id) && isVisible;
        if (shouldRequestItems) {
            this.props.onItemRequest(this.props.column.toJS());
            this.loadingMore.push(column.id);
        }
        if(column.entriesList.size > 0 && this.items[id].length === 0) {
            if(!this.colFirstEntry.has(id)) {
                this.colFirstEntry = this.colFirstEntry.set(id, column.entriesList.first());
            }
            this._mapItemsToState(column.entriesList, column);
        }
    }

    componentDidMount = () => {
        const { column, onItemPooling, isVisible } = this.props;
        const { id } = column;
        window.addEventListener('resize', this._debouncedResize);
        this._rootNodeRef.addEventListener('scroll', this._debouncedScroll);
        const newContainerHeight = this._rootNodeRef.getBoundingClientRect().height;
        const isPooling = this.poolingInterval[id] > 0;
        if (typeof onItemPooling === 'function' && !isPooling && isVisible) {
            this._createRequestPooling(id);
        }
        if (newContainerHeight !== this.containerHeight) {
            this.containerHeight = newContainerHeight;
            this._updateOffsets(this.lastScrollTop[id], column);
        }
        if(this.props.onRefLink) {
            this.props.onRefLink(this);
        }
    }

    shouldComponentUpdate (nextProps, nextState) {
        return nextState[this.props.column.id] !== this.state[this.props.column.id] ||
            !nextProps.column.entriesList.equals(this.props.column.entriesList) ||
            nextProps.ethAddress !== this.props.ethAddress ||
            nextProps.large !== this.props.large ||
            nextProps.entries.equals(this.props.entries) ||
            (nextProps.pendingEntries && !nextProps.pendingEntries.equals(this.props.pendingEntries)) ||
            !nextProps.profiles.equals(this.props.profiles);
    }

    componentWillReceiveProps = (nextProps) => {
        this._prepareUpdates(nextProps, { canUpdateState: true, isNext: true });
        const { onItemPooling, column, isVisible } = nextProps;
        const { id } = column;
        const isPooling = this.poolingInterval[id] > 0;
        if (typeof onItemPooling === 'function' && !isPooling && isVisible) {
            this._createRequestPooling(id);
        }
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
    // callable from outside of the component!
    loadNewItems = () => {
        const { column } = this.props;
        const { id } = column;
        this._mapItemsToState(column.get('newEntries'), column, { prepend: true });
        this.setState({
            [id]: 0
        }, () => {
            this.lastScrollTop[id] = 0;
            this._rootNodeRef.scrollTop = 0;
            this._resolveNewEntries(column.get('newEntries'));
        });
    }

    resetColumn = (id) => {
        this._resetColState(id);
    }

    _resetColState = (id) => {
        const { isVisible, onItemPooling } = this.props;
        this.items[id] = [];
        this.itemCount = 0;
        this.lastScrollTop[id] = 0;
        this.setState({
            [id]: 0
        });
        this.colFirstEntry = this.colFirstEntry.set(id, null);
        this._clearIntervals();
        const isPooling = this.poolingInterval[id] > 0;
        if (typeof onItemPooling === 'function' && !isPooling && isVisible) {
            this._createRequestPooling(id);
        }
    }

    _createRequestPooling = (id) => {
        this.poolingInterval[id] = setInterval(() => {
            this.props.onItemPooling(this.props.column.toJS());
        }, this.poolingDelay);
    }

    _clearIntervals = () => {
        const { onItemPooling, column } = this.props;
        if (typeof onItemPooling === 'function') {
            const isPooling = this.poolingInterval[column.id] > 0;
            if (isPooling) {
                this.poolingInterval[column.id] = clearInterval(this.poolingInterval[column.id]);
            }
        }
    }

    _resolveNewEntries = (entriesList) => {
        const { column, ethAddress, onNewEntriesResolveRequest } = this.props;
        entriesList.forEach(entryId => onNewEntriesResolveRequest({
            context: column.get('id'),
            entryId,
            ethAddress
        }));
    }

    _applyLoadedEntries = (newEntries, oldEntries) => {
        const diffFn = (x, y) => x === y;
        const diffedEntries = differenceWith(diffFn, newEntries.toJS(), oldEntries.toJS());
        if (diffedEntries.length > 0) {
            this.colFirstEntry = this.colFirstEntry.set(this.props.column.id, diffedEntries[0]);
        }
    }
    /* eslint-disable complexity */
    _prepareUpdates = (passedProps, options) => {
        const { isNext } = options;
        let newerProps = this.props;
        let olderProps = passedProps;
        if (isNext) {
            newerProps = passedProps;
            olderProps = this.props;
        }
        const { column, isVisible, ethAddress } = newerProps;
        const { entriesList } = column;
        const oldItems = olderProps.column.entriesList;
        const oldEthAddress = olderProps.ethAddress;
        const isNewColumn = ((oldEthAddress !== ethAddress) ||
            (column.value !== olderProps.column.value));
        const shouldRequestItems = entriesList.size === 0 &&
            !this.loadingMore.includes(column.id) && isVisible &&
            !this.initialRequests.includes(column.id);
        const newEntriesSize = column.newEntries && column.newEntries.size;
        const oldEntriesSize = olderProps.column.newEntries && olderProps.column.newEntries.size;
        const newEntriesLoaded = column.newEntries && (newEntriesSize < oldEntriesSize);
        this._doUpdates({
            isNewColumn,
            shouldRequestItems,
            hasNewItems: !column.entriesList.equals(oldItems),
            hasUnseenNewItems: column.newEntries && (newEntriesSize > oldEntriesSize),
            newEntriesLoaded,
            column,
            oldColumn: olderProps.column,
            options
        });
    }
    /**
     * WARNING! passed props can be new props or old props
     */
    /* eslint-disable complexity */
    _doUpdates = (updateParams) => {
        const { isNewColumn, shouldRequestItems, hasNewItems, hasUnseenNewItems,
            column, options, newEntriesLoaded, oldColumn } = updateParams;
        const { canUpdateState } = options;
        const { id } = column;
        if (hasUnseenNewItems && this.lastScrollTop[id] === 0 && canUpdateState) {
            this._mapItemsToState(column.get('newEntries'), column, { prepend: true });
            this._resolveNewEntries(column.get('newEntries'));
        }

        if (isNewColumn && canUpdateState) {
            this._resetColState(id);
        }

        if (newEntriesLoaded && options.canUpdateState) {
            this._applyLoadedEntries(column.newEntries, oldColumn.newEntries);
        }

        if ((isNewColumn || shouldRequestItems) && canUpdateState) {
            this.props.onItemRequest(column.toJS());
            this.initialRequests.push(id);
        } else if (hasNewItems) {
            if (!this.colFirstEntry.has(id)) {
                this.colFirstEntry = this.colFirstEntry.set(id, column.entriesList.first());
            }
            this._mapItemsToState(column.entriesList, column);
            this.loadingMore = remove(indexOf(id, this.loadingMore), 1, this.loadingMore);
        }
    }

    componentWillUnmount () {
        const isPooling = this.poolingInterval[this.props.column.id] > 0;
        if (isPooling) {
            clearInterval(this.poolingInterval[this.props.column.id]);
        }
        this._rootNodeRef.removeEventListener('scroll', this._debouncedScroll);
        window.removeEventListener('resize', this._debouncedResize);
        window.clearTimeout(this.scrollPending);
        window.clearTimeout(this.requestPoolingTimeout);
        if(this.props.onUnmount) {
            this.props.onUnmount(this.props.column);
        }
        this._resetColState(this.props.column.id);
        this.unmounting = true;
    }

    _onResize = () => {
        const { id } = this.props.column;
        const newContainerHeight = this._rootNodeRef.getBoundingClientRect().height;
        if (newContainerHeight !== this.containerHeight) {
            this.containerHeight = newContainerHeight;
            this._updateOffsets(this.lastScrollTop[id], this.props.column);
        }
    }

    _mapItemsToState = (items, column, options = {}) => {
        const { itemCount } = this;
        const { id } = column;
        const mappedItems = this.items[id].slice();
        let diff = [];
        // when loadMore triggers
        if(items.size > mappedItems.length) {
            const jsItems = items.toJS().map(v => ({ id: v }));
            const eqKey = (x, y) => x.id === y.id;
            if (options.prepend) {
                diff = differenceWith(eqKey, mappedItems, jsItems).map(v => ({
                    id: v.id,
                    height: this.avgItemHeight
                }));
                this.items[id].unshift(...diff);
            } else {
                diff = differenceWith(eqKey, jsItems, mappedItems).map(v => ({
                    id: v.id,
                    height: this.avgItemHeight
                }));
                this.items[id] = mappedItems.concat(diff);
            }
        } else if (items.size === 0) {
            this.items[id] = [];
        } else {
            // in this case an item was removed (lists column)
            this.items[id] = mappedItems.filter(item => items.includes(item.id));
        }
        this.itemCount = items.size;
        if (this.itemCount !== itemCount && this.scrollPending === -1) {
            this.loadingMore = remove(indexOf(id, this.loadingMore), 1, this.loadingMore);
            this._updateOffsets(this.lastScrollTop[id], column);
        }
    }

    // calculate an average of the cells height
    _calculateAverage = newSize =>
        ((this.avgItemHeight * (this.itemCount - 1)) + newSize) / this.itemCount;

    // load more entries
    _loadMoreIfNeeded = (column) => {
        const { props } = this;
        const { isVisible, fetchingMore } = props;
        const { id, hasMoreEntries, flags = {} } = column;
        const alreadyLoading = this.loadingMore.includes(id);

        if (
            !alreadyLoading && isVisible &&
            !fetchingMore && this.items[id].length > 0 &&
            (hasMoreEntries || flags.moreEntries)
        ) {
            this.props.onItemMoreRequest(column.toJS());
            this.loadingMore.push(id);
        }
    }
    /**
     * this method slices the items based on the user's current scroll position
     * it is called both onScroll() and on cellUpdate handlers;
     */
    _updateOffsets = (scrollTop, column) => { // eslint-disable-line max-statements
        const { items, state } = this;
        const { id } = column;
        let accHeight = 0;
        let topIndex = state[id];
        window.requestAnimationFrame(() => {
            for (let i = 0; i < items[id].length; i++) {
                const item = items[id][i];
                if (accHeight > Math.ceil(scrollTop - (this.avgItemHeight * VIEWPORT_VISIBLE_BUFFER_SIZE))) {
                    topIndex = i;
                    accHeight = 0;
                    break;
                }
                accHeight = Math.ceil(accHeight + item.height + (item.height * 0.1));
            }
            const delta = Math.abs(topIndex - state[id]);
            if (delta >= 1 || items[id].length === 0) {
                this.setState({
                    [id]: topIndex
                }, () => {
                    // special case for lists - when you delete the last
                    // item in the list
                    if (items[id].length === 0) {
                        this.forceUpdate();
                    }
                });
            }
            const bottomPadderHeight = this._getSliceMeasure(this._getBottomIndex(topIndex), items[id].length)
            const bottomPadding = Math.ceil(bottomPadderHeight);
            const bottomBufferHeight = Math.ceil(this.containerHeight * 1.5);
            const hasMoreEntries = (column &&
                (column.moreEntries || (column.flags && column.flags.moreEntries))) ||
                true;
            if ((bottomPadding <= bottomBufferHeight) && hasMoreEntries) {
                this._loadMoreIfNeeded(column);
            }
            this.scrollPending = -1;
        })
    }
    /**
     * get the index of the last visible element based on top index;
     */
    _getBottomIndex = (topIndex) => {
        const { containerHeight, items, props } = this;
        const { id } = props.column;
        let accHeight = this._getSliceMeasure(0, topIndex);
        let bottomIndex = items[id].length;
        const bufferHeight = this.avgItemHeight * VIEWPORT_VISIBLE_BUFFER_SIZE;
        for (let i = topIndex; i < items[id].length; i++) {
            const item = items[id][i];
            if (accHeight > (containerHeight + this.lastScrollTop[id] + bufferHeight)) {
                bottomIndex = i;
                accHeight = 0;
                break;
            }
            accHeight = Math.ceil(accHeight + item.height);
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
                if(this.scrollPending === -1 && !this.unmounting) {
                    this._updateOffsets(this.lastScrollTop[id], props.column);
                }
            }
        }

    _handleCellSizeChange = cellSize => this._handleCellMount(cellSize);

    _handleScroll = () => {
        if(this.scrollPending !== -1) {
            clearTimeout(this.scrollPending);
            this.scrollPending = -1;
        }
        this.scrollPending = setTimeout(() => {
            const { scrollTop } = this._rootNodeRef;
            const { id } = this.props.column;
            this._onScrollMove(scrollTop);
            this.lastScrollTop[id] = scrollTop;
        }, 50);
    }

    _onScrollMove = (scrollTop) => {
        window.requestAnimationFrame(() => {
            this._updateOffsets(scrollTop, this.props.column);
        });
    }

    _createRootNodeRef = (node) => {
        this._rootNodeRef = node;
    }

    _getSliceMeasure = (begin, end) => {
        const { id } = this.props.column;
        const measure = this.items[id].slice(begin, end).reduce((prev, curr) => prev + curr.height, 0);
        return Math.ceil(measure);
    }

    render () {
        const { items, state, props } = this;
        const { column, type, ...other } = props;
        const { id, hasMoreEntries, flags = {} } = column;
        const topIndexTo = state[id];
        const bottomIndexFrom = this._getBottomIndex(topIndexTo);
        const topSliceMeasure = Math.ceil(this._getSliceMeasure(0, topIndexTo));
        const bottomSliceMeasure = Math.ceil(this._getSliceMeasure(bottomIndexFrom, items[id].length));
        return (
          <div
            ref={this._createRootNodeRef}
            className="column-manager"
          >
            <div
              className="col-manager__top-offset"
              style={{
                  height: topSliceMeasure
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
                let isPending = other.pendingEntries ? other.pendingEntries.get(item.id) : false;
                let markAsNew = false;
                if (!isPending && column.newEntries && column.newEntries.includes(item.id)) {
                    isPending = true;
                }
                const lastSeenID = this.colFirstEntry.get(id);
                const currentItemIndex = items[id].findIndex(i => i.id === item.id);
                const lastSeenItemIndex = items[id].findIndex(i => i.id === lastSeenID);
                const isNewItem = lastSeenID && lastSeenItemIndex > currentItemIndex;
                if (isNewItem) {
                    markAsNew = true;
                }
                return (
                  <CellManager
                    author={author}
                    key={item.id}
                    id={item.id}
                    onMount={this._handleCellMount(item.id)}
                    onSizeChange={this._handleCellSizeChange(item.id)}
                    isPending={isPending}
                    large={column.get('large')}
                    entry={entry}
                    markAsNew={markAsNew}
                  >
                    {cellProps => React.cloneElement(this.props.itemCard, {
                        ...cellProps,
                        ...other,
                        entry,
                        author,
                        profile,
                        isPending,
                        contextId: column.get('id'),
                        markAsNew,
                    })}
                  </CellManager>
                );
                })}
            <div
              className="col-manager__bottom-offset"
              style={{
                height: bottomSliceMeasure
              }}
            />
            {bottomSliceMeasure < 30 && bottomIndexFrom > 0 && (hasMoreEntries || flags.moreEntries) &&
              <DataLoader flag={true} />
            }
          </div>
        );
    }
}

ColManager.defaultProps = {
    initialItemHeight: 270,
    itemCard: <EntryCard />,
    columnHeight: 600,
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
    onUnmount: PropTypes.func,
    onRefLink: PropTypes.func,
    onNewEntriesResolveRequest: PropTypes.func,
    profiles: PropTypes.shape(),
    entries: PropTypes.shape(),
};

export default ColManager;

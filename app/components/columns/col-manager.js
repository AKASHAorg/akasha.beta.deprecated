import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { differenceWith, propEq, findIndex, update, indexOf, remove } from 'ramda';
import throttle from 'lodash.throttle';
import CellManager from './cell-manager';
import EntryCard from '../cards/entry-card';
import * as columnTypes from '../../constants/columns';

const VIEWPORT_VISIBLE_BUFFER_SIZE = 5;

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
        this.poolingInterval = {};
        this.poolingTimeout = null;
        this.poolingDelay = 60000;
        this._debouncedOffsetUpdate = throttle(this._updateOffsets, 150, {trailing: true});
        this.colFirstEntry = new Map();
        this.scrollPending = -1;
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
            this.props.onItemRequest(this.props.column);
            this.loadingMore.push(column.id);
        }
        if(column.entriesList.size > 0 && this.items[id].length === 0) {
            this._mapItemsToState(column.entriesList);
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
            this._updateOffsets(this.lastScrollTop[id]);
        }
        if(this.props.onRefLink) {
            this.props.onRefLink(this);
        }
    }

    shouldComponentUpdate (nextProps, nextState) {
        return nextState.topIndexTo !== this.state.topIndexTo ||
            !nextProps.column.entriesList.equals(this.props.column.entriesList) ||
            nextProps.ethAddress !== this.props.ethAddress ||
            nextProps.large !== this.props.large ||
            !!(nextProps.pendingEntries && !nextProps.pendingEntries.equals(this.props.pendingEntries));
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
        if(this.lastScrollTop[id] !== 0) {
            this._mapItemsToState(column.get('newEntries'), { prepend: true });
            this.setState({
                topIndexTo: 0
            }, () => {
                this.lastScrollTop[id] = 0;
                this._rootNodeRef.scrollTop = 0;
                this._resolveNewEntries(column.get('newEntries'));
            });
        }
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
            topIndexTo: 0
        });
        this._clearIntervals();
        const isPooling = this.poolingInterval[id] > 0;
        if (typeof onItemPooling === 'function' && !isPooling && isVisible) {
            setTimeout(() => this._createRequestPooling(id), this.poolingDelay);
        }
    }

    _createRequestPooling = (id) => {
        this.poolingInterval[id] = setInterval(() => {
            this.props.onItemPooling(this.props.column);
        }, this.poolingDelay);
    }

    _clearIntervals = () => {
        const { onItemPooling, column } = this.props;
        if (typeof onItemPooling === 'function') {
            const isPooling = this.poolingInterval[column.id] > 0;
            if (isPooling) {
                clearInterval(this.poolingInterval[column.id]);
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
        const diffedEntries = differenceWith(diffFn, oldEntries.toJS(), newEntries.toJS());
        this.colFirstEntry = this.colFirstEntry.set(this.props.column.id, diffedEntries[0]);
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
        const { column, isVisible, ethAddress, fetching } = newerProps;
        const { entriesList } = column;
        const oldItems = olderProps.column.entriesList;
        const oldEthAddress = olderProps.ethAddress;
        const isNewColumn = ((oldEthAddress !== ethAddress) ||
            (column.value !== olderProps.column.value));
        const shouldRequestItems = entriesList.size === 0 &&
            !this.loadingMore.includes(column.id) && isVisible && !fetching;
        const newEntriesSize = column.newEntries && column.newEntries.size;
        const oldEntriesSize = olderProps.column.newEntries && olderProps.column.newEntries.size;
        const newEntriesLoaded = column.newEntries && (newEntriesSize < oldEntriesSize);
        if (newEntriesLoaded && options.canUpdateState) {
            this._applyLoadedEntries(column.newEntries, olderProps.column.newEntries);
        }
        this._doUpdates({
            isNewColumn,
            shouldRequestItems,
            hasNewItems: !column.entriesList.equals(oldItems),
            hasUnseenNewItems: column.newEntries && (newEntriesSize !== oldEntriesSize),
            column,
            options
        });
    }
    /**
     * WARNING! passed props can be new props or old props
     */
    /* eslint-disable complexity */
    _doUpdates = (updateParams) => {
        const { isNewColumn, shouldRequestItems, hasNewItems, hasUnseenNewItems,
            column, options } = updateParams;
        const { canUpdateState } = options;
        const { id } = column;
        if (hasUnseenNewItems && this.lastScrollTop[id] === 0 && canUpdateState) {
            this._mapItemsToState(column.get('newEntries'), { prepend: true });
            this._resolveNewEntries(column.get('newEntries'));
        }

        if (isNewColumn && canUpdateState) {
            this._resetColState(id);
        }
        console.log(column.value, isNewColumn, shouldRequestItems, canUpdateState);
        if ((isNewColumn || shouldRequestItems) && canUpdateState) {
            this.props.onItemRequest(column);
            this.loadingMore.push(column.id);
        } else if (hasNewItems) {
            if (!this.colFirstEntry.get(id)) {
                this.colFirstEntry = this.colFirstEntry.set(id, column.entriesList.first());
            }
            this._mapItemsToState(column.entriesList);
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
        if(this.props.onUnmount) {
            this.props.onUnmount(this.props.column);
        }
    }

    _onResize = () => {
        const { id } = this.props.column;
        const newContainerHeight = this._rootNodeRef.getBoundingClientRect().height;
        if (newContainerHeight !== this.containerHeight) {
            this.containerHeight = newContainerHeight;
            this._debouncedOffsetUpdate(this.lastScrollTop[id]);
        }
    }

    _mapItemsToState = (items, options = {}) => {
        const { props, itemCount } = this;
        const { id } = props.column;
        const mappedItems = this.items[id].slice();
        const jsItems = items.toJS().map(v => ({ id: v }));
        const eqKey = (x, y) => x.id === y.id;
        const diff = differenceWith(eqKey, jsItems, mappedItems).map(v => ({
            id: v.id,
            height: this.avgItemHeight
        }));
        if (options.prepend) {
            this.items[id].unshift(...diff);
        } else {
            this.items[id] = mappedItems.concat(diff);
        }
        this.itemCount = mappedItems.length + diff.length;
        if(itemCount !== this.itemCount && this.scrollPending === -1) {
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
        const alreadyLoading = this.loadingMore.includes(id);
        if (!alreadyLoading && isVisible && !fetchingMore) {
            this.props.onItemMoreRequest(column.toJS());
            this.loadingMore.push(id);
        }
    }
    /**
     * this method slices the items based on the user's current scroll position
     * it is called onScroll and on cellUpdate handler;
     */
    _updateOffsets = (scrollTop) => { // eslint-disable-line max-statements
        const { items, state, props } = this;
        const { id } = props.column;
        const { topIndexTo } = state;
        let accHeight = 0;
        let topIndex = topIndexTo;
        for (let i = 0; i < items[id].length; i++) {
            const item = items[id][i];
            if (Math.ceil(accHeight) >= Math.floor(scrollTop - (this.avgItemHeight * VIEWPORT_VISIBLE_BUFFER_SIZE))) {
                topIndex = i;
                accHeight = 0;
                break;
            }
            accHeight += item.height;
        }
        if (this.state.topIndexTo !== topIndex) {
            ReactDOM.unstable_batchedUpdates(() => {
                this.setState(() => ({
                    topIndexTo: topIndex
                }));
            });
        }
        const bottomPadderHeight = this._getSliceMeasure(this._getBottomIndex(topIndexTo), items[id].length)
        const bottomPadding = Math.ceil(bottomPadderHeight);
        const bottomBufferHeight = (VIEWPORT_VISIBLE_BUFFER_SIZE * this.avgItemHeight);
        if (bottomPadding <= bottomBufferHeight) {
            this._loadMoreIfNeeded();
        }
        this.scrollPending = -1;
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
                if(this.scrollPending === -1) {
                    requestAnimationFrame(() => {
                        this._updateOffsets(this.lastScrollTop[id]);
                    });
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
        this._updateOffsets(scrollTop);
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
                let isPending = other.pendingEntries ? other.pendingEntries.get(item.id) : false;
                let markAsNew = false;
                if (!isPending && column.newEntries && column.newEntries.includes(item.id)) {
                    isPending = true;
                }
                const lastSeenID = this.colFirstEntry.get(id);
                const currentItemIndex = items[id].findIndex(i => i.id === item.id);
                const lastSeenItemIndex = items[id].findIndex(i => i.id === lastSeenID)
                const isNewItem = lastSeenID && lastSeenItemIndex > currentItemIndex;
                if (isNewItem) {
                    markAsNew = true;
                }
                return (
                  <CellManager
                    key={item.id}
                    id={item.id}
                    onMount={this._handleCellMount(item.id)}
                    onSizeChange={this._handleCellSizeChange(item.id)}
                    isPending={isPending}
                    large={column.get('large')}
                    entry={entry}
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
    onUnmount: PropTypes.func,
    onRefLink: PropTypes.func,
    onNewEntriesResolveRequest: PropTypes.func,
};

export default ColManager;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { symmetricDifferenceWith, eqBy, prop, propEq, findIndex, update } from 'ramda';
import CellManager from './cell-manager';
import EntryCard from '../cards/entry-card';

const MORE_ITEMS_TRIGGER_SIZE = 10;

class ColManager extends Component {
    constructor (props) {
        super(props);
        this.state = {
            bottomIndexFrom: -1,
            topIndexTo: 0
        };
        this.avgItemHeight = this.props.initialItemHeight;
        this.loadingMore = false;
        this.containerHeight = this.props.columnHeight;
        this.items = [];
        this.itemCount = 0;
        this.lastScrollTop = 0;
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
        const mappedItems = this.items.slice();
        const jsItems = items.toJS().map(v => ({ id: v }));
        const eqKey = eqBy(prop('id'));
        const diff = symmetricDifferenceWith(eqKey, jsItems, mappedItems).map(v => ({
            id: v.id,
            height: this.avgItemHeight
        }));
        this.items = mappedItems.concat(diff);
        this.itemCount = mappedItems.length + diff.length;
    }

    // calculate average
    _calculateAverage = newSize =>
        ((this.avgItemHeight * (this.itemCount - 1)) + newSize) / this.itemCount;

    _loadMoreIfNeeded = () => {
        const { props } = this;
        const { onItemMoreRequest, column } = props;

        if (!this.loadingMore) {
            this.loadingMore = true;
            onItemMoreRequest(column.get('id'));
        }
    }
    /* eslint-disable complexity, max-statements */
    _updateOffsets = (scrollDirection, scrollTop) => {
        const { items, state } = this;
        const { topIndexTo, bottomIndexFrom } = state;
        const lastRederedList = items.slice(topIndexTo);
        let accHeight = 0;
        let topIndex = topIndexTo;
        let bottomIndex = bottomIndexFrom;
        let topFound = false;
        if (scrollDirection === 'up') {
            // is scrolling up
            // show more items from top and slice at bottom
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                accHeight += item.height;
                if ((accHeight >= scrollTop) && !topFound) {
                    topIndex = i > 3 ? i - 3 : i;
                    topFound = true;
                }
                if (accHeight > (scrollTop + this.containerHeight) && topFound) {
                    bottomIndex = i + 3;
                    topFound = false;
                    accHeight = 0;
                    break;
                }
            }
        }
        if (scrollDirection === 'down') {
            // is scrolling down
            // slice from top and show more on bottom
            // if bottom index is equal to items.length - BUFFER_OFFSET
            // load more entries
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                accHeight += item.height;
                if ((accHeight >= scrollTop) && !topFound) {
                    topIndex = i >= 3 ? i - 3 : i;
                    topFound = true;
                }
                if (accHeight > (scrollTop + this.containerHeight) && topFound) {
                    bottomIndex = i + 3;
                    topFound = false;
                    accHeight = 0;
                    break;
                }
            }
        }
        this.setState({
            topIndexTo: topIndex,
            bottomIndexFrom: bottomIndex
        }, () => {
            if (this.state.bottomIndexFrom > (items.length - MORE_ITEMS_TRIGGER_SIZE)) {
                this._loadMoreIfNeeded();
            }
        });
    }

    // update the height of the cell (called on cell`s didMount lifecycle)
    _handleCellMount = cellId =>
        (cellSize) => {
            const { items } = this;
            const cellHeight = cellSize.height;
            const propFind = propEq('id', cellId);
            const stateCellIdx = findIndex(propFind)(items);
            const sameHeight = (stateCellIdx > -1) && items[stateCellIdx].height === cellHeight;
            if (!sameHeight) {
                this.avgItemHeight = Math.ceil(this._calculateAverage(cellHeight));
                this.items = update(stateCellIdx, { id: cellId, height: cellHeight }, this.items);
            }
        }

    _handleCellSizeChange = cellId => this._handleCellMount(cellId);

    _handleScroll = () => {
        let delta = null;
        const scrollTop = this._rootNodeRef.scrollTop;
        if (scrollTop > this.lastScrollTop) {
            delta = 'down';
        } else {
            delta = 'up';
        }
        this.scrollTop = scrollTop;
        window.requestAnimationFrame(() => {
            this._onScrollMove(delta, scrollTop);
        });
    }
    _onScrollMove = (delta, scrollTop) => {
        this._updateOffsets(delta, scrollTop);
    }
    _createRootNodeRef = (node) => {
        this._rootNodeRef = node;
    }
    render () {
        const { items, state, props } = this;
        const { topIndexTo, bottomIndexFrom } = state;
        const { column, baseWidth, onItemrequest, onItemMoreRequest, ...other } = props;

        return (
          <div
            onScroll={this._handleScroll}
            // onScroll={this._handleScroll}
            ref={this._createRootNodeRef}
            style={{
                height: '100%',
                overflowY: 'auto'
            }}
          >
            <div
              className="col-manager__top-offset"
              style={{
                  height: items.slice(0, topIndexTo).reduce((prev, curr) => prev + curr.height, 0)
              }}
            />
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
              style={{
                height: items.slice(bottomIndexFrom, items.length)
                    .reduce((prev, curr) => prev + curr.height, 0)
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
};

export default ColManager;

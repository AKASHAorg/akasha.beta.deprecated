import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { connect } from 'react-redux';
import Waypoint from 'react-waypoint';
import CellManager from './cell-manager';

class ColumnManager extends Component {
    constructor (props) {
        super(props);
        this.state = {
            items: [],
            heights: [],
            measuredCells: new Map(),
            topOffset: 0,
            frontIndex: null,
        };
        this._lastScrollTop = 0;
        this._lastScrollHeight = 0;
    }
    componentWillMount () {
        const items = this._addTestItems(10);
        this.setState({
            items: items.items,
            height: items.heights
        });
    }
    componentDidMount () {
        this.containerSize = this._rootNodeRef.getBoundingClientRect();
        const scrollHeight = this._rootNodeRef.scrollHeight;
        // console.log(this.containerSize, scrollHeight, 'size, height');
    }
    _handleColumnItemClick = (ev) => {
        console.log(ev.target, ev.target.getAttribute('data-action'), 'the target, action');
    }
    _createRootNodeRef = (node) => { this._rootNodeRef = node; }
    _handleContainerScroll = (ev) => {
        // console.log(ev, 'the scroll ev');
        const scroll = this._rootNodeRef.scrollTop;
        let delta;
        if (ev.wheelDelta) {
            delta = ev.wheelDelta;
        } else {
            delta = -1 * ev.deltaY;
        }
        /**
         * scrollHeight => the total amount we can go down
         * scrollTop => how much scrolling do we have at top
         *  _
         *   | offsetTop (scrollTop)
         *  _|
         *   |
         *   | container (containerHeight)
         *  _|
         *   | offsetBottom (scrollHeight - container - scrollTop)
         *  _|
         *
         * containerHeight => the height of the container
         *
         * offsetTop = scrollTop - containerHeight
         * offsetBottom = scrollHeight - scrollTop + containerHeight
         */
        const { scrollTop } = this._rootNodeRef;

        if (delta < 0) {
            /**
             * when scrolling down we want to remove invisible items from top
             * and increment the topOffset in state.
             */
            this._reduceTop(scrollTop);
        } else if (delta > 0) {
            // SCROLLING UP
            this._reduceDown();
        }
        this._lastScrollTop = scroll;
    }
    _reduceTop = (topOffset) => {
        // keep safeTopMargin to the height of the container (~1vh)
        const safeTopMargin = this.containerSize.height;
        const measuredCells = this.state.measuredCells.toList().toJS();
        if (topOffset > safeTopMargin) {
            let accHeight = 0;
            let elemIndex = 0;

            for (let i = 0; i < measuredCells.length; i++) {
                accHeight += measuredCells[i];
                const diff = Math.abs(accHeight - (topOffset - safeTopMargin));
                if (diff <= 100) {
                    elemIndex = i;
                    accHeight = 0;
                    break;
                }
            }
            this.setState({
                frontIndex: elemIndex
            });
        }
    }
    _reduceDown = () => {}
    _addTestItems = (size) => {
        const existing = this.state.items.slice();
        const heights = this.state.heights.slice();
        for (let index = 0; index <= size; index++) {
            existing.push(`${index + this.state.items.length}-${this.props.column.id}`);
            heights.push(Math.floor((Math.random() * (210 - 360)) + 210));
        }
        return {
            items: existing,
            heights,
        };
    }
    _triggerMore = (ev) => {
        const newTestItems = this._addTestItems(10);
        this.setState({
            items: newTestItems.items,
            heights: newTestItems.heights
        });
    }
    _handleCellMount = (cellId, cellSize) => {
        this.setState(prevState => ({
            measuredCells: prevState.measuredCells.set(cellId, cellSize.height)
        }));
    }
    _handleCellSizeChange = (cellId, cellSize) => {
        this.setState(prevState => ({
            measuredCells: prevState.measuredCells.setIn([cellId], cellSize.height)
        }));
    }
    _handleCellLoad = () => console.log('a cell loaded!');
    render () {
        let items = this.state.items.slice();
        let heights = this.state.heights.slice();
        let topOffset = 0;

        if (this.state.frontIndex) {
            console.log(this.state.frontIndex, 'slice from this index');
            items = items.slice(this.state.frontIndex);
            heights = heights.slice(this.state.frontIndex);
            topOffset = this.state.heights.slice(0, this.state.frontIndex + 1).reduce((prev, curr) => prev + curr);
        }
        return (
          <div
            ref={this._createRootNodeRef}
            onClick={this._handleColumnItemClick}
            style={{
                height: '100%',
                overflowY: 'auto'
            }}
            onWheel={this._handleContainerScroll}
          >
            <div
              className="column-manager__top-spacer"
              style={{
                  height: topOffset
              }}
            />
            {items.map((v, i) => {
              return [
                (i === items.length - 2) &&
                  <Waypoint onEnter={this._triggerMore} key={`${v}-waypoint`} />,
                <CellManager
                  key={v}
                  id={i}
                  onMount={this._handleCellMount}
                  onSizeChange={this._handleCellSizeChange}
                >
                  <div
                    style={{
                      height: heights[i],
                      padding: '12px',
                      borderBottom: '1px solid #FFF',
                    }}
                    onLoad={this._handleCellLoad}
                  >
                    <span
                      data-url={`someUrl-${i}`}
                      data-action={'nav'}
                    >
                      Test {v}
                    </span>
                  </div>
                </CellManager>
              ];
            })}
          </div>
        );
    }
}

ColumnManager.propTypes = {
    prop: PropTypes.bool
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps)(ColumnManager);

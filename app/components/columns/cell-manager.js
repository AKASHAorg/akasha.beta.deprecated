import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CellManager extends Component {
    baseNodeSize = 0
    componentDidMount () {
        const { onMount, id } = this.props;
        onMount(id, this._baseNodeRef.getBoundingClientRect());
        // this.observer = new MutationObserver(this._onNodeChange);
        // this.observer.observe(this._baseNodeRef, { childList: true });
    }
    componentWillUpdate () {
        this.baseNodeSize = this._baseNodeRef.getBoundingClientRect();
    }
    componentDidUpdate () {
        const { id, onSizeChange } = this.props;
        const newBaseNodeSize = this._baseNodeRef.getBoundingClientRect();
        if (newBaseNodeSize.height !== this.baseNodeSize.height) {
            onSizeChange(id, this._baseNodeRef.getBoundingClientRect());
        }
    }
    // _onNodeChange = () => {
    //     const { id, onSizeChange } = this.props;
    //     onSizeChange(id, this._baseNodeRef.getBoundingClientRect());
    // }
    // componentWillUnmount () {
    //     this.observer.disconnect();
    // }
    _createBaseNodeRef = (node) => {
        this._baseNodeRef = node;
    }
    render () {
        return (
          <div ref={this._createBaseNodeRef}>
            {this.props.children}
          </div>
        );
    }
}

CellManager.propTypes = {
    id: PropTypes.number,
    onMount: PropTypes.func,
    onSizeChange: PropTypes.func,
    children: PropTypes.node
};

export default CellManager;

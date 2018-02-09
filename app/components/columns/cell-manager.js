import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CellManager extends Component {
    baseNodeSize = 0

    componentDidMount () {
        const { onMount } = this.props;
        onMount(this._baseNodeRef.getBoundingClientRect());
    }

    componentWillUpdate () {
        this.baseNodeSize = this._baseNodeRef.getBoundingClientRect();
    }

    componentDidUpdate () {
        const { onSizeChange } = this.props;
        const newBaseNodeSize = this._baseNodeRef.getBoundingClientRect();
        if (newBaseNodeSize.height !== this.baseNodeSize.height) {
            onSizeChange(this._baseNodeRef.getBoundingClientRect());
        }
    }

    _createBaseNodeRef = (node) => {
        this._baseNodeRef = node;
    }

    render () {
        return (
          <div ref={this._createBaseNodeRef}>
            {this.props.children()}
          </div>
        );
    }
}

CellManager.propTypes = {
    onMount: PropTypes.func,
    onSizeChange: PropTypes.func,
    children: PropTypes.func
};

export default CellManager;

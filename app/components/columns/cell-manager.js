import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CellManager extends Component {
    baseNodeSize = {}

    componentDidMount () {
        const { onMount, isPending } = this.props;
        // if the card is in pending state don`t bother to update
        // it`s height
        if (this._baseNodeRef && !isPending) {
            this.baseNodeSize = this._baseNodeRef.getBoundingClientRect();
            onMount(this.baseNodeSize);
        }
    }

    shouldComponentUpdate (nextProps) {
        return nextProps.isPending !== this.props.isPending;
    }

    // componentWillUpdate (nextProps) {
    //     const { isPending } = nextProps;
    //     if (this._baseNodeRef && !isPending) {
    //         this.baseNodeSize = this._baseNodeRef.getBoundingClientRect();
    //     }
    // }

    componentDidUpdate (prevProps) {
        const { onSizeChange, isPending } = this.props;
        if(isPending !== prevProps.isPending) {
            const refSize = this._baseNodeRef.getBoundingClientRect();
            if ( refSize.height !== this.baseNodeSize.height) {
                onSizeChange(refSize);
                this.baseNodeSize = refSize;
            }
        }
    }

    _createBaseNodeRef = (node) => {
        this._baseNodeRef = node;
    }

    render () {
        const { id, children } = this.props;
        return (
          <div
            id={id}
            ref={this._createBaseNodeRef}
          >
            {children()}
          </div>
        );
    }
}

CellManager.propTypes = {
    onMount: PropTypes.func,
    onSizeChange: PropTypes.func,
    children: PropTypes.func,
    isPending: PropTypes.bool,
    id: PropTypes.string,
};

export default CellManager;

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
        return nextProps.isPending !== this.props.isPending ||
            nextProps.large !== this.props.large ||
            !!(nextProps.entry && !nextProps.entry.equals(this.props.entry));
    }

    componentDidUpdate (prevProps) {
        const { onSizeChange, isPending } = this.props;
        if(isPending !== prevProps.isPending) {
            const refSize = this._baseNodeRef.getBoundingClientRect();
            if ( refSize.height !== this.baseNodeSize.height) {
                ReactDOM.unstable_batchedUpdates(() => {
                    onSizeChange(refSize);
                    this.baseNodeSize = refSize;
                });
            }
        }
    }

    _createBaseNodeRef = (node) => {
        this._baseNodeRef = node;
    }

    render () {
        const { entry, children } = this.props;
        return (
          <div
            ref={this._createBaseNodeRef}
            // id={entry.get('entryId')}
          >
            {entry && children()}
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
    large: PropTypes.bool,
    entry: PropTypes.shape(),
};

export default CellManager;

import PropTypes from 'prop-types';
import React, { Component } from 'react';

class CommentHighlight extends Component {
    render () {
        const { block, contentState } = this.props;
        const entityKey = block.getEntityAt(0);
        const entity = contentState.getEntity(entityKey);
        const data = entity.getData();
        return <blockquote>{ data.highlight }</blockquote>;
    }
}

CommentHighlight.propTypes = {
    block: PropTypes.shape().isRequired,
    contentState: PropTypes.shape().isRequired
};

export default CommentHighlight;

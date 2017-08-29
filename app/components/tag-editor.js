import React, { Component } from 'react';
import PropTypes from 'prop-types';

class TagEditor extends Component {
    getTags = () => {
        return [];
    }
    render () {
        return (
          <div className="tag-editor" ref={this.props.nodeRef}>
            <input
              type="text"
              className="tag-editor__input"
              placeholder="#category..."
            />
          </div>
        );
    }
}
TagEditor.propTypes = {
    nodeRef: PropTypes.func
}
export default TagEditor;

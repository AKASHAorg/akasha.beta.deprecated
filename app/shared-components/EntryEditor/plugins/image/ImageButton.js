import React, { Component } from 'react';
import { insertDataBlock } from 'megadraft';
import { IconButton } from 'material-ui';
import PhotoCircle from 'material-ui/svg-icons/image/add-a-photo';

export default class BlockButton extends Component {
    onClick = (e) => {
        e.preventDefault();
        const src = alert('Enter a URL');
        if (!src) {
            return;
        }

        const data = { src, type: 'image', display: 'medium' };

        this.props.onChange(insertDataBlock(this.props.editorState, data));
    }

    render () {
        return (
          <IconButton className={this.props.className} onClick={this.onClick}>
            <PhotoCircle />
          </IconButton>
        );
    }
}
BlockButton.propTypes = {
    onChange: React.PropTypes.func,
    className: React.PropTypes.string,
    editorState: React.PropTypes.shape()
};

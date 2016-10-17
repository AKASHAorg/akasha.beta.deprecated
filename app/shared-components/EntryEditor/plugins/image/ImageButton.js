import React, { Component } from 'react';
import { insertDataBlock } from 'megadraft';
import { IconButton } from 'material-ui';
import { getResizedImages } from 'utils/imageUtils';
import PhotoCircle from 'material-ui/svg-icons/image/add-a-photo';

export default class BlockButton extends Component {
    triggerFileDialog = (ev) => {
        console.log(this.fileInput);
        this.fileInput.click();
        // const src = alert('Enter a URL');
        // if (!src) {
        //     return;
        // }

        // const data = { src, type: 'image', display: 'medium' };

        // this.props.onChange(insertDataBlock(this.props.editorState, data));
    }
    _handleImageAdd = (ev) => {
        const file = ev.target.files;
        const filePromises = getResizedImages([file[0].path], { minWidth: 600 });
        Promise.all(filePromises).then(results => {
            console.log(results, 'image results');
            const data = { files: results[0], type: 'image', media: 'lg' };
            this.props.onChange(insertDataBlock(this.props.editorState, data));
        }).then(() => {
            ev.target.value = null;
        });
    }
    render () {
        return (
          <div>
            <IconButton onTouchTap={this.triggerFileDialog} style={{ width: 'auto' }}>
              <PhotoCircle />
            </IconButton>
            <input
              ref={((input) => { this.fileInput = input; })}
              type="file"
              accept="image/*"
              onChange={this._handleImageAdd}
            />
          </div>
        );
    }
}
BlockButton.propTypes = {
    onChange: React.PropTypes.func,
    className: React.PropTypes.string,
    editorState: React.PropTypes.shape()
};

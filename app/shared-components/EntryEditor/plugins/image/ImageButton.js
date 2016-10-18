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
        ev.persist(); // keep original event around for later use
        const file = ev.target.files;
        const filePromises = getResizedImages([file[0].path], { minWidth: 600 });
        Promise.all(filePromises).then(results => {
            const data = {
                files: results[0],
                type: 'image',
                media: this._getSuitableMedia(results[0])
            };
            this.props.onChange(insertDataBlock(this.props.editorState, data));
        }).then(() => {
            ev.target.value = null;
        });
    }
    _getSuitableMedia = (image) => {
        // by default we want to display image with highest resolution
        // that`s because we like high quality :)
        const biggestAvailableKey = Object.keys(image).reduce((prev, current) => {
            if (image[prev].width > image[current].width) {
                return prev;
            }
            return current;
        });
        return biggestAvailableKey;
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

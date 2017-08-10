import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { insertDataBlock } from 'megadraft';
import { IconButton } from 'material-ui';
import PhotoCircle from 'material-ui/svg-icons/image/photo-camera';
import { getResizedImages, findClosestMatch } from '../../../../utils/imageUtils';

export default class BlockButton extends Component {
    constructor (props) {
        super(props);
        this.state = {
            error: ''
        };
    }

    _triggerFileBrowser = () => {
        if (this.props.onClick) {
            this.props.onClick();
        }
        this.fileInput.value = '';
        this.fileInput.click();
        this.setState({
            error: ''
        });
    }

    _handleImageAdd = (ev) => {
        ev.persist();
        const files = this.fileInput.files;
        const filePromises = getResizedImages(files, { minWidth: 320 });
        Promise.all(filePromises).then((results) => {
            let bestKey = findClosestMatch(768, results[0]);
            if (bestKey === 'xl' || bestKey === 'xxl') {
                bestKey = 'md';
            }
            if (bestKey === 'gif' && results[0].gif) {
                const res = Object.assign({}, results[0]);
                delete res.gif;
                bestKey = findClosestMatch(results[0].gif.width, res);
            }
            const data = {
                files: results[0],
                type: 'image',
                media: bestKey,
                termsAccepted: true,
                licence: 'CC BY',
                caption: ''
            };
            this.props.onChange(insertDataBlock(this.props.editorState, data));
        }).then(() => {
            this.fileInput.value = '';
            this.setState({
                isAddingImage: false,
                dialogOpen: false
            });
            // verify if editor is in focus and blur;
            if (document.activeElement.contentEditable === 'true') {
                document.activeElement.blur();
            }
        }).catch((reason) => {
            this.props.onError(reason);
        });
    }

    render () {
        return (
          <div>
            <IconButton
              onTouchTap={this._triggerFileBrowser}
              style={{
                  width: 32,
                  height: 32,
                  padding: 0,
                  borderRadius: '50%',
                  border: '1px solid #444'
              }}
              iconStyle={{
                  fill: 'transparent',
                  stroke: '#444',
                  strokeWidth: '1px',
                  width: 20,
                  height: 20
              }}
              title="Add an image"
            >
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
    onChange: PropTypes.func,
    editorState: PropTypes.shape(),
    onClick: PropTypes.func,
    onError: PropTypes.func
};

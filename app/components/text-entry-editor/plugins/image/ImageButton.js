import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { insertDataBlock, DraftJS } from 'megadraft';
import { IconButton } from 'material-ui';
import PhotoCircle from 'material-ui/svg-icons/image/photo-camera';
import { getResizedImages, findClosestMatch } from '../../../../utils/imageUtils';
import { genId } from '../../../../utils/dataModule';

const { RichUtils } = DraftJS;

export default class BlockButton extends Component {
    constructor (props) {
        super(props);
        this.state = {
            error: '',
            isAddingImage: false,
            dialogOpen: false,
            creatingIPFSHash: false,
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
    _handleImageProgress = (currentProgress) => {
        console.log(currentProgress, 'currentProgress');
        const { onImageProgress } = this.props;
        if (onImageProgress) onImageProgress(currentProgress);
    }
    _convertToIpfs = files =>
        new Promise((resolve, reject) => {
            resolve(files);
        });

    _handleImageAdd = (ev) => {
        ev.persist();
        const files = this.fileInput.files;
        const filePromises = getResizedImages(files, {
            minWidth: 320,
            progressHandler: this._handleImageProgress,
            maxProgress: 100,
            idGenerator: genId,
        });
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
            return {
                imgId: genId(),
                files: results[0],
                type: 'image',
                media: bestKey,
                termsAccepted: true,
                licence: 'CC BY',
                caption: ''
            };
        }).then((data) => {
            this._convertToIpfs(data.files).then((imgHashes) => {
                this.fileInput.value = '';
                this.setState({
                    isAddingImage: false,
                    dialogOpen: false
                });
                // verify if editor is in focus, and blur it;
                if (document.activeElement.contentEditable === 'true') {
                    document.activeElement.blur();
                }
                this.props.onChange(insertDataBlock(this.props.editorState, {
                    files: imgHashes,
                    ...data
                }));
            });
        }).catch((reason) => {
            this.props.onImageError(reason);
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
    onImageError: PropTypes.func,
    onImageProgress: PropTypes.func,

};

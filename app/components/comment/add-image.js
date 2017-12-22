import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { AtomicBlockUtils } from 'draft-js';
import { getResizedImages, findClosestMatch } from '../../utils/imageUtils';
import { genId } from '../../utils/dataModule';
import { Icon } from '../';

class AddImage extends Component {
    openFileInput = (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        this.fileInput.value = '';
        this.fileInput.click();
    };

    convertToIpfs = (files, imgId) => {
        const serverChannel = window.Channel.server.utils.uploadImage;
        const clientChannel = window.Channel.client.utils.uploadImage;
        const managerChannel = window.Channel.client.utils.manager;
        return new Promise((resolve, reject) => {
            clientChannel.once((ev, { data }) => {
                if (data.error) return reject(data.error);
                const filesArr = data.collection;
                filesArr.forEach((file) => {
                    files[file.size].src = file.hash;
                });
                return resolve(files);
            });
            managerChannel.once(() => {
                serverChannel.send(
                    Object.keys(files)
                        .map(fileKey => ({
                            size: fileKey,
                            id: imgId,
                            source: files[fileKey].src
                        }))
                );
            });
            serverChannel.enable();
        });
    };

    applyChanges = (data) => {
        const { editorState, onChange } = this.props;
        const urlType = 'image';
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(urlType, 'IMMUTABLE', data);
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const newEditorState = AtomicBlockUtils.insertAtomicBlock(
            editorState,
            entityKey,
            ' '
        );

        onChange(newEditorState);
    };

    handleImageAdd = (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
        const files = this.fileInput.files;
        const filePromises = getResizedImages(files, {
            minWidth: 1,
            maxResizeWidth: 640
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
            this.convertToIpfs(data.files, data.imgId).then((imgHashes) => {
                this.fileInput.value = '';
                this.setState({
                    isAddingImage: false,
                    dialogOpen: false
                });
                // verify if editor is in focus, and blur it;
                if (document.activeElement.contentEditable === 'true') {
                    document.activeElement.blur();
                }
                this.applyChanges({
                    ...data,
                    files: imgHashes
                });
            });
        }).catch(console.error);
    };

    render () {
        return (
          <div className="content-link">
            <Icon className="add-image__icon" onMouseDown={this.openFileInput} type="photoImage" />
            <input
              ref={((input) => { this.fileInput = input; })}
              style={{ display: 'none' }}
              type="file"
              accept="image/*"
              onChange={this.handleImageAdd}
            />
          </div>
        );
    }
}

AddImage.propTypes = {
    editorState: PropTypes.shape(),
    onChange: PropTypes.func,
};

export default AddImage;

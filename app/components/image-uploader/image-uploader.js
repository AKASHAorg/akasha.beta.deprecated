import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Progress } from 'antd';
import { fromJS } from 'immutable';
import { equals } from 'ramda';
import { generalMessages } from '../../locale-data/messages';
import imageCreator, { getResizedImages, findClosestMatch } from '../../utils/imageUtils';
import { uploadImage } from '../../local-flux/services/utils-service';
import { Icon } from '../';

const INITIAL_PROGRESS_VALUE = 20;

class ImageUploader extends Component {
    constructor (props) {
        super(props);
        this.state = {
            progress: INITIAL_PROGRESS_VALUE,
            error: null,
            processingFinished: true,
            imageLoaded: false,
            imageUploaderClose: false
        };
    }

    shouldComponentUpdate (nextProps, nextState) {
        return !equals(nextProps.initialImage, this.props.initialImage) ||
            !equals(nextProps.baseUrl, this.props.baseUrl) ||
            !equals(nextProps.containerSize, this.props.containerSize) ||
            !equals(nextState.imageFile, this.state.imageFile) ||
            !equals(nextState.imageLoaded, this.state.imageLoaded) ||
            !equals(nextState.imageUploaderClose, this.state.imageUploaderClose) ||
            !equals(nextState.processingFinished, this.state.processingFinished) ||
            !equals(nextState.progress, this.state.progress) ||
            !equals(nextState.error, this.state.error) ||
            !equals(nextState.highlightDropZone, this.state.highlightDropZone);
    }
    _highlightDropZone = (ev) => {
        ev.preventDefault();
        if (ev.target.className === 'image-uploader__upload-button') {
            this.setState({
                highlightDropZone: true
            });
        }
    }
    _diminishDropZone = (ev) => {
        ev.preventDefault();
        this.setState({
            highlightDropZone: false
        });
    }

    getImage = () => this.state.imageFile;

    _handleResizeProgress = (totalProgress) => {
        this.setState({
            progress: Math.round(totalProgress + INITIAL_PROGRESS_VALUE)
        });
        this.forceUpdate();
    }
    _resizeImages = (files) => {
        const filePromises = getResizedImages(files, {
            minWidth: this.props.minWidth,
            minHeight: this.props.minHeight,
            progressHandler: this._handleResizeProgress,
            maxProgress: (100 - INITIAL_PROGRESS_VALUE)
        });
        // only support single file for now! (notice the 0 index)
        filePromises[0].then((results) => {
            this.setState({
                processingFinished: true,
                error: null,
                imageLoaded: false
            }, () => {
                if (typeof this.props.onChange === 'function') {
                    if (!this.props.useIpfs) {
                        return this.props.onChange(results);
                    }
                    if (results) {
                        return uploadImage(results)
                            .then(converted => this.props.onChange(converted));
                    }
                }
                return true;
            });
        }).catch((err) => {
            this.setState({
                error: err,
                progress: INITIAL_PROGRESS_VALUE,
                processingFinished: false,
            });
        });
    }
    _handleDialogOpen = () => {
        if (typeof this.props.onImageClear === 'function') {
            this.props.onImageClear();
        }
        return this.setState({
            processingFinished: false,
            progress: INITIAL_PROGRESS_VALUE,
            imageLoaded: false,
            error: null
        }, () => {
            this.forceUpdate();
            this._resizeImages(this.fileInput.files);
            this.fileInput.value = '';
        });
    }
    _getImageSrc = (image) => {
        image = fromJS(image);
        const { baseUrl } = this.props;
        let { containerSize = 320 } = this.props;
        if (image.size > 0) {
            if (this.container) {
                containerSize = this.container.clientWidth;
            }
            const bestKey = findClosestMatch(containerSize, image.toJS(), 'xs');
            if (bestKey) {
                return imageCreator(image.getIn([bestKey, 'src']), baseUrl);
            }
            return null;
        }
        return null;
    }
    _handleClearImage = () => {
        const { onImageClear } = this.props;
        if (typeof onImageClear === 'function') {
            onImageClear();
        }
        this.setState({
            processingFinished: true,
            progress: INITIAL_PROGRESS_VALUE,
            error: null,
            imageLoaded: false,
            highlightDropZone: false,
        });
    }
    _handleImageLoad = () => {
        this.setState({
            imageLoaded: true,
            highlightDropZone: false,
        });
    }
    render () {
        const { multiFiles, intl, initialImage } = this.props;
        const { imageLoaded, imageUploaderClose, processingFinished,
            progress, error, highlightDropZone } = this.state;

        return (
          <div
            ref={(container) => { this.container = container; }}
            className="image-uploader"
            onDragEnter={this._highlightDropZone}
            onDragLeave={this._diminishDropZone}
            onMouseEnter={() => { this.setState({ imageUploaderClose: true }); }}
            onMouseLeave={() => { this.setState({ imageUploaderClose: false }); }}
          >
            {imageLoaded && processingFinished && imageUploaderClose &&
              <div className="image-uploader__clear-image-button">
                <Button
                  type="standard"
                  icon="close-circle"
                  onClick={this._handleClearImage}
                />
              </div>
              }
            <div>
              {processingFinished && initialImage && initialImage.size !== 0 &&
                <img
                  src={this._getImageSrc(initialImage)}
                  className={`image-uploader__img image-uploader__img${imageLoaded && '_loaded'}`}
                  onLoad={this._handleImageLoad}
                  alt=""
                />
              }
              {processingFinished && initialImage && initialImage.size !== 0 && !imageLoaded &&
                <div
                  className="image-uploader__generating-preview"
                >
                  {intl.formatMessage(generalMessages.generatingPreview)}...
                </div>
              }
              {!processingFinished &&
                <div
                  className="image-uploader__empty-container image-uploader__processing-loader"
                >
                  <div
                    className="image-uploader__processing-loader-text"
                  >
                    {intl.formatMessage(generalMessages.processingImage)}...
                  </div>
                  <div className="image-uploader__loading-bar">
                    <Progress
                      className="image-uploader__progress-bar"
                      strokeWidth={5}
                      percent={progress}
                      status="active"
                    />
                  </div>
                </div>
              }
            </div>
            {(initialImage && initialImage.size === 0) && processingFinished &&
              <div
                className={
                    `image-uploader__empty-container
                    image-uploader__empty-container${highlightDropZone ? '_dragEnter' : ''}`
                }
              >
                <Icon className="image-uploader__add-image-icon" type="photoImage" />
                <div className="image-uploader__helper-text">
                  {!highlightDropZone && intl.formatMessage(generalMessages.addImage)}
                  {highlightDropZone && intl.formatMessage(generalMessages.addImageDragged)}
                </div>
              </div>
            }
            <input
              ref={(fileInput) => { this.fileInput = fileInput; }}
              type="file"
              className="image-uploader__upload-button"
              onChange={this._handleDialogOpen}
              multiple={multiFiles}
              accept="image/*"
              title={(!initialImage || (initialImage.size === 0)) ?
                intl.formatMessage(generalMessages.chooseImage) :
                intl.formatMessage(generalMessages.chooseAnotherImage)}
            />
            {this.state.error &&
              <div className="image-uploader__error">{error}</div>
            }
          </div>
        );
    }
}

ImageUploader.defaultProps = {};

ImageUploader.propTypes = {
    // used in profile update
    baseUrl: PropTypes.string,
    // pass the container width
    containerSize: PropTypes.number,
    // pass an image object from ipfs
    initialImage: PropTypes.shape(),
    // internationalization
    intl: PropTypes.shape().isRequired,
    // minimum accepted image width
    minWidth: PropTypes.number,
    // min accepted image height
    minHeight: PropTypes.number,
    // support multiple files
    multiFiles: PropTypes.bool,
    // change event for updates
    onChange: PropTypes.func,
    // handler when remove image is pressed
    onImageClear: PropTypes.func,
    // when true, image sources will be ipfs hashes
    useIpfs: PropTypes.bool,

};
export default ImageUploader;

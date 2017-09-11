import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button, Progress } from 'antd';
import R from 'ramda';
import { SvgIcon } from '../';
import AddImage from '../svg/add-image';
import { generalMessages } from '../../locale-data/messages';
import imageCreator, { getResizedImages, findClosestMatch } from '../../utils/imageUtils';

const INITIAL_PROGRESS_VALUE = 20;

class ImageUploader extends Component {
    constructor (props) {
        super(props);
        this.state = {
            imageFile: {},
            progress: INITIAL_PROGRESS_VALUE,
            error: null,
            processingFinished: true,
            imageLoaded: false
        };
    }

    shouldComponentUpdate (nextProps, nextState) {
        return !R.equals(nextProps.initialImage, this.props.initialImage) ||
            !R.equals(nextProps.baseUrl, this.props.baseUrl) ||
            !R.equals(nextProps.containerSize, this.props.containerSize) ||
            !R.equals(nextState.imageFile, this.state.imageFile) ||
            !R.equals(nextState.imageLoaded, this.state.imageLoaded) ||
            !R.equals(nextState.processingFinished, this.state.processingFinished) ||
            !R.equals(nextState.progress, this.state.progress) ||
            !R.equals(nextState.error, this.state.error) ||
            !R.equals(nextState.highlightDropZone, this.state.highlightDropZone);
    }
    componentDidMount () {
        const { initialImage } = this.props;
        this._setIpfsImage(initialImage);
    }
    componentWillReceiveProps (nextProps) {
        const { initialImage } = nextProps;
        this._setIpfsImage(initialImage);
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
    _setIpfsImage = (initialImage) => {
        const hasIpfsBgImage = initialImage &&
            R.is(Object, initialImage) &&
            !R.isEmpty(initialImage);
        if (hasIpfsBgImage) {
            this.setState({
                imageFile: initialImage
            });
        }
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
        filePromises[0].then((results) => {
            this.setState({
                imageFile: results,
                processingFinished: true,
                error: null,
                imageLoaded: false
            }, () => {
                if (typeof this.props.onChange === 'function') {
                    this.props.onChange(results);
                }
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
        if (this.fileInput.files.length === 0) {
            return this.setState({
                imageFile: {}
            });
        }
        return this.setState({
            imageFile: {},
            processingFinished: false,
            progress: INITIAL_PROGRESS_VALUE,
            imageLoaded: false
        }, () => {
            this.forceUpdate();
            this._resizeImages(this.fileInput.files);
            this.fileInput.value = '';
        });
    }
    _getImageSrc = (imageObj) => {
        const { baseUrl } = this.props;
        let { containerSize } = this.props;
        if (!containerSize && this.container && !R.isEmpty(imageObj)) {
            containerSize = this.container.clientWidth;
            const bestKey = findClosestMatch(containerSize, imageObj, 'sm');
            if (bestKey) {
                return imageCreator(imageObj[bestKey].src, baseUrl);
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
            imageFile: {},
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
        const {
            multiFiles,
            intl,
        } = this.props;
        const { imageFile, imageLoaded } = this.state;
        return (
          <div
            ref={(container) => { this.container = container; }}
            className="image-uploader"
            onDragEnter={this._highlightDropZone}
            onDragLeave={this._diminishDropZone}
          >
            <div>
              {this.state.processingFinished && !R.isEmpty(imageFile) &&
                <img
                  src={this._getImageSrc(this.state.imageFile)}
                  className={`image-uploader__img image-uploader__img${this.state.imageLoaded && '_loaded'}`}
                  onLoad={this._handleImageLoad}
                  alt=""
                />
              }
              {this.state.processingFinished && !R.isEmpty(imageFile) && !imageLoaded &&
                <div
                  className="image-uploader__generating-preview"
                >
                  {intl.formatMessage(generalMessages.generatingPreview)}...
                </div>
              }
              {!this.state.processingFinished && R.isEmpty(imageFile) &&
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
                      percent={this.state.progress}
                      status="active"
                    />
                  </div>
                </div>
              }
              {this.state.processingFinished && !R.isEmpty(imageFile) &&
                <div className="image-uploader__clear-image-button">
                  <Button
                    type="standard"
                    icon="close-circle"
                    onClick={this._handleClearImage}
                  />
                </div>
              }
            </div>
            {R.isEmpty(imageFile) && this.state.processingFinished &&
              <div
                className={
                    `image-uploader__empty-container
                    image-uploader__empty-container${this.state.highlightDropZone ? '_dragEnter' : ''}`
                }
              >
                <SvgIcon style={{ height: 48, width: 48 }} >
                  <AddImage />
                </SvgIcon>
                <text className="image-uploader__helper-text">
                  {!this.state.highlightDropZone && intl.formatMessage(generalMessages.addImage)}
                  {this.state.highlightDropZone && intl.formatMessage(generalMessages.addImageDragged)}
                </text>
              </div>
            }
            <input
              ref={(fileInput) => { this.fileInput = fileInput; }}
              type="file"
              className="image-uploader__upload-button"
              onChange={this._handleDialogOpen}
              multiple={multiFiles}
              accept="image/*"
              title={R.isEmpty(imageFile) ?
                intl.formatMessage(generalMessages.chooseImage) :
                intl.formatMessage(generalMessages.chooseAnotherImage)}
            />
            {this.state.error &&
              <div className="image-uploader__error">{this.state.error}</div>
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
    // styles..
    clearImageButtonStyle: PropTypes.shape(),
    errorStyle: PropTypes.shape(),
};
export default ImageUploader;

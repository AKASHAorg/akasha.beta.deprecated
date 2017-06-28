import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import R from 'ramda';
import { AddImage } from '../svg';
import { generalMessages } from '../../locale-data/messages';
import imageCreator, { getResizedImages, findClosestMatch } from '../../utils/imageUtils';
import styles from './image-uploader.scss';

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
            !R.equals(nextState.error, this.state.error);
    }
    componentDidMount () {
        const { initialImage } = this.props;
        this._setIpfsImage(initialImage);
    }
    componentWillReceiveProps (nextProps) {
        const { initialImage } = nextProps;
        this._setIpfsImage(initialImage);
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
            progress: totalProgress + INITIAL_PROGRESS_VALUE
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
            imageLoaded: false
        });
    }
    _handleImageLoad = (ev) => {
        this.setState({
            imageLoaded: true
        });
    }
    render () {
        const {
            clearImageButtonStyle,
            errorStyle,
            multiFiles,
            intl,
            muiTheme
        } = this.props;
        const { imageFile, imageLoaded } = this.state;
        /* eslint-disable react/no-array-index-key, no-console */
        if (multiFiles) {
            return console.error('sorry multiple files is not implemented yet!');
        }
        return (
          <div
            ref={(container) => { this.container = container; }}
            style={{ position: 'relative', border: `1px solid ${muiTheme.palette.textColor}` }}
          >
            <div>
              {this.state.processingFinished && !R.isEmpty(imageFile) &&
                <img
                  src={this._getImageSrc(this.state.imageFile)}
                  className={`${styles.image} ${this.state.imageLoaded && styles.loaded}`}
                  onLoad={this._handleImageLoad}
                  alt=""
                />
              }
              {this.state.processingFinished && !R.isEmpty(imageFile) && !imageLoaded &&
                <div
                  className={`${styles.generatingPreview}`}
                >
                  Generating preview...
                </div>
              }
              {!this.state.processingFinished && R.isEmpty(imageFile) &&
                <div
                  className={`${styles.emptyContainer} ${styles.processingLoader}`}
                >
                  <div className={`${styles.processingLoaderText}`}>Processing image...</div>
                  <div className={`${styles.loadingBar}`}>
                    <LinearProgress
                      mode="determinate"
                      style={{ display: 'inline-block' }}
                      value={this.state.progress}
                    />
                  </div>
                </div>
              }
              {this.state.processingFinished && !R.isEmpty(imageFile) &&
                <div className={`${styles.clearImageButton}`} style={clearImageButtonStyle}>
                  <RaisedButton
                    fullWidth
                    secondary
                    icon={<DeleteIcon />}
                    style={{ width: '100%' }}
                    onClick={this._handleClearImage}
                  />
                </div>
              }
            </div>
            {R.isEmpty(imageFile) && this.state.processingFinished &&
              <div
                className={`${styles.emptyContainer}`}
              >
                <SvgIcon
                  style={{ height: '42px', width: '100%' }}
                  viewBox="0 0 36 36"
                  color={this.context.muiTheme.palette.textColor}
                >
                  <AddImage />
                </SvgIcon>
                <text style={{ display: 'block' }}>
                  {intl.formatMessage(generalMessages.addImage)}
                </text>
              </div>
              }
            <input
              ref={(fileInput) => { this.fileInput = fileInput; }}
              type="file"
              className={`${styles.uploadButton}`}
              onChange={this._handleDialogOpen}
              multiple={multiFiles}
              accept="image/*"
            />
            {this.state.error &&
              <div style={errorStyle}>{this.state.error}</div>
            }
          </div>
        );
    }
}
ImageUploader.defaultProps = {
    errorStyle: {
        position: 'absolute',
        width: '80%',
        bottom: '8px',
        left: '10%',
        padding: '8px 16px',
        backgroundColor: '#FFF',
        color: '#D40202',
        boxShadow: '0px 0px 3px 0 rgba(0,0,0,0.6)'
    },
};
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
    // theme
    muiTheme: PropTypes.shape().isRequired,
    // change event for updates
    onChange: PropTypes.func,
    // handler when remove image is pressed
    onImageClear: PropTypes.func,
    // styles..
    clearImageButtonStyle: PropTypes.shape(),
    errorStyle: PropTypes.shape(),
};
ImageUploader.contextTypes = {
    muiTheme: PropTypes.shape()
};
export default ImageUploader;

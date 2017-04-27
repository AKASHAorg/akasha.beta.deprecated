import PropTypes from 'prop-types';
import React, { Component } from 'react';
import SvgIcon from 'material-ui/SvgIcon';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import { AddImage } from '../svg';
import { generalMessages } from '../../locale-data/messages';
import imageCreator, { getResizedImages, findClosestMatch } from '../../utils/imageUtils';
import styles from './image-uploader.scss';

class ImageUploader extends Component {
    constructor (props) {
        super(props);
        this.state = {
            imageFile: {},
            maxSteps: 0,
            currentStep: 0,
            isNewImage: false
        };
    }
    componentDidMount () {
        const { initialImageLink, minHeight, minWidth } = this.props;
        if (initialImageLink && initialImageLink.includes('/ipfs/')) {
            // const filePromises = getResizedImages([initialImageLink], {
            //     minWidth,
            //     minHeight,
            //     ipfsFile: true
            // });
            // return Promise.all(filePromises)
            //     .then((results) => {
            //         this.setState({
            //             imageFile: results,
            //             isNewImage: true,
            //             error: null
            //         }, () => {
            //             this.fileInput.value = '';
            //         });
            //     }).catch((err) => {
            //         console.error(err);
            //         return this.setState({
            //             error: err
            //         });
            //     });
        }
        return null;
    }
    componentWillReceiveProps (nextProps) {
        if (nextProps.initialImage && nextProps.initialImage.files) {
            const { initialImage } = nextProps;
            const containerSize = initialImage.containerSize;
            const { files } = initialImage;
            const matchingFileKey = Object.keys(files).find(imgKey =>
                files[imgKey].width >= containerSize.width);
            if (matchingFileKey) {
                const initialImageFile = imageCreator(files[matchingFileKey].src);
                this.setState({
                    initialImageFile
                });
            }
        }
    }
    shouldComponentUpdate (nextProps, nextState) {
        return nextState.imageFile !== this.state.imageFile ||
                nextState.initialImageFile !== this.state.initialImageFile ||
                nextState.error !== this.state.error;
    }
    getImage = () => {
        if (this.state.isNewImage) {
            return this.state.imageFile;
        }
        return this.props.initialImage;
    }
    _resizeImages = (files) => {
        const filePromises = getResizedImages(files, {
            minWidth: this.props.minWidth,
            minHeight: this.props.minHeight
        });
        // @todo: support for multiple files
        filePromises[0].then((promiseArray) => {
            this.setState({
                maxSteps: promiseArray.length - 1
            }, () => {
                promiseArray.forEach((promise, index) => {
                    promise.then((result) => {
                        const imageFiles = Object.assign({}, this.state.imageFile, result);
                        this.setState({
                            imageFile: imageFiles,
                            currentStep: index,
                            processingFinished: index === (promiseArray.length - 1)
                        });
                    });
                    // promise.then((result) => {
                        
                    // });
                });
                this.fileInput.value = '';
            });
        });
    }
    _handleDialogOpen = () => {
        if (this.fileInput.files.length === 0) {
            return this.setState({
                imageFile: {},
                isNewImage: true
            });
        }
        return this.setState({
            isNewImage: true,
            processingFinished: false
        }, () => {
            this._resizeImages(this.fileInput.files);
        });
    }
    _getImageSrc = (imageObj) => {
        const containerWidth = this.container.getBoundingClientRect().width;
        const bestKey = findClosestMatch(containerWidth, imageObj);
        const imageSrc = imageCreator(imageObj[bestKey].src);
        return imageSrc;
    }
    _handleClearImage = () => {
        const { clearImage } = this.props;
        if (clearImage) {
            clearImage();
        }
        this.setState({
            imageFile: {},
            isNewImage: false,
            initialImageFile: null,
            error: null
        });
    }
    render () {
        const {
            clearImageButtonStyle,
            errorStyle,
            multiFiles,
            intl,
            initialImageLink,
            muiTheme
        } = this.props;
        const { initialImageFile } = this.state;
        /* eslint-disable react/no-array-index-key */
        if (multiFiles) {
            console.error('sorry multiple files is not implemented yet!');
        }
        // console.log(this.state.imageFile);
        return (
          <div
            ref={(container) => { this.container = container; }}
            style={{ position: 'relative', border: `1px solid ${muiTheme.palette.textColor}` }}
          >
            {this.state.isNewImage &&
              <div>
                {this.state.processingFinished &&
                  <img
                    src={this._getImageSrc(this.state.imageFile)}
                    className={`${styles.image}`}
                    alt=""
                  />
                }
                {!this.state.processingFinished &&
                  <div
                    className={`${styles.emptyContainer} ${styles.processingLoader}`}
                  >
                    <div className={`${styles.processingLoaderText}`}>Processing image...</div>
                    <div className={`${styles.loadingBar}`}>
                      <LinearProgress
                        mode="determinate"
                        style={{ display: 'inline-block' }}
                        value={(100 / this.state.maxSteps) * this.state.currentStep}
                      />
                    </div>
                  </div>
                }
                <div className={`${styles.clearImageButton}`} style={clearImageButtonStyle}>
                  <RaisedButton
                    fullWidth
                    secondary
                    icon={<DeleteIcon />}
                    style={{ width: '100%' }}
                    onClick={this._handleClearImage}
                  />
                </div>
              </div>
              }
            {!this.state.isNewImage && initialImageFile &&
              <div>
                <img
                  src={this.state.initialImageFile}
                  alt=""
                  className={`${styles.image}`}
                />
                <div className={`${styles.clearImageButton}`} style={clearImageButtonStyle}>
                  <RaisedButton
                    fullWidth
                    secondary
                    icon={<DeleteIcon />}
                    style={{ width: '100%' }}
                    onClick={this._handleClearImage}
                  />
                </div>
              </div>
            }
            {!this.state.isNewImage && !initialImageFile && initialImageLink &&
              <div>
                <img
                  src={initialImageLink}
                  alt=""
                  className={`${styles.image}`}
                />
                <div
                  className={`${styles.clearImageButton}`}
                >
                  <RaisedButton
                    fullWidth
                    secondary
                    icon={<DeleteIcon />}
                    style={{ width: '100%' }}
                    onClick={this._handleClearImage}
                  />
                </div>
              </div>
            }
            {!this.state.isNewImage && !initialImageFile && !initialImageLink &&
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
    minWidth: PropTypes.number,
    minHeight: PropTypes.number,
    multiFiles: PropTypes.bool,
    intl: PropTypes.shape().isRequired,
    muiTheme: PropTypes.shape().isRequired,
    initialImage: PropTypes.shape(),
    initialImageLink: PropTypes.string,
    uploadButtonStyle: PropTypes.shape(),
    clearImageButtonStyle: PropTypes.shape(),
    errorStyle: PropTypes.shape(),
    clearImage: PropTypes.func
};
ImageUploader.contextTypes = {
    muiTheme: PropTypes.shape()
};
export default ImageUploader;

import React, { PropTypes, Component } from 'react';
import { SvgIcon, RaisedButton } from 'material-ui';
import { injectIntl } from 'react-intl';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import { AddImage } from 'shared-components/svg'; // eslint-disable-line import/no-unresolved, import/extensions
import { generalMessages } from 'locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions
import imageCreator, { getResizedImages, findBestMatch } from '../../utils/imageUtils';

class ImageUploader extends Component {
    constructor (props) {
        super(props);
        this.state = {};
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
        return nextState.imageFile !== this.state.imageFile;
    }
    getImage = () => {
        if (this.state.isNewImage) {
            return this.state.imageFile;
        }
        return this.props.initialImage;
    }
    _handleDialogOpen = () => {
        const filePaths = Array.from(this.fileInput.files).map(file => file.path);
        console.info('uploaded image size',
            Array.from(this.fileInput.files).map(file => `${Math.round(file.size / 1024)} KB`)
        );
        if (filePaths.length === 0) {
            return this.setState({
                imageFile: null,
                isNewImage: true
            });
        }
        const filePromises = getResizedImages(filePaths, {
            minWidth: this.props.minWidth,
            minHeight: this.props.minHeight
        });
        return Promise.all(filePromises)
            .then(results =>
                this.setState({
                    imageFile: results,
                    isNewImage: true
                }, () => {
                    this.fileInput.value = '';
                })
            ).catch(err =>
                this.setState({
                    error: err
                })
            );
    }
    _getImageSrc = (imageObj) => {
        const containerWidth = this.container.getBoundingClientRect().width;
        const bestKey = findBestMatch(containerWidth, imageObj);
        const imageSrc = imageCreator(imageObj[bestKey].src);

        console.info(`showing "${bestKey}" image with width "${imageObj[bestKey].width}px" and height "${imageObj[bestKey].height}px"`);

        return imageSrc;
    }
    _handleClearImage = () => {
        const { clearImage } = this.props;
        if (clearImage) {
            clearImage();
        }
        this.setState({
            imageFile: null,
            isNewImage: false,
            initialImageFile: null,
            error: null
        });
    }
    render () {
        const {
            imageStyle,
            clearImageButtonStyle,
            emptyContainerStyle,
            uploadButtonStyle,
            errorStyle,
            multiFiles,
            intl,
            initialImageLink
        } = this.props;
        const { initialImageFile } = this.state;
        return (
          <div
            ref={(container) => { this.container = container }}
            style={this.context.muiTheme.imageUploader}
          >
            {this.state.isNewImage &&
              <div>
                {multiFiles &&
                   this.state.imageFile.map((image, key) =>
                     <img src={this._getImageSrc(image)} key={key} style={imageStyle} role="presentation" />
                   )
                }
                {!multiFiles &&
                  <img src={this._getImageSrc(this.state.imageFile[0])} style={imageStyle} role="presentation" />
                }
                <div style={clearImageButtonStyle}>
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
                  role="presentation"
                  style={imageStyle}
                />
                <div style={clearImageButtonStyle}>
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
                  role="presentation"
                  style={imageStyle}
                />
                <div style={clearImageButtonStyle}>
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
              <div style={emptyContainerStyle}>
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
              style={uploadButtonStyle}
              onChange={this._handleDialogOpen}
              multiple={multiFiles}
            />
            {this.state.error &&
              <div style={errorStyle}>{this.state.error}</div>
            }
          </div>
        );
    }
}
ImageUploader.defaultProps = {
    uploadButtonStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        cursor: 'pointer',
        opacity: 0,
        width: '100%'
    },
    clearImageButtonStyle: {
        position: 'absolute',
        top: '8px',
        right: '-8px',
        zIndex: 3,
        width: 36
    },
    imageStyle: {
        width: '100%',
        display: 'inherit'
    },
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
    emptyContainerStyle: {
        textAlign: 'center',
        width: '100%',
        height: '220px',
        padding: '80px 5px'
    }
};
ImageUploader.propTypes = {
    minWidth: PropTypes.number,
    minHeight: PropTypes.number,
    multiFiles: PropTypes.bool,
    intl: PropTypes.shape(),
    initialImage: PropTypes.shape(),
    initialImageLink: PropTypes.string,
    uploadButtonStyle: PropTypes.shape(),
    clearImageButtonStyle: PropTypes.shape(),
    imageStyle: PropTypes.shape(),
    errorStyle: PropTypes.shape(),
    emptyContainerStyle: PropTypes.shape(),
    clearImage: PropTypes.func
};
ImageUploader.contextTypes = {
    muiTheme: React.PropTypes.shape()
};
export default injectIntl(ImageUploader, { withRef: true });

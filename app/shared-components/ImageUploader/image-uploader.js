import React, { PropTypes, Component } from 'react';
import { SvgIcon, RaisedButton } from 'material-ui';
import AddPhotoIcon from 'material-ui/svg-icons/image/add-a-photo';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import { injectIntl } from 'react-intl';
import { generalMessages } from 'locale-data/messages';
import { remote } from 'electron';
import imageCreator, { getResizedImages } from '../../utils/imageUtils';

const { dialog } = remote;

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
    componentWillUnmount = () => {
        window.URL.revokeObjectURL(this.state.initialImageFile);
    }
    getImage = () => {
        if (this.state.isNewImage) {
            return this.state.images;
        }
        return this.props.initialImage;
    }
    _handleDialogOpen = () => {
        const multiselection = this.props.multiFiles ? 'multiSelections' : '';
        dialog.showOpenDialog({
            title: this.props.dialogTitle,
            properties: ['openFile', multiselection],
            filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }]
        }, (files) => {
            if (!files) {
                return;
            }
            this.setState({
                imageFile: files,
                isNewImage: true
            }, () => {
                const {
                    minWidth,
                    minHeight
                } = this.props;
                const imageFiles = this.state.imageFile;
                const outputFiles = getResizedImages(imageFiles, { minWidth, minHeight });

                Promise.all(outputFiles).then((results) => {
                    this.setState({
                        images: results
                    });
                })
                .catch((err) => {
                    this.setState({
                        error: err
                    });
                });
            });
        });
    }
    _handleClearImage = () => {
        const { clearImage } = this.props;
        if (clearImage) {
            clearImage();
        }
        this.setState({
            images: null,
            imageFile: null,
            isNewImage: false,
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
          <div style={this.context.muiTheme.imageUploader}>
            {this.state.isNewImage &&
              <div>
                {multiFiles &&
                   this.state.imageFile.map((image, key) =>
                     <img src={image} key={key} style={imageStyle} role="presentation" />
                   )
                }
                {!multiFiles &&
                  <img src={this.state.imageFile[0]} style={imageStyle} role="presentation" />
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
                  color={this.context.muiTheme.palette.textColor}
                >
                  <AddPhotoIcon viewBox="0 0 24 24" />
                </SvgIcon>
                <text style={{ display: 'block' }}>
                  {intl.formatMessage(generalMessages.addImage)}
                </text>
              </div>
              }
            <div style={uploadButtonStyle} onClick={this._handleDialogOpen} />
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
        cursor: 'pointer'
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
    dialogTitle: PropTypes.string,
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

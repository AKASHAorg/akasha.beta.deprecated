import React from 'react';
import {SvgIcon, RaisedButton} from 'material-ui';
import AddPhotoIcon from 'material-ui/svg-icons/image/add-a-photo';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import {getResizedImages} from '../../../utils/imageUtils'
const remote = require('remote');
const dialog = remote.require('electron').dialog;

class ImageUploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    getImage (cb) {
        return this.state.images;
    }
    render () {
        const uploadButtonStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
            cursor: 'pointer'
        };
        const clearImageButtonStyle = {
            position: 'absolute',
            top: '8px',
            right: '-8px',
            zIndex: 3,
            width: 36
        };
        const imageStyle = {
            width: '100%',
            display: 'inherit'
        };

        return (
            <div style = {this.context.muiTheme.imageUploader}>
                {this.state.isNewImage &&
                    <div>
                        { this.props.multiFiles &&
                            this.state.imageFile.map((image, key) => {
                                return <img src = {image} key = {key} style = {imageStyle} />
                            })
                        }
                        { !this.props.multiFiles &&
                            <img src={this.state.imageFile[0]} style = {imageStyle} />
                        }
                        <div style={clearImageButtonStyle}>
                        <RaisedButton fullWidth secondary
                            icon = {<DeleteIcon />}
                            style = {{width: '100%'}}
                            onClick = {this._handleClearImage}
                        />
                        </div>
                    </div>
                }
                {!this.state.isNewImage &&
                    <div style={{textAlign: 'center', width: '100%', height: 220, padding: '80px 5px'}}>
                        <SvgIcon style = {{height: '42px', width: '100%'}}
                            color = {this.context.muiTheme.palette.textColor}
                        >
                            <AddPhotoIcon viewBox = "0 0 24 24"/>
                        </SvgIcon>
                        <text style={{display: 'block'}}>Add image</text>
                    </div>
                }
                <div style = {uploadButtonStyle} onClick = {this._handleDialogOpen}></div>
                {this.state.error &&
                    <div>{this.state.error}</div>
                }
                
            </div>
        );
    }
    _handleDialogOpen = (ev) => {
        const multiselection = this.props.multiFiles ? 'multiSelections' : '';
        dialog.showOpenDialog({
            title: this.props.dialogTitle,
            properties: ['openFile', multiselection],
            filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }]
        }, files => {
            if (!files) {
                return;
            }
            this.setState({
                imageFile: files,
                isNewImage: true
            }, () => {
                let {
                    minWidth,
                    minHeight
                } = this.props;
                const imageFiles = this.state.imageFile;
                let files = getResizedImages(imageFiles, {minWidth, minHeight});

                Promise.all(files).then(results => {
                    this.setState({
                        images: results
                    });
                }).catch(err => {
                    this.setState({
                        error: err
                    })
                })
            });
        });
    }
    _handleClearImage = () => {
        this.setState({
            imageFile: null,
            isNewImage: false
        })
    }
}
ImageUploader.propTypes = {
    minWidth: React.PropTypes.number,
    minHeight: React.PropTypes.number,
    dialogTitle: React.PropTypes.string,
    multiFiles: React.PropTypes.bool
};
ImageUploader.contextTypes = {
    muiTheme: React.PropTypes.object
};
export default ImageUploader;

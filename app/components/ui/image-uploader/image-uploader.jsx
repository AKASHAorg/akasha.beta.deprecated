import React from 'react';
import { SvgIcon, RaisedButton } from 'material-ui';
import AddPhotoIcon from 'material-ui/svg-icons/image/add-a-photo';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import { getResizedImages } from '../../../utils/imageUtils';
import { injectIntl } from 'react-intl';
import { generalMessages } from '../../../locale-data/messages';
const { dialog } = require('electron').remote;

class ImageUploader extends React.Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    getImage = () => this.state.images;
    _handleDialogOpen = () => {
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
                const {
                    minWidth,
                    minHeight
                } = this.props;
                const imageFiles = this.state.imageFile;
                const outputFiles = getResizedImages(imageFiles, { minWidth, minHeight });

                Promise.all(outputFiles).then(results => {
                    this.setState({
                        images: results
                    });
                }).catch(err => {
                    this.setState({
                        error: err
                    });
                });
            });
        });
    }
    _handleClearImage = () => {
        this.setState({
            images: null,
            imageFile: null,
            isNewImage: false,
            error: null
        });
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
        const errorStyle = {
            position: 'absolute',
            width: '80%',
            bottom: '8px',
            left: '10%',
            padding: '8px 16px',
            backgroundColor: '#FFF',
            color: '#D40202',
            boxShadow: '0px 0px 3px 0 rgba(0,0,0,0.6)'
        };
        const emptyContainerStyle = {
            textAlign: 'center',
            width: '100%',
            height: '220px',
            padding: '80px 5px'
        };

        return (
          <div style={this.context.muiTheme.imageUploader}>
              {this.state.isNewImage &&
                <div>
                  {this.props.multiFiles &&
                     this.state.imageFile.map((image, key) =>
                       <img src={image} key={key} style={imageStyle} role="presentation" />
                     )
                  }
                  {!this.props.multiFiles &&
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
                {!this.state.isNewImage &&
                  <div style={emptyContainerStyle}>
                    <SvgIcon
                      style={{ height: '42px', width: '100%' }}
                      color={this.context.muiTheme.palette.textColor}
                    >
                      <AddPhotoIcon viewBox="0 0 24 24" />
                    </SvgIcon>
                    <text style={{ display: 'block' }}>
                      {this.props.intl.formatMessage(generalMessages.addImage)}
                    </text>
                  </div>
                }
            <div style={uploadButtonStyle} onClick={this._handleDialogOpen}></div>
                {this.state.error &&
                  <div style={errorStyle}>{this.state.error}</div>
                }
          </div>
        );
    }
}
ImageUploader.propTypes = {
    minWidth: React.PropTypes.number,
    minHeight: React.PropTypes.number,
    dialogTitle: React.PropTypes.string,
    multiFiles: React.PropTypes.bool,
    intl: React.PropTypes.object
};
ImageUploader.contextTypes = {
    muiTheme: React.PropTypes.object
};
export default injectIntl(ImageUploader, { withRef: true });

import React, { Component } from 'react';
import { insertDataBlock } from 'megadraft';
import { IconButton, Dialog, FlatButton, RaisedButton, SelectField, MenuItem } from 'material-ui';
import { getResizedImages } from 'utils/imageUtils'; // eslint-disable-line import/no-unresolved, import/extensions
import PhotoCircle from 'material-ui/svg-icons/image/add-a-photo';

export default class BlockButton extends Component {
    constructor (props) {
        super(props);
        this.state = {
            dialogOpen: false,
            licence: 'CC BY',
            error: ''
        };
    }
    triggerFileDialog = (ev) => {
        this.setState({
            dialogOpen: true
        }, () => {
            if (this.props.onClick) this.props.onClick(ev);
        });
    }
    _triggerFileBrowser = () => {
        this.fileInput.click();
    }
    _handleDialogClose = () => {
        this.setState({
            dialogOpen: false
        });
    }
    _handleImageSubmit = (ev) => {
        const files = this.fileInput.files;
        this.setState({
            isAddingImage: true
        }, () => {
            this._handleImageAdd(ev, files);
        });
    }
    _handleImageAdd = (ev, files) => {
        ev.persist(); // keep original event around for later use
        const filePromises = getResizedImages([files[0].path], { minWidth: 320 });
        Promise.all(filePromises).then((results) => {
            const data = {
                files: results[0],
                type: 'image',
                media: 'md',
                termsAccepted: true,
                licence: this.state.licence,
                caption: ''
            };
            this.props.onChange(insertDataBlock(this.props.editorState, data));
        }).then(() => {
            this.fileInput.value = '';
            this.setState({
                isAddingImage: false,
                dialogOpen: false,
                fileName: ''
            });
        }).catch((reason) => {
            this.setState({
                errors: reason.message
            });
        });
    }
    /**
     * Selects an image from disk
     */
    _handleImageSelect = () => {
        const files = this.fileInput.files;
        const fileName = files[0].name;
        console.log(files);
        this.setState({
            fileName
        });
    }
    _handleLicenceChange = (ev, index, value) => {
        this.setState({
            licence: value
        });
    }
    _getSuitableMedia = (image) => {
        // by default we want to display image with highest resolution
        // that`s because we like high quality :)
        const biggestAvailableKey = Object.keys(image).reduce((prev, current) => {
            if (image[prev].width > image[current].width) {
                return prev;
            }
            return current;
        });
        return biggestAvailableKey;
    }
    showTerms = (ev) => {
        const { showTerms } = this.props;
        ev.preventDefault();
        this._handleDialogClose();
        showTerms();
    }
    render () {
        const akashaTermsLink =
          <a href="#" onClick={(ev) => this.showTerms(ev)}>
            {'AKASHA\'s terms'}
          </a>;
        const { dialogOpen, licence, fileName } = this.state;
        const selectFileMessage = fileName || 'Select file';
        return (
          <div>
            <IconButton
              onTouchTap={this.triggerFileDialog}
              style={{
                  width: 32,
                  height: 32,
                  padding: 0,
                  borderRadius: '50%',
                  border: '1px solid #444'
              }}
            >
              <PhotoCircle
                style={{
                    transform: 'scale(0.75)'
                }}
              />
            </IconButton>
            <Dialog
              modal
              open={dialogOpen}
              title={'Upload File'}
              contentStyle={{ width: 450, maxWidth: 'none' }}
              actions={[
                /* eslint-disable */
                <FlatButton
                  label="Cancel"
                  onTouchTap={this._handleDialogClose}
                />,
                <FlatButton
                  label={this.state.isAddingImage ? 'Uploading..' : 'Upload'}
                  primary
                  onTouchTap={this._handleImageSubmit}
                  disabled={this.state.isAddingImage}
                />
                /* eslint-enable */
              ]}
            >
              <div className="row">
                <div className="col-xs-8 start-xs">{selectFileMessage}</div>
                <div className="col-xs-4 end-xs">
                  <RaisedButton
                    label="Browse"
                    primary
                    onTouchTap={this._triggerFileBrowser}
                  />
                </div>
              </div>
              {this.state.errors &&
                <div className="row">
                  <div className="col-xs-12">
                    <p>{this.state.error}</p>
                  </div>
                </div>
              }
              <div className="row">
                <div className="col-xs-4">
                  <h4>Image Licence</h4>
                </div>
                <div className="col-xs-8">
                  <SelectField value={licence} onChange={this._handleLicenceChange} fullWidth>
                    <MenuItem value={'CC BY'} primaryText="Attribution" />
                    <MenuItem value={'CC BY-SA'} primaryText="Attribution-ShareAlike" />
                    <MenuItem value={'CC BY-ND'} primaryText="Attribution-NoDerivs" />
                    <MenuItem value={'CC BY-NC'} primaryText="Attribution-NonCommercial" />
                    <MenuItem value={'CC BY-NC-SA'} primaryText="Attribution-NonCommercial-ShareAlike" />
                    <MenuItem value={'CC BY-NC-ND'} primaryText="Attribution-NonCommercial-NoDerivs" />
                  </SelectField>
                </div>
                <div className="col-xs-12">
                  <small>
                    By adding this image I acknowledge and agree {akashaTermsLink} on using images
                  </small>
                </div>
              </div>
            </Dialog>
            <input
              ref={((input) => { this.fileInput = input; })}
              type="file"
              accept="image/*"
              onChange={this._handleImageSelect}
            />
          </div>
        );
    }
}
BlockButton.propTypes = {
    onChange: React.PropTypes.func,
    editorState: React.PropTypes.shape()
};

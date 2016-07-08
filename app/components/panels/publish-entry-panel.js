import React from 'react';
import { Paper, TextField, RaisedButton } from 'material-ui';
import ImageUploader from '../ui/image-uploader/image-uploader';
import LicenceDialog from '../ui/dialogs/licence-dialog';
import licences from '../ui/dialogs/licences';

class PublishPanel extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isLicencingOpen: false
        };
    }
    _handleLicenceDialogClose = (ev) => {
        console.log('request close');
        this.setState({
            isLicencingOpen: false
        });
    }
    _handleLicenceFocus = (ev) => {
        this.setState({
            isLicencingOpen: true
        });
    }
    _handleLicenceSet = (ev, selectedLicence) => {
        this.setState({
            selectedLicence,
            isLicencingOpen: false
        });
    }
    render () {
        let selectedLicence;
        if (this.state.selectedLicence) {
            selectedLicence = this.state.selectedLicence;
        } else {
            selectedLicence = {
                mainLicence: licences.find(lic => lic.id === '1'),
                subLicence: null,
                isDefault: false
            };
        }
        const licenceDescription = selectedLicence.mainLicence.description.map((descr, key) => {
            return (
              <span key={key}>{descr.text}</span>
            );
        });
        return (
          <Paper
            style={{
                width: (this.props.width || 640), zIndex: 10, height: '100%', padding: '32px'
            }}
            className="row"
          >
            <LicenceDialog
              isOpen={this.state.isLicencingOpen}
              defaultSelected="1"
              onRequestClose={this._handleLicenceDialogClose}
              onDone={this._handleLicenceSet}
              licences={licences}
            />
            <div className="col-xs-12">
              <div className="row middle-xs">
                <h2 className="col-xs-7">Publish a New Entry</h2>
                <div className="col-xs-4 end-xs">0.002 ETH</div>
              </div>
              <div className="row">
                <div className="col-xs-12 field">
                  <small>Title shown in preview</small>
                  <TextField name="title" fullWidth />
                </div>
                <div className="col-xs-12 field">
                  <small>Featured Image</small>
                  <ImageUploader />
                </div>
                <div className="col-xs-12 field">
                  <small>Tags</small>
                  <TextField name="tags" fullWidth />
                </div>
                <div className="col-xs-12 field">
                  <small>Excerpt shown in preview</small>
                  <TextField name="excerpt" multiLine fullWidth />
                </div>
                <div className="col-xs-12 field">
                  <small>Licence</small>
                  <TextField
                    name="licence"
                    fullWidth
                    onFocus={this._handleLicenceFocus}
                    errorText={licenceDescription}
                    errorStyle={{ color: '#DDD' }}
                    value={selectedLicence.mainLicence.label}
                  />
                </div>
                <div className="col-xs-12 field">
                  <small>
                  By proceeding to publish this entry, you agree with the
                    <b> 0.005 ETH</b> fee which will be deducted from your
                    <b> 0.02 ETH</b> balance.
                  </small>
                </div>
              </div>
              <div className="row end-xs">
                <div className="col-xs-2">
                  <RaisedButton label="Later" />
                </div>
                <div className="col-xs-2">
                  <RaisedButton label="Publish" primary />
                </div>
              </div>
            </div>
          </Paper>
        );
    }
}
PublishPanel.propTypes = {
    width: React.PropTypes.string
};
export default PublishPanel;

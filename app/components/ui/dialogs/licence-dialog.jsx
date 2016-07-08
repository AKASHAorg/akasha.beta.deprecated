import React from 'react';
import {
    Dialog,
    RaisedButton,
    RadioButton,
    Checkbox,
    Divider } from 'material-ui';
import licences from './licences';

class LicenceDialog extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            mainLicence: props.defaultLicence || licences.find(lic => lic.id === '1')
        };
    }
    _handleDialogCancel = (ev) => {
        this.props.onRequestClose(ev);
    }
    _handleSubLicenceCheck = (ev, val) => {
        this.setState({
            subLicence: licences.find(lic => lic.id === val)
        });
    }
    _handleMainLicenceCheck = (ev, val) => {
        this.setState({
            mainLicence: licences.find(lic => lic.id === val),
            subLicence: null
        });
    }
    render () {
        const selectedMainLicence = this.state.mainLicence;
        const selectedMainLicenceId = selectedMainLicence.id;

        const radios = licences.filter(lic => lic.parent === null).map(licence => {
            const sublicence = licences.filter(lic => lic.parent === licence.id).map(sublic => {
                return (
                  <RadioButton
                    key={sublic.id}
                    value={sublic.id}
                    label={sublic.label}
                    style={{ marginTop: 16, marginLeft: 34 }}
                    onCheck={(ev, val) => this._handleSubLicenceCheck(ev, val)}
                    checked={(this.state.subLicence && this.state.subLicence.id === sublic.id)}
                  />
                );
            });
            // console.log(this.state.selectedLicence, 'licence');
            return (
              <span key={licence.id}>
                <RadioButton
                  value={licence.id}
                  label={licence.label}
                  style={{ marginTop: 16 }}
                  checked={(selectedMainLicenceId === licence.id ||
                            (this.state.subLicence && this.state.subLicence.parent === licence.id))
                  }
                  onCheck={(ev, val) => this._handleMainLicenceCheck(ev, val)}
                />
                {(selectedMainLicenceId === licence.id || 
                  (this.state.subLicence && this.state.subLicence.parent === licence.id)) && 
                  sublicence
                }
              </span>
            );
        });

        return (
          <Dialog
            title="Licensing"
            open={this.props.isOpen}
            modal
            onRequestClose={this.props.onRequestClose}
          >
            {radios}
            <Divider style={{ marginTop: 16 }} />
            <small>{'Description of the selected licence'}</small>
            <div className="row middle-xs" style={{ marginTop: 24 }}>
              <div className="col-xs-6">
                <Checkbox label="Set as default licence" />
              </div>
              <div className="col-xs-6 end-xs">
                <RaisedButton label="cancel" onTouchTap={this._handleDialogCancel} />
                <RaisedButton label="done" primary style={{ marginLeft: 8 }} />
              </div>
            </div>
          </Dialog>
        );
    }
}

LicenceDialog.propTypes = {
    isOpen: React.PropTypes.bool,
    onRequestClose: React.PropTypes.func,
    defaultLicence: React.PropTypes.string
};

export default LicenceDialog;

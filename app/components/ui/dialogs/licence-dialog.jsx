import React from 'react';
import {
    Dialog,
    RaisedButton,
    RadioButton,
    Checkbox,
    Divider,
    FontIcon } from 'material-ui';

class LicenceDialog extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            mainLicence: props.defaultLicence || props.licences.find(lic => lic.id === '1')
        };
    }
    _handleDialogCancel = (ev) => {
        this.props.onRequestClose(ev);
    }
    _handleSubLicenceCheck = (ev, val) => {
        this.setState({
            subLicence: this.props.licences.find(lic => lic.id === val)
        });
    }
    _handleMainLicenceCheck = (ev, val) => {
        this.setState({
            mainLicence: this.props.licences.find(lic => lic.id === val),
            subLicence: undefined
        });
    }
    _handleDefaultLicenceSet = (ev, isChecked) => {
        this.setState({
            isDefault: isChecked
        });
    }
    render () {
        const selectedMainLicence = this.state.mainLicence;
        const selectedMainLicenceId = selectedMainLicence.id;

        const radios = this.props.licences.filter(lic => lic.parent === null).map(licence => {
            const sublicence = this.props.licences
                                .filter(lic => lic.parent === licence.id)
                                .map(sublic => {
                                    const subLicence = this.state.subLicence;
                                    return (
                                      <RadioButton
                                        key={sublic.id}
                                        value={sublic.id}
                                        label={sublic.label}
                                        style={{ marginTop: 16, paddingLeft: 34 }}
                                        onCheck={(ev, val) => this._handleSubLicenceCheck(ev, val)}
                                        checked={
                                          (subLicence && subLicence.id === sublic.id) || false
                                        }
                                      />
                                  );
                                }
                                );
            return (
              <span key={licence.id}>
                <RadioButton
                  value={licence.id}
                  label={licence.label}
                  style={{ marginTop: 16 }}
                  checked={
                    (selectedMainLicenceId === licence.id) ||
                    (this.state.subLicence && this.state.subLicence.parent === licence.id)
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
            contentStyle={{ maxWidth: '550px' }}
            autoScrollBodyContent
          >
            {radios}
            <Divider style={{ marginTop: 16 }} />
            <div style={{ minHeight: 48 }}>
              {this.state.subLicence &&
                this.state.subLicence.description.map((licDescription, key) =>
                  <small key={key} className="row middle-xs" style={{ marginTop: 8 }}>
                    <FontIcon className="material-icons" style={{ fontSize: 18 }}>
                      {licDescription.icon}
                    </FontIcon>
                    <div className="col-xs-11">
                      {licDescription.text}
                    </div>
                  </small>
                )
              }
            </div>
            <div className="row middle-xs" style={{ marginTop: 24 }}>
              <div className="col-xs-6">
                <Checkbox label="Set as default licence" onCheck={this._handleDefaultLicenceSet} />
              </div>
              <div className="col-xs-6 end-xs">
                <RaisedButton label="cancel" onTouchTap={this._handleDialogCancel} />
                <RaisedButton
                  label="done"
                  primary
                  style={{ marginLeft: 8 }}
                  onTouchTap={(ev) =>
                      this.props.onDone(ev, {
                          mainLicence: this.state.mainLicence,
                          subLicence: this.state.subLicence,
                          isDefault: this.state.isDefault
                      })}
                />
              </div>
            </div>
          </Dialog>
        );
    }
}

LicenceDialog.propTypes = {
    isOpen: React.PropTypes.bool,
    onRequestClose: React.PropTypes.func,
    defaultLicence: React.PropTypes.string,
    licences: React.PropTypes.array,
    onDone: React.PropTypes.func
};

export default LicenceDialog;

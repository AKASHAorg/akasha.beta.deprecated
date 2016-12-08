import React from 'react';
import {
    Dialog,
    RaisedButton,
    RadioButton,
    Divider,
    Checkbox,
    SvgIcon } from 'material-ui';
import { CreativeCommonsBY, CreativeCommonsCC, CreativeCommonsNCEU, CreativeCommonsNCJP,
  CreativeCommonsNC, CreativeCommonsND, CreativeCommonsREMIX, CreativeCommonsSHARE,
  CreativeCommonsZERO, CreativeCommonsPD, CreativeCommonsSA
} from 'shared-components/svg'; // eslint-disable-line import/no-unresolved, import/extensions

class LicenceDialog extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            defaultLicence: props.defaultSelected
        };
    }
    _handleDialogCancel = (ev) => {
        this.props.onRequestClose(ev);
    }
    _handleSubLicenceCheck = (ev, val) => {
        let { defaultLicence } = this.state;
        if (!defaultLicence) defaultLicence = {};
        defaultLicence.id = val;
        this.setState({
            defaultLicence
        });
    }
    _handleMainLicenceCheck = (ev, val) => {
        this.setState({
            defaultLicence: {
                parent: val,
                id: null
            }
        });
    }
    _handleDefaultLicenceSet = (ev, isChecked) => {
        this.setState({
            isDefault: isChecked
        });
    }
    render () {
        const { licences } = this.props;
        const { defaultLicence } = this.state;
        const licenceIcons = {
            CCBY: CreativeCommonsBY,
            CCCC: CreativeCommonsCC,
            CCNCEU: CreativeCommonsNCEU,
            CCNCJP: CreativeCommonsNCJP,
            CCNC: CreativeCommonsNC,
            CCND: CreativeCommonsND,
            CCREMIX: CreativeCommonsREMIX,
            CCSHARE: CreativeCommonsSHARE,
            CCZERO: CreativeCommonsZERO,
            CCPD: CreativeCommonsPD,
            CCSA: CreativeCommonsSA
        };
        let selectedMainLicence;
        if (licences.size === 0) {
            return <div>Loading licences</div>;
        }
        if (defaultLicence) {
            selectedMainLicence = licences.find(licence => licence.id === defaultLicence.parent);
        } else {
            selectedMainLicence = licences.find(licence => licence.id === '1');
        }
        const selectedMainLicenceId = selectedMainLicence.id;

        const radios = this.props.licences.filter(lic => lic.parent === null).map((licence) => {
            const sublicence = this.props.licences.filter(lic => lic.parent === licence.id)
              .map(sublic =>
                <RadioButton
                  key={sublic.id}
                  value={sublic.id}
                  label={sublic.label}
                  style={{ marginTop: 16, paddingLeft: 34 }}
                  onCheck={(ev, val) => this._handleSubLicenceCheck(ev, val)}
                  checked={
                    (defaultLicence && defaultLicence.id === sublic.id) || false
                  }
                />
              );
            return (
              <span key={licence.id}>
                <RadioButton
                  value={licence.id}
                  label={licence.label}
                  style={{ marginTop: 16 }}
                  checked={
                    (selectedMainLicenceId === licence.id) ||
                    !!(defaultLicence && (defaultLicence.parent === licence.id))
                  }
                  onCheck={(ev, val) => this._handleMainLicenceCheck(ev, val)}
                />
                {(selectedMainLicenceId === licence.id ||
                  (defaultLicence && defaultLicence.parent === licence.id)) &&
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
            contentStyle={{ maxWidth: '550px' }}
            autoScrollBodyContent
          >
            {radios}
            <Divider style={{ marginTop: 16 }} />
            <div style={{ minHeight: 48 }}>
              {defaultLicence && defaultLicence.id &&
                licences.find(lic => lic.id === defaultLicence.id)
                  .description
                  .map((licDescription, key) =>
                    <small key={key} className="row top-xs" style={{ marginTop: 8 }}>
                      <SvgIcon className="material-icons" style={{ fontSize: 18 }}>
                        {React.createElement(licenceIcons[licDescription.icon])}
                      </SvgIcon>
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
                  onTouchTap={ev =>
                      this.props.onDone(ev, this.state.defaultLicence)}
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
    defaultSelected: React.PropTypes.shape(),
    licences: React.PropTypes.shape(),
    onDone: React.PropTypes.func
};

export default LicenceDialog;


import React, { Component, PropTypes } from 'react';
import { MenuAkashaLogo } from '../ui/svg';

import * as Colors from 'material-ui/lib/styles/colors';
import SvgIcon from 'material-ui/lib/svg-icon';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';
import Checkbox from 'material-ui/lib/checkbox';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';

class CreateProfile extends Component {

  componentDidMount () {
    if (this.firstNameInput) {
      this.firstNameInput.focus();
    }
  }

  handleUpdateName = () => {
    const { actions } = this.props;
    const nam1 = this.firstNameInput.getValue().trim();
    const nam2 = this.lastNameInput.getValue().trim();
    const name = `${nam1} ${nam2}`.trim();
    if (actions.validateName(name).valid) {
      actions.updateName(nam1, nam2);
    }
  }

  handleUpdateUser = (event) => {
    const { actions } = this.props;
    actions.updateUser(event.target.value.trim());
  }

  handleUpdatePasswd = () => {
    const { actions, profile } = this.props;
    const pwd1 = this.refs.passwd1.getValue();
    const pwd2 = this.refs.passwd2.getValue();
    actions.updatePasswd(pwd1, pwd2);
  }

  handleShowDetails = (event, enable) => {
    const { actions } = this.props;
    actions.toggleDetails(enable);
  }

  handleUnlockActive = (event, enable) => {
    const { actions } = this.props;
    actions.unlockEnable(enable);
  }

  handleUnlockFor = (event, _, unlockFor) => {
    const { actions } = this.props;
    actions.unlockAccountFor(unlockFor);
  }

  readyForSubmit = () => {
    const { profile } = this.props;
    return (
      profile.getIn(['name', 'valid']) &&
      profile.getIn(['user', 'valid']) &&
      profile.getIn(['passwd', 'valid'])
    );
  }

  handleSubmit = () => {
    const { actions } = this.props;
    if (this.readyForSubmit()) {
      actions.createUser();
    }
  }

  render () {
    const { style, profile } = this.props;
    const floatLabelStyle = { color: Colors.lightBlack };
    const inputStyle      = { color: Colors.darkBlack };

    return (
      <div style={style}>
        <div className="row start-xs">
          <div className="col-xs" style={{ flex: 1, padding: 0 }}>
            <SvgIcon
                color={Colors.lightBlack}
                viewBox="0 0 32 32"
                style={{ width: '32px', height: '32px', marginRight: '10px', verticalAlign: 'middle' }}
              >
              <MenuAkashaLogo />
            </SvgIcon>
            <h1 style={{ fontWeight: '400', display: 'inline', verticalAlign: 'middle' }}>
              {'Create new identity'}
            </h1>

            <TextField
                floatingLabelStyle={floatLabelStyle}
                floatingLabelText="First Name *"
                inputStyle={inputStyle}
                style={{width: '210px'}}
                ref={(c) => this.firstNameInput = c}
                onBlur={this.handleUpdateName}
            />
            <TextField
                floatingLabelStyle={floatLabelStyle}
                floatingLabelText="Last Name"
                inputStyle={inputStyle}
                style={{width: '210px', marginLeft: '20px'}}
                ref={(c) => this.lastNameInput = c}
                onBlur={this.handleUpdateName}
            />
            <TextField
                fullWidth={true}
                inputStyle={inputStyle}
                floatingLabelText="User Name *"
                floatingLabelStyle={floatLabelStyle}
                errorText={profile.getIn(['user', 'valid']) ? '' : profile.getIn(['user', 'err'])}
                onChange={this.handleUpdateUser}
                value={profile.getIn(['user', 'value'])}
            />
            <TextField type="password"
                ref="passwd1"
                fullWidth={true}
                inputStyle={inputStyle}
                floatingLabelText="Password *"
                floatingLabelStyle={floatLabelStyle}
                errorText={profile.getIn(['passwd', 'valid']) ? '' : profile.getIn(['passwd', 'err1'])}
                onChange={this.handleUpdatePasswd}
                value={profile.getIn(['passwd', 'pwd1'])}
            />
            <TextField type="password"
                ref="passwd2"
                fullWidth={true}
                inputStyle={inputStyle}
                floatingLabelText="Verify Password *"
                floatingLabelStyle={floatLabelStyle}
                errorText={profile.getIn(['passwd', 'valid']) ? '' : profile.getIn(['passwd', 'err2'])}
                onChange={this.handleUpdatePasswd}
                value={profile.getIn(['passwd', 'pwd2'])}
            />

            <Checkbox
                label="Optional details"
                style={{marginTop: '18px', marginLeft: '-4px'}}
                checked={profile.get('opt_details')}
                onCheck={this.handleShowDetails}
            />

            <div style={{ display: profile.get('opt_details') ? 'block' : 'none' }}>
              <h2>{ 'Avatar' }</h2>
              <h2>{ 'Background image' }</h2>
              <h2>{ 'About you' }</h2>
              <h2>{ 'Links' }</h2>
            </div>

            <div className="row">
              <div className="col-xs-6">
                <Checkbox
                    label="Keep account unlocked for"
                    style={{marginTop: '18px', marginLeft: '-4px', width: '280px'}}
                    checked={profile.getIn(['unlock', 'enabled'])}
                    onCheck={this.handleUnlockActive}
                />
              </div>
              <div className="col-xs-6">
                <SelectField
                    value={profile.getIn(['unlock', 'value'])}
                    onChange={this.handleUnlockFor}
                    style={{width: '100px'}}
                  >
                  <MenuItem value={1} primaryText="1 min"/>
                  <MenuItem value={5} primaryText="5 min"/>
                  <MenuItem value={15} primaryText="15 min"/>
                  <MenuItem value={30} primaryText="30 min"/>
                </SelectField>
              </div>
            </div>

            <div style={{marginTop: '20px'}}>
              <small>
                {'By proceeding to create your account and use AKASHA, you are agreeing to our' +
                 'Terms of Service and Privacy Policy. If you do not agree, you cannot use AKASHA.'}
              </small>
            </div>
          </div>
        </div>

        <div className="row end-xs">
          <div className="col-xs" style={
              profile.get('opt_details') ? {margin: '25px 0 30px'} : {position: 'absolute', bottom: 0, right: 0}
            }>
            <RaisedButton label="Cancel"
            />
            <RaisedButton label="Submit"
                primary={true}
                disabled={this.readyForSubmit() ? false : true}
                style={{marginLeft: '12px'}}
                onClick={this.handleSubmit}
            />
          </div>
        </div>
      </div>
    );
  }
}

CreateProfile.propTypes = {
  actions: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  style:   PropTypes.object
};

CreateProfile.contextTypes = {
  muiTheme: React.PropTypes.object
};

CreateProfile.defaultProps = {
  style: {
    width:         '100%',
    height:        '100%',
    display:       'flex',
    flexDirection: 'column',
    position:      'relative'
  }
};

export default CreateProfile;

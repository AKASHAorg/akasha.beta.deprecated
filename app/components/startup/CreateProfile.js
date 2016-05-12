const remote = require('remote');
const dialog = remote.require('electron').dialog;
import React, { Component, PropTypes } from 'react';
import { MenuAkashaLogo } from '../ui/svg';
import * as Colors from 'material-ui/styles/colors';
import { SvgIcon, RaisedButton, TextField, Checkbox, SelectField, MenuItem } from 'material-ui';
import Avatar from '../ui/avatar/avatar-editor';
import Validator from 'validatorjs';

class CreateProfile extends Component {
  constructor() {
    super();
    this.state = {
      formValues: {
        firstName: '',
        lastName: '',
        userName: '',
        password: '',
        password_confirmation: ''
      }
    };
    this.validatorTypes = {
      firstName: 'required|min:3',
      lastName: 'required|min:3',
      userName: 'required|min:4',
      password: 'required|min:8|max:32',
      password2: 'required|confirmed'
    };
    this.validationErrorMessages = {
      required: 'The :attribute is required.',
      min: ':attribute should be at least :min characters long.',
      max: ':attribute should not have more than :max characters.',
      'confirmed.password2': 'Oups! Password verification is different than first one!'
    }
  }
  componentWillMount () {
    this.setState({ opt_details: false });
  }

  componentDidMount () {
    if (this.firstNameInput) {
      this.firstNameInput.focus();
    }
  }

  handleUpdateName = () => {}

  handleUpdateUser = (event) => {}

  handleUpdatePasswd = () => {}

  handleShowDetails = (event, enable) => {
    this.setState({ opt_details: !this.state.opt_details });
  }

  handleUnlockActive = (event, enable) => {}

  handleUnlockFor = (event, _, unlockFor) => {}

  handleUploadBgImage = () => {}

  readyForSubmit = () => {}

  handleSubmit = () => {
    actions.createUser();
  }

  render () {
    const { style, profile } = this.props;
    const floatLabelStyle = { color: Colors.lightBlack };
    const inputStyle = { color: Colors.darkBlack };

    return (
      <div style={style} >
        <div className="row start-xs" >
          <div className="col-xs" style={{ flex: 1, padding: 0 }} >
            <SvgIcon
              color={Colors.lightBlack}
              viewBox="0 0 32 32"
              style={{ width: '32px', height: '32px', marginRight: '10px', verticalAlign: 'middle' }}
            >
              <MenuAkashaLogo />
            </SvgIcon>
            <h1 style={{ fontWeight: '400', display: 'inline', verticalAlign: 'middle' }} >
              {'Create new identity'}
            </h1>

            <TextField
              floatingLabelStyle={floatLabelStyle}
              floatingLabelText="First Name"
              inputStyle={inputStyle}
              style={{ width: '210px' }}
              ref={(c) => this.firstNameInput = c}
              onBlur={this.handleUpdateName}
            />
            <TextField
              floatingLabelStyle={floatLabelStyle}
              floatingLabelText="Last Name"
              inputStyle={inputStyle}
              style={{ width: '210px', marginLeft: '20px' }}
              ref={(c) => this.lastNameInput = c}
              onBlur={this.handleUpdateName}
            />
            <TextField
              fullWidth
              inputStyle={inputStyle}
              floatingLabelText="User Name"
              floatingLabelStyle={floatLabelStyle}
              errorText={profile.getIn(['user', 'valid']) ? '' : profile.getIn(['user', 'err'])}
              onChange={this.handleUpdateUser}
              value={profile.getIn(['user', 'value'])}
            />
            <TextField type="password"
                       ref="passwd1"
                       fullWidth
                       inputStyle={inputStyle}
                       floatingLabelText="Password"
                       floatingLabelStyle={floatLabelStyle}
                       errorText={profile.getIn(['passwd', 'valid']) ? '' : profile.getIn(['passwd', 'err1'])}
                       onChange={this.handleUpdatePasswd}
                       value={profile.getIn(['passwd', 'pwd1'])}
            />
            <TextField type="password"
                       ref="passwd2"
                       fullWidth
                       inputStyle={inputStyle}
                       floatingLabelText="Verify Password"
                       floatingLabelStyle={floatLabelStyle}
                       errorText={profile.getIn(['passwd', 'valid']) ? '' : profile.getIn(['passwd', 'err2'])}
                       onChange={this.handleUpdatePasswd}
                       value={profile.getIn(['passwd', 'pwd2'])}
            />

            <Checkbox
              label="Optional details"
              style={{ marginTop: '18px', marginLeft: '-4px' }}
              checked={this.state.opt_details}
              onCheck={this.handleShowDetails}
            />

            <div style={{ display: this.state.opt_details ? 'block' : 'none' }} >

              <h3 style={{ margin: '30px 0 10px 0' }} >{'Avatar'}</h3>
              <div>
                <Avatar 
                  image={this.state.avatarImage} 
                  editable
                  ref={(avatar) => this.avatar = avatar}/>
              </div>
              <h3 style={{ margin: '20px 0 10px 0' }} >{'Background image'}</h3>
              <canvas
                id="canvasBgImage"
                onClick={this.handleUploadBgImage}
                style={{ width: '100%', height: '200px', border: '1px dotted #ccc', background: '#eee' }}
              >
              </canvas>

              <h3 style={{ margin: '20px 0 0 0' }} >{'About you'}</h3>
              <TextField
                fullWidth
                floatingLabelText="Short description"
                floatingLabelStyle={floatLabelStyle}
              />

              <h3 style={{ margin: '20px 0 0 0' }} >{'Links'}</h3>
              <TextField
                fullWidth
                floatingLabelText="Title"
                floatingLabelStyle={floatLabelStyle}
              />
              <TextField
                fullWidth
                floatingLabelText="URL"
                floatingLabelStyle={floatLabelStyle}
              />

            </div>

            <div className="row" >
              <div className="col-xs-6" >
                <Checkbox
                  label="Keep account unlocked for"
                  style={{ marginTop: '18px', marginLeft: '-4px', width: '280px' }}
                  checked={profile.getIn(['unlock', 'enabled'])}
                  onCheck={this.handleUnlockActive}
                />
              </div>
              <div className="col-xs-6" >
                <SelectField
                  value={profile.getIn(['unlock', 'value'])}
                  onChange={this.handleUnlockFor}
                  style={{ width: '100px' }}
                >
                  <MenuItem value={1} primaryText="1 min" />
                  <MenuItem value={5} primaryText="5 min" />
                  <MenuItem value={15} primaryText="15 min" />
                  <MenuItem value={30} primaryText="30 min" />
                </SelectField>
              </div>
            </div>

            <div style={{ marginTop: '20px' }} >
              <small>
                {'By proceeding to create your account and use AKASHA, you are agreeing to our' +
                'Terms of Service and Privacy Policy. If you do not agree, you cannot use AKASHA.'}
              </small>
            </div>
          </div>
        </div>

        <div className="row end-xs" >
          <div className="col-xs"
               style={
              this.state.opt_details ? { margin: '25px 0 30px' } : { position: 'absolute', bottom: 0, right: 0 }
            }
          >
            <RaisedButton label="Cancel" />
            <RaisedButton label="Submit"
                          primary
                          disabled={!this.readyForSubmit()}
                          style={{ marginLeft: '12px' }}
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
  style: PropTypes.object
};

CreateProfile.contextTypes = {
  muiTheme: React.PropTypes.object
};

CreateProfile.defaultProps = {
  style: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  }
};

export default CreateProfile;

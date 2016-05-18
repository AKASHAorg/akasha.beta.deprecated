const remote = require('remote');
const dialog = remote.require('electron').dialog;
import React, { Component, PropTypes } from 'react';
import { MenuAkashaLogo } from '../ui/svg';
import * as Colors from 'material-ui/styles/colors';
import { SvgIcon, RaisedButton, TextField, Checkbox, SelectField, MenuItem } from 'material-ui';
import Avatar from '../ui/avatar/avatar-editor';
import ImageUploader from '../ui/image-uploader/image-uploader';
import { inputFieldMethods } from '../../utils/dataModule';
import validationProvider from '../../utils/validationProvider';
import { user } from '../../utils/validationSchema';
import ScrollBars from 'react-custom-scrollbars';

class CreateProfile extends Component {
  constructor() {
    super();
    this.getProps = inputFieldMethods.getProps.bind(this);
    this.state = {
      formValues: {}
    };
    this.validatorTypes = user.schema,
    this.serverValidatedFields = ['userName']
  }

  getValidatorData = () => {
    return this.state.formValues;
  }

  componentWillMount () {
    this.setState({ opt_details: false });
  }

  componentDidMount () {
    if (this.firstNameInput) {
      this.firstNameInput.focus();
    }
  }

  handleShowDetails = (event, enable) => {
    this.setState({ opt_details: !this.state.opt_details });
  }

  handleUnlockActive = (event, enable) => {}

  handleUnlockFor = (event, _, unlockFor) => {}

  handleSubmit = () => {
    let userData = {};
    let avatarFile = this.avatar.getImage();
    let profileImage = this.imageUploader.getImage();
    
  }

  render () {
    const { style, profile } = this.props;
    const floatLabelStyle = { color: Colors.lightBlack };
    const inputStyle = { color: Colors.darkBlack };

    const firstNameProps = this.getProps({
        floatingLabelText: 'First Name',
        ref: (firstNameInput) => this.firstNameInput = firstNameInput,
        floatingLabelStyle: floatLabelStyle,
        inputStyle: {inputStyle},
        style: { width: '210px' },
        statePath: 'formValues.firstName',
        addValueLink: true,
        onBlur: this.props.handleValidation('formValues.firstName')
    });

    const lastNameProps = this.getProps({
        floatingLabelStyle: floatLabelStyle,
        floatingLabelText: 'Last Name',
        inputStyle: {inputStyle},
        style: { width: '210px', marginLeft: '20px' },
        statePath: 'formValues.lastName',
        addValueLink: true,
        onBlur: this.props.handleValidation('formValues.lastName')
    });

    const userNameProps = this.getProps({
        fullWidth: true,
        inputStyle: {inputStyle},
        floatingLabelText: 'User Name',
        floatingLabelStyle: floatLabelStyle,
        addValueLink: true,
        statePath: 'formValues.userName',
        onBlur: this.props.handleValidation('formValues.userName')
    });

    const passwordProps = this.getProps({
        type: 'password',
        fullWidth: true,
        inputStyle: {inputStyle},
        floatingLabelText: 'Password',
        floatingLabelStyle: floatLabelStyle,
        addValueLink: true,
        statePath: 'formValues.password',
        onBlur: this.props.handleValidation('formValues.password')
    });

    const password2Props = this.getProps({
        type: 'password',
        fullWidth: true,
        inputStyle: {inputStyle},
        floatingLabelText: 'Verify Password',
        floatingLabelStyle: floatLabelStyle,
        addValueLink: true,
        statePath: 'formValues.password2',
        onBlur: this.props.handleValidation('formValues.password2')
    });

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
            <TextField {...firstNameProps} />
            <TextField {...lastNameProps} />
            <TextField {...userNameProps} />
            <TextField {...passwordProps} />
            <TextField {...password2Props} />

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
                  editable
                  ref={(avatar) => this.avatar = avatar}
                />
              </div>
              <h3 style={{ margin: '20px 0 10px 0' }} >{'Background image'}</h3>

              <ImageUploader
                ref={(imageUploader) => this.imageUploader = imageUploader}
                minHeight = {350}
                minWidth = {1024}
                multiFiles = {true}
              />

              <h3 style={{ margin: '20px 0 0 0' }} >{'About you'}</h3>
              <TextField
                fullWidth
                floatingLabelText="Short description"
                multiLine
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
              this.state.opt_details ? { margin: '25px 0 30px' } : {}
            }
          >
            <RaisedButton label="Cancel" />
            <RaisedButton label="Submit"
                          primary
                          disabled={false}
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
    style: PropTypes.object,
    validate: React.PropTypes.func,
    errors: React.PropTypes.object,
    isValid: React.PropTypes.func,
    getValidationMessages: React.PropTypes.func,
    clearValidations: React.PropTypes.func,
    handleValidation: React.PropTypes.func
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

export default validationProvider(CreateProfile);

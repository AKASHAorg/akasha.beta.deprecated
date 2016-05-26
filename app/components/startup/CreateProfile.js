const remote = require('remote');
const dialog = remote.require('electron').dialog;
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import { MenuAkashaLogo } from '../ui/svg';
import * as Colors from 'material-ui/styles/colors';
import { SvgIcon, IconButton, RaisedButton,
         TextField, Checkbox, SelectField, MenuItem, Divider } from 'material-ui';
import ContentAddIcon from 'material-ui/svg-icons/content/add'
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';
import Avatar from '../ui/avatar/avatar-editor';
import ImageUploader from '../ui/image-uploader/image-uploader';
import { inputFieldMethods } from '../../utils/dataModule';
import validationProvider from '../../utils/validationProvider';
import { UserValidation } from '../../utils/validationSchema';
import ScrollBars from 'react-custom-scrollbars';
import { defineMessages, injectIntl, FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { profileMessages, formMessages, generalMessages } from '../../locale-data/messages';

class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.getProps = inputFieldMethods.getProps.bind(this);
    this.state = {
      formValues: {},
      links: [
            {
                title: '',
                url: '',
                type: '',
                _id: 0
            }
        ]
    };
    this.validatorTypes = new UserValidation(props.intl).getSchema();
    this.serverValidatedFields = ['userName'];
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

  handleSubmit = (ev) => {
    let userData = this.state.formValues;
    let avatarFile = this.avatar.getImage();
    let profileImage = this.imageUploader.refs['wrappedInstance'].getImage();
    const errors = this.props.errors;
    const userLinks = this.state.links.filter(link => {
        return link.title.length > 0
    });
    // optional settings
    if(userLinks.length > 0) {
        userData.links = userLinks
    }
    if(avatarFile) {
        userData.avatarFile = avatarFile
    }
    if(profileImage) {
        userData.profileImage = profileImage
    }
    if(this.state.about) {
        userData.about = this.state.about
    }
    // check for remaining errors
    for(let key in this.props.errors) {
        if(this.props.errors[key].length > 0) {
            return;
        }
    }
    /*
    return this.props.actions.createUser(userData).then(() => {
        // redirect to user homepage
        

        this.setState({
            submitting: false
        });
    }).catch((err) => {
        // show an error in snackBar -> dispatch it to store
        this.setState({
            createError: err,
            submitting: false
        });
    });
    */
    this.context.router.push('new-profile-status');
    console.log('save user with data ', userData);

  }

    render () {
        const { style, profile, intl} = this.props;
        const floatLabelStyle = { color: Colors.lightBlack };
        const inputStyle = { color: Colors.darkBlack };
        const firstNameProps = this.getProps({
            floatingLabelText: intl.formatMessage(formMessages.firstName),
            ref: (firstNameInput) => this.firstNameInput = firstNameInput,
            floatingLabelStyle: floatLabelStyle,
            inputStyle: {inputStyle},
            style: { width: '210px', verticalAlign: 'middle' },
            statePath: 'formValues.firstName',
            required: true,
            addValueLink: true,
            onBlur: this.props.handleValidation('formValues.firstName')
        });

        const lastNameProps = this.getProps({
            floatingLabelStyle: floatLabelStyle,
            floatingLabelText: intl.formatMessage(formMessages.lastName),
            inputStyle: {inputStyle},
            style: { width: '210px', marginLeft: '20px', verticalAlign: 'middle' },
            statePath: 'formValues.lastName',
            required: true,
            addValueLink: true,
            onBlur: this.props.handleValidation('formValues.lastName')
        });

        const userNameProps = this.getProps({
            fullWidth: true,
            inputStyle: {inputStyle},
            style: {verticalAlign: 'middle'},
            floatingLabelText: intl.formatMessage(formMessages.userName),
            floatingLabelStyle: floatLabelStyle,
            required: true,
            addValueLink: true,
            statePath: 'formValues.userName',
            onBlur: this.props.handleValidation('formValues.userName')
        });

        const passwordProps = this.getProps({
            type: 'password',
            fullWidth: true,
            inputStyle: {inputStyle},
            style: {verticalAlign: 'middle'},
            floatingLabelText: intl.formatMessage(formMessages.password),
            floatingLabelStyle: floatLabelStyle,
            required: true,
            addValueLink: true,
            statePath: 'formValues.password',
            onBlur: this.props.handleValidation('formValues.password')
        });

        const password2Props = this.getProps({
            type: 'password',
            fullWidth: true,
            inputStyle: {inputStyle},
            style: {verticalAlign: 'middle'},
            floatingLabelText: intl.formatMessage(formMessages.passwordVerify),
            floatingLabelStyle: floatLabelStyle,
            required: true,
            addValueLink: true,
            statePath: 'formValues.password2',
            onBlur: this.props.handleValidation('formValues.password2')
        });

        return (
          <div style={style} >
            <form action=""
                  onSubmit = {this.handleSubmit}
                  ref={(profileForm) => this.profileForm = profileForm}
            >
            <div className="row start-xs" >
              <div className="col-xs" style={{ flex: 1, padding: 0 }} >
                <div className="row middle-xs">
                    <SvgIcon
                      color={Colors.lightBlack}
                      viewBox="0 0 32 32"
                      style={{ 
                        width: '32px',
                        height: '32px',
                        marginRight: '10px',
                        verticalAlign: 'middle' }}
                    >
                      <MenuAkashaLogo />
                    </SvgIcon>
                    <h1 style={{ fontWeight: '400', display: 'inline', verticalAlign: 'middle', margin: 0 }} >
                      <FormattedMessage {...profileMessages.createProfileTitle} />
                    </h1>
                </div>
                <TextField {...firstNameProps} />
                <TextField {...lastNameProps} />
                <TextField {...userNameProps} />
                <TextField {...passwordProps} />
                <TextField {...password2Props} />
                    <Checkbox
                      label={intl.formatMessage(profileMessages.optionalDetailsLabel)}
                      style={{ marginTop: '18px', marginLeft: '-4px' }}
                      checked={this.state.opt_details}
                      onCheck={this.handleShowDetails}
                    />

                    <div style={{ display: this.state.opt_details ? 'block' : 'none' }} >

                      <h3 style={{ margin: '30px 0 10px 0' }} >
                        {intl.formatMessage(profileMessages.avatarTitle)}
                      </h3>
                      <div>
                        <Avatar
                          editable
                          ref={(avatar) => this.avatar = avatar}
                        />
                      </div>
                      <h3 style={{ margin: '20px 0 10px 0' }} >
                        {intl.formatMessage(profileMessages.backgroundImageTitle)}
                      </h3>

                      <ImageUploader
                        ref={(imageUploader) => this.imageUploader = imageUploader}
                        minHeight = {350}
                        minWidth = {672}
                      />

                      <h3 style={{ margin: '20px 0 0 0' }} >
                        {intl.formatMessage(profileMessages.aboutYouTitle)}
                      </h3>
                      <TextField
                        fullWidth
                        floatingLabelText={intl.formatMessage(profileMessages.shortDescriptionLabel)}
                        multiLine
                        value = {this.state.about}
                        floatingLabelStyle={floatLabelStyle}
                        onChange = {this._handleAboutChange}
                      />
                      <div className = "row" style={{ margin: '20px 0 0 0' }}>
                        <h3 className="col-xs-10"
                        >{intl.formatMessage(profileMessages.linksTitle)}</h3>
                        <div className = "col-xs-2 end-xs">
                            <IconButton
                                title = {intl.formatMessage(profileMessages.addLinkButtonTitle)}
                                onClick={this._handleAddLink}
                                primary
                            >
                                <SvgIcon >
                                    <ContentAddIcon 
                                        color={this.context.muiTheme.palette.primary1Color}
                                    />
                                </SvgIcon>
                            </IconButton>
                        </div>
                      </div>
                      {this.state.links.map((link, key) => {
                        return (
                            <div key={key} className = "row">
                                <div className="col-xs-10">
                                    <TextField
                                        autoFocus = {(this.state.links.length - 1) === key}
                                        fullWidth
                                        floatingLabelText={intl.formatMessage(formMessages.title)}
                                        value = {link.title}
                                        floatingLabelStyle={floatLabelStyle}
                                        onChange = {this._handleLinkChange.bind(this, 'title', link._id)}
                                    />
                                    <TextField
                                        fullWidth
                                        floatingLabelText={intl.formatMessage(formMessages.url)}
                                        value = {link.url}
                                        floatingLabelStyle={floatLabelStyle}
                                        onChange = {this._handleLinkChange.bind(this, 'url', link._id)}
                                    />
                                </div>
                                {this.state.links.length > 1 &&
                                    <div className = "col-xs-2 center-xs">
                                        <IconButton
                                            title = {intl.formatMessage(profileMessages.removeLinkButtonTitle)}
                                            style = {{marginTop: '24px'}}
                                            onClick = {this._handleRemoveLink.bind(this, link._id)}
                                        >
                                            <SvgIcon >
                                                <CancelIcon />
                                            </SvgIcon>
                                        </IconButton>
                                    </div>
                                }
                                {this.state.links.length > 1 &&
                                    <Divider style={{marginTop: '16px'}} className = "col-xs-12"/>
                                }
                            </div>
                        );
                      })}
                    </div>
                    <div className="row" >
                      <div className="col-xs-6" >
                        <Checkbox
                          label={intl.formatMessage(profileMessages.keepAccUnlockedLabel)}
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
                        <FormattedMessage
                            {...profileMessages.terms}
                            values = {{
                                termsLink: (
                                    <a href="/terms" onClick={
                                            (ev) => this._handleModalShow(ev, 'termsOfService')
                                    }>
                                        {intl.formatMessage(generalMessages.termsOfService)}
                                    </a>
                                ),
                                privacyLink: (
                                    <a href="/privacy" onClick = {
                                            (ev) => this._handleModalShow(ev, 'privacyPolicy')
                                    }>
                                        {intl.formatMessage(generalMessages.privacyPolicy)}
                                    </a>
                                )
                            }}
                        />
                      </small>
                    </div>
                  </div>
                </div>
                <div className="row end-xs" >
                  <div className="col-xs"
                       style={ this.state.opt_details ? { margin: '25px 0 30px' } : {} }
                  >
                    <RaisedButton label={intl.formatMessage(generalMessages.cancel)} type="reset" onClick = {this._handleCancel}/>
                    <RaisedButton label={intl.formatMessage(generalMessages.submit)}
                                  type="submit"
                                  onClick = {this._submitForm}
                                  disabled = {this.state.submitting}
                                  primary
                                  disabled={false}
                                  style={{ marginLeft: '12px' }}
                    />
                  </div>
                </div>
            </form>
          </div>
        );
    }
    _submitForm = (ev) => {
        ev.preventDefault()
        this.handleSubmit();
    }
    _handleCancel = (ev) => {
        ev.preventDefault();
        this.profileForm.reset();
        this.context.router.goBack();
    }
    _handleAddLink = () => {
        let currentLinks = this.state.links;
        const notEmpty = this._checkLinks();

        if(!!notEmpty) {
            currentLinks.push({
                title: '',
                url: '',
                type: '',
                _id: currentLinks.length
            });
            this.setState({
                links: currentLinks
            });
        }
    }
    _handleRemoveLink = (linkId, ev) => {
        let links = _.cloneDeep(this.state.links);
        if(this.state.links.length > 1) {
            _.remove(links, link => {
                return link._id == linkId;
            });
        }
        for (let i = 0; i < links.length; i++) {
            links[i]._id = i
        }
        this.setState({
            links: links
        });
    }
    _checkLinks = () => {
        return this.state.links.every(link => {
            for (let key in link) {
                return (key !== '_id' && key !== 'type' && link[key].length !== 0);
            }
        });
    }
    _handleLinkChange = (field, linkId, ev) => {
        const emailRegex = /(.+){1,}@(.+){1,}\.(.+){2,}/
        const links = _.cloneDeep(this.state.links);
        let fieldValue = ev.target.value;
        const index = _.findIndex(links, link => link._id == linkId)
        const link = links[index];
        link[field] = fieldValue;
        if(field === 'url') {
            if(field.indexOf('akasha://')) {
                link['type'] = 'internal'
            } else {
                link['type'] = 'other'
            }
        }
        links[index] = link;
        this.setState({
            links: links
        });
    }
    _handleAboutChange = (ev) => {
        this.setState({
            about: ev.target.value
        });
    }
    _handleModalShow = (ev, modalName) => {
        ev.preventDefault();
        console.log("show modal ", modalName);
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
  muiTheme: React.PropTypes.object,
  router: React.PropTypes.object
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

export default injectIntl(validationProvider(CreateProfile));

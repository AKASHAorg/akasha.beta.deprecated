import React, { Component } from 'react';
import PropTypes from 'prop-types';
import r from 'ramda';
import { SvgIcon, IconButton, RaisedButton,
    TextField, Checkbox, Divider } from 'material-ui';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';
import ErrorIcon from 'material-ui/svg-icons/alert/error';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Avatar, ImageUploader, PanelContainer, PanelHeader } from 'shared-components';
import { profileMessages, formMessages, generalMessages } from 'locale-data/messages';/* eslint import/no-unresolved: 0*/
import { inputFieldMethods } from '../utils/dataModule';
import validationProvider from '../utils/validationProvider';
import { UserValidation } from '../utils/validationSchema';

class CreateProfile extends Component {
    constructor (props) {
        super(props);
        this.getProps = inputFieldMethods.getProps.bind(this);
        this.state = {
            formValues: {
                firstName: '',
                akashaId: '',
                password: '',
                password2: ''
            },
            links: [],
        };
        this.validatorTypes = new UserValidation(props.intl).getSchema();
        this.serverValidatedFields = ['akashaId'];
    }
    // componentWillMount () {
    //     this.setState({ opt_details: false });
    // }
    // componentDidMount () {
    //     if (this.refs.firstName) {
    //         this.refs.firstName.focus();
    //     }
    // }
    // componentWillUpdate (nextProps) {
    //     const { tempProfile } = nextProps;
    //     if (tempProfile && tempProfile.get('akashaId') !== '') {
    //         this.context.router.push('/authenticate/new-profile-status');
    //     }
    // }
    // getValidatorData () {
    //     return this.state.formValues;
    // }
    // handleShowDetails = () => {
    //     this.setState({ opt_details: !this.state.opt_details });
    // };
    // handleSubmit = () => {
    //     if (this.hasErrors() || this._checkLinks()) {
    //         return;
    //     }
    //     const { tempProfileActions } = this.props;
    //     const profileData = this.state.formValues;
    //     const optionalData = {};
    //     const profileImage = this.imageUploader.getWrappedInstance().getImage();
    //     profileData.password = this.state.formValues.password;
    //     profileData.password2 = this.state.formValues.password2;
    //     // optional settings
    //     if (this.state.links.length > 0) {
    //         optionalData.links = this.state.links.map((link) => {
    //             delete link.error;
    //             return link;
    //         });
    //     }
    //     if (profileImage) {
    //         optionalData.backgroundImage = profileImage;
    //     }
    //     if (this.state.about) {
    //         optionalData.about = this.state.about;
    //     }

    //     this.avatar.getImage().then((uintArr) => {
    //         if (uintArr) {
    //             optionalData.avatar = uintArr;
    //         }
    //         return { ...profileData, ...optionalData };
    //     }).then((data) => {
    //         let mustCorrectErrors = false;
    //         Object.keys(this.state.formValues).forEach((key) => {
    //             if (this.state.formValues[key] === '') {
    //                 this.refs[key].focus();
    //                 mustCorrectErrors = true;
    //             }
    //         });
    //         if (mustCorrectErrors) {
    //             console.log('must correct some errors!', this.state);
    //         } else {
    //             delete data.password2;
    //             tempProfileActions.createTempProfile(data);
    //         }
    //     });
    // };
    // _submitForm = (ev) => {
    //     ev.preventDefault();
    //     this.handleSubmit();
    // };
    // _handleCancel = (ev) => {
    //     ev.preventDefault();
    //     this.profileForm.reset();
    //     this.context.router.goBack();
    // };
    // _handleAddLink = () => {
    //     const currentLinks = this.state.links.slice();
    //     const isEmpty = this._checkLinks();

    //     if (!isEmpty) {
    //         currentLinks.push({
    //             title: '',
    //             url: '',
    //             type: '',
    //             id: currentLinks.length,
    //             error: {}
    //         });
    //         this.setState({
    //             links: currentLinks
    //         });
    //     }
    // };
    // _handleRemoveLink = (linkId) => {
    //     let links = this.state.links;
    //     if (this.state.links.length > 0) {
    //         links = r.reject(link => link.id === linkId, links);
    //     }
    //     for (let i = 0; i < links.length; i += 1) {
    //         links[i].id = i;
    //     }
    //     this.setState({
    //         links
    //     });
    // };
    // _checkLinks = () => {
    //     let isEmpty = false;
    //     this.state.links.forEach((link) => {
    //         Object.keys(link).forEach((key) => {
    //             if (key !== 'id' && key !== 'type' && link[key].length === 0) {
    //                 isEmpty = true;
    //                 const links = r.clone(this.state.links);
    //                 const index = r.findIndex(r.propEq('id', link.id))(links);
    //                 link.error[key] = true;
    //                 links[index] = link;
    //                 this.setState({
    //                     links
    //                 });
    //             }
    //         });
    //     });
    //     return isEmpty;
    // }

    // _handleLinkChange = (field, linkId, ev) => {
    //     const links = r.clone(this.state.links);
    //     const fieldValue = ev.target.value;
    //     const index = r.findIndex(r.propEq('id', linkId))(links);
    //     const link = links[index];
    //     link[field] = fieldValue;
    //     link.error[field] = fieldValue.length === 0;
    //     if (field === 'url') {
    //         if (fieldValue.indexOf('akasha://') === 0) {
    //             link.type = 'internal';
    //         } else {
    //             link.type = 'other';
    //         }
    //     }
    //     links[index] = link;
    //     this.setState({ links });
    // };
    // _handleAboutChange = (ev) => {
    //     this.setState({
    //         about: ev.target.value
    //     });
    // };
    // showTerms = (ev) => {
    //     const { appActions } = this.props;
    //     ev.preventDefault();
    //     appActions.showTerms();
    // };
    // hasErrors = () => {
    //     const { errors } = this.props;
    //     let hasErrors = false;
    //     if (this.state.links.find(link => link.error && (link.error.title || link.error.url))) {
    //         return true;
    //     }
    //     Object.keys(errors).forEach((key) => {
    //         if (errors[key] && errors[key].length) {
    //             hasErrors = true;
    //         }
    //     });
    //     return hasErrors;
    // }
    // renderWarningMessage () {
    //     const { intl, gethStatus, ipfsStatus } = this.props;
    //     const { palette } = this.context.muiTheme;
    //     if (!gethStatus.get('api') || (!ipfsStatus.get('started') && !ipfsStatus.get('spawned'))) {
    //         return (<div
    //           style={{ height: '36px', lineHeight: '36px', display: 'flex', alignItems: 'center' }}
    //         >
    //           <ErrorIcon style={{ color: palette.accent1Color }} />
    //           <span style={{ marginLeft: '5px', color: palette.accent1Color }}>
    //             {intl.formatMessage(generalMessages.serviceStoppedWarning)}
    //           </span>
    //         </div>);
    //     }
    //     return null;
    // }
    render () {
        const { intl, gethStatus, ipfsStatus } = this.props;
        const { palette } = this.context.muiTheme;
        // const isServiceStopped = !gethStatus.get('api')
        //     || (!ipfsStatus.get('started') && !ipfsStatus.get('spawned'));
        const floatLabelStyle = { color: palette.disabledColor };
        const firstNameProps = this.getProps({
            floatingLabelText: intl.formatMessage(formMessages.firstName),
            ref: 'firstName',
            floatingLabelStyle: floatLabelStyle,
            style: { verticalAlign: 'middle', width: '47%' },
            statePath: 'formValues.firstName',
            required: true,
            addValueLink: true,
            onChange: this.props.clearValidations,
            onBlur: this.props.handleValidation('formValues.firstName')
        });

        const lastNameProps = this.getProps({
            floatingLabelStyle: floatLabelStyle,
            floatingLabelText: intl.formatMessage(formMessages.lastName),
            ref: 'lastName',
            style: { marginLeft: '20px', verticalAlign: 'middle', width: '47%' },
            statePath: 'formValues.lastName',
            required: false,
            addValueLink: true,
            onChange: this.props.clearValidations,
            onBlur: this.props.handleValidation('formValues.lastName')
        });

        const akashaIdProps = this.getProps({
            fullWidth: true,
            style: { verticalAlign: 'middle' },
            floatingLabelText: intl.formatMessage(formMessages.akashaId),
            ref: 'akashaId',
            floatingLabelStyle: floatLabelStyle,
            required: true,
            addValueLink: true,
            statePath: 'formValues.akashaId',
            onBlur: this.props.handleValidation('formValues.akashaId')
        });

        const passwordProps = this.getProps({
            type: 'password',
            fullWidth: true,
            style: { verticalAlign: 'middle' },
            floatingLabelText: intl.formatMessage(formMessages.passphrase),
            ref: 'password',
            floatingLabelStyle: floatLabelStyle,
            required: true,
            addValueLink: true,
            statePath: 'formValues.password',
            onBlur: this.props.handleValidation('formValues.password')
        });

        const password2Props = this.getProps({
            type: 'password',
            fullWidth: true,
            style: { verticalAlign: 'middle' },
            floatingLabelText: intl.formatMessage(formMessages.passphraseVerify),
            ref: 'password2',
            floatingLabelStyle: floatLabelStyle,
            required: true,
            addValueLink: true,
            statePath: 'formValues.password2',
            onBlur: this.props.handleValidation('formValues.password2')
        });

        return (
          <PanelContainer
            showBorder
            actions={[
              /* eslint-disable */
              <RaisedButton
                key="cancel"
                label={intl.formatMessage(generalMessages.cancel)}
                type="reset"
                onClick={this._handleCancel}
              />,
              <RaisedButton
                key="submit"
                label={intl.formatMessage(generalMessages.submit)}
                type="submit"
                onClick={this._submitForm}
                style={{ marginLeft: 8 }}
                // disabled={this.state.submitting || isServiceStopped || this.hasErrors()}
                primary
              />
              /* eslint-enable */
            ]}
            // leftActions={this.renderWarningMessage()}
            header={
              <PanelHeader title={intl.formatMessage(profileMessages.createProfileTitle)} />
            }
          >
            <form
              action=""
              onSubmit={this.handleSubmit}
              className="row"
              ref={(profileForm) => { this.profileForm = profileForm; }}
            >
              <TextField {...firstNameProps} />
              <TextField {...lastNameProps} />
              <TextField {...akashaIdProps} />
              <TextField {...passwordProps} />
              <TextField {...password2Props} />
              <Checkbox
                label={intl.formatMessage(profileMessages.optionalDetailsLabel)}
                style={{ marginTop: '18px', marginLeft: '-4px' }}
                checked={this.state.opt_details}
                onCheck={this.handleShowDetails}
              />
              <div style={{ display: this.state.opt_details ? 'block' : 'none', width: '100%' }} >
                <h3 style={{ margin: '30px 0 10px 0' }} >
                  {intl.formatMessage(profileMessages.avatarTitle)}
                </h3>
                <div>
                  <Avatar
                    editable
                    ref={(avatar) => { this.avatar = avatar; }}
                  />
                </div>
                <h3 style={{ margin: '20px 0 10px 0' }} >
                  {intl.formatMessage(profileMessages.backgroundImageTitle)}
                </h3>
                <ImageUploader
                  ref={(imageUploader) => { this.imageUploader = imageUploader; }}
                  minWidth={320}
                />
                <h3 style={{ margin: '20px 0 0 0' }} >
                  {intl.formatMessage(profileMessages.aboutYouTitle)}
                </h3>
                <TextField
                  fullWidth
                  floatingLabelText={
                    intl.formatMessage(profileMessages.shortDescriptionLabel)
                  }
                  multiLine
                  value={this.state.about}
                  floatingLabelStyle={floatLabelStyle}
                  onChange={this._handleAboutChange}
                />
                <div className="row" style={{ margin: '20px 0 0 0' }}>
                  <h3 className="col-xs-10" style={{ marginTop: 10 }}>
                    {intl.formatMessage(profileMessages.linksTitle)}
                  </h3>
                  <div className="col-xs-2 end-xs">
                    <IconButton
                      title={intl.formatMessage(profileMessages.addLinkButtonTitle)}
                      onClick={this._handleAddLink}
                    >
                      <SvgIcon >
                        <ContentAddIcon
                          color={this.context.muiTheme.palette.primary1Color}
                        />
                      </SvgIcon>
                    </IconButton>
                  </div>
                </div>
                {this.state.links.map((link, key) =>
                  <div key={link.id} className="row">
                    <div className="col-xs-10">
                      <TextField
                        autoFocus={(this.state.links.length - 1) === key}
                        fullWidth
                        floatingLabelText={intl.formatMessage(formMessages.title)}
                        value={link.title}
                        floatingLabelStyle={floatLabelStyle}
                        onChange={ev => this._handleLinkChange('title', link.id, ev)}
                        errorText={link.error && link.error.title && 'Title cannot be empty'}
                        errorStyle={{ position: 'absolute', bottom: '-10px' }}
                      />
                      <TextField
                        fullWidth
                        floatingLabelText={intl.formatMessage(formMessages.url)}
                        value={link.url}
                        floatingLabelStyle={floatLabelStyle}
                        onChange={ev => this._handleLinkChange('url', link.id, ev)}
                        errorText={link.error && link.error.url && 'URL cannot be empty'}
                        errorStyle={{ position: 'absolute', bottom: '-10px' }}
                      />
                    </div>
                    {this.state.links.length > 0 &&
                      <div className="col-xs-2 center-xs">
                        <IconButton
                          title={intl.formatMessage(profileMessages.removeLinkButtonTitle)}
                          style={{ marginTop: '24px' }}
                          onClick={ev => this._handleRemoveLink(link.id, ev)}
                        >
                          <SvgIcon >
                            <CancelIcon />
                          </SvgIcon>
                        </IconButton>
                      </div>
                    }
                    {this.state.links.length > 1 &&
                      <Divider
                        style={{ marginTop: '16px' }}
                        className="col-xs-12"
                      />
                    }
                  </div>
                )}
              </div>
              <small style={{ paddingBottom: '15px', marginTop: '15px' }}>
                <FormattedMessage
                  {...profileMessages.terms}
                  values={{
                      termsLink: (
                        <a
                          href="#"
                          onClick={ev => this.showTerms(ev)}
                          style={{ color: palette.primary1Color }}
                        >
                          {intl.formatMessage(generalMessages.termsOfService)}
                        </a>
                      )
                  }}
                />
              </small>
            </form>
          </PanelContainer>
        );
    }
}

CreateProfile.propTypes = {
    appActions: PropTypes.shape(),
    errors: PropTypes.shape(),
    tempProfileActions: PropTypes.shape(),
    clearValidations: PropTypes.func,
    handleValidation: PropTypes.func,
    intl: PropTypes.shape(),
    gethStatus: PropTypes.shape().isRequired,
    ipfsStatus: PropTypes.shape().isRequired
};

CreateProfile.contextTypes = {
    muiTheme: PropTypes.shape(),
    router: PropTypes.shape()
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

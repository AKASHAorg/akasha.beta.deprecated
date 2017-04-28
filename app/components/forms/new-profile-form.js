import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SvgIcon, IconButton, RaisedButton,
    TextField, Checkbox, Divider } from 'material-ui';
import muiThemeable from 'material-ui/styles/muiThemeable';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';
import { injectIntl, FormattedMessage } from 'react-intl';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';
import { Avatar, ImageUploader } from '../';
import PanelContainerFooter from '../PanelContainer/panel-container-footer';
import { profileMessages, formMessages,
  generalMessages, validationMessages } from '../../locale-data/messages';
import { getProfileSchema } from '../../utils/validationSchema';
import styles from './new-profile-form.scss';

class NewProfileForm extends Component {
    constructor (props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            akashaId: '',
            password: '',
            password2: '',
            about: '',
            links: [],
            crypto: [],
            optDetails: false,
            akashaIdIsValid: true,
            akashaIdExists: false
        };
        this.validatorTypes = getProfileSchema(props.intl);
        this.showErrorOnFields = [];
        this.isSubmitting = false;
    }

    getValidatorData = () => this.state;

    _showTerms = (ev) => {
        ev.preventDefault();
        const { onTermsShow } = this.props;
        if (onTermsShow) return onTermsShow();
    }
    _handleShowDetails = () => {
        this.setState({
            optDetails: !this.state.optDetails
        });
    }
    _handleAddLink = linkType =>
        () =>
            this.setState((prevState) => {
                const links = prevState[linkType];
                const lastLink = links[links.length - 1];
                let newLink = {};
                if (lastLink) {
                    if (linkType === 'links' && (lastLink.title.length === 0 || lastLink.url.length === 0)) {
                        return null;
                    }
                    if (linkType === 'crypto' && (lastLink.name.length === 0 || lastLink.address.length === 0)) {
                        return null;
                    }
                }
                if (linkType === 'links') {
                    newLink = {
                        title: '',
                        url: '',
                        type: '',
                        id: links.length > 0 ? (links.slice(-1).pop().id + 1) : 1
                    };
                }
                if (linkType === 'crypto') {
                    newLink = {
                        name: '',
                        address: '',
                        id: links.length > 0 ? (links.slice(-1).pop().id + 1) : 1
                    };
                }
                return {
                    [linkType]: [...links, newLink]
                };
            });
    _handleLinkChange = (linkType, field, linkId) => {
        const links = this.state[linkType].slice();
        const index = links.findIndex(link => link.id === linkId);
        return (ev) => {
            links[index][field] = ev.target.value;
            this.setState({
                [linkType]: links
            });
        };
    }
    _handleRemoveLink = (linkId, linkType) =>
        () => {
            this.setState(prevState => ({
                [linkType]: prevState[linkType].filter(link => link.id !== linkId)
            }));
        }
    _handleFieldChange = field =>
        (ev) => {
            this.setState({
                [field]: ev.target.value
            });
        }
    _handleResponse = (resp) => {
        const { idValid, exists, } = resp.data;
        if (resp.error) {
            this.setState({
                error: `Unknown error ${resp.error}`
            });
            return;
        }
        this.setState({
            akashaIdIsValid: idValid,
            akashaIdExists: exists
        });
    }
    _validateAkashaId = (akashaId) => {
        const serverChannel = window.Channel.server.registry.profileExists;
        const clientChannel = window.Channel.client.registry.profileExists;
        if (!this.idVerifyChannelEnabled) {
            serverChannel.enable();
            this.idVerifyChannelEnabled = true;
        }
        // one listener is auto attached on application start
        // we need to attach another one with the provided handler
        if (clientChannel.listenerCount <= 1) {
            clientChannel.on((ev, data) => this._handleResponse(data));
        }
        serverChannel.send({ akashaId });
    }
    _onValidate = field => (err) => {
        if (err) {
            this.setState({
                formHasErrors: true
            });
        } else {
            this.setState({
                formHasErrors: false
            });
        }
        // validation passed
        if (field === 'akashaId') {
            this._validateAkashaId(this.state.akashaId);
        }
    }

    _validateField = (field, index, sub) =>
        () => {
            if (!this.showErrorOnFields.includes(field)) {
                this.showErrorOnFields.push(field);
            }
            if (field === 'links' || field === 'crypto') {
                return this.props.validate(this._onValidate(field[index][sub]));
            }
            return this.props.validate(this._onValidate(field));
        };
    _getErrorMessages = (field, index, sub) => {
        const { getValidationMessages } = this.props;
        if (this.showErrorOnFields.includes(field) && !this.isSubmitting) {
            if (field === 'links' || field === 'crypto') {
                const errors = getValidationMessages(field)[index];
                if (errors && errors[sub]) {
                    return errors[sub][0];
                }
                return null;
            }
            return getValidationMessages(field)[0];
        }
        return null;
    }
    // server validated akashaId errors must have higher priority
    _getAkashaIdErrors = () => {
        const { intl } = this.props;
        const { akashaIdIsValid, akashaIdExists } = this.state;
        if (!akashaIdIsValid) {
            return intl.formatMessage(validationMessages.akashaIdNotValid);
        }
        if (akashaIdExists) {
            return intl.formatMessage(validationMessages.akashaIdExists);
        }
        if (this._getErrorMessages('akashaId')) {
            return this._getErrorMessages('akashaId');
        }
        return null;
    }
    _handleCancel = () => {
        const { onCancel } = this.props;
        if (typeof onCancel === 'function') {
            onCancel();
        }
    }
    _submitData = (additionalData) => {
        const { onSubmit } = this.props;
        const {
          firstName,
          lastName,
          akashaId,
          password,
          about,
          links,
          crypto } = this.state;
        onSubmit({
            firstName,
            lastName,
            akashaId,
            password: new TextEncoder('utf-8').encode(password),
            about,
            links,
            crypto,
            ...additionalData
        });
    }
    _handleSubmit = (ev) => {
        ev.preventDefault();
        const { expandOptionalDetails } = this.props;
        const { optDetails } = this.state;

        this.props.validate((err) => {
            if (err) {
                this.showErrorOnFields = this.showErrorOnFields.concat(Object.keys(err));
                this.forceUpdate();
                return;
            }
            this.isSubmitting = true;
            if (this.state.akashaIdIsValid && !this.state.akashaIdExists) {
                if (optDetails || expandOptionalDetails) {
                    const backgroundImage = this.imageUploader.getImage();
                    this.avatar.getImage().then((uint8arr) => {
                        let avatar;
                        if (uint8arr) {
                            avatar = uint8arr;
                        }
                        this._submitData({
                            avatar,
                            backgroundImage,
                        });
                    });
                } else {
                    this._submitData();
                }
            }
        });
    }
    render () {
        const { intl, muiTheme, expandOptionalDetails, style, isUpdate } = this.props;
        const { firstName, lastName, akashaId, password, password2,
          optDetails, about, links, crypto, formHasErrors } = this.state;
        const { formatMessage } = intl;
        return (
          <div
            className={`${styles.root} col-xs-12`}
            style={style}
          >
            <form
              action=""
              onSubmit={this._handleSubmit}
              className={`row ${styles.form}`}
              ref={(profileForm) => { this.profileForm = profileForm; }}
            >
              <div className="col-xs-6 start-xs">
                <TextField
                  fullWidth
                  floatingLabelText={formatMessage(formMessages.firstName)}
                  value={firstName}
                  onChange={this._handleFieldChange('firstName')}
                  onBlur={this._validateField('firstName')}
                  errorText={this._getErrorMessages('firstName')}
                />
              </div>
              <div className="col-xs-6 end-xs">
                <TextField
                  className="start-xs"
                  fullWidth
                  floatingLabelText={formatMessage(formMessages.lastName)}
                  value={lastName}
                  onChange={this._handleFieldChange('lastName')}
                  onBlur={this._validateField('lastName')}
                  errorText={this._getErrorMessages('lastName')}
                />
              </div>
              {!isUpdate &&
                <div className="col-xs-12">
                  <TextField
                    fullWidth
                    floatingLabelText={formatMessage(formMessages.akashaId)}
                    value={akashaId}
                    onChange={this._handleFieldChange('akashaId')}
                    onBlur={this._validateField('akashaId')}
                    errorText={this._getAkashaIdErrors()}
                  />
                </div>
              }
              <div className="col-xs-12">
                <TextField
                  fullWidth
                  type="password"
                  floatingLabelText={formatMessage(formMessages.passphrase)}
                  value={password}
                  onChange={this._handleFieldChange('password')}
                  onBlur={this._validateField('password')}
                  errorText={this._getErrorMessages('password')}
                />
              </div>
              <div className="col-xs-12">
                <TextField
                  fullWidth
                  type="password"
                  floatingLabelText={formatMessage(formMessages.passphraseVerify)}
                  value={password2}
                  onChange={this._handleFieldChange('password2')}
                  onBlur={this._validateField('password2')}
                  errorText={this._getErrorMessages('password2')}
                />
              </div>
              {!expandOptionalDetails &&
                <Checkbox
                  label={intl.formatMessage(profileMessages.optionalDetailsLabel)}
                  style={{ marginTop: 18 }}
                  checked={optDetails}
                  onCheck={this._handleShowDetails}
                />
              }
              {(optDetails || expandOptionalDetails) &&
                <div className="row middle-xs" style={{ padding: '0 4px' }}>
                  <h3 className="col-xs-12" style={{ margin: '30px 0 10px 0' }} >
                    {intl.formatMessage(profileMessages.avatarTitle)}
                  </h3>
                  <div className="col-xs-12 center-xs">
                    <Avatar
                      editable
                      ref={(avatar) => { this.avatar = avatar; }}
                    />
                  </div>
                  <h3 className="col-xs-12" style={{ margin: '20px 0 10px 0' }} >
                    {intl.formatMessage(profileMessages.backgroundImageTitle)}
                  </h3>
                  <div className="col-xs-12">
                    <ImageUploader
                      ref={(imageUploader) => { this.imageUploader = imageUploader; }}
                      minWidth={360}
                      intl={intl}
                      muiTheme={muiTheme}
                    />
                  </div>
                  <h3 className="col-xs-12" style={{ margin: '20px 0 0 0' }} >
                    {intl.formatMessage(profileMessages.aboutYouTitle)}
                  </h3>
                  <div className="col-xs-12">
                    <TextField
                      fullWidth
                      floatingLabelText={
                        intl.formatMessage(profileMessages.shortDescriptionLabel)
                      }
                      multiLine
                      value={about}
                      onChange={this._handleFieldChange('about')}
                      onBlur={this._validateField('about')}
                      errorText={this._getErrorMessages('about')}
                    />
                  </div>
                  <h3 className="col-xs-10" style={{ margin: '20px 0 0 0' }}>
                    {intl.formatMessage(profileMessages.linksTitle)}
                  </h3>
                  <div className="col-xs-2 end-xs" style={{ margin: '16px 0 0 0' }}>
                    <IconButton
                      title={intl.formatMessage(profileMessages.addLinkButtonTitle)}
                      onClick={this._handleAddLink('links')}
                    >
                      <SvgIcon>
                        <ContentAddIcon
                          color={muiTheme.palette.primary1Color}
                        />
                      </SvgIcon>
                    </IconButton>
                  </div>
                  <div className="col-xs-12">
                    {links.map((link, index) =>
                      <div key={link.id} className="row">
                        <div className="col-xs-10">
                          <TextField
                            autoFocus={(links.length - 1) === index}
                            fullWidth
                            floatingLabelText={intl.formatMessage(formMessages.title)}
                            value={link.title}
                            onChange={this._handleLinkChange('links', 'title', link.id)}
                            onBlur={this._validateField('links', index, 'title')}
                            errorText={this._getErrorMessages('links', index, 'title')}
                          />
                          <TextField
                            fullWidth
                            floatingLabelText={intl.formatMessage(formMessages.url)}
                            hintText="https://twitter.com or email@example.com"
                            value={link.url}
                            onChange={this._handleLinkChange('links', 'url', link.id)}
                            onBlur={this._validateField('links', index, 'url')}
                            errorText={this._getErrorMessages('links', index, 'url')}
                          />
                        </div>
                        <div className="col-xs-2 center-xs">
                          <IconButton
                            title={intl.formatMessage(profileMessages.removeLinkButtonTitle)}
                            style={{ marginTop: '24px' }}
                            onClick={this._handleRemoveLink(link.id, 'links')}
                          >
                            <SvgIcon>
                              <CancelIcon color={muiTheme.palette.textColor} />
                            </SvgIcon>
                          </IconButton>
                        </div>
                        {links.length > 1 &&
                          <Divider
                            style={{ marginTop: '16px' }}
                            className="col-xs-12"
                          />
                        }
                      </div>
                    )}
                  </div>
                  <h3 className="col-xs-10" style={{ margin: '20px 0 0 0' }}>
                    {intl.formatMessage(profileMessages.cryptoAddresses)}
                  </h3>
                  <div className="col-xs-2 end-xs" style={{ margin: '16px 0 0 0' }}>
                    <IconButton
                      title={intl.formatMessage(profileMessages.addCryptoAddress)}
                      onClick={this._handleAddLink('crypto')}
                    >
                      <SvgIcon>
                        <ContentAddIcon
                          color={muiTheme.palette.primary1Color}
                        />
                      </SvgIcon>
                    </IconButton>
                  </div>
                  <div className="col-xs-12">
                    {crypto.map((cryptoLink, index) =>
                      <div key={cryptoLink.id} className="row">
                        <div className="col-xs-10">
                          <TextField
                            autoFocus={(crypto.length - 1) === index}
                            fullWidth
                            floatingLabelText={intl.formatMessage(profileMessages.cryptoName)}
                            value={cryptoLink.name}
                            onChange={this._handleLinkChange('crypto', 'name', cryptoLink.id)}
                            onBlur={this._validateField('crypto', index, 'name')}
                            errorText={this._getErrorMessages('crypto', index, 'name')}
                          />
                          <TextField
                            fullWidth
                            floatingLabelText={intl.formatMessage(profileMessages.cryptoAddress)}
                            value={cryptoLink.address}
                            onChange={this._handleLinkChange('crypto', 'address', cryptoLink.id)}
                            onBlur={this._validateField('crypto', index, 'address')}
                            errorText={this._getErrorMessages('crypto', index, 'address')}
                          />
                        </div>
                        <div className="col-xs-2 center-xs">
                          <IconButton
                            title={intl.formatMessage(profileMessages.removeCryptoButtonTitle)}
                            style={{ marginTop: '24px' }}
                            onClick={this._handleRemoveLink(cryptoLink.id, 'crypto')}
                          >
                            <SvgIcon>
                              <CancelIcon color={muiTheme.palette.textColor} />
                            </SvgIcon>
                          </IconButton>
                        </div>
                        {crypto.length > 1 &&
                          <Divider
                            style={{ marginTop: '16px' }}
                            className="col-xs-12"
                          />
                        }
                      </div>
                    )}
                  </div>
                </div>
              }
              <small style={{ paddingBottom: '15px', marginTop: '15px' }}>
                <FormattedMessage
                  {...profileMessages.terms}
                  values={{
                      termsLink: (
                        <a
                          href="#"
                          onClick={ev => this._showTerms(ev)}
                          style={{ color: muiTheme.palette.primary1Color }}
                        >
                          {intl.formatMessage(generalMessages.termsOfService)}
                        </a>
                      )
                  }}
                />
              </small>
              <input type="submit" className="hidden" />
            </form>
            <PanelContainerFooter>
              <RaisedButton
                key="cancel"
                label={intl.formatMessage(generalMessages.cancel)}
                type="reset"
                onClick={this._handleCancel}
              />
              <RaisedButton
                key="submit"
                label={intl.formatMessage(generalMessages.submit)}
                type="submit"
                disabled={formHasErrors}
                onClick={formHasErrors ? () => {} : this._handleSubmit}
                style={{ marginLeft: 8 }}
                primary
              />
            </PanelContainerFooter>
          </div>
        );
    }
}

NewProfileForm.propTypes = {
    intl: PropTypes.shape(),
    muiTheme: PropTypes.shape(),
    expandOptionalDetails: PropTypes.bool,
    isUpdate: PropTypes.bool,
    validate: PropTypes.func,
    getValidationMessages: PropTypes.func,
    onSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    style: PropTypes.shape(),
    onTermsShow: PropTypes.func,
};

const validationHOC = validation(strategy());

export default injectIntl(
    muiThemeable()(
      validationHOC(NewProfileForm)
));

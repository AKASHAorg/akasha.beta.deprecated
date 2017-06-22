import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { SvgIcon, IconButton, RaisedButton,
    TextField, Checkbox, Divider } from 'material-ui';
import muiThemeable from 'material-ui/styles/muiThemeable';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';
import { injectIntl, FormattedMessage } from 'react-intl';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';
import { Avatar, ImageUploader, PanelContainerFooter } from '../';
import { profileMessages, formMessages,
  generalMessages, validationMessages } from '../../locale-data/messages';
import { getProfileSchema } from '../../utils/validationSchema';
import styles from './new-profile-form.scss';

class NewProfileForm extends Component {
    constructor (props) {
        super(props);
        this.state = {
            optDetails: false,
            akashaIdIsValid: true,
            akashaIdExists: false
        };
        this.validatorTypes = getProfileSchema(props.intl, { isUpdate: props.isUpdate });
        this.showErrorOnFields = [];
        this.isSubmitting = false;
    }

    getValidatorData = () => this.props.tempProfile.toJS();
    componentWillReceiveProps (nextProps) {
        const { isUpdate, tempProfile } = nextProps;
        // we need to update temp profile only if something has changed
        // so we need to keep a ref to old temp profile.
        if (isUpdate && tempProfile.akashaId !== this.props.tempProfile.akashaId) {
            this.refTempProfile = tempProfile;
        }
    }

    _showTerms = (ev) => {
        ev.preventDefault();
        const { onTermsShow } = this.props;
        if (onTermsShow) return onTermsShow();
        return null;
    }

    _handleShowDetails = () => {
        this.setState({
            optDetails: !this.state.optDetails
        });
    }

    _handleAddLink = linkType => () => {
        const { tempProfile } = this.props;
        const links = tempProfile.get(linkType);
        let updatedTempProfile;
        const lastLink = links.last();
        if (lastLink) {
            if (linkType === 'links' && (lastLink.get('title').length === 0 || lastLink.get('url').length === 0)) {
                return null;
            }
            if (linkType === 'crypto' && (lastLink.get('name').length === 0 || lastLink.get('address').length === 0)) {
                return null;
            }
        }
        if (linkType === 'links') {
            updatedTempProfile = tempProfile.setIn([linkType],
              links.push(new Map({
                  title: '',
                  url: '',
                  type: '',
                  id: links.size > 0 ? (links.last().get('id') + 1) : 1
              })));
        }
        if (linkType === 'crypto') {
            updatedTempProfile = tempProfile.setIn([linkType],
                links.push(new Map({
                    name: '',
                    address: '',
                    id: links.size > 0 ? (links.last().get('id') + 1) : 1
                })));
        }
        return this.props.onProfileUpdate(updatedTempProfile);
    };

    _handleLinkChange = (linkType, field, linkId) => {
        const { tempProfile } = this.props;
        const links = tempProfile.get(linkType);
        const index = links.findIndex(link => link.get('id') === linkId);
        return (ev) => {
            const updatedLinks = links.setIn([index, field], ev.target.value);
            const updatedTempProfile = tempProfile.setIn([linkType], updatedLinks);
            this.props.onProfileUpdate(updatedTempProfile);
        };
    }

    _handleRemoveLink = (linkId, linkType) => {
        const { tempProfile, onProfileUpdate } = this.props;
        const links = tempProfile.get(linkType);
        return () => {
            onProfileUpdate(
              tempProfile.setIn([linkType],
                links.filter(link => link.get('id') !== linkId)
              )
            );
        };
    }

    _handleFieldChange = (field) => {
        const { tempProfile, onProfileUpdate } = this.props;
        return (ev) => {
            onProfileUpdate(tempProfile.setIn([field], ev.target.value));
        };
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
            this._validateAkashaId(this.props.tempProfile.get('akashaId'));
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

    _handleAvatarClear = () => {
        const { isUpdate, tempProfile, onProfileUpdate } = this.props;
        if (isUpdate) {
            onProfileUpdate(
              tempProfile.set('avatar', null)
            );
        }
    }
    _handleBackgroundClear = () => {
        const { isUpdate, tempProfile, onProfileUpdate } = this.props;
        if (isUpdate) {
            onProfileUpdate(
              tempProfile.set('backgroundImage', {})
            );
        }
    }

    _handleBackgroundChange = (bgImageObj) => {
        const { isUpdate, tempProfile, onProfileUpdate } = this.props;
        if (isUpdate) {
            onProfileUpdate(
                tempProfile.set('backgroundImage', bgImageObj)
            );
        }
    }

    _handleSubmit = (ev) => {
        ev.preventDefault();
        const { expandOptionalDetails, isUpdate, tempProfile, onSubmit,
          onProfileUpdate } = this.props;
        const { optDetails } = this.state;

        this.props.validate((err) => {
            if (err) {
                this.showErrorOnFields = this.showErrorOnFields.concat(Object.keys(err));
                this.forceUpdate();
                console.error(err);
                return;
            }
            this.isSubmitting = true;
            if (this.state.akashaIdIsValid && !this.state.akashaIdExists) {
                if (optDetails || expandOptionalDetails) {
                    this.avatar.getImage().then((uint8arr) => {
                        let avatar = null;
                        if (uint8arr) {
                            avatar = uint8arr;
                        }
                        onProfileUpdate(
                          tempProfile.withMutations((profile) => {
                              profile.set('avatar', avatar);
                              if (!isUpdate) {
                                  profile.set('backgroundImage', this.imageUploader.getImage());
                              }
                          })
                        );
                        onSubmit();
                    });
                } else {
                    onProfileUpdate(tempProfile);
                    onSubmit();
                }
            }
        });
    }

    render () {
        const { intl, muiTheme, expandOptionalDetails, style, isUpdate, tempProfile } = this.props;
        const { firstName, lastName, akashaId, password, password2,
          about, links, crypto, formHasErrors, avatar, backgroundImage,
          baseUrl } = tempProfile;
        const { optDetails } = this.state;
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
                  <div className="row">
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
                  </div>
                </div>
              }
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
                      ref={(avtr) => { this.avatar = avtr; }}
                      image={avatar}
                      onImageClear={this._handleAvatarClear}
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
                      initialImage={backgroundImage}
                      baseUrl={baseUrl}
                      muiTheme={muiTheme}
                      onImageClear={this._handleBackgroundClear}
                      onChange={this._handleBackgroundChange}
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
                      (<div key={`${index + 1}`} className="row">
                        <div className="col-xs-10">
                          <TextField
                            autoFocus={(links.size - 1) === index}
                            fullWidth
                            floatingLabelText={intl.formatMessage(formMessages.title)}
                            value={link.get('title')}
                            onChange={this._handleLinkChange('links', 'title', link.get('id'))}
                            onBlur={this._validateField('links', index, 'title')}
                            errorText={this._getErrorMessages('links', index, 'title')}
                          />
                          <TextField
                            fullWidth
                            floatingLabelText={intl.formatMessage(formMessages.url)}
                            hintText="https://twitter.com"
                            value={link.get('url')}
                            onChange={this._handleLinkChange('links', 'url', link.get('id'))}
                            onBlur={this._validateField('links', index, 'url')}
                            errorText={this._getErrorMessages('links', index, 'url')}
                          />
                        </div>
                        <div className="col-xs-2 center-xs">
                          <IconButton
                            title={intl.formatMessage(profileMessages.removeLinkButtonTitle)}
                            style={{ marginTop: '24px' }}
                            onClick={this._handleRemoveLink(link.get('id'), 'links')}
                          >
                            <SvgIcon>
                              <CancelIcon color={muiTheme.palette.textColor} />
                            </SvgIcon>
                          </IconButton>
                        </div>
                        {links.size > 1 &&
                          <Divider
                            style={{ marginTop: '16px' }}
                            className="col-xs-12"
                          />
                        }
                      </div>)
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
                      (<div key={`${index + 1}`} className="row">
                        <div className="col-xs-10">
                          <TextField
                            autoFocus={(crypto.size - 1) === index}
                            fullWidth
                            floatingLabelText={intl.formatMessage(profileMessages.cryptoName)}
                            value={cryptoLink.get('name')}
                            onChange={this._handleLinkChange('crypto', 'name', cryptoLink.id)}
                            onBlur={this._validateField('crypto', index, 'name')}
                            errorText={this._getErrorMessages('crypto', index, 'name')}
                          />
                          <TextField
                            fullWidth
                            floatingLabelText={intl.formatMessage(profileMessages.cryptoAddress)}
                            value={cryptoLink.get('address')}
                            onChange={this._handleLinkChange('crypto', 'address', cryptoLink.get('id'))}
                            onBlur={this._validateField('crypto', index, 'address')}
                            errorText={this._getErrorMessages('crypto', index, 'address')}
                          />
                        </div>
                        <div className="col-xs-2 center-xs">
                          <IconButton
                            title={intl.formatMessage(profileMessages.removeCryptoButtonTitle)}
                            style={{ marginTop: '24px' }}
                            onClick={this._handleRemoveLink(cryptoLink.get('id'), 'crypto')}
                          >
                            <SvgIcon>
                              <CancelIcon color={muiTheme.palette.textColor} />
                            </SvgIcon>
                          </IconButton>
                        </div>
                        {crypto.size > 1 &&
                          <Divider
                            style={{ marginTop: '16px' }}
                            className="col-xs-12"
                          />
                        }
                      </div>)
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
                          href="/terms"
                          onClick={this._showTerms}
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
                onClick={formHasErrors ? () => {} : this._handleSubmit}
                style={{ marginLeft: 8 }}
                disabled={
                  isUpdate && this.refTempProfile && tempProfile.equals(this.refTempProfile)
                }
                primary
              />
            </PanelContainerFooter>
          </div>
        );
    }
}

NewProfileForm.propTypes = {
    expandOptionalDetails: PropTypes.bool,
    getValidationMessages: PropTypes.func,
    intl: PropTypes.shape(),
    isUpdate: PropTypes.bool,
    muiTheme: PropTypes.shape(),
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    onProfileUpdate: PropTypes.func.isRequired,
    onTermsShow: PropTypes.func,
    validate: PropTypes.func,
    style: PropTypes.shape(),
    tempProfile: PropTypes.shape()
};

const validationHOC = validation(strategy());

export default injectIntl(
    muiThemeable()(
      validationHOC(NewProfileForm)
));

import React, { Component, PropTypes } from 'react';
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
import { profileMessages, formMessages, generalMessages } from '../../locale-data/messages';
import { getProfileSchema } from '../../utils/validationSchema';

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
        // show terms panel
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
    _validateAkashaId = (akashaId) => {
        const serverChannel = window.Channel.server.registry.checkIdFormat;
        const clientChannel = window.Channel.client.registry.checkIdFormat;
        if (!this.idVerifyChannelEnabled) {
            serverChannel.enable();
            this.idVerifyChannelEnabled = true;
        }
        clientChannel.on((response) => {
            if (response.error) {
                return this.setState({
                    error: `Unknown error ${response.error}`
                });
            }
            return this.setState({
                akashaIdIsValid: response.idValid
            });
        });
        serverChannel.send({ akashaId });
    }
    _checkAkashaId = (akashaId) => {
        console.log('check if akashaId is available', akashaId);
    }
    _onValidate = field => (err) => {
        if (err) {
            console.log('form has errors!', err);
            return;
        }
        // validation passed
        if (field === 'akashaId') {
            console.log('check the existence on server of akashaId:', this.state.akashaId);
            this._validateAkashaId(this.state.akashaId);
            this._checkAkashaId(this.state.akashaId);
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
    _getAkashaIdErrors = () => {
        if (this._getErrorMessages('akashaId')) {
            return this._getErrorMessages('akashaId');
        }
        if (!this.state.akashaIdIsValid) {
            return 'Username contains invalid characters!';
        }
        if (this.state.akashaIdExists) {
            return 'Username already registered!';
        }
        return null;
    }
    _handleCancel = () => {
        this.props.history.push('/authenticate');
    }
    _handleSubmit = (ev) => {
        ev.preventDefault();
        const { tempProfileCreate } = this.props;
        const {
          firstName,
          lastName,
          akashaId,
          password,
          about,
          links,
          crypto } = this.state;
        this.isSubmitting = true;
        this.props.validate((err) => {
            if (err) return;
            if (this.state.akashaIdIsValid && !this.state.akashaIdExists) {
                const backgroundImage = this.imageUploader.getImage();
                this.avatar.getImage().then((uint8arr) => {
                    let avatar;
                    if (uint8arr) {
                        avatar = uint8arr;
                    }
                    tempProfileCreate({
                        firstName,
                        lastName,
                        akashaId,
                        password: new TextEncoder('utf-8').encode(password),
                        backgroundImage,
                        avatar,
                        about,
                        links,
                        crypto
                    });
                });
            }
        });
    }
    render () {
        const { intl, muiTheme, expandOptionalDetails } = this.props;
        const { formatMessage } = intl;

        return (
          <div className="col-xs-12" style={{ padding: '0 24px' }}>
            <form
              action=""
              onSubmit={this._handleSubmit}
              className="row"
              ref={(profileForm) => { this.profileForm = profileForm; }}
            >
              <div className="col-xs-6 start-xs">
                <TextField
                  fullWidth
                  floatingLabelText={formatMessage(formMessages.firstName)}
                  value={this.state.firstName}
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
                  value={this.state.lastName}
                  onChange={this._handleFieldChange('lastName')}
                  onBlur={this._validateField('lastName')}
                  errorText={this._getErrorMessages('lastName')}
                />
              </div>
              <div className="col-xs-12">
                <TextField
                  fullWidth
                  floatingLabelText={formatMessage(formMessages.akashaId)}
                  value={this.state.akashaId}
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
                  value={this.state.password}
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
                  value={this.state.password2}
                  onChange={this._handleFieldChange('password2')}
                  onBlur={this._validateField('password2')}
                  errorText={this._getErrorMessages('password2')}
                />
              </div>
              {!expandOptionalDetails &&
                <Checkbox
                  label={intl.formatMessage(profileMessages.optionalDetailsLabel)}
                  style={{ marginTop: 18 }}
                  checked={this.state.optDetails}
                  onCheck={this._handleShowDetails}
                />
              }
              {(this.state.optDetails || expandOptionalDetails) &&
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
                      value={this.state.about}
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
                    {this.state.links.map((link, index) =>
                      <div key={link.id} className="row">
                        <div className="col-xs-10">
                          <TextField
                            autoFocus={(this.state.links.length - 1) === index}
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
                        {this.state.links.length > 1 &&
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
                    {this.state.crypto.map((cryptoLink, index) =>
                      <div key={cryptoLink.id} className="row">
                        <div className="col-xs-10">
                          <TextField
                            autoFocus={(this.state.crypto.length - 1) === index}
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
                        {this.state.crypto.length > 1 &&
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
                          href="#terms"
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
                onClick={this._handleSubmit}
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
    validate: PropTypes.func,
    getValidationMessages: PropTypes.func,
};

NewProfileForm.defaultProps = {
    style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
    }
};
const validationHOC = validation(strategy());

export default injectIntl(
    muiThemeable()(
      validationHOC(NewProfileForm)
));

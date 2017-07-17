import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { SvgIcon, IconButton, RaisedButton,
    TextField, Divider } from 'material-ui';
import muiThemeable from 'material-ui/styles/muiThemeable';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';
import { injectIntl, FormattedMessage } from 'react-intl';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';
import { Row, Col, Input, Button, Form, Icon, Select } from 'antd';
import { Avatar, ImageUploader } from '../';
import { profileMessages, formMessages,
  generalMessages, validationMessages } from '../../locale-data/messages';
import { getProfileSchema } from '../../utils/validationSchema';
import styles from './new-profile-form.scss';

const FormItem = Form.Item;
const { Option } = Select;

class NewProfileForm extends Component {
    constructor (props) {
        super(props);
        this.state = {
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
        // we need to enable update temp profile button only if something has changed
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

    _handleAddLink = linkType => () => {
        const { tempProfile } = this.props;
        const links = tempProfile.get(linkType);
        let updatedTempProfile;
        const lastLink = links.last();
        if (lastLink) {
            if (linkType === 'links' &&
                (lastLink.get('title').length === 0 || lastLink.get('url').length === 0)) {
                return null;
            }
            if (linkType === 'crypto' &&
                (lastLink.get('name').length === 0 || lastLink.get('address').length === 0)) {
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
        console.log('clearing avatar');
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
        const { isUpdate, tempProfile, onSubmit,
          onProfileUpdate } = this.props;

        this.props.validate((err) => {
            if (err) {
                this.showErrorOnFields = this.showErrorOnFields.concat(Object.keys(err));
                this.forceUpdate();
                console.error(err);
                return;
            }
            this.isSubmitting = true;
            if (this.state.akashaIdIsValid && !this.state.akashaIdExists) {
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
            }
        });
    }

    render () {
        const { intl, muiTheme, style, isUpdate, tempProfile, form } = this.props;
        const { firstName, lastName, about, links, crypto, formHasErrors, avatar, backgroundImage,
          baseUrl } = tempProfile;
        const { formatMessage } = intl;
        const linkAddressPrefix = form.getFieldDecorator('linkAddressPrefix', {
            initialValue: 'http://'
        })(
          <Select>
            <Option value="http://">http://</Option>
            <Option value="https://">https://</Option>
          </Select>
        );
        return (
          <Row
            type="flex"
            className={`${styles.root}`}
            style={style}
          >
            <Form
              action=""
              style={{ width: '100%' }}
              onSubmit={this._handleSubmit}
            >
              {!isUpdate &&
                <div>
                  <h1
                    style={{ marginBottom: 0 }}
                  >
                    Complete Profile
                  </h1>
                  <h3>Step 1/2</h3>
                </div>
              }
              <Col type="flex" md={24}>
                <Col md={6}>
                  <div className="row">
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
                  </div>
                </Col>
                <Col md={18}>
                  <div className="row">
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
                  </div>
                </Col>
              </Col>
              <Col md={12}>
                <FormItem
                  label={formatMessage(formMessages.firstName)}
                  colon={false}
                  hasFeedback
                  validateStatus={this._getErrorMessages('firstName') ? 'error' : 'success'}
                  help={this._getErrorMessages('firstName')}
                  style={{ marginRight: 8 }}
                >
                  <Input
                    value={firstName}
                    onChange={this._handleFieldChange('firstName')}
                    onBlur={this._validateField('firstName')}
                  />
                </FormItem>
              </Col>
              <Col md={12}>
                <FormItem
                  label={formatMessage(formMessages.lastName)}
                  colon={false}
                  hasFeedback
                  validateStatus={this._getErrorMessages('lastName') ? 'error' : 'success'}
                  help={this._getErrorMessages('lastName')}
                  style={{ marginLeft: 8 }}
                >
                  <Input
                    value={lastName}
                    onChange={this._handleFieldChange('lastName')}
                    onBlur={this._validateField('lastName')}
                  />
                </FormItem>
              </Col>
              <Col md={24}>
                <FormItem
                  label={intl.formatMessage(profileMessages.aboutMeTitle)}
                  colon={false}
                >
                  <Input.TextArea
                    rows={2}
                    placeholder={intl.formatMessage(profileMessages.shortDescriptionLabel)}
                    value={about}
                    onChange={this._handleFieldChange('about')}
                    autosize={{ minRows: 2 }}
                  />
                </FormItem>
              </Col>
              <h3 className="col-xs-10" style={{ margin: '20px 0 0 0' }}>
                {intl.formatMessage(profileMessages.linksTitle)}
              </h3>
              {links.map((link, index) => (
                <div key={`${index + 1}`}>
                  <FormItem
                    label={intl.formatMessage(formMessages.title)}
                    colon={false}
                    hasFeedback
                    validateStatus={this._getErrorMessages('links', index, 'title') ? 'error' : 'success'}
                    help={this._getErrorMessages('links', index, 'title')}
                  >
                    <Input
                      value={link.get('title')}
                      onChange={this._handleLinkChange('links', 'title', link.get('id'))}
                      onBlur={this._validateField('links', index, 'title')}
                    />
                  </FormItem>
                  <FormItem
                    label={intl.formatMessage(formMessages.url)}
                    colon={false}
                    hasFeedback
                    validateStatus={this._validateField('links', index, 'url') ? 'error' : 'success'}
                    help={this._getErrorMessages('links', index, 'url')}
                  >
                    <Input
                      addonBefore={linkAddressPrefix}
                      value={link.get('url')}
                      style={{ width: '100%' }}
                      onChange={this._handleLinkChange('links', 'url', link.get('id'))}
                      onBlur={this._validateField('links', index, 'url')}
                    />
                  </FormItem>
                  <Button
                    type="primary"
                    icon="close-circle"
                    ghost
                    onClick={this._handleRemoveLink(link.get('id'), 'links')}
                  >{intl.formatMessage(profileMessages.removeLinkButtonTitle)}</Button>
                </div>
                ))}
              <div className="col-xs-2 end-xs" style={{ margin: '16px 0 0 0' }}>
                <Button
                  icon="plus"
                  type="primary"
                  onClick={this._handleAddLink('links')}
                  title={intl.formatMessage(profileMessages.addLinkButtonTitle)}
                  ghost
                  style={{ border: 'none' }}
                >Add more links</Button>
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
              <small style={{ paddingBottom: '15px', marginTop: '15px' }}>
                <FormattedMessage
                  {...generalMessages.terms}
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
            </Form>
          </Row>
        );
    }
}

NewProfileForm.propTypes = {
    form: PropTypes.shape(),
    getValidationMessages: PropTypes.func,
    intl: PropTypes.shape(),
    isUpdate: PropTypes.bool,
    muiTheme: PropTypes.shape(),
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    onProfileUpdate: PropTypes.func.isRequired,
    onTermsShow: PropTypes.func,
    style: PropTypes.shape(),
    tempProfile: PropTypes.shape(),
    validate: PropTypes.func,
};

const validationHOC = validation(strategy());

export default injectIntl(
    muiThemeable()(
      Form.create()(validationHOC(NewProfileForm))
));

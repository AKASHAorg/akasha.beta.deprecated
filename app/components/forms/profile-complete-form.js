import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map } from 'immutable';
import { injectIntl } from 'react-intl';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';
import QRCode from 'qrcode.react';
import { Row, Card, Col, Input, Button, Form, Icon, Switch } from 'antd';
import * as actionTypes from '../../constants/action-types';
import { AvatarEditor, ImageUploader } from '../';
import { profileMessages, formMessages,
    generalMessages, validationMessages } from '../../locale-data/messages';
import { getProfileSchema } from '../../utils/validationSchema';
import { uploadImage } from '../../local-flux/services/utils-service';

const FormItem = Form.Item;

const serverChannel = window.Channel.server.registry.profileExists;
const clientChannel = window.Channel.client.registry.profileExists;

class ProfileCompleteForm extends Component {
    constructor (props) {
        super(props);
        this.state = {
            akashaIdIsValid: true,
            akashaIdExists: false,
            insufficientEth: false,
            insufficientEthRenderFlag: false
        };
        this.validatorTypes = getProfileSchema(props.intl, { isUpdate: props.isUpdate });
        this.showErrorOnFields = [];
        this.isSubmitting = false;
    }
    getValidatorData = () => this.props.tempProfile.toJS();
    componentWillReceiveProps (nextProps) {
        const { isUpdate, balance, tempProfile } = nextProps;
        // we need to enable update temp profile button only if something has changed
        // so we need to keep a ref to old temp profile.
        if (isUpdate && tempProfile.akashaId !== this.props.tempProfile.akashaId) {
            this.refTempProfile = tempProfile;
        }
        if (balance.get('eth') >= 0.1) {
            this.setState({
                insufficientEth: false,
                insufficientEthRenderFlag: false
            });
        }
    }

    componentDidUpdate () {
        const { insufficientEth, insufficientEthRenderFlag } = this.state;
        if (insufficientEth && !insufficientEthRenderFlag) {
            this.container.scrollTop = this.container.scrollHeight;
            this.state.insufficientEthRenderFlag = true;
        }
    }

    componentWillUnmount () {
        clientChannel.removeListener(this._handleResponse);
    }

    getContainerRef = (el) => {
        const { getFormContainerRef } = this.props;
        this.container = el;
        if (getFormContainerRef) {
            getFormContainerRef(el);
        }
    };

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

    _handleResponse = (ev, resp) => {
        const { tempProfile, onProfileUpdate } = this.props;
        const { idValid, exists, normalisedId } = resp.data;
        if (resp.error && resp.error.message) {
            this.setState({
                error: `${resp.error.message}`
            });
            return;
        }
        this.setState({
            akashaIdIsValid: idValid,
            akashaIdExists: exists,
            error: ''
        });
        if (normalisedId) {
            onProfileUpdate(tempProfile.set('akashaId', normalisedId));
        }
    }

    _validateAkashaId = (akashaId) => {
        if (!this.idVerifyChannelEnabled) {
            serverChannel.enable();
            this.idVerifyChannelEnabled = true;
        }
        // one listener is auto attached on application start
        // we need to attach another one with the provided handler
        if (clientChannel.listenerCount <= 1) {
            clientChannel.on(this._handleResponse);
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

    _validateField = field =>
        () => {
            if (!this.showErrorOnFields.includes(field)) {
                this.showErrorOnFields.push(field);
            }
            return this.props.validate(this._onValidate(field));
        };

    _getErrorMessages = (field, index, sub) => {
        const { getValidationMessages } = this.props;
        if (this.showErrorOnFields.includes(field) && !this.isSubmitting) {
            if (field === 'links') {
                const joiPath = `${field},${index},${sub}`;
                const errors = getValidationMessages(joiPath);
                if (errors) {
                    return errors[0];
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
        const { akashaIdIsValid, akashaIdExists, error } = this.state;
        if (error) {
            return error;
        }
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


    _handleAvatarClear = () => {
        const { tempProfile, onProfileUpdate } = this.props;
        onProfileUpdate(
            tempProfile.set('avatar', null)
        );
    }

    _handleAvatarAdd = () => {
        const { tempProfile, onProfileUpdate } = this.props;
        this.avatar.getImage().then(avatar =>
            onProfileUpdate(
                tempProfile.set('avatar', avatar)
            )
        );
    }

    _handleBackgroundClear = () => {
        const { tempProfile, onProfileUpdate } = this.props;
        onProfileUpdate(
            tempProfile.set('backgroundImage', new Map())
        );
    }

    _handleBackgroundChange = (bgImageObj) => {
        const { tempProfile, onProfileUpdate } = this.props;
        uploadImage(bgImageObj).then((bgImageObjIpfs) => {
            onProfileUpdate(
                tempProfile.set('backgroundImage', bgImageObjIpfs));
        });
    }

    _handleSwitchChange = (checked) => {
        const { tempProfile, onProfileUpdate } = this.props;
        onProfileUpdate(tempProfile.set('donationsEnabled', checked));
    }

    _handleSkipStep = () => {
        const { history } = this.props;
        history.push('/setup/new-identity-interests');
    };

    _handleSubmit = (ev) => {
        ev.preventDefault();
        const { actionAdd, history, isUpdate, balance, tempProfile } = this.props;

        this.props.validate((err) => {
            if (err) {
                this.showErrorOnFields = this.showErrorOnFields.concat(Object.keys(err));
                this.forceUpdate();
                console.error(err);
                return;
            }
            if (balance.get('eth') < 0.1) {
                this.setState({ insufficientEth: true });
                // this.formWrap.scrollTop = this.formWrap.scrollHeight;
                // this.forceUpdate();
                return;
            }
            this.isSubmitting = true;
            if (this.state.akashaIdIsValid && !this.state.akashaIdExists) {
                const actionType = isUpdate ?
                    actionTypes.profileUpdate :
                    actionTypes.profileRegister;
                const ethAddress = tempProfile.get('ethAddress');
                const data = tempProfile ? tempProfile.toJS() : null;
                history.push('/setup/new-identity-interests');
                actionAdd(ethAddress, actionType, data);
            }
        });
    }

    _handleSave = () => {
        const { tempProfile } = this.props;
        this.props.tempProfileCreate(tempProfile);
    }

    onCopy = () => {
        const { loggedEthAddress } = this.props;
        const textArea = document.createElement('textarea');
        textArea.value = loggedEthAddress;
        textArea.style.position = 'fixed';
        textArea.style.top = -99999;
        textArea.style.left = -99999;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    };


    render () {
        const { intl, isUpdate, tempProfile, loggedEthAddress } = this.props;
        const { akashaId, firstName, lastName, about, links, avatar, backgroundImage,
            baseUrl } = tempProfile;
        const { formatMessage } = intl;

        return (
          <div className="profile-complete-form__wrap">
            <div className="profile-complete-form__form-wrapper" ref={this.getContainerRef}>
              <Row type="flex" className="">
                <Form
                  onSubmit={this._handleSubmit}
                >
                  <Col type="flex" md={24} className="profile-complete-form__image-wrap">
                    <Col md={8}>
                      <div className="row">
                        <p className="profile-complete-form__avatar-title">
                          {intl.formatMessage(profileMessages.avatarTitle)}
                        </p>
                        <div className="col-xs-12 center-xs">
                          <AvatarEditor
                            size={100}
                            editable
                            ref={(avtr) => { this.avatar = avtr; }}
                            image={avatar}
                            onImageAdd={this._handleAvatarAdd}
                            onImageClear={this._handleAvatarClear}
                          />
                        </div>
                      </div>
                    </Col>
                    <Col md={16}>
                      <div className="row">
                        <p className="profile-complete-form__bg-image-title" >
                          {intl.formatMessage(profileMessages.backgroundImageTitle)}
                        </p>
                        <div className="col-xs-12">
                          <ImageUploader
                            ref={(imageUploader) => { this.imageUploader = imageUploader; }}
                            minWidth={360}
                            intl={intl}
                            initialImage={backgroundImage}
                            baseUrl={baseUrl}
                            onImageClear={this._handleBackgroundClear}
                            onChange={this._handleBackgroundChange}
                          />
                        </div>
                      </div>
                    </Col>
                  </Col>
                  <Col md={12}>
                    <FormItem
                      label={formatMessage(formMessages.akashaId)}
                      colon={false}
                      validateStatus={this._getAkashaIdErrors('akashaId') ? 'error' : 'success'}
                      help={this._getAkashaIdErrors('akashaId')}
                      style={{ marginRight: 8 }}
                    >
                      <Input
                        value={akashaId}
                        onChange={this._handleFieldChange('akashaId')}
                        onBlur={this._validateField('akashaId')}
                        disabled={isUpdate}
                      />
                    </FormItem>
                  </Col>
                  <Col md={12}>
                    <div className="profile-complete-form__tips-switch">
                      <FormItem
                        label={formatMessage(formMessages.tips)}
                        colon={false}
                        style={{ marginRight: 8, marginLeft: 8 }}
                      >
                        <Switch
                          checked={tempProfile.get('donationsEnabled')}
                          onChange={this._handleSwitchChange}
                          size="large"
                        />
                      </FormItem>
                    </div>
                    <div className="profile-complete-form__tips-description">
                      {formatMessage(formMessages.acceptTips)}
                    </div>
                  </Col>
                  <Col md={24}>
                    <Col md={12}>
                      <FormItem
                        label={formatMessage(formMessages.firstName)}
                        colon={false}
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
                  </Col>
                  <Col md={24}>
                    <FormItem
                      label={formatMessage(profileMessages.aboutMeTitle)}
                      colon={false}
                    >
                      <Input.TextArea
                        className="profile-complete-form__textarea"
                        rows={2}
                        placeholder={formatMessage(profileMessages.shortDescriptionLabel)}
                        value={about}
                        onChange={this._handleFieldChange('about')}
                        autosize={{ minRows: 2, maxRows: 5 }}
                      />
                    </FormItem>
                  </Col>
                  <Col md={24}>
                    <h3 className="profile-complete-form__link">
                      {intl.formatMessage(profileMessages.linksTitle)}
                    </h3>
                    {links.map((link, index) => (
                      <div key={`${index + 1}`} className="profile-complete-form__link">
                        <FormItem
                          validateStatus={this._getErrorMessages('links', index, 'url') ? 'error' : 'success'}
                          help={this._getErrorMessages('links', index, 'url')}
                        >
                          <Input
                            value={link.get('url')}
                            style={{ width: '100%' }}
                            onChange={this._handleLinkChange('links', 'url', link.get('id'))}
                            onBlur={this._validateField('links')}
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
                    <div className="profile-complete-form__add-links-btn">
                      <Button
                        icon="plus"
                        type="primary borderless"
                        onClick={this._handleAddLink('links')}
                        title={intl.formatMessage(profileMessages.addLinkButtonTitle)}
                        ghost
                        style={{ border: 'none' }}
                      >Add more</Button>
                    </div>
                  </Col>
                  {this.state.insufficientEth &&
                    <Col md={24}>
                      <div
                        className="profile-complete-form__insufficient-funds"
                      >
                        <Card
                          bordered={false}
                          noHovering
                        >
                          <h3>{formatMessage(formMessages.insufficientEth)}</h3>
                          <p>{formatMessage(formMessages.depositEth)}</p>
                          <div className="profile-complete-form__address-info">
                            <div className="profile-complete-form__qr-wrap">
                              <span className="profile-complete-form__qr-title">QR Code</span>
                              <div className="profile-complete-form__qr-code">
                                <QRCode value={loggedEthAddress} />
                              </div>
                            </div>
                            <div>
                              <FormItem
                                className="profile-complete-form__form-item"
                                colon={false}
                                label={intl.formatMessage(profileMessages.yourEthAddress)}
                              >
                                <Input
                                  className="profile-complete-form__input profile-complete-form__my-address"
                                  readOnly
                                  value={loggedEthAddress}
                                />
                                <div
                                  className="content-link profile-complete-form__copy-button"
                                  onClick={this.onCopy}
                                >
                                  {intl.formatMessage(generalMessages.copy)}
                                </div>
                              </FormItem>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </Col>
                }
                  <Col md={24} className="profile-complete-form__filler" />
                </Form>
              </Row>
            </div>
            <div className="setup-content__column-footer profile-complete-form__footer">
              <div className="content-link" onClick={this._handleSkipStep}>
                {intl.formatMessage(generalMessages.skipStep)} <Icon type="arrow-right" />
              </div>
              <div className="profile-complete-form__buttons-wrapper">
                <div className="profile-complete-form__save-btn">
                  <Button
                    size="large"
                    onClick={this._handleSave}
                  >
                    {intl.formatMessage(profileMessages.saveForLater)}
                  </Button>
                </div>
                <Button
                  htmlType="submit"
                  className="new-identity__button"
                  onClick={this._handleSubmit}
                  size="large"
                  type="primary"
                >
                  {intl.formatMessage(generalMessages.submit)}
                </Button>
              </div>
            </div>
          </div>
        );
    }
}

ProfileCompleteForm.propTypes = {
    actionAdd: PropTypes.func,
    balance: PropTypes.shape(),
    getValidationMessages: PropTypes.func,
    history: PropTypes.shape(),
    intl: PropTypes.shape(),
    isUpdate: PropTypes.bool,
    getFormContainerRef: PropTypes.func,
    loggedEthAddress: PropTypes.string,
    onProfileUpdate: PropTypes.func.isRequired,
    tempProfile: PropTypes.shape(),
    tempProfileCreate: PropTypes.func,
    validate: PropTypes.func,
};

const validationHOC = validation(strategy());

export default injectIntl(
    Form.create()(validationHOC(ProfileCompleteForm))
);

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Map, fromJS } from 'immutable';
import { injectIntl, FormattedMessage } from 'react-intl';
import validation from 'react-validation-mixin';
import strategy from 'joi-validation-strategy';
import { Row, Col, Icon, Input, Button, Form } from 'antd';
import * as actionTypes from '../../constants/action-types';
import { AvatarEditor, ImageUploader } from '../';
import { profileMessages, formMessages,
    generalMessages, validationMessages } from '../../locale-data/messages';
import { getProfileSchema } from '../../utils/validationSchema';
import { uploadImage } from '../../local-flux/services/utils-service';

const FormItem = Form.Item;

class ProfileEditForm extends Component {
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
        const { loggedProfileData, tempProfile, profileExistsData } = nextProps;
        this.formChanged = (
            tempProfile.get('firstName') !== loggedProfileData.get('firstName') ||
            tempProfile.get('lastName') !== loggedProfileData.get('lastName') ||
            tempProfile.get('about') !== loggedProfileData.get('about') ||
            tempProfile.get('avatar') !== loggedProfileData.get('avatar') ||
            !tempProfile.get('backgroundImage').equals(fromJS(loggedProfileData.get('backgroundImage'))) ||
            !tempProfile.get('links').equals(fromJS(loggedProfileData.get('links')))
        );
        this.emptyLinks = !!tempProfile.get('links').filter(link => !link.get('url')).size;
        if (profileExistsData !== this.props.profileExistsData) {
            const { idValid, exists, normalisedId } = profileExistsData.get('data').toJS();
            this.setState({
                akashaIdIsValid: idValid,
                akashaIdExists: exists
            });
            if (tempProfile.get('akashaId') !== normalisedId) {
                this.setState({ akashaIdIsValid: false });
            }
        }
    }

    getContainerRef = (el) => {
        const { getFormContainerRef } = this.props;
        this.container = el;
        if (getFormContainerRef) {
            getFormContainerRef(el);
        }
    };

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
                (lastLink.get('url').length === 0)) {
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
            this.props.profileExists(this.props.tempProfile.get('akashaId'));
        }

        if (field === 'links') {
            this.props.tempProfile.get('links').forEach((link) => {
                if (!link.get('url')) {
                    this._handleRemoveLink(link.get('id'), 'links')();
                }
            });
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
        const { intl, tempProfile, profileExistsData } = this.props;
        const { akashaIdIsValid, akashaIdExists } = this.state;
        if (tempProfile.get('akashaId') === profileExistsData.get('akashaId')) {
            if (!akashaIdIsValid && tempProfile.get('akashaId').length > 1) {
                return intl.formatMessage(validationMessages.akashaIdNotValid);
            }
            if (akashaIdExists) {
                return intl.formatMessage(validationMessages.akashaIdExists);
            }
            if (this._getErrorMessages('akashaId')) {
                return this._getErrorMessages('akashaId');
            }
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
        this.avatar.wrappedInstance.refs.wrappedInstance.getImage().then((avatar) => {
            if (!avatar) {
                return null;
            }
            if (typeof avatar === 'string') {
                return onProfileUpdate(
                    tempProfile.set('avatar', avatar)
                );
            }
            return uploadImage(avatar).then((avatarIpfs) => {
                return onProfileUpdate(
                    tempProfile.set('avatar', avatarIpfs)
                );
            }
            );
        });
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

    _handleSave = () => {
        const { tempProfile } = this.props;
        this.props.tempProfileCreate(tempProfile);
    }

    _handleSubmit = (ev) => {
        ev.preventDefault();
        const { isUpdate, tempProfile, actionAdd } = this.props;

        this.props.validate((err) => {
            if (err) {
                this.showErrorOnFields = this.showErrorOnFields.concat(Object.keys(err));
                this.forceUpdate();
                console.error(err);
                return;
            }
            this.isSubmitting = true;
            if (this.state.akashaIdIsValid && !this.state.akashaIdExists) {
                const actionType = isUpdate ?
                    actionTypes.profileUpdate :
                    actionTypes.profileRegister;
                const ethAddress = tempProfile.get('ethAddress');
                const data = tempProfile ? tempProfile.toJS() : null;
                actionAdd(ethAddress, actionType, data);
            }
        });
    }

    render () {
        const { intl, isUpdate, tempProfile } = this.props;
        const { akashaId, firstName, lastName, about, links, avatar, backgroundImage,
            baseUrl } = tempProfile;
        const { formatMessage } = intl;

        return (
          <div className="profile-edit-form__wrap">
            <div className="profile-edit-form__pad">
              <div className="profile-edit-form__form-wrapper" ref={this.getContainerRef}>
                <Row type="flex" className="">
                  <Form
                    action=""
                    style={{ width: '100%' }}
                    onSubmit={this._handleSubmit}
                  >
                    <Col type="flex" md={24}>
                      <Col md={8}>
                        <div>
                          <div className="profile-edit-form__avatar-title">
                            {intl.formatMessage(profileMessages.avatarTitle)}
                          </div>
                          <div>
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
                      <Col md={24}>
                        <div className="row profile-edit-form__bg-image">
                          <div className="profile-edit-form__bg-image-title" >
                            {intl.formatMessage(profileMessages.backgroundImageTitle)}
                          </div>
                          <div className="col-xs-12 profile-edit-form__bg-image-wrap">
                            <ImageUploader
                              ref={(imageUploader) => { this.imageUploader = imageUploader; }}
                              minWidth={320}
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
                    <Col md={24}>
                      <FormItem
                        label={formatMessage(formMessages.akashaId)}
                        colon={false}
                        validateStatus={this._getAkashaIdErrors('akashaId') ? 'error' : 'success'}
                        help={this._getAkashaIdErrors('akashaId')}
                      >
                        <Input
                          value={akashaId}
                          onChange={this._handleFieldChange('akashaId')}
                          onBlur={this._validateField('akashaId')}
                          disabled={isUpdate}
                        />
                      </FormItem>
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
                        label={intl.formatMessage(profileMessages.aboutMeTitle)}
                        colon={false}
                        validateStatus={this._getErrorMessages('about') ? 'error' : 'success'}
                        help={this._getErrorMessages('about')}
                      >
                        <Input.TextArea
                          className="profile-edit-form__textarea"
                          rows={5}
                          placeholder={intl.formatMessage(profileMessages.shortDescriptionLabel)}
                          value={about}
                          onChange={this._handleFieldChange('about')}
                          onBlur={this._validateField('about')}
                        />
                      </FormItem>
                    </Col>
                    <Col md={24}>
                      <div className="profile-edit-form__link">
                        {intl.formatMessage(profileMessages.linksTitle)}
                      </div>
                      {links.map((link, index) => (
                        <div className="profile-edit-form__link" key={`${index + 1}`}>
                          <FormItem
                            validateStatus={this._getErrorMessages('links', index, 'url') ? 'error' : 'success'}
                            help={this._getErrorMessages('links', index, 'url')}
                          >
                            <Input
                              suffix={<Icon
                                className="content-link"
                                type="minus-circle"
                                onClick={this._handleRemoveLink(link.get('id'), 'links')}
                              />}
                              value={link.get('url')}
                              style={{ width: '100%' }}
                              onChange={this._handleLinkChange('links', 'url', link.get('id'))}
                              onBlur={this._validateField('links')}
                            />
                          </FormItem>
                        </div>
                            ))}
                      <div className="profile-edit-form__add-links-btn">
                        <Button
                          icon="plus-circle"
                          type="primary borderless"
                          onClick={this._handleAddLink('links')}
                          ghost
                          style={{ border: 'none' }}
                        >{intl.formatMessage(profileMessages.addLinkButtonTitle)}</Button>
                      </div>
                    </Col>
                    {!isUpdate &&
                    <Col md={24} className="profile-edit-form__terms">
                      <small>
                        <FormattedMessage
                          {...generalMessages.terms}
                          values={{
                                termsLink: (
                                  <a
                                    href="/terms"
                                    onClick={this._showTerms}
                                  >
                                    {intl.formatMessage(generalMessages.termsOfService)}
                                  </a>
                                )
                            }}
                        />
                      </small>
                    </Col>
                    }
                  </Form>
                </Row>
              </div>
            </div>
            <div className="profile-edit-form__buttons-wrapper">
              <div className="profile-edit-form__save-btn">
                <Button
                  size="large"
                  onClick={this._handleSave}
                >
                  {intl.formatMessage(profileMessages.saveForLater)}
                </Button>
              </div>
              <div className="profile-edit-form__update-btn">
                <Button
                  type="primary"
                  disabled={!tempProfile.get('akashaId') || !this.formChanged || this.emptyLinks}
                  onClick={this._handleSubmit}
                  size="large"
                >
                  {isUpdate ?
                        intl.formatMessage(profileMessages.updateProfile) :
                        intl.formatMessage(profileMessages.registerProfile)
                    }
                </Button>
              </div>
            </div>
          </div>
        );
    }
}

ProfileEditForm.propTypes = {
    actionAdd: PropTypes.func,
    form: PropTypes.shape(),
    getFormContainerRef: PropTypes.func,
    getValidationMessages: PropTypes.func,
    intl: PropTypes.shape(),
    isUpdate: PropTypes.bool,
    loggedProfileData: PropTypes.shape(),
    onCancel: PropTypes.func,
    onSubmit: PropTypes.func,
    onProfileUpdate: PropTypes.func.isRequired,
    onTermsShow: PropTypes.func,
    profileExists: PropTypes.func,
    profileExistsData: PropTypes.shape(),
    style: PropTypes.shape(),
    tempProfile: PropTypes.shape(),
    tempProfileCreate: PropTypes.func,
    validate: PropTypes.func,
};

const validationHOC = validation(strategy());

export default injectIntl(
    Form.create()(validationHOC(ProfileEditForm))
);

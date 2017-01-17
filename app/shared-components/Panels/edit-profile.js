import React, { Component, PropTypes } from 'react';
import r from 'ramda';
import { SvgIcon, IconButton, RaisedButton,
    TextField, Divider, Paper } from 'material-ui';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';
import { injectIntl } from 'react-intl';
import { Avatar, ImageUploader, PanelContainer } from 'shared-components';
import { profileMessages, formMessages, generalMessages } from 'locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions
import { inputFieldMethods } from 'utils/dataModule'; // eslint-disable-line import/no-unresolved, import/extensions
import validationProvider from 'utils/validationProvider'; // eslint-disable-line import/no-unresolved, import/extensions
import { UserValidation } from 'utils/validationSchema'; // eslint-disable-line import/no-unresolved, import/extensions
import PanelHeader from '../../routes/components/panel-header';
import imageCreator, { findBestMatch } from '../../utils/imageUtils';

class EditProfile extends Component {
    constructor (props) {
        super(props);
        this.getProps = inputFieldMethods.getProps.bind(this);
        const profileData = props.loggedProfileData.toJS();
        const links = profileData.links;
        this.state = {
            formValues: {
                firstName: profileData.firstName,
                lastName: profileData.lastName
            },
            about: profileData.about,
            avatar: profileData.avatar,
            backgroundImage: profileData.backgroundImage,
            links: links || [],
            lastCreatedLink: links && links.length ? links[links.length - 1].id : '1'
        };
        this.validatorTypes = new UserValidation(props.intl).getSchema();
    }

    getValidatorData () {
        return this.state.formValues;
    }

    handleSubmit = () => {
        if (this._checkLinks()) {
            return;
        }
        const { updateProfileData } = this.props;
        const profileData = Object.assign({}, this.state.formValues);
        const profileImage = this.imageUploader.getWrappedInstance().getImage();

        if (this.state.links.length > 0) {
            profileData.links = this.state.links.map((link) => {
                delete link.error;
                return link;
            });
        }
        if (profileImage) {
            profileData.backgroundImage = profileImage;
        } else {
            profileData.backgroundImage = this.state.backgroundImage;
        }
        if (this.state.about) {
            profileData.about = this.state.about;
        }

        this.avatar.getImage().then((uintArr) => {
            if (uintArr) {
                profileData.avatar = uintArr;
            }
            return profileData;
        }).then((data) => {
            let mustCorrectErrors = false;
            Object.keys(this.state.formValues).forEach((key) => {
                if (this.state.formValues[key] === '') {
                    if (this.refs[key]) {
                        this.refs[key].focus();
                    }
                    mustCorrectErrors = true;
                }
            });
            if (mustCorrectErrors) {
                console.log('must correct some errors!', this.state);
            } else if (!profileImage && this.state.backgroundImage) {
                const background = this.state.backgroundImage;
                const newImage = {};
                Object.keys(background).forEach((key) => {
                    newImage[key] = Object.assign({}, background[key], {
                        src: background[key].src
                    });
                });
                data.backgroundImage = newImage;
                updateProfileData(data);
            } else {
                updateProfileData(data);
            }
        });
    };

    _submitForm = (ev) => {
        ev.preventDefault();
        this.handleSubmit();
    };

    _handleCancel = (ev) => {
        ev.preventDefault();
        this.profileForm.reset();
        this.props.showPanel({ name: 'userProfile', overlay: true });
    };

    _handleAddLink = () => {
        const currentLinks = this.state.links.slice();
        const isEmpty = this._checkLinks();

        if (!isEmpty) {
            currentLinks.push({
                title: '',
                url: '',
                type: '',
                id: this.state.lastCreatedLink + 1,
                error: {}
            });
            this.setState({
                links: currentLinks,
                lastCreatedLink: this.state.lastCreatedLink + 1
            });
        }
    };

    _handleRemoveLink = (linkId) => {
        let links = this.state.links;
        if (this.state.links.length > 0) {
            links = r.reject(link => link.id === linkId, links);
        }
        this.setState({
            links
        });
    };

    _hasLinkErrors = () => {
        if (this.state.links.find(link => link.error && (link.error.title || link.error.url))) {
            return true;
        }
        return false;
    };

    _checkLinks = () => {
        let isEmpty = false;
        this.state.links.forEach((link) => {
            Object.keys(link).forEach((key) => {
                if (key !== 'id' && key !== 'type' && link[key].length === 0) {
                    isEmpty = true;
                    const links = r.clone(this.state.links);
                    const index = r.findIndex(r.propEq('id', link.id))(links);
                    link.error[key] = true;
                    links[index] = link;
                    this.setState({
                        links
                    });
                }
            });
        });
        return isEmpty;
    }

    _handleLinkChange = (field, linkId, ev) => {
        const links = r.clone(this.state.links);
        const fieldValue = ev.target.value;
        const index = r.findIndex(r.propEq('id', linkId))(links);
        const link = links[index];
        link[field] = fieldValue;
        link.error[field] = fieldValue.length === 0;
        if (field === 'url') {
            if (field.indexOf('akasha://')) {
                link.type = 'internal';
            } else {
                link.type = 'other';
            }
        }
        links[index] = link;
        this.setState({ links });
    };

    _handleAboutChange = (ev) => {
        this.setState({
            about: ev.target.value
        });
    };

    clearAvatarImage = () => {
        this.setState({
            avatar: ''
        });
    };

    clearBackgroundImage = () => {
        this.setState({
            backgroundImage: {}
        });
    };

    renderHeaderTitle () {
        const { intl } = this.props;
        const akashaId = this.props.loggedProfileData.get('akashaId');
        return (<div>
          <div style={{ fontSize: '20px' }}>{intl.formatMessage(profileMessages.personalProfile)}</div>
          <div style={{ fontWeight: '300' }}>{`@${akashaId}`}</div>
        </div>);
    }

    render () {
        const { intl, loggedProfileData, updatingProfile } = this.props;
        const { palette } = this.context.muiTheme;
        const floatLabelStyle = { color: palette.disabledColor };
        const firstNameProps = this.getProps({
            floatingLabelText: intl.formatMessage(formMessages.firstName),
            ref: 'firstName',
            floatingLabelStyle: floatLabelStyle,
            style: { verticalAlign: 'middle', flex: '1 1 auto' },
            statePath: 'formValues.firstName',
            required: true,
            addValueLink: true,
            value: this.state.formValues.firstName,
            onFocus: this.props.clearValidations,
            onBlur: this.props.handleValidation('formValues.firstName')
        });

        const lastNameProps = this.getProps({
            floatingLabelStyle: floatLabelStyle,
            floatingLabelText: intl.formatMessage(formMessages.lastName),
            ref: 'lastName',
            style: { flex: '1 1 auto', marginLeft: '20px', verticalAlign: 'middle' },
            statePath: 'formValues.lastName',
            required: true,
            addValueLink: true,
            value: this.state.formValues.lastName,
            onBlur: this.props.handleValidation('formValues.lastName')
        });
        const key = findBestMatch(400, this.state.backgroundImage);
        const backgroundImageLink = this.state.backgroundImage && key &&
            imageCreator(this.state.backgroundImage[key].src, loggedProfileData.get('baseUrl'));

        return (
          <Paper
            style={{
                width: '480px',
                zIndex: 10,
                position: 'relative',
                height: '100%'
            }}
          >
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
                    key="update"
                    label={intl.formatMessage(generalMessages.update)}
                    type="submit"
                    onClick={this._submitForm}
                    style={{ marginLeft: 8 }}
                    disabled={this.state.submitting || updatingProfile || this._hasLinkErrors()}
                    primary
                />
                /* eslint-enable */
              ]}
              header={
                <PanelHeader
                  title={this.renderHeaderTitle()}
                  noLogoButton
                  noStatusBar
                />
              }
            >
              <form
                action=""
                onSubmit={this.handleSubmit}
                ref={(profileForm) => { this.profileForm = profileForm; }}
                style={{ width: '100%' }}
              >
                <div style={{ display: 'flex' }}>
                  <TextField {...firstNameProps} />
                  <TextField {...lastNameProps} />
                </div>
                <h3 style={{ margin: '30px 0 10px 0' }} >
                  {intl.formatMessage(profileMessages.avatarTitle)}
                </h3>
                <div>
                  <Avatar
                    radius={130}
                    image={this.state.avatar}
                    editable
                    ref={(avatar) => { this.avatar = avatar; }}
                    clearAvatarImage={this.clearAvatarImage}
                    avatarScale={1}
                  />
                </div>
                <h3 style={{ margin: '20px 0 10px 0' }} >
                  {intl.formatMessage(profileMessages.backgroundImageTitle)}
                </h3>
                <ImageUploader
                  ref={(imageUploader) => { this.imageUploader = imageUploader; }}
                  minWidth={320}
                  initialImageLink={backgroundImageLink}
                  clearImage={this.clearBackgroundImage}
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
                  <h3 className="col-xs-10">
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
                {!!this.state.links.length && this.state.links.map(link =>
                  <div key={link.id} className="row">
                    <div className="col-xs-10">
                      <TextField
                        autoFocus={
                            this.state.lastCreatedLink === link.id &&
                            !loggedProfileData.get('links').find(lnk =>
                                lnk.id === link.id
                            )
                        }
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
              </form>
            </PanelContainer>
          </Paper>
        );
    }
}

EditProfile.propTypes = {
    clearValidations: PropTypes.func,
    handleValidation: PropTypes.func,
    intl: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    showPanel: PropTypes.func,
    updateProfileData: PropTypes.func,
    updatingProfile: PropTypes.bool
};

EditProfile.contextTypes = {
    muiTheme: React.PropTypes.shape(),
    router: React.PropTypes.shape()
};

EditProfile.defaultProps = {
    style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
    }
};

export default injectIntl(validationProvider(EditProfile));

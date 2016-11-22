import React, { Component, PropTypes } from 'react';
import r from 'ramda';
import { SvgIcon, IconButton, RaisedButton,
    TextField, Divider, Paper } from 'material-ui';
import ContentAddIcon from 'material-ui/svg-icons/content/add';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';
import { injectIntl } from 'react-intl';
import { Avatar, ImageUploader, PanelContainer } from 'shared-components';
import { profileMessages, formMessages, generalMessages } from 'locale-data/messages'; /* eslint import/no-unresolved: 0*/
import { inputFieldMethods } from 'utils/dataModule';
import validationProvider from 'utils/validationProvider';
import { UserValidation } from 'utils/validationSchema';
import PanelHeader from '../../routes/components/panel-header';
import imageCreator from '../../utils/imageUtils';

class EditProfile extends Component {
    constructor (props) {
        super(props);
        this.getProps = inputFieldMethods.getProps.bind(this);
        this.state = {
            formValues: {
                firstName: props.profile.get('firstName'),
                lastName: props.profile.get('lastName')
            },
            about: '',
            avatar: props.profile.get('avatar'),
            backgroundImage: {},
            links: [],
            lastCreatedLink: ''
        };
        this.validatorTypes = new UserValidation(props.intl).getSchema();
    }

    componentWillMount () {
        const { profile, profileActions } = this.props;
        profileActions.getProfileData([{ profile: profile.get('profile') }], true);
    }

    componentWillReceiveProps (nextProps) {
        if (!nextProps.fetchingProfileData && this.props.fetchingProfileData) {
            const { firstName, lastName, about, backgroundImage, links,
                avatar } = nextProps.profile.toJS();
            this.setState({
                formValues: {
                    firstName,
                    lastName
                },
                backgroundImage,
                about,
                avatar,
                links: links || []
            });
        }
        if (!nextProps.loginRequested && this.props.loginRequested) {
            this.handleSubmit();
        }
    }

    getValidatorData () {
        return this.state.formValues;
    }

    handleSubmit = () => {
        const { updateProfileData } = this.props;
        const profileData = this.state.formValues;
        const profileImage = this.imageUploader.getWrappedInstance().getImage();
        const userLinks = this.state.links.filter(link => link.title.length > 0);

        if (userLinks.length > 0) {
            profileData.links = userLinks;
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
                        src: background[key].src['/']
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
                id: currentLinks.length
            });
            this.setState({
                links: currentLinks,
                lastCreatedLink: currentLinks.length - 1
            });
        }
    };

    _handleRemoveLink = (linkId) => {
        let links = this.state.links;
        if (this.state.links.length > 0) {
            links = r.reject(link => link.id === linkId, links);
        }
        for (let i = 0; i < links.length; i += 1) {
            links[i].id = i;
        }
        this.setState({
            links
        });
    };

    _checkLinks = () => {
        let isEmpty = false;
        this.state.links.forEach((link) => {
            Object.keys(link).forEach((key) => {
                if (key !== 'id' && key !== 'type' && link[key].length === 0) {
                    isEmpty = true;
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
        const akashaId = this.props.profile.get('akashaId');
        return <div>
          <div style={{ fontSize: '20px' }}>{intl.formatMessage(profileMessages.personalProfile)}</div>
          <div style={{ fontWeight: '300' }}>{`@${akashaId}`}</div>
        </div>;
    }

    render () {
        const { intl, profile, updatingProfile } = this.props;
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
        const mediumImage = this.state.backgroundImage.md;
        const backgroundImageLink = mediumImage &&
            imageCreator(mediumImage.src['/'], profile.get('baseUrl'));

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
                    disabled={this.state.submitting || updatingProfile}
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
                  minHeight={350}
                  minWidth={672}
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
                {!!this.state.links.length && this.state.links.map((link, key) =>
                  <div key={key} className="row">
                    <div className="col-xs-10">
                      <TextField
                        autoFocus={this.state.lastCreatedLink === key}
                        fullWidth
                        floatingLabelText={intl.formatMessage(formMessages.title)}
                        value={link.title}
                        floatingLabelStyle={floatLabelStyle}
                        onChange={ev => this._handleLinkChange('title', link.id, ev)}
                      />
                      <TextField
                        fullWidth
                        floatingLabelText={intl.formatMessage(formMessages.url)}
                        value={link.url}
                        floatingLabelStyle={floatLabelStyle}
                        onChange={ev => this._handleLinkChange('url', link.id, ev)}
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
    profile: PropTypes.shape(),
    profileActions: PropTypes.shape(),
    showPanel: PropTypes.func,
    fetchingProfileData: PropTypes.bool,
    updateProfileData: PropTypes.func,
    loginRequested: PropTypes.bool,
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
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
import { profileSchema, getErrorMessages } from '../../utils/validationSchema';

class NewProfileForm extends Component {
    constructor (props) {
        super(props);
        this.state = {
            firstName: '',
            akashaId: '',
            password: '',
            password2: '',
            links: [],
            optDetails: false,
        };
        this.validatorTypes = profileSchema;
        this.showErrorOnFields = [];
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
    _handleAddLink = () => {
        this.setState((prevState) => {
            if (prevState.links[prevState.links.length - 1] &&
              prevState.links[prevState.links.length - 1].title.length === 0) {
                return prevState;
            }
            return {
                links: [...prevState.links, {
                    title: '',
                    url: '',
                    type: '',
                    id: prevState.links.length > 0 ? (prevState.links.slice(-1).pop().id + 1) : 1,
                    error: {}
                }]
            };
        });
    }
    _handleLinkChange = (field, linkId) => {
        const links = this.state.links.slice();
        const index = links.findIndex(link => link.id === linkId);
        return (ev) => {
            links[index][field] = ev.target.value;
            this.setState({
                links
            });
        };
    }
    _handleRemoveLink = linkId =>
        () => {
            this.setState(prevState => ({
                links: prevState.links.filter(link => link.id !== linkId)
            }));
        }
    _handleFieldChange = field =>
        (ev) => {
            this.setState({
                [field]: ev.target.value
            });
        }
    _onValidate = field => (err) => {
        if (err) {
            console.log('form has errors!', err);
            return;
        }
        // validation passed
        if (field === 'akashaId') {
            console.log('check the existence on server of akashaId:', this.state.akashaId);
        }
    }

    _validateField = field =>
        () => {
            if (!this.showErrorOnFields.includes(field)) {
                this.showErrorOnFields.push(field);
            }
            this.props.validate(this._onValidate(field));
        };
    _getErrorMessages = (field) => {
        const { getValidationMessages } = this.props;
        if (this.showErrorOnFields.includes(field)) {
            return getValidationMessages(field)[0];
        }
        return null;
    }
    render () {
        const { intl, muiTheme, expandOptionalDetails } = this.props;
        const floatLabelStyle = { color: muiTheme.palette.disabledColor };
        console.log(this.showErrorOnFields, 'showError');
        return (
          <div className="col-xs-12" style={{ padding: '0 24px' }}>
            <form
              action=""
              onSubmit={this.handleSubmit}
              className="row"
              ref={(profileForm) => { this.profileForm = profileForm; }}
            >
              <div className="col-xs-6 start-xs">
                <TextField
                  fullWidth
                  floatingLabelText="First Name"
                  value={this.state.firstName}
                  onChange={this._handleFieldChange('firstName')}
                  onBlur={this._validateField('firstName')}
                  errorText={this._getErrorMessages('firstName')}
                />
              </div>
              <div className="col-xs-6 end-xs">
                <TextField
                  fullWidth
                  floatingLabelText="Last Name"
                  value={this.state.lastName}
                  onChange={this._handleFieldChange('lastName')}
                  onBlur={this._validateField('lastName')}
                  errorText={this._getErrorMessages('lastName')}
                />
              </div>
              <div className="col-xs-12">
                <TextField
                  fullWidth
                  floatingLabelText="Akasha Id"
                  value={this.state.akashaId}
                  onChange={this._handleFieldChange('akashaId')}
                  onBlur={this._validateField('akashaId')}
                  errorText={this._getErrorMessages('akashaId')}
                />
              </div>
              <div className="col-xs-12">
                <TextField
                  fullWidth
                  floatingLabelText="Password"
                  value={this.state.password}
                  onChange={this._handleFieldChange('password')}
                  onBlur={this._validateField('password')}
                  errorText={this._getErrorMessages('password')}
                />
              </div>
              <div className="col-xs-12">
                <TextField
                  fullWidth
                  floatingLabelText="Confirm Password"
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
                      minWidth={320}
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
                      floatingLabelStyle={floatLabelStyle}
                      onChange={this._handleAboutChange}
                    />
                  </div>
                  <h3 className="col-xs-10" style={{ margin: '20px 0 0 0' }}>
                    {intl.formatMessage(profileMessages.linksTitle)}
                  </h3>
                  <div className="col-xs-2 end-xs" style={{ margin: '16px 0 0 0' }}>
                    <IconButton
                      title={intl.formatMessage(profileMessages.addLinkButtonTitle)}
                      onClick={this._handleAddLink}
                    >
                      <SvgIcon>
                        <ContentAddIcon
                          color={muiTheme.palette.primary1Color}
                        />
                      </SvgIcon>
                    </IconButton>
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
                          onChange={this._handleLinkChange('title', link.id)}
                          errorText={link.error && link.error.title && 'Title cannot be empty'}
                          errorStyle={{ position: 'absolute', bottom: '-10px' }}
                        />
                        <TextField
                          fullWidth
                          floatingLabelText={intl.formatMessage(formMessages.url)}
                          value={link.url}
                          floatingLabelStyle={floatLabelStyle}
                          onChange={this._handleLinkChange('url', link.id)}
                          errorText={link.error && link.error.url && 'URL cannot be empty'}
                          errorStyle={{ position: 'absolute', bottom: '-10px' }}
                        />
                      </div>
                      <div className="col-xs-2 center-xs">
                        <IconButton
                          title={intl.formatMessage(profileMessages.removeLinkButtonTitle)}
                          style={{ marginTop: '24px' }}
                          onClick={this._handleRemoveLink(link.id)}
                        >
                          <SvgIcon>
                            <CancelIcon />
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
                onClick={this._submitForm}
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
    errors: PropTypes.shape(),
    expandOptionalDetails: PropTypes.bool,
    validate: PropTypes.func,
    isValid: PropTypes.func,
    getValidationMessages: PropTypes.func,
    clearValidations: PropTypes.func
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

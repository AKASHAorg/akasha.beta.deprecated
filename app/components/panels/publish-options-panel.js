import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Menu, Icon, Radio, Select, Input } from 'antd';
import { entryMessages, validationMessages } from '../../locale-data/messages';
import { ImageUploader } from '../';

const { Option } = Select;
const { TextArea } = Input;
const { SubMenu } = Menu;
const RadioGroup = Radio.Group;

class PublishOptionsPanel extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    shouldComponentUpdate (nextProps, nextState) {
        return nextProps.excerpt !== this.props.excerpt ||
            !nextProps.selectedLicence.equals(this.props.selectedLicence) ||
            !nextProps.featuredImage.equals(this.props.featuredImage) ||
            nextProps.errors.excerpt !== this.props.errors.excerpt ||
            nextState.scrolled !== this.state.scrolled;
    }

    _handleContentScroll = (ev) => {
        const scrollTop = ev.target.scrollTop;
        this.setState({
            scrolled: scrollTop > 0
        });
    }
    _handleLicenceChange = licenceType =>
        (value) => {
            if (licenceType === 'parent') {
                this.props.onLicenceChange(licenceType, value);
            } else if (licenceType === 'id') {
                this.props.onLicenceChange(licenceType, value.target.value);
            }
        }
    _handleExcerptChange = (ev) => {
        this.props.onExcerptChange(ev.target.value);
    }
    _handleFeaturedImageChange = (image) => {
        this.props.onFeaturedImageChange(image);
    }
    render () {
        const { intl, onClose, licences, selectedLicence, featuredImage,
            excerpt, baseUrl, errors } = this.props;
        console.log(this.props, 'some props');
        return (
          <div className="publish-options-panel">
            <div
              className={
                  `publish-options-panel__header
                  publish-options-panel__header${this.state.scrolled ? '_scrolled' : ''}`
              }
            >
              <div className="publish-options-panel__header-title">
                {intl.formatMessage(entryMessages.publishOptions)}
              </div>
              <div className="publish-options-panel__header-actions">
                <Button
                  icon="close"
                  onClick={onClose}
                  className="borderless"
                />
              </div>
            </div>
            <div
              className="publish-options-panel__content"
              onScroll={this._handleContentScroll}
            >
              <div className="publish-options-panel__licence-container">
                <h4 className="publish-options-panel__container-title">
                  {intl.formatMessage(entryMessages.license)}
                </h4>
                <Select
                  defaultValue={selectedLicence.parent}
                  style={{ width: '100%' }}
                  className="publish-options-panel__licence-select"
                  onChange={this._handleLicenceChange('parent')}
                >
                  {licences.filter(lic => !lic.parent).map(parentLicence =>
                    <Option key={parentLicence.get('id')}>{parentLicence.get('label')}</Option>
                  ).toIndexedSeq()}
                </Select>
                {(licences.filter(lic => lic.get('parent') === selectedLicence.parent).size > 0) &&
                  <RadioGroup
                    className="publish-options-panel__licence-radio-group"
                    onChange={this._handleLicenceChange('id')}
                    value={selectedLicence.id}
                  >
                      {licences.filter(lic => lic.get('parent') === selectedLicence.parent)
                        .map(childLic => (
                          <Radio
                            className="publish-options-panel__licence-radio"
                            key={childLic.id}
                            value={childLic.id}
                          >
                            {childLic.label}
                          </Radio>
                        )).toIndexedSeq()}
                  </RadioGroup>
                }
              </div>
              <div
                className="publish-options-panel__featured-image-container"
              >
                <h4
                  className="publish-options-panel__container-title"
                >
                  {intl.formatMessage(entryMessages.featuredImage)}
                </h4>
                <ImageUploader
                  baseUrl={baseUrl}
                  initialImage={featuredImage}
                  intl={intl}
                  onChange={this._handleFeaturedImageChange}
                  useIpfs
                />
                <small>{intl.formatMessage(entryMessages.allowedImageTypes)}</small>
              </div>
              <div
                className="publish-options-panel__excerpt-container"
              >
                <h4
                  className="publish-options-panel__container-title"
                >
                  {intl.formatMessage(entryMessages.excerpt)}
                </h4>
                <TextArea
                  ref={(node) => { this.textareaNode = node; }}
                  className="publish-options-panel__excerpt-textarea"
                  placeholder="Write a short summary"
                  autosize={{ minRows: 3 }}
                  onChange={this._handleExcerptChange}
                  value={excerpt}
                />
                {errors.excerpt &&
                  <small className="edit-entry-page__error-text">{errors.excerpt}</small>
                }
                {!errors.excerpt &&
                  <small>{intl.formatMessage(validationMessages.maxExcerptLength)}</small>
                }
              </div>
            </div>
          </div>
        );
    }
}

PublishOptionsPanel.propTypes = {
    baseUrl: PropTypes.string,
    errors: PropTypes.shape(),
    excerpt: PropTypes.string,
    intl: PropTypes.shape(),
    onClose: PropTypes.func,
    onLicenceChange: PropTypes.func,
    onExcerptChange: PropTypes.func,
    onFeaturedImageChange: PropTypes.func,
    featuredImage: PropTypes.shape(),
    licences: PropTypes.shape(),
    selectedLicence: PropTypes.shape()
};

export default PublishOptionsPanel;

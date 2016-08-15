import React from 'react';
import ReactDOM from 'react-dom';
import { TextField, RaisedButton } from 'material-ui';
import PanelContainer from 'shared-components/PanelContainer/panel-container';
import ImageUploader from 'shared-components/ImageUploader/image-uploader';
import LicenceDialog from 'shared-components/Dialogs/licence-dialog';
import TagsField from 'shared-components/TagsField/tags-field';
import licences from 'shared-components/Dialogs/licences';
import { convertFromRaw } from 'draft-js';

class PublishPanel extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isLicencingOpen: false,
            title: '',
            content: {},
            excerpt: '',
            tags: [],
            licence: '',
            featuredImage: []
        };
    }
    componentWillMount () {
        if (this.props.draft) {
            this._setWorkingDraft(this.props.draft);
        }
    }
    componentDidMount () {
        const panelSize = ReactDOM.findDOMNode(this).getBoundingClientRect();
        this.panelSize = panelSize;
    }
    _setWorkingDraft = (draft) => {
        const { title, content, tags, licence, featuredImage, id } = draft;
        let { excerpt } = draft;
        if (!excerpt) {
            excerpt = convertFromRaw(content).getPlainText()
                .slice(0, 120)
                .replace(/\r?\n|\r/g, '');
        }
        return this.setState({
            id,
            title,
            content,
            excerpt,
            tags,
            licence,
            featuredImage
        });
    };
    _handleLicenceDialogClose = () => {
        this.setState({
            isLicencingOpen: false
        });
    };
    _handleLicenceFocus = () => {
        this.setState({
            isLicencingOpen: true
        });
    };
    _handleLicenceSet = (ev, selectedLicence) => {
        this.setState({
            licence: selectedLicence,
            isLicencingOpen: false
        }, () => {
            this._handleDraftUpdate(null, 'licence');
        });
    };
    _publishEntry = () => {
        const { entryState, params } = this.props;
        const draftToPublish = entryState.get('drafts').find(draft =>
        draft.id === parseInt(params.draftId, 10));
        this._handleDraftUpdate(null, 'featuredImage');
        console.log('publish entry', draftToPublish);
    };
    _handleTagAutocomplete = (value) => {
        const { entryActions } = this.props;
    };
    _checkTagExistence = (tag) => {
        const { entryActions } = this.props;
        const tags = this.state.tags;
        tags.forEach(tagName => {
            entryActions.checkTagExistence(tagName);
        });
    };
    _handleDraftUpdate = (ev, field) => {
        const { entryActions } = this.props;
        let fieldValue = this.state[field];
        if (field === 'tags') {
            fieldValue = this.tagsField.getTags();
        }
        if (field === 'featuredImage') {
            fieldValue = this.featuredImageUploader.getWrappedInstance().getImage()[0];
        }
        entryActions.updateDraft({
            id: this.state.id,
            [field]: fieldValue
        });
    };
    _getFeaturedImage = () => {
        const panelSize = this.panelSize;
        if (this.state.featuredImage) {
            const stateFeaturedImage = this.state.featuredImage.sort((a, b) => a.width - b.width);
            return {
                files: stateFeaturedImage,
                containerSize: panelSize
            };
        }
        return null;
    };
    render () {
        let selectedLicence;
        if (this.state.selectedLicence) {
            selectedLicence = this.state.selectedLicence;
        } else {
            selectedLicence = {
                mainLicence: licences.find(lic => lic.id === '1'),
                subLicence: null,
                isDefault: false
            };
        }
        const licenceDescription = selectedLicence.mainLicence.description.map((descr, key) =>
          <span key={key}>{descr.text}</span>
        );
        const { tags } = this.props.draft;
        const existingTags = this.props.tagState.get('tags');
        return (
          <PanelContainer
            showBorder
            title="Publish a New Entry"
            style={{ left: '50%', marginLeft: '-320px', position: 'absolute', top: 0, bottom: 0 }}
            actions={[
              <RaisedButton
                key="cancel"
                label="Later"
                onTouchTap={this._handleCancelButton}
              />,
              <RaisedButton
                key="publish"
                label="Publish"
                primary
                style={{ marginLeft: 8 }}
                onTouchTap={this._publishEntry}
              />
            ]}
          >
            <LicenceDialog
              isOpen={this.state.isLicencingOpen}
              defaultSelected="1"
              onRequestClose={this._handleLicenceDialogClose}
              onDone={this._handleLicenceSet}
              licences={licences}
            />
            <div className="col-xs-12">
              <div className="col-xs-12 field">
                <small>Title shown in preview</small>
                <TextField
                  name="title"
                  fullWidth
                  value={this.state.title}
                  onChange={(ev) => this.setState({ title: ev.target.value })}
                  onBlur={(ev) => this._handleDraftUpdate(ev, 'title')}
                />
              </div>
              <div className="col-xs-12 field">
                <small>Featured Image</small>
                <ImageUploader
                  ref={(featuredImageUploader) => {
                      this.featuredImageUploader = featuredImageUploader;
                  }}
                  dialogTitle={'Add a featured image'}
                  initialImage={this._getFeaturedImage()}
                />
              </div>
              <div className="col-xs-12 field">
                <small>Tags</small>
                <TagsField
                  tags={tags}
                  existingTags={existingTags}
                  ref={(tagsField) => this.tagsField = tagsField}
                  onRequestTagAutocomplete={this._handleTagAutocomplete}
                  onTagAdded={this._checkTagExistence}
                  onBlur={(ev) => this._handleDraftUpdate(ev, 'tags')}
                  fullWidth
                />
              </div>
              <div className="col-xs-12 field">
                <small>Excerpt shown in preview</small>
                <TextField
                  name="excerpt"
                  multiLine
                  fullWidth
                  value={this.state.excerpt}
                  onChange={(ev) => this.setState({ excerpt: ev.target.value })}
                  onBlur={(ev) => this._handleDraftUpdate(ev, 'excerpt')}
                />
              </div>
              <div className="col-xs-12 field">
                <small>Licence</small>
                <TextField
                  name="licence"
                  fullWidth
                  onFocus={this._handleLicenceFocus}
                  errorText={licenceDescription}
                  errorStyle={{ color: '#DDD' }}
                  value={selectedLicence.mainLicence.label}
                />
              </div>
              <div className="col-xs-12 field" style={{ marginBottom: 24 }}>
                <small>
                  By proceeding to publish this entry, you agree with the
                  <b> 0.005 ETH</b> fee which will be deducted from your
                  <b> 0.02 ETH</b> balance.
                </small>
              </div>
            </div>
          </PanelContainer>
        );
    }
}
PublishPanel.propTypes = {
    width: React.PropTypes.string,
    entryState: React.PropTypes.object,
    entryActions: React.PropTypes.object,
    draft: React.PropTypes.object
};
export default PublishPanel;

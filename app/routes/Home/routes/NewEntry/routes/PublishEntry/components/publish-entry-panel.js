import React from 'react';
import ReactDOM from 'react-dom';
import { TextField, RaisedButton } from 'material-ui';
import PanelContainer from 'shared-components/PanelContainer/panel-container';
import ImageUploader from 'shared-components/ImageUploader/image-uploader';
import LicenceDialog from 'shared-components/Dialogs/licence-dialog';
import TagsField from 'shared-components/TagsField/tags-field';
import licences from 'shared-components/Dialogs/licences';
import { convertFromRaw } from 'draft-js';
import { TagService } from 'local-flux/services';

class PublishPanel extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isLicencingOpen: false,
            title: '',
            content: {},
            excerpt: '',
            tags: [],
            existingTags: [],
            licence: '',
            featuredImage: []
        };
    }
    componentWillMount () {
        const { drafts, params } = this.props;
        const currentDraft = drafts.find(draft => draft.id === params.draftId);
        console.log(drafts, currentDraft, params.draftId);
    }
    componentDidMount () {
        const panelSize = ReactDOM.findDOMNode(this).getBoundingClientRect();
        this.panelSize = panelSize;
    }
    // _setWorkingDraft = (draft) => {
    //     const { content } = draft;
    //     let { excerpt } = draft;
    //     if (!excerpt) {
    //         excerpt = convertFromRaw(content).getPlainText()
    //             .slice(0, 120)
    //             .replace(/\r?\n|\r/g, '');
    //     }
    //     draft = draft.set('excerpt', excerpt);
    //     if (draft.tags && draft.tags.length > 0) {
    //         this._checkExistingTags(draft.tags);
    //     }
    //     return this.setState({
    //         ...draft.toJS()
    //     });
    // };
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
        const { draftActions, profileState, entryBundleActions } = this.props;
        const loggedProfile = profileState.get('loggedProfile');
        this._handleDraftUpdate(null, 'featuredImage');
        const {
            title,
            content,
            excerpt,
            tags,
            licence,
            featuredImage,
        } = this.state;
        const tagsToRegister = tags.filter(tag => this.state.existingTags.indexOf(tag) === -1);
        console.log(tagsToRegister, 'tagsToRegister')
        const draftId = parseInt(this.props.params.draftId, 10);
        const router = this.context.router;
        draftactions.updateDraft({
            id: draftId,
            publishing: true
        }).then(() => {
            if (tagsToRegister.length > 0) {
                router.push(`/${loggedProfile.get('userName')}/draft/${draftId}/publish-tags`);
            } else {
                router.push(`/${loggedProfile.get('userName')}/draft/${draftId}/publish-status`);
            }
        });
    };
    _handleTagAutocomplete = (value) => {
        const { tagActions } = this.props;
    };
    _handleTagAdd = (tag) => {
        const newTags = this.state.tags.slice();
        newTags.push(tag);
        this.setState({
            tags: newTags
        }, () => {
            this._checkExistingTags(newTags);
        });
        this._handleDraftUpdate(null, 'tags');
    };
    _handleTagDelete = (index) => {
        const currentTags = this.state.tags.slice();
        currentTags.splice(index, 1);
        this.setState({
            tags: currentTags
        }, () => {
            this._handleDraftUpdate(null, 'tags');
        });
    };
    _handleDraftUpdate = (ev, field) => {
        const { draftActions } = this.props;
        const fieldValue = this.state[field];
        draftActions.updateDraft({
            id: parseInt(this.props.params.draftId, 10),
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
    _checkExistingTags = (tags) => {
        const tagService = new TagService();
        tagService.checkExistingTags(tags).then(results => {
            const existingTags = results.map((tag) => {
                if (tag[0] && tag[0].tag) {
                    return tag[0].tag;
                }
                return null;
            }).filter(tag => tag !== null);
            this.setState({
                existingTags
            });
        });
    };
    render () {
        const { tags } = this.state;
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
        return (
          <PanelContainer
            showBorder
            title="Publish a New Entry"
            style={{
                left: '50%',
                marginLeft: '-320px',
                position: 'absolute',
                top: 0,
                bottom: 0,
                zIndex: 16
            }}
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
              defaultSelected={selectedLicence}
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
                  existingTags={this.state.existingTags}
                  ref={(tagsField) => this.tagsField = tagsField}
                  onRequestTagAutocomplete={this._handleTagAutocomplete}
                  onTagAdded={this._handleTagAdd}
                  onDelete={this._handleTagDelete}
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
PublishPanel.contextTypes = {
    router: React.PropTypes.object
};
export default PublishPanel;

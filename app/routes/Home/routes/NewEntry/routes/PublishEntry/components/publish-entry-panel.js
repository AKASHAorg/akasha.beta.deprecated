import React from 'react';
import ReactDOM from 'react-dom';
import { TextField, RaisedButton } from 'material-ui';
import PanelContainer from 'shared-components/PanelContainer/panel-container';
import ImageUploader from 'shared-components/ImageUploader/image-uploader';
import LicenceDialog from 'shared-components/Dialogs/licence-dialog';
import TagsField from 'shared-components/TagsField/tags-field';
import licences from 'shared-components/Dialogs/licences';
import { TagService } from 'local-flux/services';

class PublishPanel extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isLicencingOpen: false,
            title: '',
            content: null,
            excerpt: '',
            tags: [],
            existingTags: [],
            licence: null,
            featuredImage: []
        };
    }
    componentWillMount () {
        const currentDraft = this._findCurrentDraft(this.props.drafts);
        if (!currentDraft) {
            this.setState({
                fetchingDraft: true
            });
        }
    }
    componentDidMount () {
        const panelSize = ReactDOM.findDOMNode(this).getBoundingClientRect();
        this.panelSize = panelSize;
    }
    componentWillReceiveProps (nextProps) {
        const currentDraft = this._findCurrentDraft(nextProps.drafts);
        console.log(currentDraft, nextProps.drafts);
        if (currentDraft) {
            this.setState({
                featchingDraft: false
            }, () => this._populateDraft(currentDraft));
        }
    }
    _populateDraft = (draft) => {
        console.log('populate', draft);
        const { title, content, excerpt, tags, licence, featuredImage } = draft;
        this.setState({
            title,
            content,
            excerpt,
            tags,
            licence,
            featuredImage
        });
    }
    _findCurrentDraft = (drafts) => {
        const { params } = this.props;
        return drafts.find(draft => draft.id === parseInt(params.draftId, 10));
    }
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
            // this._handleDraftUpdate(null, 'licence');
        });
    };
    _publishEntry = () => {
        const { draftActions, profileState } = this.props;
        const loggedProfile = profileState.get('loggedProfile');
        // this._handleDraftUpdate(null, 'featuredImage');
        const {
            title,
            content,
            excerpt,
            tags,
            licence,
            featuredImage,
        } = this.state;
        const tagsToRegister = tags.filter(tag => this.state.existingTags.indexOf(tag) === -1);
        const draftId = parseInt(this.props.params.draftId, 10);
        const router = this.context.router;
        draftActions.updateDraft({
            id: draftId,
            title,
            content,
            excerpt,
            licence,
            featuredImage,
            status: {
                currentAction: 'confirmPublish',
                mustRegisterTags: (tagsToRegister.length > 0),
                publishingConfirmed: false
            }
        }).then(() => {
            router.push(`/${loggedProfile.get('userName')}/draft/${draftId}/publish-status`);
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
        this._handleDraftUpdate('tags', newTags);
    };
    _handleTagDelete = (index) => {
        const currentTags = this.state.tags.slice();
        currentTags.splice(index, 1);
        this.setState({
            tags: currentTags
        }, () => {
            this._handleDraftUpdate('tags', currentTags);
        });
    };
    _handleDraftUpdate = (field, value) => {
        const { draftActions, params } = this.props;
        draftActions.updateDraft({
            id: parseInt(params.draftId, 10),
            [field]: value
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
        tags.forEach((tag) => {
            tagService.checkExistingTags(tag, ({ data }) => {
                const existingTags = this.state.existingTags.slice();
                if (data.exists) {
                    this.setState({
                        existingTags: existingTags.push(tag)
                    });
                }
            });
        });
    };
    _handleCancelButton = () => {
        const { params } = this.props;
        this.context.router.push(`/${params.username}/draft/${params.draftId}`);
    }
    _getSelectedLicence = () => {
        if (this.state.selectedLicence) {
            return this.state.selectedLicence;
        }
        return {
            mainLicence: licences.find(lic => lic.id === '1'),
            subLicence: null,
            isDefault: false
        };
    }
    render () {
        const { tags } = this.state;
        const selectedLicence = this._getSelectedLicence();
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
                /* eslint-disable */
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
              /* eslint-enable */
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
                  value={this.state.title || ''}
                  onChange={ev => this.setState({ title: ev.target.value })}
                  onBlur={ev => this._handleDraftUpdate('title', ev.target.value)}
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
                  ref={(tagsField) => { this.tagsField = tagsField; }}
                  onRequestTagAutocomplete={this._handleTagAutocomplete}
                  onTagAdded={this._handleTagAdd}
                  onDelete={this._handleTagDelete}
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
                  onChange={ev => this.setState({ excerpt: ev.target.value })}
                  onBlur={ev => this._handleDraftUpdate('excerpt', ev.target.value)}
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
    drafts: React.PropTypes.shape(),
    params: React.PropTypes.shape(),
    draftActions: React.PropTypes.shape(),
    tagActions: React.PropTypes.shape()
};
PublishPanel.contextTypes = {
    router: React.PropTypes.shape()
};
export default PublishPanel;

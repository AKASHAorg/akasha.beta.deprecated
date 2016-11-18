import React from 'react';
import ReactDOM from 'react-dom';
import { TextField, RaisedButton } from 'material-ui';
import { injectIntl } from 'react-intl';
import PanelContainer from 'shared-components/PanelContainer/panel-container';
import ImageUploader from 'shared-components/ImageUploader/image-uploader';
import LicenceDialog from 'shared-components/Dialogs/licence-dialog';
import TagsField from 'shared-components/TagsField/tags-field';
import { TagService } from 'local-flux/services';
import { convertFromRaw } from 'draft-js';
import { findBestMatch } from 'utils/imageUtils';

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
            featuredImage: {},
            fetchingDraft: true,
            validationErrors: []
        };
    }
    componentWillMount () {
        const { entryActions } = this.props;
        entryActions.getLicences();
    }
    componentDidMount () {
        const panelSize = ReactDOM.findDOMNode(this).getBoundingClientRect();
        this.panelSize = panelSize;
    }
    componentWillReceiveProps (nextProps) {
        const { draft, params, pendingTags } = nextProps;
        const loggedProfileData = this._getLoggedProfileData();
        if (draft && draft.get('status').currentAction === 'confirmPublish') {
            this.context.router.push(`/${loggedProfileData.get('akashaId')}/draft/${params.draftId}/publish-status`);
        }
        if (draft) {
            if (pendingTags.size < this.props.pendingTags.size) {
                this._checkExistingTags(draft.tags);
            }
            if (this.state.fetchingDraft) {
                this.setState({
                    fetchingDraft: false
                }, () => {
                    this._populateDraft(draft);
                });
            }
        }
    }

    _populateDraft = (draft) => {
        const { content, licence, excerpt } = draft;
        let { title, tags, featuredImage } = draft;
        const contentMap = convertFromRaw(content);
        const blockMap = contentMap.getBlockMap();
        if (!title) {
            title = this._generateTitle(blockMap);
        }
        if (!featuredImage) {
            featuredImage = this._generateFeaturedImage(blockMap);
        }
        if (typeof tags.toJS === 'function') {
            tags = tags.toJS();
        }
        if (tags && tags.length > 0) {
            this._checkExistingTags(tags);
        }
        this.setState({
            title,
            content,
            excerpt,
            tags,
            licence,
            featuredImage
        });
    }
    _getLoggedProfileData = () => {
        const { loggedProfile, profiles } = this.props;
        return profiles.find(prf =>
            prf.get('profile') === loggedProfile.get('profile'));
    }
    _generateTitle = blockMap =>
        blockMap.find(block => block.text !== '').text;

    _generateFeaturedImage = (blockMap) => {
        const imageBlock = blockMap.find(block =>
            block.type === 'atomic' && block.data.get('type') === 'image');

        if (imageBlock) return imageBlock.data.get('files');
        return null;
    }
    _findImageSource = (imageFiles) => {
        // @TODO move this to a config file
        const recommendedFeaturedImageWidth = '640';
        const imageObject = findBestMatch(recommendedFeaturedImageWidth, imageFiles);
        return imageObject.src;
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
            this._handleDraftUpdate('licence', selectedLicence);
        });
    };
    _publishEntry = () => {
        const { draftActions, profiles, loggedProfile } = this.props;
        const loggedProfileData = profiles.find(prf =>
            prf.get('profile') === loggedProfile.get('profile'));

        const draftId = parseInt(this.props.params.draftId, 10);
        this.setState({
            validationErrors: []
        });
        this._validateEntry(({ title, content, excerpt, licence, featuredImage }) => {
            if (featuredImage) {
                featuredImage = this._findImageSource(featuredImage);
            }
            draftActions.updateDraft({
                id: draftId,
                title,
                content,
                excerpt,
                licence,
                featuredImage,
                profile: loggedProfileData.get('profile'),
                status: {
                    currentAction: 'confirmPublish',
                    publishing: true,
                    publishingConfirmed: false
                }
            });
        });
    };
    _validateEntry = (cb) => {
        const {
            title,
            content,
            excerpt,
            licence,
            featuredImage,
            tags
        } = this.state;
        const validationErrors = this.state.validationErrors.slice();
        if (!title || title === '') {
            validationErrors.push({
                field: 'title',
                error: 'Title must not be empty'
            });
        }
        if (!tags || tags.length === 0) {
            validationErrors.push({
                field: 'tags',
                error: 'You must add at least 1 tag'
            });
        }
        if (!licence) {
            validationErrors.push({
                field: 'licence',
                error: 'Please review the licence'
            });
        }
        if (!excerpt || excerpt.length < '60') {
            validationErrors.push({
                field: 'excerpt',
                error: 'Please provide a longer excerpt'
            });
        }
        if (validationErrors.length > 0) {
            return this.setState({
                validationErrors
            });
        }
        console.log(validationErrors, 'draft has errors?');
        return cb({ title, content, excerpt, licence, featuredImage, tags });
    }
    // _handleTagAutocomplete = (value) => {
    //     const { tagActions } = this.props;
    // };
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
        const { tagActions, pendingTags } = this.props;
        const currentTags = this.state.tags.slice();
        const tag = currentTags[index];
        currentTags.splice(index, 1);
        this.setState({
            tags: currentTags
        }, () => {
            const pendingTag = pendingTags.find(tagObj => tagObj.tag === tag);
            const erroredTag = pendingTags.filter(tags => typeof tags.error === 'object')
                                         .find(tagObj => tagObj.error.from.tagName === tag);
            if (erroredTag) {
                tagActions.deletePendingTag({ tag: erroredTag.error.from.tagName });
            }
            if (!erroredTag && pendingTag) {
                tagActions.deletePendingTag(pendingTag);
            }
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
            return {
                files: this.state.featuredImage,
                containerSize: panelSize
            };
        }
        return null;
    };
    _checkExistingTags = (tags) => {
        const tagService = new TagService();
        let tagsPromise = Promise.resolve();
        tags.forEach((tag) => {
            tagsPromise = tagsPromise.then(prevData =>
                new Promise((resolve, reject) => {
                    tagService.checkExistingTags(tag, (ev, { data, error }) => {
                        if (error) {
                            return reject(error);
                        }
                        if (prevData) {
                            return resolve(prevData.concat([{ tag, exists: data.exists }]));
                        }
                        return resolve([{ tag, exists: data.exists }]);
                    });
                })
            );
        });
        return tagsPromise.then(results =>
            this.setState({
                existingTags: results.filter(tagObj => tagObj.exists).map(tag => tag.tag)
            }, () => {
                tagService.removeExistsListeners();
            })
        );
    };
    _handleCancelButton = () => {
        const { params } = this.props;
        this.context.router.push(`/${params.akashaId}/draft/${params.draftId}`);
    }
    _getSelectedLicence = () => {
        const { licences } = this.props;
        if (this.state.licence) {
            return this.state.licence;
        }
        if (licences.size === 0) {
            return null;
        }
        return {
            mainLicence: licences.find(lic => lic.id === '1'),
            subLicence: null,
            isDefault: false
        };
    }
    _handleTagRegisterRequest = (tag) => {
        const { loggedProfile, tagActions } = this.props;
        // 1. verify that tag is not in pending state
        // 2. put tag in pending state after confirm dialog
        // 3. check login is valid
        // 4. send tag registration
        // 5. add tx to queue
        // 6. watch for mined tx
        // 7. remove tag from pending state
        tagActions.createPendingTag({
            tag,
            tx: null,
            profile: loggedProfile.get('profile'),
            minGas: 2000000,
            publishConfirmed: false
        });
    }
    _getLicenceMeta = () => {
        const { licences } = this.props;
        const { licence } = this.state;
        if (licences.size === 0) {
            return {
                description: [],
                label: 'loading licences...'
            };
        }
        if (!licence) {
            return {
                label: licences.find(licenceObj => licenceObj.id === '1').label,
                description: []
            };
        }
        return {
            label: licences.find(licenceObj => licenceObj.id === licence.parent).label,
            description: licences.find(licenceObj => licenceObj.id === licence.id).description
        };
    }
    render () {
        const { tags, validationErrors, existingTags } = this.state;
        const { pendingTags, licences } = this.props;
        return (
          <PanelContainer
            showBorder
            title="Publish a New Entry"
            style={{
                left: '50%',
                marginLeft: '-320px',
                position: 'fixed',
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
                disabled={(pendingTags.size > 0)}
                style={{ marginLeft: 8 }}
                onTouchTap={this._publishEntry}
              />
              /* eslint-enable */
            ]}
          >
            <LicenceDialog
              isOpen={this.state.isLicencingOpen}
              defaultSelected={this.state.licence}
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
                  errorText={
                      validationErrors.filter(ve => ve.field === 'title')
                            .map(err => `${err.error}`).join('')
                  }
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
                  pendingTags={pendingTags}
                  ref={(tagsField) => { this.tagsField = tagsField; }}
                  onRequestTagAutocomplete={this._handleTagAutocomplete}
                  onTagAdded={this._handleTagAdd}
                  onDelete={this._handleTagDelete}
                  onTagRegisterRequest={this._handleTagRegisterRequest}
                  fullWidth
                  errorText={
                      validationErrors.filter(ve => ve.field === 'tags')
                            .map(err => `${err.error}`).join('')
                  }
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
                  errorText={
                      validationErrors.filter(ve => ve.field === 'excerpt')
                            .map(err => `${err.error}`).join('')
                  }
                />
              </div>
              <div className="col-xs-12 field">
                <small>Licence</small>
                <TextField
                  name="licence"
                  fullWidth
                  onFocus={this._handleLicenceFocus}
                  errorText={this._getLicenceMeta().description.map((descr, key) =>
                    <span key={key}>{descr.text}</span>
                  )}
                  errorStyle={{ color: '#DDD' }}
                  value={this._getLicenceMeta().label}
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
    params: React.PropTypes.shape(),
    draftActions: React.PropTypes.shape(),
    tagActions: React.PropTypes.shape(),
    profiles: React.PropTypes.shape(),
    loggedProfile: React.PropTypes.shape(),
    pendingTags: React.PropTypes.shape(),
    entryActions: React.PropTypes.shape(),
    licences: React.PropTypes.shape(),
    intl: React.PropTypes.shape()
};
PublishPanel.contextTypes = {
    router: React.PropTypes.shape()
};
export default injectIntl(PublishPanel);

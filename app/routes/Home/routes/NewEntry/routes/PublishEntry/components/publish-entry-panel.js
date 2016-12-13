import React from 'react';
import { TextField, RaisedButton } from 'material-ui';
import { injectIntl } from 'react-intl';
/* eslint import/no-unresolved: 0, import/extensions: 0 */
import PanelContainer from 'shared-components/PanelContainer/panel-container';
import ImageUploader from 'shared-components/ImageUploader/image-uploader';
import LicenceDialog from 'shared-components/Dialogs/licence-dialog';
import TagsField from 'shared-components/TagsField/tags-field';
import { TagService } from 'local-flux/services';
import { findBestMatch } from 'utils/imageUtils';
import { convertFromRaw } from 'draft-js';

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
    componentDidMount () {
        this.panelSize = this.container.getBoundingClientRect();
        document.body.style.overflow = 'hidden';
    }
    componentWillReceiveProps (nextProps) {
        const { draft, params } = nextProps;
        const loggedProfileData = this._getLoggedProfileData();
        if (draft && draft.getIn(['status', 'publishing'])) {
            this.context.router.push(`/${loggedProfileData.get('akashaId')}/draft/${params.draftId}/publish-status`);
        } else if (draft && !draft.getIn(['status', 'publishing'])) {
            this._populateDraft(draft);
            if (this.state.fetchingDraft) {
                this.setState({
                    fetchingDraft: false
                });
            }
        }
    }
    componentWillUnmount () {
        document.body.style.overflow = 'initial';
    }
    _populateDraft = (draft) => {
        const { content, licence, excerpt, tags, wordCount } = draft;
        let { title, featuredImage } = draft;
        const contentMap = convertFromRaw(content.toJS());
        const blockMap = contentMap.getBlockMap();
        const tagsHaveChanged = (draft && !this.props.draft) ||
            (tags && this.props.draft && !tags.equals(this.props.draft.tags));
        if (!featuredImage) {
            featuredImage = this._generateFeaturedImage(blockMap);
        }
        if (tags && tags.size > 0 && tags.size > this.state.tags.length && tagsHaveChanged) {
            this._checkExistingTags(tags);
        }
        this.setState({
            title,
            content,
            excerpt,
            tags: tags ? tags.toJS() : [],
            licence,
            featuredImage,
            wordCount
        });
    }
    _getLoggedProfileData = () => {
        const { loggedProfile, profiles } = this.props;
        return profiles.find(prf =>
            prf.get('profile') === loggedProfile.get('profile'));
    }

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
        const { draftActions, appActions, profiles, loggedProfile } = this.props;
        const loggedProfileData = profiles.find(prf =>
            prf.get('profile') === loggedProfile.get('profile'));

        const draftId = parseInt(this.props.params.draftId, 10);
        this.setState({
            validationErrors: []
        });
        this._validateEntry(({
            title,
            content,
            excerpt,
            licence,
            featuredImage,
            tags,
            wordCount }) => {
            if (featuredImage) {
                featuredImage = this._findImageSource(featuredImage);
            }
            const cleanDraft = {
                id: draftId,
                title,
                content,
                excerpt,
                licence,
                featuredImage,
                tags,
                wordCount,
                profile: loggedProfileData.get('profile'),
                status: {
                    publishing: true
                }
            };
            draftActions.updateDraft(cleanDraft);
            appActions.addPendingAction({
                type: 'publishEntry',
                payload: cleanDraft,
                titleId: 'publishEntryTitle',
                messageId: 'publishEntry',
                gas: 4000000,
                status: 'needConfirmation'
            });
        });
    };
    _validateEntry = (cb) => {
        const {
            tags,
            title,
            content,
            excerpt,
            licence,
            featuredImage,
            existingTags,
            wordCount
        } = this.state;
        const validationErrors = this.state.validationErrors.slice();
        if (!title || title === '') {
            validationErrors.push({
                field: 'title',
                error: 'Title must not be empty'
            });
        }
        if (!existingTags || existingTags.length === 0) {
            validationErrors.push({
                field: 'tags',
                error: 'You must add at least 1 valid tag'
            });
        }
        if (existingTags && existingTags.length !== tags.length) {
            validationErrors.push({
                field: 'tags',
                error: 'You have unregistered tags. Please either remove or register them.'
            });
        }
        if (!licence) {
            validationErrors.push({
                field: 'licence',
                error: 'Please review the licence'
            });
        }
        if (!excerpt || excerpt.length < 60) {
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
        return cb({
            title,
            content,
            excerpt,
            licence,
            featuredImage,
            tags,
            wordCount
        });
    }
    _handleTagAdd = (tag) => {
        const newTags = [...this.state.tags, tag];
        this.setState({
            tags: newTags
        }, () => {
            this._checkExistingTags(newTags);
            this._handleDraftUpdate('tags', this.state.tags);
        });
    };
    _handleTagDelete = (index) => {
        const { tagActions, pendingTags } = this.props;
        const currentTags = [...this.state.tags];
        const tag = currentTags[index];
        currentTags.splice(index, 1);
        this.setState({
            tags: currentTags,
            existingTags: this.state.existingTags.filter(tg => tg !== tag),
            validationErrors: this.state.validationErrors.filter(err => err.field !== 'tags')
        }, () => {
            // const pendingTag = pendingTags.find(tagObj => tagObj.tag === tag);
            // const erroredTag = pendingTags.filter(tags => typeof tags.error === 'object')
            //                              .find(tagObj => tagObj.error.from.tagName === tag);
            // if (erroredTag) {
            //     tagActions.deletePendingTag({ tag: erroredTag.error.from.tagName });
            // }
            // if (!erroredTag && pendingTag) {
            //     tagActions.deletePendingTag(pendingTag);
            // }
            this._handleDraftUpdate('tags', this.state.tags);
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
        const panelSize = this.panelSize || { width: 550 };
        if (this.state.featuredImage) {
            return {
                files: this.state.featuredImage,
                containerSize: panelSize
            };
        }
        return null;
    };
    _checkExistingTags = (tags) => {
        this.setState({
            checkingTags: true
        }, () => {
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
                                return resolve(prevData.concat([data]));
                            }
                            return resolve([data]);
                        });
                    })
                );
            });
            return tagsPromise.then((results) => {
                const existingTags = results.filter(tagObj => tagObj.exists).map(tag => tag.tagName);
                this.setState({
                    existingTags,
                    checkingTags: false,
                    validationErrors: existingTags.length ?
                        this.state.validationErrors.filter(err => err.field !== 'tags') :
                        this.state.validationErrors
                }, () => {
                    tagService.removeExistsListeners();
                });
            });
        });
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
    _handleTagRegisterRequest = (tagName) => {
        const { tagActions } = this.props;
        // 1. verify that tag is not in pending state
        // 2. put tag in pending state after confirm dialog
        // 3. check login is valid
        // 4. send tag registration
        // 5. add tx to queue
        // 6. watch for mined tx
        // 7. remove tag from pending state
        tagActions.addRegisterTagAction(tagName);
    }
    _handleTitleChange = (ev) => {
        this.setState({
            title: ev.target.value,
            validationErrors: this.state.validationErrors.filter(err => err.field !== 'title')
        });
    };
    _handleExcerptChange = (ev) => {
        this.setState({
            excerpt: ev.target.value,
            validationErrors: this.state.validationErrors.filter(err => err.field !== 'excerpt')
        });
    };
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
        const { registerPending, licences } = this.props;
        return (
          <div ref={(container) => { this.container = container; }} className="mdfckr-container">
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
                <RaisedButton // eslint-disable-line indent
                  key="cancel"
                  label="Later"
                  onTouchTap={this._handleCancelButton}
                />,
                <RaisedButton // eslint-disable-line indent
                  key="publish"
                  label="Publish"
                  primary
                  disabled={(registerPending.size > 0)}
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
                    onChange={this._handleTitleChange}
                    onBlur={ev => this._handleDraftUpdate('title', ev.target.value)}
                    errorText={
                        validationErrors.filter(ve => ve.field === 'title')
                              .map(err => `${err.error}`)[0]
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
                    checkExistingTags={this._checkExistingTags}
                    existingTags={existingTags}
                    registerPending={registerPending}
                    ref={(tagsField) => { this.tagsField = tagsField; }}
                    onRequestTagAutocomplete={this._handleTagAutocomplete}
                    onTagAdded={this._handleTagAdd}
                    onDelete={this._handleTagDelete}
                    onTagRegisterRequest={this._handleTagRegisterRequest}
                    fullWidth
                    errorText={
                        validationErrors.filter(ve => ve.field === 'tags')
                              .map(err => `${err.error}`)[0]
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
                    onChange={this._handleExcerptChange}
                    onBlur={ev => this._handleDraftUpdate('excerpt', ev.target.value)}
                    errorText={
                        validationErrors.filter(ve => ve.field === 'excerpt')
                              .map(err => `${err.error}`)[0]
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
                    <b> 0.005 AETH</b> fee which will be deducted from your
                    <b> 0.02 AETH</b> balance.
                  </small>
                </div>
              </div>
            </PanelContainer>
          </div>
        );
    }
}
PublishPanel.propTypes = {
    params: React.PropTypes.shape(),
    draftActions: React.PropTypes.shape(),
    tagActions: React.PropTypes.shape(),
    profiles: React.PropTypes.shape(),
    loggedProfile: React.PropTypes.shape(),
    registerPending: React.PropTypes.shape(),
    entryActions: React.PropTypes.shape(),
    licences: React.PropTypes.shape(),
    appActions: React.PropTypes.shape(),
    intl: React.PropTypes.shape()
};
PublishPanel.contextTypes = {
    router: React.PropTypes.shape()
};
export default injectIntl(PublishPanel);

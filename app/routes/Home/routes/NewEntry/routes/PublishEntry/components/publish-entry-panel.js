import React from 'react';
import { TextField, RaisedButton } from 'material-ui';
import { injectIntl } from 'react-intl';
/* eslint import/no-unresolved: 0, import/extensions: 0 */
import PanelContainer from 'shared-components/PanelContainer/panel-container';
import LicenceDialog from 'shared-components/Dialogs/licence-dialog';
import TagsField from 'shared-components/TagsField/tags-field';
import { TagService } from 'local-flux/services';

class PublishPanel extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isLicencingOpen: false,
            draft: null,
            fetchingDraft: true,
            validationErrors: [],
            existingTags: [],
            checkingTags: false
        };
        this.tagService = new TagService();
    }
    componentDidMount () {
        if (this.container) {
            this.panelSize = this.container.getBoundingClientRect();
        }
        if (this.props.draft) {
            this._populateDraft(this.props.draft);
            if (this.props.draft.get('tags').size && !this.state.checkingTags) {
                this._checkExistingTags(this.props.draft.get('tags'));
            }
        }
        document.body.style.overflow = 'hidden';
    }
    componentWillReceiveProps (nextProps) {
        const { draft } = nextProps;
        if (draft && !draft.equals(this.props.draft)) {
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
        const tags = draft.get('tags');
        if (tags && tags.size > 0 && !this.state.checkingTags) {
            this._checkExistingTags(tags);
        }
        this.setState({
            draft
        });
    };

    _getLoggedProfileData = () => {
        const { loggedProfile, profiles } = this.props;
        return profiles.find(prf =>
            prf.get('profile') === loggedProfile.get('profile'));
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
    _handleLicenceSet = (ev, selectedLicence, isDefault) => {
        const { settingsActions, loggedProfile } = this.props;
        if (isDefault) {
            settingsActions.saveDefaultEntryLicence(loggedProfile.get('akashaId'), selectedLicence);
        }
        this.setState({
            draft: this.state.draft.mergeIn(['content', 'licence'], selectedLicence),
            isLicencingOpen: false
        }, () => {
            this._handleDraftUpdate({ content: { licence: selectedLicence } });
        });
    };
    _publishEntry = () => {
        const { draftActions, appActions } = this.props;
        this.setState({
            validationErrors: []
        });
        this._validateEntry(() => {
            draftActions.updateDraft(this.state.draft.toJS());
            appActions.addPendingAction({
                type: 'publishEntry',
                payload: {
                    title: this.state.draft.getIn(['content', 'title']),
                    draft: this.state.draft.toJS()
                },
                titleId: 'publishEntryTitle',
                messageId: 'publishEntry',
                gas: 4000000,
                status: 'needConfirmation'
            });
        });
    };
    _validateEntry = (cb) => {
        const { draft, existingTags } = this.state;
        const validationErrors = this.state.validationErrors.slice();
        if (!draft.getIn(['content', 'title']) || draft.getIn(['content', 'title']) === '') {
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
        if (existingTags && existingTags.length !== draft.get('tags').size) {
            validationErrors.push({
                field: 'tags',
                error: 'You have unregistered tags. Please either remove or register them.'
            });
        }
        if (!draft.getIn(['content', 'licence'])) {
            validationErrors.push({
                field: 'licence',
                error: 'Please review the licence'
            });
        }
        if (!draft.getIn(['content', 'excerpt']) || draft.getIn(['content', 'excerpt']).size < 35) {
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
        return cb();
    }
    _handleTagAdd = (tag) => {
        const newTags = this.state.draft.get('tags').push(tag);
        this.setState({
            draft: this.state.draft.setIn(['tags'], newTags)
        }, () => {
            this._checkExistingTags(newTags);
            this._handleDraftUpdate({ tags: this.state.draft.get('tags').toJS() });
        });
    };
    _handleTagDelete = (index) => {
        const tag = this.state.draft.getIn(['tags', index]);
        const newTags = this.state.draft.get('tags').delete(index);
        this.setState({
            draft: this.state.draft.set('tags', newTags),
            existingTags: this.state.existingTags.filter(tg => tg !== tag),
            validationErrors: this.state.validationErrors.filter(err => err.field !== 'tags')
        }, () => {
            this._handleDraftUpdate({ tags: this.state.draft.get('tags').toJS() });
        });
    };
    _handleDraftUpdate = (obj) => {
        const { draftActions, params } = this.props;
        draftActions.updateDraft({
            id: parseInt(params.draftId, 10),
            ...obj
        });
    };
    _checkExistingTags = (tags) => {
        this.setState({
            checkingTags: true
        }, () => {
            let tagsPromise = Promise.resolve();
            tags.forEach((tag) => {
                tagsPromise = tagsPromise.then(prevData =>
                    new Promise((resolve, reject) => {
                        this.tagService.checkExistingTags(tag, (ev, { data, error }) => {
                            if (error) {
                                return reject(error);
                            }
                            if (prevData) {
                                return resolve(prevData.concat([data]));
                            }
                            this.tagService.removeExistsListeners();
                            return resolve([data]);
                        });
                    })
                );
            });
            return tagsPromise.then((results) => {
                const existingTags = results.filter(tagObj => tagObj.exists)
                                            .map(tag => tag.tagName);
                this.setState({
                    existingTags,
                    checkingTags: false,
                    validationErrors: existingTags.length ?
                        this.state.validationErrors.filter(err => err.field !== 'tags') :
                        this.state.validationErrors
                });
            });
        });
    };
    _handleCancelButton = () => {
        const { params } = this.props;
        this.context.router.replace(`/${params.akashaId}/draft/${params.draftId}`);
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
            draft: this.state.draft.setIn(['content', 'title'], ev.target.value),
            validationErrors: this.state.validationErrors.filter(err => err.field !== 'title')
        });
    };
    _handleExcerptChange = (ev) => {
        this.setState({
            draft: this.state.draft.setIn(['content', 'excerpt'], ev.target.value),
            validationErrors: this.state.validationErrors.filter(err => err.field !== 'excerpt')
        });
    };
    _getLicenceMeta = () => {
        const { licences } = this.props;
        const licence = this.state.draft.getIn(['content', 'licence']);
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
            label: licence.parent ? licences.find(licenceObj =>
                licenceObj.id === licence.parent).label :
                    licences.find(licenceObj => licenceObj.id === licence.id).label,
            description: licence.id ?
                licences.find(licenceObj => licenceObj.id === licence.id).description :
                licences.find(licenceObj => licenceObj.id === licence.parent).label
        };
    }
    render () {
        const { draft, validationErrors, existingTags } = this.state;
        const { registerPending, licences } = this.props;
        if (!draft) {
            return <div>Loading</div>;
        }
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
                  style={{ marginLeft: 8 }}
                  onTouchTap={this._publishEntry}
                />
                /* eslint-enable */
              ]}
            >
              <LicenceDialog
                isOpen={this.state.isLicencingOpen}
                defaultSelected={this.state.draft.getIn(['content', 'licence']).toJS()}
                onRequestClose={this._handleLicenceDialogClose}
                onDone={this._handleLicenceSet}
                licences={licences}
              />
              <div className="col-xs-12" style={{ marginTop: 48 }}>
                <div className="col-xs-12" style={{ marginBottom: 32 }}>
                  <small>Title shown in preview</small>
                  <TextField
                    name="title"
                    fullWidth
                    value={this.state.draft.content.title || ''}
                    onChange={this._handleTitleChange}
                    onBlur={ev => this._handleDraftUpdate({ content: { title: ev.target.value } })}
                    errorText={
                        validationErrors.filter(ve => ve.field === 'title')
                              .map(err => `${err.error}`)[0]
                    }
                  />
                </div>
                {/* <div className="col-xs-12 field">
                  <small>Featured Image</small>
                  <ImageUploader
                    ref={(featuredImageUploader) => {
                        this.featuredImageUploader = featuredImageUploader;
                    }}
                    dialogTitle={'Add a featured image'}
                    initialImage={this._getFeaturedImage()}
                  />
                </div> */}
                <div className="col-xs-12" style={{ marginBottom: 32 }}>
                  <small>Tags</small>
                  <TagsField
                    tags={draft.get('tags') ? draft.get('tags').toJS() : []}
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
                <div className="col-xs-12" style={{ marginBottom: 32 }}>
                  <small>Excerpt shown in preview</small>
                  <TextField
                    name="excerpt"
                    multiLine
                    fullWidth
                    value={this.state.draft.content.excerpt}
                    onChange={this._handleExcerptChange}
                    onBlur={ev => this._handleDraftUpdate({
                        content: { excerpt: ev.target.value }
                    })}
                    errorText={
                        validationErrors.filter(ve => ve.field === 'excerpt')
                              .map(err => `${err.error}`)[0]
                    }
                  />
                </div>
                <div className="col-xs-12" style={{ marginBottom: 32 }}>
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
                {/** <div className="col-xs-12 field" style={{ marginBottom: 24 }}>
                  <small>
                    By proceeding to publish this entry, you agree with the
                    <b> 0.005 AETH</b> fee which will be deducted from your
                    <b> 0.02 AETH</b> balance.
                  </small>
                </div> */}
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
    licences: React.PropTypes.shape(),
    appActions: React.PropTypes.shape(),
    settingsActions: React.PropTypes.shape(),
    draft: React.PropTypes.shape()
};
PublishPanel.contextTypes = {
    router: React.PropTypes.shape()
};
export default injectIntl(PublishPanel);

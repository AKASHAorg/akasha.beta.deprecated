import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { fromJS } from 'immutable';
import { DraftJS } from 'megadraft';
import { Row, Col, Button, Steps, Modal } from 'antd';
import { PublishOptionsPanel, TextEntryEditor, TagEditor, EntryVersionTimeline, NewEntryTopBar,
    DataLoader } from '../components';
import { genId } from '../utils/dataModule';
import { draftCreate, draftsGet, draftUpdate, draftsGetCount,
    draftRevertToVersion } from '../local-flux/actions/draft-actions';
import { entryGetFull } from '../local-flux/actions/entry-actions';
import { searchResetResults, searchTags } from '../local-flux/actions/search-actions';
import { actionAdd } from '../local-flux/actions/action-actions';
import { entryMessages, generalMessages } from '../locale-data/messages';
import { selectDraftById, selectLoggedProfile } from '../local-flux/selectors';
import * as actionTypes from '../constants/action-types';

const { EditorState } = DraftJS;

const { confirm } = Modal;

class NewEntryPage extends Component {
    state = {
        showPublishPanel: false,
        errors: {},
        shouldResetCaret: false,
    }
    componentWillReceiveProps (nextProps) {
        const { match, draftObj, drafts,
            selectionState } = nextProps;
        const { loggedProfile, history } = this.props;
        const ethAddress = loggedProfile.get('ethAddress');
        const currentSelection = selectionState.getIn([match.params.draftId, ethAddress]);

        /** handle just published draft! */
        if (!draftObj && this.props.draftObj) {
            if (drafts.size > 0) {
                const draftId = drafts.first().get('id');
                const draftType = drafts.first().getIn(['content', 'entryType']);
                if (draftId) {
                    history.push(`/draft/${draftType}/${draftId}`);
                }
            } else {
                history.push('/draft/article/noDraft');
            }
        }

        if (draftObj && match.params.draftId &&
                match.params.draftId !== this.props.match.params.draftId && this.editor) {
            if (currentSelection) {
                this.setState({
                    shouldResetCaret: true
                });
            } else {
                const selection = EditorState.moveSelectionToEnd(
                    draftObj.getIn(['content', 'draft'])
                ).getSelection();
                this.editor.updateCaretPosition(selection);
            }
        } else {
            this.setState({
                shouldResetCaret: false
            });
        }
    }
    _createNewDraft = (ev) => {
        const { history, loggedProfile, userDefaultLicence } = this.props;
        const draftId = genId();
        this.props.draftCreate({
            id: draftId,
            ethAddress: loggedProfile.get('ethAddress'),
            content: {
                licence: userDefaultLicence,
                featuredImage: {},
                entryType: 'article',
            },
            tags: [],
        });
        history.push(`/draft/article/${draftId}`);
        ev.preventDefault();
    }
    _showPublishOptionsPanel = () => {
        this.setState({
            showPublishPanel: !this.state.showPublishPanel
        });
    }

    _handleTitleChange = (ev) => {
        const { match, loggedProfile, draftObj } = this.props;
        this.props.draftUpdate(draftObj.merge({
            ethAddress: loggedProfile.get('ethAddress'),
            content: draftObj.get('content').merge({
                title: ev.target.value
            }),
            id: match.params.draftId,
        }));
        this.setState(prevState => ({
            errors: {
                ...prevState.errors,
                title: null,
            }
        }));
    }

    _handleEditorChange = (editorState) => {
        const { draftObj, loggedProfile } = this.props;
        this.props.draftUpdate(draftObj.merge(fromJS({
            ethAddress: loggedProfile.get('ethAddress'),
            content: draftObj.get('content').mergeDeep(fromJS({
                draft: editorState,
            })),
        })));
        this.setState(prevState => ({
            errors: {
                ...prevState.errors,
                draft: null,
            }
        }));
    }

    _handleTagUpdate = (tagList) => {
        const { draftObj, loggedProfile } = this.props;
        this.props.draftUpdate(draftObj.merge({
            ethAddress: loggedProfile.get('ethAddress'),
            tags: draftObj.get('tags').clear().concat(tagList),
        }));
        this.setState(prevState => ({
            errors: {
                ...prevState.errors,
                tags: null,
            }
        }));
    }

    _handleDraftLicenceChange = (licenceField, licence) => {
        const { draftObj, loggedProfile, licences } = this.props;
        if (licenceField === 'parent') {
            const childLicence = licences.find(lic => lic.get('parent') === licence);
            if (childLicence) {
                return this.props.draftUpdate(
                    draftObj.merge({
                        ethAddress: loggedProfile.get('ethAddress'),
                        content: draftObj.get('content').merge({
                            licence: draftObj.getIn(['content', 'licence']).merge({
                                parent: licence,
                                id: childLicence.get('id'),
                            })
                        })
                    })
                );
            }
        }
        return this.props.draftUpdate(
            draftObj.merge({
                ethAddress: loggedProfile.get('ethAddress'),
                content: draftObj.get('content').setIn(['licence', licenceField], licence)
            })
        );
    }

    _handleExcerptChange = (excerpt) => {
        const { draftObj, loggedProfile } = this.props;
        this.props.draftUpdate(draftObj.merge({
            ethAddress: loggedProfile.get('ethAddress'),
            content: draftObj.get('content').setIn(['excerpt'], excerpt),
        }));
        this.setState(prevState => ({
            errors: {
                ...prevState.errors,
                excerpt: null,
            }
        }));
    }

    _handleFeaturedImageChange = (image) => {
        const { draftObj, loggedProfile } = this.props;
        this.props.draftUpdate(
            draftObj.merge({
                ethAddress: loggedProfile.get('ethAddress'),
                content: draftObj.get('content').set('featuredImage', fromJS(image))
            })
        );
    }

    _handlePublishPanelClose = () => {
        this.setState({
            showPublishPanel: false
        });
    }

    validateData = () =>
        new Promise((resolve, reject) => {
            const { draftObj, intl } = this.props;
            const excerpt = draftObj.getIn(['content', 'excerpt']);
            const draftState = draftObj.getIn(['content', 'draft']);
            if (draftObj.getIn(['content', 'title']).length === 0) {
                return reject({ title: intl.formatMessage(entryMessages.titleRequired) });
            }
            if (!draftState.getCurrentContent().hasText()) {
                return reject({ draft: intl.formatMessage(entryMessages.draftContentRequired) });
            }

            if (this.state.tagError) {
                return reject({ tags: intl.formatMessage(entryMessages.oneOfTheTagsCannotBeUsed) });
            }
            if (this.tagEditor.getIsBusy()) {
                return reject({ tags: 'tag validation in progress... please wait' });
            }
            if (draftObj.get('tags').size === 0) {
                return reject({ tags: intl.formatMessage(entryMessages.errorOneTagRequired) });
            }

            if (excerpt.length > 120) {
                return this.setState({
                    showPublishPanel: true
                }, () => reject({ excerpt: intl.formatMessage(entryMessages.errorExcerptTooLong) }));
            }
            return resolve();
        });

    _createRef = nodeName =>
        (node) => { this[nodeName] = node; };

    _handlePublish = (ev) => {
        ev.preventDefault();
        const { draftObj, loggedProfile, match } = this.props;
        const publishPayload = {
            id: draftObj.id,
            title: draftObj.getIn(['content', 'title']),
            type: match.params.draftType
        };
        setTimeout(() => {
            this.validateData().then(() => {
                if (draftObj.onChain) {
                    return this.props.actionAdd(
                        loggedProfile.get('ethAddress'),
                        actionTypes.draftPublishUpdate,
                        { draft: publishPayload, entryId: draftObj.id }
                    );
                }
                return this.props.actionAdd(
                    loggedProfile.get('ethAddress'),
                    actionTypes.draftPublish,
                    { draft: publishPayload, entryId: draftObj.id }
                );
            }).catch((errors) => {
                this.setState({ errors });
            });
        }, 100);
    }

    _handleVersionRevert = (version) => {
        const { draftObj, loggedProfile } = this.props;
        this.props.draftRevertToVersion({
            version,
            id: draftObj.id
        });
        this.props.entryGetFull({
            entryId: draftObj.id,
            version,
            asDraft: true,
            revert: true,
            ethAddress: loggedProfile.get('ethAddress'),
        });
    }

    _showRevertConfirm = (ev, version) => {
        const handleVersionRevert = this._handleVersionRevert.bind(null, version);
        const { draftObj, intl } = this.props;
        if (draftObj.localChanges) {
            confirm({
                content: intl.formatMessage(entryMessages.revertConfirmTitle),
                okText: intl.formatMessage(generalMessages.yes),
                okType: 'danger',
                cancelText: intl.formatMessage(generalMessages.no),
                onOk: handleVersionRevert,
                onCancel () {}
            });
        } else {
            handleVersionRevert();
        }
        ev.preventDefault();
    }
    _handleInternalTagError = (hasError) => {
        this.setState({
            tagError: hasError
        });
    }
    _handleTagInputChange = () => {
        this.setState(prevState => ({
            errors: {
                ...prevState.errors,
                tags: null
            }
        }));
    }
    _createTimeline = (draftObj) => {
        const { content, localChanges } = draftObj;
        const { latestVersion, version } = content;
        const timelineItems = [...Array(Number(latestVersion) + 1)];
        return (
          <Steps
            progressDot={this._getProgressDot}
            current={latestVersion + 1}
            className="edit-entry-page__timeline-steps"
          >
            {
              this._getTimelineSteps(timelineItems, localChanges, version)
            }
          </Steps>
        );
    }
    _checkIfDisabled = () => {
        const { pendingFaucetTx } = this.props;
        if (this.state.tagError) {
            return true;
        }
        if (pendingFaucetTx) {
            return true;
        }
        return false;
    }
    /* eslint-disable complexity */
    render () {
        const { showPublishPanel, errors, shouldResetCaret } = this.state;
        const { loggedProfile, baseUrl, drafts, darkTheme, showSecondarySidebar, intl, draftObj,
            draftsFetched, entriesFetched, tagSuggestions, tagSuggestionsCount, match, licences, resolvingEntries,
            selectionState } = this.props;
        const draftId = match.params.draftId;
        const unpublishedDrafts = drafts.filter(drft => !drft.get('onChain'));

        if (!draftObj && unpublishedDrafts.size === 0 && !draftId.startsWith('0x') && draftsFetched) {
            return (
              <div
                className={
                  `edit-entry-page__no-drafts
                  edit-entry-page__no-drafts${darkTheme ? '_dark' : ''}`
                }
              >
                <div className="edit-entry-page__no-drafts_placeholder-image" />
                <div className="edit-entry-page__no-drafts_placeholder-text">
                  <h3>
                    {intl.formatMessage(entryMessages.youHaveNoDrafts)}
                  </h3>
                  <p>
                    <a href="#" onClick={this._createNewDraft}>
                      {intl.formatMessage(entryMessages.startANewDraft)}
                    </a>
                  </p>
                </div>
              </div>
            );
        }
        if ((!draftObj || !draftObj.get('content'))) {
            return (
              <DataLoader
                flag
                message={intl.formatMessage(entryMessages.loadingDrafts)}
                size="large"
                className="edit-entry-page__data-loader"
              />
            );
        }
        const unresolved = draftObj && resolvingEntries.includes(draftObj.get('id'));
        if (unresolved) {
            return (
              <DataLoader
                flag
                message={
                  <div>
                    <div>
                      {intl.formatMessage(entryMessages.resolvingIpfsHash)}
                    </div>
                    <div>
                      {intl.formatMessage(entryMessages.makeSureToOpenDApp)}
                    </div>
                  </div>
                }
                size="large"
                className="edit-entry-page__data-loader"
              />
            );
        }
        const currentSelection = selectionState.getIn([draftObj.get('id'), loggedProfile.get('ethAddress')]);
        // console.log(currentSelection, 'current selection');
        const { content, tags, localChanges, onChain } = draftObj;
        const { title, excerpt, latestVersion, licence, draft, featuredImage } = content;
        let draftWithSelection = draft;

        if (currentSelection && currentSelection.size > 0 && shouldResetCaret) {
            draftWithSelection = EditorState.forceSelection(draft, currentSelection);
        } else if (currentSelection && currentSelection.size > 0) {
            draftWithSelection = EditorState.acceptSelection(draft, currentSelection);
        }
        return (
          <div className="edit-entry-page article-page">
            <Row
              type="flex"
              className="edit-entry-page__content"
            >
              <Col
                span={showPublishPanel ? 17 : 24}
                className="edit-entry-page__editor-wrapper"
              >
                <div
                  id="editor"
                  className={
                    `edit-entry-page__editor
                    edit-entry-page__editor${showSecondarySidebar ? '' : '_full'}`
                  }
                >
                  <div className="edit-entry-page__editor-inner">
                    <input
                      ref={this._createRef('titleInput')}
                      className={
                        `edit-entry-page__title-input-field
                        edit-entry-page__title-input-field${showSecondarySidebar ? '' : '_full'}`
                      }
                      placeholder={intl.formatMessage(entryMessages.title)}
                      onChange={this._handleTitleChange}
                      value={title}
                    />
                    {errors.title &&
                      <small className="edit-entry-page__error-text">{errors.title}</small>
                    }
                    <TextEntryEditor
                      ref={this._createRef('editor')}
                      className={
                        `text-entry-editor${showSecondarySidebar ? '' : '_full'}`
                      }
                      onChange={this._handleEditorChange}
                      editorState={draftWithSelection}
                      selectionState={currentSelection}
                      baseUrl={baseUrl}
                      intl={intl}
                      sidebarReposition={showPublishPanel}
                    />
                    {errors.draft &&
                      <small className="edit-entry-page__error-text">{errors.draft}</small>
                    }
                  </div>
                  <TagEditor
                    ref={this._createRef('tagEditor')}
                    className="edit-entry-page__tag-editor"
                    match={match}
                    nodeRef={(node) => { this.tagsField = node; }}
                    intl={intl}
                    ethAddress={loggedProfile.get('ethAddress')}
                    onTagUpdate={this._handleTagUpdate}
                    onChange={this._handleTagInputChange}
                    tags={tags}
                    actionAdd={this.props.actionAdd}
                    searchTags={this.props.searchTags}
                    tagSuggestions={tagSuggestions}
                    tagSuggestionsCount={tagSuggestionsCount}
                    searchResetResults={this.props.searchResetResults}
                    inputDisabled={onChain}
                    onTagError={this._handleInternalTagError}
                    tagErrors={errors.tags}
                  />
                </div>
              </Col>
              <Col
                span={6}
                className={
                    `edit-entry-page__publish-options-panel-wrapper
                    edit-entry-page__publish-options-panel-wrapper${showPublishPanel ? '_open' : ''}`
                }
              >
                <PublishOptionsPanel
                  baseUrl={baseUrl}
                  errors={errors}
                  intl={intl}
                  onClose={this._handlePublishPanelClose}
                  onLicenceChange={this._handleDraftLicenceChange}
                  onExcerptChange={this._handleExcerptChange}
                  onFeaturedImageChange={this._handleFeaturedImageChange}
                  title={title}
                  excerpt={excerpt}
                  featuredImage={featuredImage}
                  selectedLicence={licence}
                  licences={licences}
                />
              </Col>
              <div
                className={
                    `edit-entry-page__footer-wrapper
                    edit-entry-page__footer-wrapper${showSecondarySidebar ? '' : '_full'}`
                }
              >
                <div className="edit-entry-page__footer">
                  <NewEntryTopBar />
                  <div className="edit-entry-page__footer-timeline-wrapper">
                    {onChain && (localChanges || latestVersion > 0) &&
                      <div
                        className={
                          `edit-entry-page__footer-timeline
                          edit-entry-page__footer-timeline${latestVersion ? '' : '_empty'}`
                        }
                      >
                        <EntryVersionTimeline
                          draftObj={draftObj}
                          onRevertConfirm={this._showRevertConfirm}
                        />
                      </div>
                    }
                  </div>
                  <div className="edit-entry-page__footer-actions">
                    <Button
                      size="large"
                      onClick={this._showPublishOptionsPanel}
                      className={'edit-entry-page__options-button'}
                    >
                      {intl.formatMessage(entryMessages.publishOptions)}
                    </Button>
                    <Button
                      size="large"
                      type="primary"
                      className={
                          `edit-entry-page__publish-button
                          edit-entry-page__publish-button${draftObj.get('publishing') ? '_pending' : ''}`
                      }
                      onClick={this._handlePublish}
                      loading={draftObj.get('publishing')}
                      disabled={this._checkIfDisabled()}
                    >
                      {!draftObj.get('publishing') && onChain && intl.formatMessage(generalMessages.update)}
                      {!draftObj.get('publishing') && !onChain && intl.formatMessage(generalMessages.publish)}
                      {draftObj.get('publishing') && onChain && intl.formatMessage(generalMessages.updating)}
                      {draftObj.get('publishing') &&
                        !onChain &&
                        intl.formatMessage(generalMessages.publishing)
                      }
                    </Button>
                  </div>
                </div>
              </div>
            </Row>
          </div>
        );
    }
}

NewEntryPage.propTypes = {
    actionAdd: PropTypes.func,
    baseUrl: PropTypes.string,
    draftObj: PropTypes.shape(),
    drafts: PropTypes.shape(),
    draftCreate: PropTypes.func,
    draftUpdate: PropTypes.func,
    draftRevertToVersion: PropTypes.func,
    draftsFetched: PropTypes.bool,
    darkTheme: PropTypes.bool,
    entryGetFull: PropTypes.func,
    history: PropTypes.shape(),
    intl: PropTypes.shape(),
    licences: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    match: PropTypes.shape(),
    resolvingEntries: PropTypes.shape(),
    showSecondarySidebar: PropTypes.bool,
    selectionState: PropTypes.shape(),
    searchResetResults: PropTypes.func,
    searchTags: PropTypes.func,
    tagSuggestions: PropTypes.shape(),
    tagSuggestionsCount: PropTypes.number,
    userDefaultLicence: PropTypes.shape(),
    pendingFaucetTx: PropTypes.bool,
};

const mapStateToProps = (state, ownProps) => ({
    baseUrl: state.externalProcState.getIn(['ipfs', 'status', 'baseUrl']),
    draftObj: selectDraftById(state, ownProps.match.params.draftId),
    drafts: state.draftState.get('drafts'),
    draftsFetched: state.draftState.get('draftsFetched'),
    darkTheme: state.settingsState.getIn(['general', 'darkTheme']),
    entriesFetched: state.draftState.get('entriesFetched'),
    licences: state.licenseState.get('byId'),
    loggedProfile: selectLoggedProfile(state),
    selectionState: state.draftState.get('selection'),
    resolvingEntries: state.draftState.get('resolvingEntries'),
    showSecondarySidebar: state.appState.get('showSecondarySidebar'),
    tagSuggestions: state.searchState.get('tags'),
    tagSuggestionsCount: state.searchState.get('tagResultsCount'),
    userDefaultLicence: state.settingsState.getIn(['userSettings', 'defaultLicence']),
    pendingFaucetTx: state.actionState.getIn(['pending', 'faucet']),
});

export default connect(
    mapStateToProps,
    {
        actionAdd,
        draftCreate,
        draftsGet,
        draftUpdate,
        draftsGetCount,
        draftRevertToVersion,
        entryGetFull,
        searchTags,
        searchResetResults,
    }
)(injectIntl(NewEntryPage));

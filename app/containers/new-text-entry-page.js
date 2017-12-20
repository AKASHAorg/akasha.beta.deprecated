import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { fromJS } from 'immutable';
import { DraftJS } from 'megadraft';
import { Row, Col, Button, Steps, Modal } from 'antd';
import { PublishOptionsPanel, TextEntryEditor, TagEditor, EntryVersionTimeline,
    DataLoader, Icon } from '../components';
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
        const { match, draftObj, draftsFetched, entriesFetched, resolvingEntries,
            userDefaultLicense, selectionState } = nextProps;
        const { loggedProfile } = this.props;
        const ethAddress = loggedProfile.get('ethAddress');
        const currentSelection = selectionState.getIn([match.params.draftId, ethAddress]);
        const draftIsPublished = resolvingEntries.includes(match.params.draftId);
        if (!draftObj && draftsFetched && entriesFetched && !draftIsPublished) {
            this.props.draftCreate({
                id: match.params.draftId,
                ethAddress: loggedProfile.get('ethAddress'),
                content: {
                    licence: userDefaultLicense,
                    featuredImage: {},
                },
                tags: [],
                entryType: 'article',
            });
        }
        if (match.params.draftId && match.params.draftId !== this.props.match.params.draftId && this.editor) {
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

    _showPublishOptionsPanel = () => {
        this.setState({
            showPublishPanel: true
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
        const { draftObj, loggedProfile } = this.props;
        this.props.draftUpdate(
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
        this.validateData().then(() => {
            if (draftObj.onChain) {
                return this.props.actionAdd(
                    loggedProfile.get('ethAddress'),
                    actionTypes.draftPublishUpdate,
                    { draft: publishPayload }
                );
            }
            return this.props.actionAdd(
                loggedProfile.get('ethAddress'),
                actionTypes.draftPublish,
                { draft: publishPayload }
            );
        }).catch((errors) => {
            this.setState({ errors });
        });
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
    /* eslint-disable complexity */
    render () {
        const { showPublishPanel, errors, shouldResetCaret } = this.state;
        const { loggedProfile, baseUrl, showSecondarySidebar, intl, draftObj,
            tagSuggestions, tagSuggestionsCount, match, licences, resolvingEntries,
            selectionState } = this.props;
        if (!draftObj || !draftObj.get('content')) {
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
            <div
              className="flex-center-y edit-entry-page__publish-options"
              onClick={this._showPublishOptionsPanel}
            >
              <Icon className="edit-entry-page__more-icon" type="more" />
              {intl.formatMessage(entryMessages.publishOptions)}
            </div>
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
                    <textarea
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
                    tags={tags}
                    actionAdd={this.props.actionAdd}
                    searchTags={this.props.searchTags}
                    tagSuggestions={tagSuggestions}
                    tagSuggestionsCount={tagSuggestionsCount}
                    searchResetResults={this.props.searchResetResults}
                    inputDisabled={onChain}
                  />
                  {errors.tags &&
                    <small className="edit-entry-page__error-text">{errors.tags}</small>
                  }
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
                      type="primary"
                      onClick={this._handlePublish}
                      loading={draftObj.get('publishing')}
                    >
                      {onChain ?
                        intl.formatMessage(generalMessages.update) :
                        intl.formatMessage(generalMessages.publish)
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
    draftCreate: PropTypes.func,
    draftUpdate: PropTypes.func,
    draftRevertToVersion: PropTypes.func,
    draftsFetched: PropTypes.bool,
    entriesFetched: PropTypes.bool,
    entryGetFull: PropTypes.func,
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
    userDefaultLicense: PropTypes.shape(),
};

const mapStateToProps = (state, ownProps) => ({
    baseUrl: state.externalProcState.getIn(['ipfs', 'status', 'baseUrl']),
    draftObj: selectDraftById(state, ownProps.match.params.draftId),
    draftsFetched: state.draftState.get('draftsFetched'),
    entriesFetched: state.draftState.get('entriesFetched'),
    licences: state.licenseState.get('byId'),
    loggedProfile: selectLoggedProfile(state),
    selectionState: state.draftState.get('selection'),
    resolvingEntries: state.draftState.get('resolvingEntries'),
    showSecondarySidebar: state.appState.get('showSecondarySidebar'),
    tagSuggestions: state.searchState.get('tags'),
    tagSuggestionsCount: state.searchState.get('tagResultsCount'),
    userDefaultLicence: state.settingsState.getIn(['userSettings', 'defaultLicence'])
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

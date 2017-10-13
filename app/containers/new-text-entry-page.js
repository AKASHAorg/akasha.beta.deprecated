import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { fromJS } from 'immutable';
import { DraftJS } from 'megadraft';
import { Icon, Row, Col, Button, Steps, Popover, Modal } from 'antd';
import { PublishOptionsPanel, TextEntryEditor, TagEditor } from '../components';
import { secondarySidebarToggle } from '../local-flux/actions/app-actions';
import { draftCreate, draftsGet, draftUpdate, draftsGetCount,
    draftRevertToVersion } from '../local-flux/actions/draft-actions';
import { entryGetFull } from '../local-flux/actions/entry-actions';
import { tagSearch } from '../local-flux/actions/tag-actions';
import { searchResetResults } from '../local-flux/actions/search-actions';
import { actionAdd } from '../local-flux/actions/action-actions';
import { entryMessages, generalMessages } from '../locale-data/messages';
import { selectDraftById, selectLoggedProfile } from '../local-flux/selectors';
import * as actionTypes from '../constants/action-types';

const { EditorState } = DraftJS;
const { Step } = Steps;
const { confirm } = Modal;

const EditorNotReadyPlaceholder = ({ message, loading }) => (
  <div className="editor-not-ready">
    {loading &&
      <div className="editor-not-ready__loader">Loading</div>
    }
    <div className="editor-not-ready__message">
      {message}
    </div>
  </div>
);

EditorNotReadyPlaceholder.propTypes = {
    message: PropTypes.string,
    loading: PropTypes.bool
};

class NewEntryPage extends Component {
    state = {
        showPublishPanel: false,
        errors: {},
    }

    componentWillReceiveProps (nextProps) {
        const { match, draftObj, draftsFetched, entriesFetched, resolvingEntries,
            userDefaultLicense } = nextProps;
        const { loggedProfile } = this.props;
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
        this.props.draftUpdate(draftObj.merge({
            ethAddress: loggedProfile.get('ethAddress'),
            content: draftObj.get('content').mergeDeep({
                draft: editorState,
            }),
        }));
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
                content: draftObj.get('content').mergeIn(['licence', licenceField], licence)
            })
        );
    }

    _handleExcerptChange = (excerpt) => {
        const { draftObj, loggedProfile } = this.props;
        this.props.draftUpdate(draftObj.merge({
            ethAddress: loggedProfile.get('ethAddress'),
            content: draftObj.get('content').mergeIn(['excerpt'], excerpt),
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
            const { draftObj } = this.props;
            const excerpt = draftObj.getIn(['content', 'excerpt']);
            const draftState = draftObj.getIn(['content', 'draft']);
            if (draftObj.getIn(['content', 'title']).length === 0) {
                return reject({ title: 'Title must not be empty' });
            }

            if (!draftState.getCurrentContent().hasText()) {
                return reject({ draft: 'Cannot create an article without content!' });
            }

            if (draftObj.get('tags').size === 0) {
                return reject({ tags: 'You must add at least 1 tag' });
            }
            if (excerpt.length > 120) {
                return this.setState({
                    showPublishPanel: true
                }, () => reject({ excerpt: 'Excerpt must not be longer than 120 characters' }));
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
        const { draftObj } = this.props;
        this.props.draftRevertToVersion({
            version,
            id: draftObj.id
        });
        this.props.entryGetFull({
            entryId: draftObj.id,
            version,
            asDraft: true
        });
    }

    _showRevertConfirm = (ev, version) => {
        const handleVersionRevert = this._handleVersionRevert.bind(null, version);
        const { draftObj } = this.props;
        if (draftObj.localChanges) {
            confirm({
                content: 'Are you sure you want to revert this draft?',
                okText: 'Yes',
                okType: 'danger',
                cancelText: 'No',
                onOk: handleVersionRevert,
                onCancel () {}
            });
        } else {
            handleVersionRevert();
        }
        ev.preventDefault();
    }
    componentWillUnmount () {
        this.props.secondarySidebarToggle({ forceToggle: true });
    }

    _getProgressDot = (dot, { status, index }) => {
        switch (status) {
            case 'draft':
                return (
                  <span className="draft-dot">
                    {dot}
                  </span>
                );
            case 'published':
                return (
                  <Popover content={`Status: ${status}`}>
                    <a
                      href="##"
                      className="published-dot"
                      onClick={ev => this._showRevertConfirm(ev, index)}
                    >
                      {dot}
                    </a>
                  </Popover>
                );
            case 'published-selected':
                return (
                  <Popover
                    content={'Status: Published'}
                  >
                    <a
                      href="##"
                      className="published-dot published-dot-selected"
                      onClick={ev => this._showRevertConfirm(ev, index)}
                    >
                      {dot}
                    </a>
                  </Popover>
                );
            case 'none':
                return null;
            default:
                return dot;
        }
        // return <Popover content="test">{dot}</Popover>;
    }

    _getTimelineSteps = (items, localChanges, selectedVersion) => {
        /* eslint-disable react/no-array-index-key */
        const steps = items.map((item, index) => (
          <Step
            key={`${index}`}
            title={`v${index + 1}`}
            status={`published${(selectedVersion === index) ? '-selected' : ''}`}
          />
        ));
        /* eslint-enable react/no-array-index-key */
        if (localChanges) {
            steps.push(
              <Step key="$localVersion" title="Local Version" status="draft" />
            );
        }
        return steps;
    }

    _createTimeline = () => {
        const { draftObj } = this.props;
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
        const { showPublishPanel, errors } = this.state;
        const { loggedProfile, baseUrl, showSecondarySidebar, intl, draftObj,
            tagSuggestions, tagSuggestionsCount, match, licences, resolvingEntries,
            selectionState } = this.props;
        if (!draftObj || !draftObj.get('content')) {
            return (
              <div>Finding Draft</div>
            );
        }
        const unresolved = draftObj && resolvingEntries.includes(draftObj.get('id'));
        if (unresolved) {
            return (
              <div>
                  Cannot resolve entry`s ipfs hash.
                  Make sure to open AKASHA DApp on the computer you have published from.
              </div>
            );
        }
        const currentSelection = selectionState.getIn([draftObj.get('id'), loggedProfile.get('ethAddress')]);
        console.log(currentSelection, 'current selection');
        const { content, tags, localChanges, onChain } = draftObj;
        const { title, excerpt, latestVersion, licence, draft, featuredImage } = content;
        let draftWithSelection = draft;
        if (currentSelection && currentSelection.size > 0 && !currentSelection.getHasFocus()) {
            draftWithSelection = EditorState.forceSelection(draft, currentSelection);
        }
        return (
          <div className="edit-entry-page article-page">
            <div
              className="edit-entry-page__publish-options"
              onClick={this._showPublishOptionsPanel}
            >
              <Icon
                type="ellipsis"
                style={{ transform: 'rotate(90deg)' }}
              />
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
                <div className="edit-entry-page__editor">
                  <textarea
                    ref={this._createRef('titleInput')}
                    className="edit-entry-page__title-input-field"
                    placeholder="Title"
                    onChange={this._handleTitleChange}
                    value={title}
                  />
                  {errors.title &&
                    <small className="edit-entry-page__error-text">{errors.title}</small>
                  }
                  <TextEntryEditor
                    ref={this._createRef('editor')}
                    onChange={this._handleEditorChange}
                    editorState={draftWithSelection}
                    selectionState={currentSelection}
                    baseUrl={baseUrl}
                    intl={intl}
                  />
                  {errors.draft &&
                    <small className="edit-entry-page__error-text">{errors.draft}</small>
                  }
                </div>
                <div className="edit-entry-page__tag-editor">
                  <TagEditor
                    ref={this._createRef('tagEditor')}
                    match={match}
                    nodeRef={(node) => { this.tagsField = node; }}
                    intl={intl}
                    ethAddress={loggedProfile.get('ethAddress')}
                    onTagUpdate={this._handleTagUpdate}
                    tags={tags}
                    actionAdd={this.props.actionAdd}
                    tagSearch={this.props.tagSearch}
                    tagSuggestions={tagSuggestions}
                    tagSuggestionsCount={tagSuggestionsCount}
                    searchResetResults={this.props.searchResetResults}
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
                        {this._createTimeline()}
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
    secondarySidebarToggle: PropTypes.func,
    selectionState: PropTypes.shape(),
    searchResetResults: PropTypes.func,
    tagSearch: PropTypes.func,
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
    tagSuggestionsCount: state.searchState.get('resultsCount'),
    userDefaultLicence: state.settingsState.getIn(['userSettings', 'defaultLicence'])
});

export default connect(
    mapStateToProps,
    {
        actionAdd,
        secondarySidebarToggle,
        draftCreate,
        draftsGet,
        draftUpdate,
        draftsGetCount,
        draftRevertToVersion,
        entryGetFull,
        tagSearch,
        searchResetResults,
    }
)(injectIntl(NewEntryPage));

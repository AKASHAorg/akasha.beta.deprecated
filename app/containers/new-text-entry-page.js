import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { fromJS } from 'immutable';
import { Icon, Row, Col, Button, Steps, Popover, Modal } from 'antd';
import { PublishOptionsPanel, TextEntryEditor, TagEditor } from '../components';
import { secondarySidebarToggle } from '../local-flux/actions/app-actions';
import { draftCreate, draftsGet, draftUpdate, draftAutosave,
    draftsGetCount, draftRevertToVersion } from '../local-flux/actions/draft-actions';
import { entryGetFull } from '../local-flux/actions/entry-actions';
import { tagSearch } from '../local-flux/actions/tag-actions';
import { searchResetResults } from '../local-flux/actions/search-actions';
import { actionAdd } from '../local-flux/actions/action-actions';
import { entryMessages, generalMessages } from '../locale-data/messages';
import { selectDraftById, selectLoggedProfile } from '../local-flux/selectors';
import * as actionTypes from '../constants/action-types';

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
    }

    componentWillReceiveProps (nextProps) {
        const { match, draftObj, draftsFetched, entriesFetched, resolvingHashes,
            userDefaultLicence } = nextProps;
        const { loggedProfile } = this.props;
        const draftIsPublished = resolvingHashes.includes(match.params.draftId);
        if (!draftObj && draftsFetched && entriesFetched && !draftIsPublished) {
            this.props.draftCreate({
                id: match.params.draftId,
                ethAddress: loggedProfile.get('ethAddress'),
                content: {
                    licence: userDefaultLicence,
                    featuredImage: {},
                },
                tags: [],
                type: 'article',
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
    }

    _handleEditorChange = (editorState) => {
        const { draftObj } = this.props;
        this.props.draftUpdate(draftObj.merge({
            content: draftObj.get('content').mergeDeep({
                draft: editorState,
            }),
        }));
    }

    _handleTagUpdate = (tagList) => {
        const { draftObj } = this.props;
        this.props.draftUpdate(draftObj.merge({
            tags: draftObj.get('tags').clear().concat(tagList),
        }));
    }

    _handleDraftLicenceChange = (licenceField, licence) => {
        const { draftObj } = this.props;
        this.props.draftUpdate(
            draftObj.mergeIn(['content', 'licence', licenceField], licence)
        );
    }

    _handleExcerptChange = (excerpt) => {
        const { draftObj } = this.props;
        this.props.draftUpdate(draftObj.mergeIn(['content', 'excerpt'], excerpt));
    }

    _handleFeaturedImageChange = (image) => {
        const { draftObj } = this.props;
        this.props.draftUpdate(
            draftObj.setIn(['content', 'featuredImage'], fromJS(image))
        );
    }

    _handlePublishPanelClose = () => {
        this.setState({
            showPublishPanel: false
        });
    }

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
        if (draftObj.onChain) {
            return this.props.actionAdd(
                loggedProfile.get('account'),
                actionTypes.draftPublishUpdate,
                { draft: publishPayload }
            );
        }
        return this.props.actionAdd(
            loggedProfile.get('account'),
            actionTypes.draftPublish,
            { draft: publishPayload }
        );
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
            className="text-entry-page__timeline-steps"
          >
            {
              this._getTimelineSteps(timelineItems, localChanges, version)
            }
          </Steps>
        );
    }

    render () {
        const { showPublishPanel } = this.state;
        const { loggedProfile, baseUrl, showSecondarySidebar, intl, draftObj,
            tagSuggestions, tagSuggestionsCount, match, licences, resolvingHashes } = this.props;
        if (!draftObj || !draftObj.content) {
            return (
              <div>Finding Draft</div>
            );
        }
        const unresolved = draftObj.entryEth.ipfsHash && resolvingHashes.includes(draftObj.entryEth.ipfsHash);
        if (unresolved) {
            return (
              <div>
                  Cannot resolve entry`s ipfs hash.
                  Make sure to open AKASHA DApp on the computer you have published from.
              </div>
            );
        }
        const { content, tags, localChanges, onChain } = draftObj;
        const { title, excerpt, latestVersion, licence, draft, featuredImage } = content;
        return (
          <div className="text-entry-page">
            <div
              className="text-entry-page__publish-options"
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
              className="text-entry-page__content"
            >
              <Col
                span={showPublishPanel ? 17 : 24}
                className="text-entry-page__editor-wrapper"
              >
                <div className="text-entry-page__editor">
                  <textarea
                    ref={this._createRef('titleInput')}
                    className="text-entry-page__title-input-field"
                    placeholder="Title"
                    onChange={this._handleTitleChange}
                    value={title}
                  />
                  <TextEntryEditor
                    ref={this._createRef('editor')}
                    onChange={this._handleEditorChange}
                    editorState={draft}
                    selectionState={this.state.editorState}
                    baseUrl={baseUrl}
                    intl={intl}
                  />
                </div>
                <div className="text-entry-page__tag-editor">
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
                </div>
              </Col>
              <Col
                span={6}
                className={
                    `text-entry-page__publish-options-panel-wrapper
                    text-entry-page__publish-options-panel-wrapper${showPublishPanel ? '_open' : ''}`
                }
              >
                <PublishOptionsPanel
                  baseUrl={baseUrl}
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
                    `text-entry-page__footer-wrapper
                    text-entry-page__footer-wrapper${showSecondarySidebar ? '' : '_full'}`
                }
              >
                <div className="text-entry-page__footer">
                  <div className="text-entry-page__footer-timeline-wrapper">
                    {onChain && (localChanges || latestVersion > 0) &&
                      <div
                        className={
                          `text-entry-page__footer-timeline
                          text-entry-page__footer-timeline${latestVersion ? '' : '_empty'}`
                        }
                      >
                        {this._createTimeline()}
                      </div>
                    }
                  </div>
                  <div className="text-entry-page__footer-actions">
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
    resolvingHashes: PropTypes.shape(),
    showSecondarySidebar: PropTypes.bool,
    secondarySidebarToggle: PropTypes.func,
    searchResetResults: PropTypes.func,
    tagSearch: PropTypes.func,
    tagSuggestions: PropTypes.shape(),
    tagSuggestionsCount: PropTypes.number,
    userDefaultLicence: PropTypes.shape(),
};

const mapStateToProps = (state, ownProps) => ({
    baseUrl: state.externalProcState.getIn(['ipfs', 'status', 'baseUrl']),
    draftObj: selectDraftById(state, ownProps.match.params.draftId),
    draftsFetched: state.draftState.get('draftsFetched'),
    entriesFetched: state.draftState.get('entriesFetched'),
    licences: state.licenseState.get('byId'),
    loggedProfile: selectLoggedProfile(state),
    resolvingHashes: state.draftState.get('resolvingHashes'),
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
        draftAutosave,
        draftsGetCount,
        draftRevertToVersion,
        entryGetFull,
        tagSearch,
        searchResetResults,
    }
)(injectIntl(NewEntryPage));

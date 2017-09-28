import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { fromJS } from 'immutable';
import { Icon, Row, Col, Button, Steps, Popover } from 'antd';
import { PublishOptionsPanel, TextEntryEditor, TagEditor } from '../components';
import { secondarySidebarToggle } from '../local-flux/actions/app-actions';
import { draftCreate, draftsGet, draftUpdate, draftAutosave,
    draftsGetCount } from '../local-flux/actions/draft-actions';
import { tagSearch } from '../local-flux/actions/tag-actions';
import { searchResetResults } from '../local-flux/actions/search-actions';
import { actionAdd } from '../local-flux/actions/action-actions';
import { entryMessages, generalMessages } from '../locale-data/messages';
import { selectDraftById, selectLoggedAkashaId } from '../local-flux/selectors';
import * as actionTypes from '../constants/action-types';

const { Step } = Steps;

class NewEntryPage extends Component {
    state = {
        showPublishPanel: false,
    }

    componentWillReceiveProps (nextProps) {
        const { match, draftObj, draftsFetched, entriesFetched, resolvingHashes,
            userDefaultLicence } = nextProps;
        const { akashaId } = this.props;
        const draftIsPublished = resolvingHashes.includes(match.params.draftId);
        if (!draftObj && draftsFetched && entriesFetched && !draftIsPublished) {
            this.props.draftCreate({
                id: match.params.draftId,
                akashaId,
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
        const { match, akashaId, draftObj } = this.props;
        this.props.draftUpdate(draftObj.merge({
            akashaId,
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
        console.log('update draftObj with image', draftObj.mergeIn(['content', 'featuredImage'], image));
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
        const { draftObj, akashaId } = this.props;
        const publishPayload = {
            id: draftObj.id,
            title: draftObj.getIn(['content', 'title']),
            type: draftObj.getIn(['content', 'type'])
        };
        this.props.actionAdd(akashaId, actionTypes.draftPublish, { draft: publishPayload });
        ev.preventDefault();
    }

    _handleVersionRevert = version =>
        (ev) => {
            const { draftObj } = this.props;
            if (draftObj.localChanges) {
                alert(`Are you sure you want to discard current changes and revert to v${version + 1}?`);
            }
            console.log('revert current draft to version', version);
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
                      onClick={this._handleVersionRevert(index)}
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
    _getTimelineSteps = (items, localChanges) => {
        const steps = items.map((item, index) => (
          <Step
            key={`${index}`}
            title={`v${index + 1}`}
            status="published"
          />
        ));
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
        const { version } = content;
        const timelineItems = [...Array(Number(version) + 1)];
        if (version === -1) {
            return (
              <Steps
                progressDot={this._getProgressDot}
                current={1}
                className="text-entry-page__timeline-steps"
              >
                <Step title="" status="none" />
                <Step title="Local Version" status="draft" />
              </Steps>
            );
        }
        return (
          <Steps
            progressDot={this._getProgressDot}
            current={version + 1}
            className="text-entry-page__timeline-steps"
          >
            {
              this._getTimelineSteps(timelineItems, localChanges)
            }
          </Steps>
        );
    }

    render () {
        const { showPublishPanel } = this.state;
        const { akashaId, baseUrl, showSecondarySidebar, intl, draftObj,
            tagSuggestions, tagSuggestionsCount, match, licences } = this.props;

        if (!draftObj || !draftObj.content) {
            return <div>Finding Draft</div>;
        }

        const { content, tags, version } = draftObj;
        const { title, excerpt, licence, draft, featuredImage } = content;
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
                    akashaId={akashaId}
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
                    <div
                      className={
                          `text-entry-page__footer-timeline
                          text-entry-page__footer-timeline${version ? '' : '_empty'}`
                      }
                    >
                      {this._createTimeline()}
                    </div>
                  </div>
                  <div className="text-entry-page__footer-actions">
                    <Button
                      size="large"
                      type="primary"
                      onClick={this._handlePublish}
                      loading={draftObj.get('publishing')}
                    >
                      {intl.formatMessage(generalMessages.publish)}
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
    akashaId: PropTypes.string,
    baseUrl: PropTypes.string,
    draftObj: PropTypes.shape(),
    draftCreate: PropTypes.func,
    draftUpdate: PropTypes.func,
    draftsFetched: PropTypes.bool,
    entriesFetched: PropTypes.bool,
    intl: PropTypes.shape(),
    licences: PropTypes.shape(),
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
    akashaId: selectLoggedAkashaId(state),
    baseUrl: state.externalProcState.getIn(['ipfs', 'status', 'baseUrl']),
    draftObj: selectDraftById(state, ownProps.match.params.draftId),
    draftsFetched: state.draftState.get('draftsFetched'),
    entriesFetched: state.draftState.get('entriesFetched'),
    licences: state.licenseState.get('byId'),
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
        tagSearch,
        searchResetResults,
    }
)(injectIntl(NewEntryPage));

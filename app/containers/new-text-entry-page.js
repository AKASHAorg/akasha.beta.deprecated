import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Icon, Row, Col, Button } from 'antd';
import { PublishOptionsPanel, TextEntryEditor, TagEditor } from '../components';
import { secondarySidebarToggle } from '../local-flux/actions/app-actions';
import { draftCreate, draftsGet, draftUpdate, draftAutosave,
    draftsGetCount } from '../local-flux/actions/draft-actions';
import { tagSearch } from '../local-flux/actions/tag-actions';
import { searchResetResults } from '../local-flux/actions/search-actions';
import { actionAdd } from '../local-flux/actions/action-actions';
import { entryMessages, generalMessages } from '../locale-data/messages';
import { selectDraftById, selectLoggedAkashaId } from '../local-flux/selectors';

class NewEntryPage extends Component {
    state = {
        showPublishPanel: false,
    }

    componentWillReceiveProps (nextProps) {
        const { match, draftObj, draftsFetched, userDefaultLicence } = nextProps;
        const { akashaId } = this.props;
        if (!draftObj && draftsFetched) {
            this.props.draftCreate({
                id: match.params.draftId,
                akashaId,
                tags: [],
                content: {
                    licence: userDefaultLicence,
                    type: 'article',
                }
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

    _handlePublishPanelClose = () => {
        this.setState({
            showPublishPanel: false
        });
    }

    _createRef = nodeName =>
        (node) => { this[nodeName] = node; };

    _handlePublish = () => {
        console.log('publish this draft!');
    }

    componentWillUnmount () {
        this.props.secondarySidebarToggle({ forceToggle: true });
    }

    render () {
        const { showPublishPanel } = this.state;
        const { akashaId, baseUrl, showSecondarySidebar, intl, draftObj,
            tagSuggestions, tagSuggestionsCount, match, licences } = this.props;

        if (!draftObj) {
            return <div>Finding Draft</div>;
        }
        const { content, tags } = draftObj;
        const { title, excerpt, licence, draft } = content;
        const draftSaving = !draftObj.get('saved') && draftObj.get('saving');
        const draftSaved = draftObj.get('saved') && !draftObj.get('saving');
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
                  intl={intl}
                  onClose={this._handlePublishPanelClose}
                  onLicenceChange={this._handleDraftLicenceChange}
                  onExcerptChange={this._handleExcerptChange}
                  title={title}
                  excerpt={excerpt}
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
                  <div className="text-entry-page__footer-messages-wrapper">
                    <div className="text-entry-page__footer-message">
                      {draftSaved &&
                        <div>{intl.formatMessage(entryMessages.draftSaved)}</div>
                      }
                      {draftSaving &&
                        <div>{intl.formatMessage(entryMessages.draftSaving)}</div>
                      }
                    </div>
                  </div>
                  <div className="text-entry-page__footer-actions">
                    <Button
                      size="large"
                      onClick={this._handleForceSave}
                    >
                      {intl.formatMessage(generalMessages.save)}
                    </Button>
                    <Button
                      size="large"
                      type="primary"
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
    intl: PropTypes.shape(),
    licences: PropTypes.shape(),
    match: PropTypes.shape(),
    showSecondarySidebar: PropTypes.bool,
    secondarySidebarToggle: PropTypes.func,
    searchResetResults: PropTypes.func,
    tagSearch: PropTypes.func,
    tagSuggestions: PropTypes.shape(),
    tagSuggestionsCount: PropTypes.number,
    userDefaultLicence: PropTypes.shape(),
};

const mapStateToProps = (state, ownProps) => ({
    showSecondarySidebar: state.appState.get('showSecondarySidebar'),
    draftObj: selectDraftById(state, ownProps.match.params.draftId),
    akashaId: selectLoggedAkashaId(state),
    draftsCount: state.draftState.get('draftsCount'),
    draftsFetched: state.draftState.get('draftsFetched'),
    baseUrl: state.externalProcState.getIn(['ipfs', 'status', 'baseUrl']),
    tagSuggestions: state.searchState.get('tags'),
    tagSuggestionsCount: state.searchState.get('resultsCount'),
    licences: state.licenseState.get('byId'),
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

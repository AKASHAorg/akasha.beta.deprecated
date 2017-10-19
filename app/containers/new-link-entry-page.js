import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Col, Row, Icon, Button, Modal } from 'antd';
import { DraftJS } from 'megadraft';
import { PublishOptionsPanel, TextEntryEditor, EntryVersionTimeline,
    TagEditor, WebsiteInfoCard } from '../components';
import { selectDraftById, selectLoggedProfile } from '../local-flux/selectors';
import { entryMessages, generalMessages } from '../locale-data/messages';
import { extractWebsiteInfo } from '../utils/extract-website-info';
import { draftCreate, draftUpdate, draftRevertToVersion } from '../local-flux/actions/draft-actions';
import { entryGetFull } from '../local-flux/actions/entry-actions';
import { tagSearchLocal } from '../local-flux/actions/tag-actions';
import { actionAdd } from '../local-flux/actions/action-actions';
import { searchResetResults } from '../local-flux/actions/search-actions';
import { getResizedImages } from '../utils/imageUtils';
import { uploadImage } from '../local-flux/services/utils-service';
import { secondarySidebarToggle } from '../local-flux/actions/app-actions';
import * as actionTypes from '../constants/action-types';

const { EditorState } = DraftJS;
const { confirm } = Modal;
class NewLinkEntryPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            showPublishPanel: false,
            errors: {},
            shouldResetCaret: false,
        };
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
                entryType: 'link',
            });
        }
    }
    // format an url based on the prefix of the source url
    _formatUrl = (targetUrl, sourceUrl) => {
        const prefix = sourceUrl.split('://')[0];
        if (targetUrl.startsWith(prefix)) {
            return targetUrl;
        }
        if (targetUrl.startsWith('//')) {
            return `${prefix}://${targetUrl.substr(2)}`;
        }
        return `${prefix}://${targetUrl}`;
    }
    _processUrl = () => {
        const { draftObj, loggedProfile, match } = this.props;
        const url = draftObj.getIn(['content', 'cardInfo', 'url']);
        extractWebsiteInfo(url).then((data) => {
            let filePromises = [];
            if (data.info.image) {
                filePromises = getResizedImages([this._formatUrl(data.info.image, data.url)], {
                    ipfsFile: true
                });
            }
            Promise.all(filePromises).then((results) => {
                let promise = Promise.resolve();
                if (results[0]) {
                    promise = uploadImage(results[0]);
                }
                promise.then(uploadedImage =>
                    this.props.draftUpdate(draftObj.merge({
                        ethAddress: loggedProfile.get('ethAddress'),
                        content: draftObj.get('content').merge({
                            cardInfo: draftObj.getIn(['content', 'cardInfo']).merge({
                                title: data.info.title,
                                description: data.info.description,
                                image: uploadedImage || {},
                                bgColor: data.info.bgColor,
                                url: data.url
                            }),
                        }),
                        id: match.params.draftId,
                    })));
            });
        });
    }

    _handleUrlBlur = () => {
        const { draftObj } = this.props;
        const { content } = draftObj;
        if (content.getIn(['cardInfo', 'url']).length > 0) {
            return this._processUrl();
        }
        return this.props.draftUpdate(draftObj);
    }

    _handleKeyPress = (ev) => {
        // handle enter key press
        if (ev.which === 13) {
            this._processUrl();
            if (!ev.defaultPrevented) {
                ev.preventDefault();
            }
        }
    }

    _handleUrlChange = (ev) => {
        const { match, loggedProfile, draftObj } = this.props;
        this.props.draftUpdate(draftObj.merge({
            ethAddress: loggedProfile.get('ethAddress'),
            content: draftObj.get('content').mergeIn(['cardInfo'], {
                url: ev.target.value,
            }),
            id: match.params.draftId,
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

    validateData = () =>
        new Promise((resolve, reject) => {
            const { draftObj } = this.props;
            const excerpt = draftObj.getIn(['content', 'excerpt']);
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

    _togglePublishPanel = state =>
        () => {
            this.setState({
                showPublishPanel: state
            });
        }

    _createRef = nodeName =>
        (node) => { this[nodeName] = node; }

    /* eslint-disable complexity */
    render () {
        const { intl, baseUrl, draftObj, licences, match, tagSuggestions, tagSuggestionsCount,
            showSecondarySidebar, loggedProfile, selectionState } = this.props;
        const { showPublishPanel, errors, shouldResetCaret } = this.state;

        if (!draftObj) {
            return (<div>Finding draft</div>);
        }
        const currentSelection = selectionState.getIn([draftObj.get('id'), loggedProfile.get('ethAddress')]);
        const { content, tags, localChanges, onChain } = draftObj;
        const { excerpt, draft, latestVersion, licence, cardInfo } = content;
        const { url, title, description } = cardInfo;
        let draftWithSelection = draft;

        if (currentSelection && currentSelection.size > 0 && shouldResetCaret) {
            draftWithSelection = EditorState.forceSelection(draft, currentSelection);
        } else if (currentSelection && currentSelection.size > 0) {
            draftWithSelection = EditorState.acceptSelection(draft, currentSelection);
        }
        return (
          <div className="edit-entry-page link-page">
            <div
              className="edit-entry-page__publish-options"
              onClick={this._togglePublishPanel(true)}
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
                  <input
                    ref={this._createRef('titleInput')}
                    className="edit-entry-page__url-input-field"
                    placeholder="Enter an address. eg. www.akasha.world"
                    onChange={this._handleUrlChange}
                    onBlur={this._handleUrlBlur}
                    onKeyPress={this._handleKeyPress}
                    value={url}
                  />
                  {(title || description) &&
                  <div>
                    <WebsiteInfoCard
                      baseUrl={baseUrl}
                      cardInfo={cardInfo}
                      hasCard={!!(title || description)}
                      url={url}
                    />
                    <div>
                      <TextEntryEditor
                        ref={this._createRef('editor')}
                        onChange={this._handleEditorChange}
                        editorState={draftWithSelection}
                        selectionState={currentSelection}
                        baseUrl={baseUrl}
                        intl={intl}
                      />
                    </div>
                  </div>
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
                    tagSearchLocal={this.props.tagSearchLocal}
                    tagSuggestions={tagSuggestions}
                    tagSuggestionsCount={tagSuggestionsCount}
                    searchResetResults={this.props.searchResetResults}
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
                  linkEntry
                  baseUrl={baseUrl}
                  intl={intl}
                  onClose={this._togglePublishPanel(false)}
                  onLicenceChange={this._handleDraftLicenceChange}
                  onExcerptChange={this._handleExcerptChange}
                  title={title}
                  excerpt={excerpt}
                  errors={errors}
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

NewLinkEntryPage.propTypes = {
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
    selectionState: PropTypes.shape(),
    showSecondarySidebar: PropTypes.bool,
    secondarySidebarToggle: PropTypes.func,
    searchResetResults: PropTypes.func,
    tagSearchLocal: PropTypes.func,
    tagSuggestions: PropTypes.shape(),
    tagSuggestionsCount: PropTypes.number,
    userDefaultLicense: PropTypes.shape(),

};
const mapStateToProps = (state, ownProps) => ({
    loggedProfile: selectLoggedProfile(state),
    baseUrl: state.externalProcState.getIn(['ipfs', 'status', 'baseUrl']),
    draftObj: selectDraftById(state, ownProps.match.params.draftId),
    draftsFetched: state.draftState.get('draftsFetched'),
    entriesFetched: state.draftState.get('entriesFetched'),
    licences: state.licenseState.get('byId'),
    resolvingEntries: state.draftState.get('resolvingEntries'),
    selectionState: state.draftState.get('selection'),
    showSecondarySidebar: state.appState.get('showSecondarySidebar'),
    tagSuggestions: state.searchState.get('tags'),
    tagSuggestionsCount: state.searchState.get('resultsCount'),
    userDefaultLicense: state.settingsState.getIn(['userSettings', 'defaultLicense'])
});

export default connect(
    mapStateToProps,
    {
        actionAdd,
        entryGetFull,
        draftCreate,
        draftUpdate,
        draftRevertToVersion,
        searchResetResults,
        tagSearchLocal,
        secondarySidebarToggle,
    }
)(injectIntl(NewLinkEntryPage));

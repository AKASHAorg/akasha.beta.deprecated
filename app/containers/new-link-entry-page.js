import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Col, Row, Button, Modal } from 'antd';
import { DraftJS } from 'megadraft';
import { fromJS } from 'immutable';
import { PublishOptionsPanel, TextEntryEditor, EntryVersionTimeline,
    TagEditor, WebsiteInfoCard, DataLoader, Icon } from '../components';
import { genId } from '../utils/dataModule';
import { selectDraftById, selectLoggedProfile } from '../local-flux/selectors';
import { entryMessages, generalMessages } from '../locale-data/messages';
import { WebsiteParser } from '../utils/extract-website-info';
import { draftCreate, draftUpdate, draftRevertToVersion } from '../local-flux/actions/draft-actions';
import { entryGetFull } from '../local-flux/actions/entry-actions';
import { actionAdd } from '../local-flux/actions/action-actions';
import { searchResetResults, searchTags } from '../local-flux/actions/search-actions';
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
            parsingInfo: false,
            urlInputHidden: false,
            infoExtracted: false,
        };
    }

    componentWillReceiveProps (nextProps) {
        const { draftObj } = nextProps;
        const hasCardContent = draftObj &&
            (draftObj.getIn(['content', 'cardInfo', 'title']).length > 0 ||
            draftObj.getIn(['content', 'cardInfo', 'description']).length > 0) &&
            draftObj.getIn(['content', 'cardInfo', 'url']).length > 0;
        if (hasCardContent) {
            this.setState({
                urlInputHidden: true,
                infoExtracted: true
            });
        } else {
            this.setState({
                urlInputHidden: false,
                infoExtracted: false
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
                cardInfo: {},
                licence: userDefaultLicence,
                featuredImage: {},
                entryType: 'link',
            },
            tags: [],
        });
        history.push(`/draft/link/${draftId}`);
        ev.preventDefault();
    }
    _processUrl = () => {
        const { draftObj, loggedProfile, match, intl } = this.props;
        const url = draftObj.getIn(['content', 'cardInfo', 'url']);
        this.setState({
            parsingInfo: true,
            urlInputHidden: true
        }, () => {
            const parser = new WebsiteParser({
                url,
                uploadImageToIpfs: true
            });
            parser.getInfo().then((data) => {
                this.props.draftUpdate(draftObj.merge(fromJS({
                    ethAddress: loggedProfile.get('ethAddress'),
                    content: draftObj.get('content').merge(fromJS({
                        cardInfo: draftObj.getIn(['content', 'cardInfo']).merge(fromJS({
                            title: data.info.title,
                            description: data.info.description,
                            image: data.info.image,
                            bgColor: data.info.bgColor,
                            url: data.url
                        })),
                    })),
                    id: match.params.draftId,
                })));
                this.setState({
                    parsingInfo: false,
                    infoExtracted: true
                });
            }).catch(() => {
                this.setState({
                    errors: {
                        card: intl.formatMessage(entryMessages.websiteInfoFetchingError),
                    },
                    parsingInfo: false,
                    infoExtracted: true
                });
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
        const { draftObj } = this.props;
        // handle enter key press
        if (ev.which === 13) {
            if (draftObj.getIn(['content', 'cardInfo', 'url']).length) {
                this._processUrl();
            }
            if (!ev.defaultPrevented) {
                ev.preventDefault();
            }
        }
    }

    _handleUrlChange = (ev) => {
        const { match, loggedProfile, draftObj } = this.props;
        this.props.draftUpdate(draftObj.merge(fromJS({
            ethAddress: loggedProfile.get('ethAddress'),
            content: draftObj.get('content').mergeIn(['cardInfo'], fromJS({
                url: ev.target.value,
            })),
            id: match.params.draftId,
        })));
    }

    _handleEditorChange = (editorState) => {
        const { draftObj, loggedProfile } = this.props;
        this.props.draftUpdate(draftObj.merge(fromJS({
            ethAddress: loggedProfile.get('ethAddress'),
            content: draftObj.get('content').mergeDeep(fromJS({
                draft: editorState,
            })),
        })));
    }

    _handleTagUpdate = (tagList) => {
        const { draftObj, loggedProfile } = this.props;
        this.props.draftUpdate(draftObj.merge(fromJS({
            ethAddress: loggedProfile.get('ethAddress'),
            tags: draftObj.get('tags').clear().concat(tagList),
        })));
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
            draftObj.merge(fromJS({
                ethAddress: loggedProfile.get('ethAddress'),
                content: draftObj.get('content').setIn(['licence', licenceField], licence)
            }))
        );
    }

    _handleExcerptChange = (excerpt) => {
        const { draftObj, loggedProfile } = this.props;
        this.props.draftUpdate(draftObj.merge(fromJS({
            ethAddress: loggedProfile.get('ethAddress'),
            content: draftObj.get('content').setIn(['excerpt'], excerpt),
        })));
        this.setState(prevState => ({
            errors: {
                ...prevState.errors,
                excerpt: null,
            }
        }));
    }

    validateData = () =>
        new Promise((resolve, reject) => {
            const { draftObj, intl } = this.props;
            const excerpt = draftObj.getIn(['content', 'excerpt']);
            if (draftObj.get('tags').size === 0) {
                return reject({ tags: intl.formatMessage(entryMessages.errorOneTagRequired) });
            }
            if (this.state.tagError) {
                return reject({ tags: intl.formatMessage(entryMessages.oneOfTheTagsCannotBeUsed) });
            }
            if (excerpt.length > 120) {
                return this.setState({
                    showPublishPanel: true
                }, () => reject({ excerpt: intl.formatMessage(entryMessages.errorExcerptTooLong) }));
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

    _handleInfoCardClose = () => {
        const { draftObj, loggedProfile, match } = this.props;
        const { card, ...otherErrors } = this.state.errors;
        this.setState({
            parsingInfo: false,
            urlInputHidden: false,
            errors: otherErrors,
            infoExtracted: false,
        }, () => {
            this.props.draftUpdate(
                draftObj.merge(fromJS({
                    ethAddress: loggedProfile.get('ethAddress'),
                    content: draftObj.get('content').mergeIn(['cardInfo'], fromJS({
                        url: '',
                        image: {},
                        title: '',
                        description: '',
                        bgColor: null,
                    })),
                    id: match.params.draftId,
                }))
            );
        });
    }

    _togglePublishPanel = state =>
        () => {
            this.setState({
                showPublishPanel: state
            });
        }

    _createRef = nodeName =>
        (node) => { this[nodeName] = node; }

    _calculateEditorMinHeight = () => {
        let height = '20%';
        const websiteInfoCard = this.websiteInfoCard;
        const baseNode = this.editorBaseNodeRef;
        if (websiteInfoCard && websiteInfoCard.getNodeRef().container && baseNode) {
            const wicNode = websiteInfoCard.getNodeRef().container;
            const rootNodeHeight = baseNode.getBoundingClientRect().height;
            const maxHeight = rootNodeHeight;
            height = maxHeight - wicNode.getBoundingClientRect().height - 70;
        }
        return height;
    }
    _handleInternalTagError = (hasError) => {
        this.setState({
            tagError: hasError
        });
    }
    _checkIfDisabled = () => {
        if (this.state.tagError) {
            return true;
        }
        return false;
    }
    /* eslint-disable complexity */
    render () {
        const { intl, baseUrl, darkTheme, draftObj, drafts, draftsFetched, licences, match, tagSuggestions, tagSuggestionsCount,
            showSecondarySidebar, loggedProfile, selectionState } = this.props;
        const { showPublishPanel, errors, shouldResetCaret, parsingInfo,
            infoExtracted, urlInputHidden } = this.state;
        const matchingDrafts = drafts.filter(draft =>
            draft.getIn(['content', 'entryType']) === match.params.draftType && !draft.get('onChain'));
        if (!draftObj && matchingDrafts.size === 0 && draftsFetched) {
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
        const editorMinHeight = this._calculateEditorMinHeight();
        return (
          <div
            className="edit-entry-page link-page"
          >
            <div
              className="flex-center-y edit-entry-page__publish-options"
              onClick={this._togglePublishPanel(true)}
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
                  className="edit-entry-page__editor"
                  ref={(node) => { this.editorBaseNodeRef = node; }}
                >
                  {!urlInputHidden &&
                    <input
                      ref={this._createRef('titleInput')}
                      className="edit-entry-page__url-input-field"
                      placeholder={intl.formatMessage(entryMessages.enterWebAddress)}
                      onChange={this._handleUrlChange}
                      onBlur={this._handleUrlBlur}
                      onKeyPress={this._handleKeyPress}
                      value={url}
                    />
                  }
                  <div className="edit-entry-page__info-card-wrapper">
                    <WebsiteInfoCard
                      ref={(node) => { this.websiteInfoCard = node; }}
                      baseUrl={baseUrl}
                      cardInfo={cardInfo}
                      intl={intl}
                      hasCard={!!(title.length > 0 || description.length > 0)}
                      url={url}
                      onClose={this._handleInfoCardClose}
                      isEdit
                      loading={parsingInfo}
                      infoExtracted={infoExtracted}
                      error={errors.card}
                    />
                  </div>
                  {!parsingInfo && infoExtracted && !errors.card &&
                    <div style={{ minHeight: editorMinHeight }}>
                      <TextEntryEditor
                        ref={this._createRef('editor')}
                        className={`text-entry-editor${showSecondarySidebar ? '' : '_full'} link-entry`}
                        onChange={this._handleEditorChange}
                        editorState={draftWithSelection}
                        selectionState={currentSelection}
                        baseUrl={baseUrl}
                        intl={intl}
                      />
                    </div>
                  }
                  {!parsingInfo && infoExtracted && !errors.card &&
                    <div className="edit-entry-page__tag-editor_wrapper">
                      <TagEditor
                        className="edit-entry-page__tag-editor"
                        ref={this._createRef('tagEditor')}
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
                        onTagError={this._handleInternalTagError}
                      />
                      {errors.tags &&
                        <small className="edit-entry-page__error-text">{errors.tags}</small>
                      }
                    </div>
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
                  linkEntry
                  errors={errors}
                  baseUrl={baseUrl}
                  intl={intl}
                  onClose={this._togglePublishPanel(false)}
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
                      {draftObj.get('publishing') && !onChain && intl.formatMessage(generalMessages.publishing)}
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
    history: PropTypes.shape(),
    darkTheme: PropTypes.bool,
    draftObj: PropTypes.shape(),
    draftCreate: PropTypes.func,
    draftUpdate: PropTypes.func,
    draftRevertToVersion: PropTypes.func,
    drafts: PropTypes.shape(),
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
    searchResetResults: PropTypes.func,
    searchTags: PropTypes.func,
    tagSuggestions: PropTypes.shape(),
    tagSuggestionsCount: PropTypes.number,
    userDefaultLicence: PropTypes.shape(),

};
const mapStateToProps = (state, ownProps) => ({
    loggedProfile: selectLoggedProfile(state),
    baseUrl: state.externalProcState.getIn(['ipfs', 'status', 'baseUrl']),
    darkTheme: state.settingsState.getIn(['general', 'darkTheme']),
    draftObj: selectDraftById(state, ownProps.match.params.draftId),
    drafts: state.draftState.get('drafts'),
    draftsFetched: state.draftState.get('draftsFetched'),
    entriesFetched: state.draftState.get('entriesFetched'),
    licences: state.licenseState.get('byId'),
    resolvingEntries: state.draftState.get('resolvingEntries'),
    selectionState: state.draftState.get('selection'),
    showSecondarySidebar: state.appState.get('showSecondarySidebar'),
    tagSuggestions: state.searchState.get('tags'),
    tagSuggestionsCount: state.searchState.get('tagResultsCount'),
    userDefaultLicence: state.settingsState.getIn(['userSettings', 'defaultLicense'])
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
        searchTags,
    }
)(injectIntl(NewLinkEntryPage));

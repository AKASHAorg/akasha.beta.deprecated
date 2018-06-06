import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Col, Row } from 'antd';
import { DraftJS } from 'megadraft';
import { fromJS } from 'immutable';
import { DataLoader, EditorFooter, NoDraftsPlaceholder, PublishOptionsPanel, TextEntryEditor, TagEditor,
    WebsiteInfoCard } from '../components';
import { genId } from '../utils/dataModule';
import { selectDraftById, selectLoggedProfile } from '../local-flux/selectors';
import { entryMessages } from '../locale-data/messages';
import { WebsiteParser } from '../utils/extract-website-info';
import { draftAddTag, draftRemoveTag, draftCreate, draftUpdate,
    draftRevertToVersion } from '../local-flux/actions/draft-actions';
import { entryGetFull } from '../local-flux/actions/entry-actions';
import { actionAdd } from '../local-flux/actions/action-actions';
import { searchResetResults, searchTags } from '../local-flux/actions/search-actions';
import * as actionTypes from '../constants/action-types';
import { entryTypes } from '../constants/entry-types';

const { EditorState } = DraftJS;

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
    componentWillMount () {
        const { draftObj } = this.props;
        if (draftObj) {
            const shouldProcessUrl = draftObj.getIn(['content', 'cardInfo', 'url']).length > 0;
            if (shouldProcessUrl) {
                this._processUrl();
            }
        }
    }
    componentWillReceiveProps (nextProps) { // eslint-disable-line complexity
        const { draftObj, drafts } = nextProps;
        const { history } = this.props;
        const isSameEntry = draftObj && this.props.draftObj &&
            draftObj.get('id') === this.props.draftObj.get('id');
        const isNewlyLoaded = draftObj && !this.props.draftObj;
        const shouldProcessUrl = draftObj && draftObj.getIn(['content', 'cardInfo', 'url']).length > 0 &&
            (!isSameEntry || isNewlyLoaded);
        const hasCardContent = draftObj &&
            (draftObj.getIn(['content', 'cardInfo', 'title']).length > 0 ||
            draftObj.getIn(['content', 'cardInfo', 'description']).length > 0) &&
            draftObj.getIn(['content', 'cardInfo', 'url']).length > 0;
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
        if (hasCardContent && isSameEntry) {
            this.setState({
                urlInputHidden: true,
                infoExtracted: true
            });
        } else if (shouldProcessUrl) {
            this.setState({
                urlInputHidden: false,
                infoExtracted: false
            });
            this._processUrl(draftObj);
        } else if (!isSameEntry) {
            this.setState({
                urlInputHidden: false,
                infoExtracted: false,
                parsingInfo: false
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
            tags: {},
        });
        history.push(`/draft/link/${draftId}`);
        ev.preventDefault();
    };
    _processUrl = (newerDraft) => {
        const { loggedProfile, intl } = this.props;
        let { draftObj } = this.props;
        if (newerDraft) {
            draftObj = newerDraft;
        }
        const url = draftObj.getIn(['content', 'cardInfo', 'url']);
        const draftId = draftObj.get('id');

        this.setState({
            parsingInfo: true,
            urlInputHidden: true,
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
                    id: draftId,
                })));
                this.setState({
                    parsingInfo: false,
                    infoExtracted: true,
                    parsingUrl: false
                });
            }).catch((error) => {
                console.error('parser crashed!', error);
                this.setState({
                    errors: {
                        card: error || intl.formatMessage(entryMessages.websiteInfoFetchingError),
                    },
                    parsingInfo: false,
                    infoExtracted: true,
                });
            });
        });
    };

    _handleUrlBlur = () => {
        const { draftObj } = this.props;
        const { content } = draftObj;
        this.setState({
            errors: {}
        }, () => {
            if (content.getIn(['cardInfo', 'url']).length > 0) {
                return this._processUrl();
            }
            return this.props.draftUpdate(draftObj);
        });
    };

    _handleKeyPress = (ev) => {
        const { draftObj } = this.props;
        // handle enter key press
        if (ev.keyCode === 13) {
            this.setState({
                errors: {}
            }, () => {
                if (draftObj.getIn(['content', 'cardInfo', 'url']).length) {
                    this._processUrl();
                }
            });
        }
    };

    _handleUrlChange = (ev) => {
        const { match, loggedProfile, draftObj } = this.props;
        this.props.draftUpdate(draftObj.merge(fromJS({
            ethAddress: loggedProfile.get('ethAddress'),
            content: draftObj.get('content').mergeIn(['cardInfo'], fromJS({
                url: ev.target.value,
            })),
            id: match.params.draftId,
        })));
    };

    _handleEditorChange = (editorState) => {
        const { draftObj, loggedProfile } = this.props;
        this.props.draftUpdate(draftObj.merge(fromJS({
            ethAddress: loggedProfile.get('ethAddress'),
            content: draftObj.get('content').mergeDeep(fromJS({
                draft: editorState,
            })),
        })));
    };

    _handleTagAdd = (tagName) => {
        const { draftObj } = this.props;
        this.props.draftAddTag({
            tagName,
            draftId: draftObj.get('id')
        });
        this.props.draftUpdate(draftObj.setIn(['tags', tagName], { fetching: true }));
    };

    _handleTagRemove = (tagName) => {
        const { draftObj } = this.props;
        this.props.draftRemoveTag({
            tagName,
            draftId: draftObj.get('id')
        });
        this.props.draftUpdate(draftObj.deleteIn(['tags', tagName]));
    };

    _handleDraftLicenceChange = (licenceField, licence) => {
        const { draftObj, loggedProfile } = this.props;
        this.props.draftUpdate(
            draftObj.merge(fromJS({
                ethAddress: loggedProfile.get('ethAddress'),
                content: draftObj.get('content').setIn(['licence', licenceField], licence)
            }))
        );
    };

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
    };

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
        const { draftObj, loggedProfile } = this.props;
        const publishPayload = {
            id: draftObj.id,
            title: draftObj.getIn(['content', 'cardInfo', 'title']),
            type: entryTypes.findIndex(type => type === draftObj.getIn(['content', 'entryType']))
        };
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
    };

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
    };

    _togglePublishPanel = () => {
        this.setState({
            showPublishPanel: !this.state.showPublishPanel
        });
    };

    _createRef = nodeName =>
        (node) => { this[nodeName] = node; };

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
    };
    _handleInternalTagError = (hasError) => {
        this.setState({
            tagError: hasError
        });
    };
    _handleTagInputChange = () => {
        this.setState(prevState => ({
            errors: {
                ...prevState.errors,
                tags: null
            }
        }));
    };
    _checkIfDisabled = () => {
        const { pendingFaucetTx } = this.props;
        if (this.state.tagError) {
            return true;
        }
        if (pendingFaucetTx) {
            return true;
        }
        return false;
    };
    render () { // eslint-disable-line complexity
        const { intl, baseUrl, darkTheme, draftObj, drafts, draftsFetched, licences,
            match, tagSuggestions, tagSuggestionsCount, showSecondarySidebar,
            loggedProfile, selectionState, canCreateTags } = this.props;

        const { showPublishPanel, errors, shouldResetCaret, parsingInfo,
            infoExtracted, urlInputHidden } = this.state;
        const unpublishedDrafts = drafts.filter(drft => !drft.get('onChain'));
        const draftId = match.params.draftId;

        if (!draftObj && unpublishedDrafts.size === 0 && !draftId.startsWith('0x') && draftsFetched) {
            return <NoDraftsPlaceholder darkTheme={darkTheme} onNewDraft={this._createNewDraft} />;
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
        const currentSelection = selectionState.getIn([draftObj.get('id'), loggedProfile.get('ethAddress')]);
        const { content, tags, onChain } = draftObj;
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
          <div className="edit-entry-page link-page">
            <Row type="flex" className="edit-entry-page__content">
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
                      className="edit-entry-page__url-input-field"
                      placeholder={intl.formatMessage(entryMessages.enterWebAddress)}
                      onChange={this._handleUrlChange}
                      onBlur={this._handleUrlBlur}
                      onKeyDown={this._handleKeyPress}
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
                        canCreateTags={canCreateTags}
                        className="edit-entry-page__tag-editor"
                        intl={intl}
                        isUpdate={onChain}
                        onChange={this._handleTagInputChange}
                        onTagAdd={this._handleTagAdd}
                        onTagRemove={this._handleTagRemove}
                        searchResetResults={this.props.searchResetResults}
                        searchTags={this.props.searchTags}
                        tagErrors={errors.tags}
                        tags={tags}
                        tagSuggestions={tagSuggestions}
                        tagSuggestionsCount={tagSuggestionsCount}
                      />
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
                  onClose={this._togglePublishPanel}
                  onLicenceChange={this._handleDraftLicenceChange}
                  onExcerptChange={this._handleExcerptChange}
                  excerpt={excerpt}
                  selectedLicence={licence}
                  licences={licences}
                />
              </Col>
              <EditorFooter
                disabled={this._checkIfDisabled()}
                draftObj={draftObj}
                draftRevertToVersion={this.props.draftRevertToVersion}
                latestVersion={latestVersion}
                onPublish={this._handlePublish}
                onPublishOptions={this._togglePublishPanel}
                showSecondarySidebar={showSecondarySidebar}
              />
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
    draftAddTag: PropTypes.func,
    draftRemoveTag: PropTypes.func,
    draftCreate: PropTypes.func,
    draftUpdate: PropTypes.func,
    draftRevertToVersion: PropTypes.func,
    drafts: PropTypes.shape(),
    draftsFetched: PropTypes.bool,
    entryGetFull: PropTypes.func,
    intl: PropTypes.shape(),
    licences: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    match: PropTypes.shape(),
    selectionState: PropTypes.shape(),
    showSecondarySidebar: PropTypes.bool,
    searchResetResults: PropTypes.func,
    searchTags: PropTypes.func,
    tagSuggestions: PropTypes.shape(),
    tagSuggestionsCount: PropTypes.number,
    userDefaultLicence: PropTypes.shape(),
    pendingFaucetTx: PropTypes.bool,
    canCreateTags: PropTypes.bool,
};
const mapStateToProps = (state, ownProps) => ({
    loggedProfile: selectLoggedProfile(state),
    baseUrl: state.externalProcState.getIn(['ipfs', 'status', 'baseUrl']),
    darkTheme: state.settingsState.getIn(['general', 'darkTheme']),
    draftObj: selectDraftById(state, ownProps.match.params.draftId),
    draftAddTag: PropTypes.func,
    draftRemoveTag: PropTypes.func,
    drafts: state.draftState.get('drafts'),
    draftsFetched: state.draftState.get('draftsFetched'),
    licences: state.licenseState.get('byId'),
    resolvingEntries: state.draftState.get('resolvingEntries'),
    selectionState: state.draftState.get('selection'),
    showSecondarySidebar: state.appState.get('showSecondarySidebar'),
    tagSuggestions: state.searchState.get('tags'),
    tagSuggestionsCount: state.searchState.get('tagResultsCount'),
    userDefaultLicence: state.settingsState.getIn(['userSettings', 'defaultLicense']),
    pendingFaucetTx: state.actionState.getIn(['pending', 'faucet']),
    canCreateTags: state.profileState.get('canCreateTags'),
});

export default connect(
    mapStateToProps,
    {
        actionAdd,
        draftAddTag,
        draftRemoveTag,
        entryGetFull,
        draftCreate,
        draftUpdate,
        draftRevertToVersion,
        searchResetResults,
        searchTags,
    }
)(injectIntl(NewLinkEntryPage));

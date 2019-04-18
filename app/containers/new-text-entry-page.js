import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { fromJS } from 'immutable';
import { DraftJS } from 'megadraft';
import { Col, Row } from 'antd';
import {
    DataLoader,
    EditorFooter,
    NoDraftsPlaceholder,
    PublishOptionsPanel,
    TagEditor,
    TextEntryEditor
} from '../components';
import { genId } from '../utils/dataModule';
import {
    draftAddTag,
    draftCreate,
    draftRemoveTag,
    draftRevertToVersion,
    draftsGet,
    draftsGetCount,
    draftUpdate
} from '../local-flux/actions/draft-actions';
import { entryGetFull } from '../local-flux/actions/entry-actions';
import { searchResetResults, searchTags } from '../local-flux/actions/search-actions';
import { actionAdd } from '../local-flux/actions/action-actions';
import { tagExists } from '../local-flux/actions/tag-actions';
import { entryMessages } from '../locale-data/messages';
import {
    actionSelectors,
    appSelectors,
    draftSelectors,
    externalProcessSelectors,
    licenseSelectors,
    profileSelectors,
    searchSelectors,
    settingsSelectors
} from '../local-flux/selectors';
import * as actionTypes from '../constants/action-types';

const { EditorState } = DraftJS;

class NewEntryPage extends Component {
    state = {
        showPublishPanel: false,
        errors: {},
        shouldResetCaret: false,
    };

    componentWillReceiveProps (nextProps) { // eslint-disable-line complexity
        const { match, draftObj, drafts, selectionState } = nextProps;
        const { loggedProfile, history } = this.props;
        const ethAddress = loggedProfile.get('ethAddress');
        const currentSelection = selectionState.getIn([match.params.draftId, ethAddress]);

        /** handle just published draft! */
        if (!draftObj && this.props.draftObj) {
            if (drafts.size > 0) {
                const draftId = drafts.first().get('id');
                const draftType = drafts.first().getIn(['content', 'entryType']);
                if (draftId) {
                    history.push(`/draft/${ draftType }/${ draftId }`);
                }
            } else {
                history.push('/draft/article/noDraft');
            }
        }
        if (draftObj && this.props.draftObj &&
            (draftObj.get('tags').size !== this.props.draftObj.get('tags').size) &&
            draftObj.get('localChanges')
        ) {
            this.props.draftUpdate(draftObj);
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
            tags: {},
        });
        history.push(`/draft/article/${ draftId }`);
        ev.preventDefault();
    };
    _showPublishOptionsPanel = () => {
        this.setState({
            showPublishPanel: !this.state.showPublishPanel
        });
    };

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
    };

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
    };

    _handleTagAdd = (tagName) => {
        const { draftObj } = this.props;
        this.props.draftAddTag({
            tagName,
            draftId: draftObj.get('id')
        });
    };

    _handleTagRemove = (tagName) => {
        const { draftObj } = this.props;
        this.props.draftRemoveTag({
            tagName,
            draftId: draftObj.get('id')
        });
    };

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
            return this.props.draftUpdate(
                draftObj.merge({
                    ethAddress: loggedProfile.get('ethAddress'),
                    content: draftObj.get('content').merge({
                        licence: draftObj.getIn(['content', 'licence']).merge({
                            parent: licence,
                            id: null,
                        })
                    })
                })
            );
        }
        return this.props.draftUpdate(
            draftObj.merge({
                ethAddress: loggedProfile.get('ethAddress'),
                content: draftObj.get('content').setIn(['licence', licenceField], licence)
            })
        );
    };

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
    };

    _handleFeaturedImageChange = (image) => {
        const { draftObj, loggedProfile } = this.props;
        this.props.draftUpdate(
            draftObj.merge({
                ethAddress: loggedProfile.get('ethAddress'),
                content: draftObj.get('content').set('featuredImage', fromJS(image))
            })
        );
    };

    _handlePublishPanelClose = () => {
        this.setState({
            showPublishPanel: false
        });
    };

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
        (node) => {
            this[nodeName] = node;
        };

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
        if (pendingFaucetTx) {
            return true;
        }
        return false;
    };

    _handleTitleKeyPress = (ev) => {
        if (ev.keyCode === 13) {
            this.editor.focus();
        }
    };

    render () { // eslint-disable-line complexity
        const { showPublishPanel, errors, shouldResetCaret } = this.state;
        const {
            loggedProfile, baseUrl, drafts, darkTheme, showSecondarySidebar, intl, draftObj,
            draftsFetched, tagSuggestions, tagSuggestionsCount, match, licences, resolvingEntries,
            selectionState, canCreateTags
        } = this.props;
        const draftId = match.params.draftId;
        const unpublishedDrafts = drafts.filter(drft => !drft.get('onChain'));

        if (!draftObj && unpublishedDrafts.size === 0 && !draftId.startsWith('0x') && draftsFetched) {
            return <NoDraftsPlaceholder darkTheme={ darkTheme }
                                        onNewDraft={ this._createNewDraft }/>;
        }
        if ((!draftObj || !draftObj.get('content'))) {
            return (
                <DataLoader
                    flag
                    message={ intl.formatMessage(entryMessages.loadingDrafts) }
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
                                { intl.formatMessage(entryMessages.resolvingIpfsHash) }
                            </div>
                            <div>
                                { intl.formatMessage(entryMessages.makeSureToOpenDApp) }
                            </div>
                        </div>
                    }
                    size="large"
                    className="edit-entry-page__data-loader"
                />
            );
        }
        const currentSelection = selectionState.getIn([draftObj.get('id'), loggedProfile.get('ethAddress')]);
        const { content, tags, onChain } = draftObj;
        const { title, excerpt, latestVersion, licence, draft, featuredImage } = content;
        let draftWithSelection = draft;

        if (currentSelection && currentSelection.size > 0 && shouldResetCaret) {
            draftWithSelection = EditorState.forceSelection(draft, currentSelection);
        } else if (currentSelection && currentSelection.size > 0) {
            draftWithSelection = EditorState.acceptSelection(draft, currentSelection);
        }
        return (
            <div className="edit-entry-page article-page">
                <Row type="flex" className="edit-entry-page__content">
                    <Col
                        span={ showPublishPanel ? 17 : 24 }
                        className="edit-entry-page__editor-wrapper"
                    >
                        <div
                            id="editor"
                            className={
                                `edit-entry-page__editor
                    edit-entry-page__editor${ showSecondarySidebar ? '' : '_full' }`
                            }
                        >
                            <div className="edit-entry-page__editor-inner">
                                <input
                                    className={
                                        `edit-entry-page__title-input-field
                        edit-entry-page__title-input-field${ showSecondarySidebar ? '' : '_full' }`
                                    }
                                    placeholder={ intl.formatMessage(entryMessages.title) }
                                    onChange={ this._handleTitleChange }
                                    onKeyDown={ this._handleTitleKeyPress }
                                    value={ title }
                                />
                                { errors.title &&
                                <small
                                    className="edit-entry-page__error-text">{ errors.title }</small>
                                }
                                <TextEntryEditor
                                    ref={ this._createRef('editor') }
                                    className={
                                        `text-entry-editor${ showSecondarySidebar ? '' : '_full' }`
                                    }
                                    onChange={ this._handleEditorChange }
                                    editorState={ draftWithSelection }
                                    selectionState={ currentSelection }
                                    baseUrl={ baseUrl }
                                    intl={ intl }
                                    sidebarReposition={ showPublishPanel }
                                />
                                { errors.draft &&
                                <small
                                    className="edit-entry-page__error-text">{ errors.draft }</small>
                                }
                            </div>
                            <TagEditor
                                canCreateTags={ canCreateTags }
                                className="edit-entry-page__tag-editor"
                                intl={ intl }
                                isUpdate={ onChain }
                                onChange={ this._handleTagInputChange }
                                onTagAdd={ this._handleTagAdd }
                                onTagRemove={ this._handleTagRemove }
                                searchResetResults={ this.props.searchResetResults }
                                searchTags={ this.props.searchTags }
                                tagErrors={ errors.tags }
                                tags={ tags }
                                tagSuggestions={ tagSuggestions }
                                tagSuggestionsCount={ tagSuggestionsCount }
                            />
                        </div>
                    </Col>
                    <Col
                        span={ 6 }
                        className={
                            `edit-entry-page__publish-options-panel-wrapper
                    edit-entry-page__publish-options-panel-wrapper${ showPublishPanel ? '_open' : '' }`
                        }
                    >
                        <PublishOptionsPanel
                            baseUrl={ baseUrl }
                            errors={ errors }
                            intl={ intl }
                            onClose={ this._handlePublishPanelClose }
                            onLicenceChange={ this._handleDraftLicenceChange }
                            onExcerptChange={ this._handleExcerptChange }
                            onFeaturedImageChange={ this._handleFeaturedImageChange }
                            excerpt={ excerpt }
                            featuredImage={ featuredImage }
                            selectedLicence={ licence }
                            licences={ licences }
                        />
                    </Col>
                    <EditorFooter
                        disabled={ this._checkIfDisabled() }
                        draftObj={ draftObj }
                        draftRevertToVersion={ this.props.draftRevertToVersion }
                        latestVersion={ latestVersion }
                        onPublish={ this._handlePublish }
                        onPublishOptions={ this._showPublishOptionsPanel }
                        showSecondarySidebar={ showSecondarySidebar }
                    />
                </Row>
            </div>
        );
    }
}

NewEntryPage.propTypes = {
    actionAdd: PropTypes.func,
    baseUrl: PropTypes.string,
    canCreateTags: PropTypes.bool,
    draftObj: PropTypes.shape(),
    draftAddTag: PropTypes.func,
    draftRemoveTag: PropTypes.func,
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
    tagExists: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
    baseUrl: externalProcessSelectors.getBaseUrl(state),
    draftObj: draftSelectors.selectDraftById(state, ownProps.match.params.draftId),
    drafts: draftSelectors.selectDrafts(state),
    draftsFetched: draftSelectors.selectDraftsFetched(state),
    darkTheme: settingsSelectors.getThemeSettings(state),
    licences: licenseSelectors.selectAllLicenses(state),
    loggedProfile: profileSelectors.selectLoggedProfile(state),
    selectionState: draftSelectors.selectDraftsSelection(state),
    resolvingEntries: draftSelectors.selectDraftsResolvingEntries(state),
    showSecondarySidebar: appSelectors.selectShowSecondarySidebar(state),
    tagSuggestions: searchSelectors.selectTagSearchResults(state),
    tagSuggestionsCount: searchSelectors.selectTagSearchResultsCount(state),
    userDefaultLicence: licenseSelectors.getUserDefaultLicence(state),
    pendingFaucetTx: actionSelectors.getPendingActionByType(state, 'faucet'),
    canCreateTags: profileSelectors.selectCanCreateTags(state),
});

export default connect(
    mapStateToProps,
    {
        actionAdd,
        draftAddTag,
        draftRemoveTag,
        draftCreate,
        draftsGet,
        draftUpdate,
        draftsGetCount,
        draftRevertToVersion,
        entryGetFull,
        searchTags,
        searchResetResults,
        tagExists,
    }
)(injectIntl(NewEntryPage));

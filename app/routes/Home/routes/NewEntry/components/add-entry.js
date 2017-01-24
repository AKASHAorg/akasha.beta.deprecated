import React, { Component, PropTypes } from 'react';
import {
    Toolbar,
    ToolbarGroup,
    FlatButton,
    IconButton,
    IconMenu,
    MenuItem } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { getWordCount } from 'utils/dataModule'; // eslint-disable-line import/no-unresolved, import/extensions
import { AlertDialog, EntryEditor } from 'shared-components'; // eslint-disable-line import/no-unresolved, import/extensions
import { generalMessages } from 'locale-data/messages'; // eslint-disable-line import/no-unresolved, import/extensions
import { injectIntl } from 'react-intl';

class AddEntryPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isNewDraft: false,
            fetchingDraft: false,
            errors: {}
        };
    }

    componentDidMount () {
        const { drafts, entryActions, location, params } = this.props;
        const currentDraft = this._findCurrentDraft(drafts);
        if (params.draftId !== 'new' && !currentDraft) {
            this.getDraft(params.draftId);
        }
        if (params.draftId === 'new' && location.query.editEntry) {
            entryActions.getFullEntry(location.query.editEntry);
        }
    }

    componentWillReceiveProps (nextProps) {
        const { drafts, location, params } = nextProps;
        const currentDraft = this._findCurrentDraft(drafts);
        const currentPathName = this.props.location.pathname;
        if (params.draftId === 'new') {
            this.setState({
                isNewDraft: !location.query.editEntry,
                fetchingDraft: !location.query.editEntry ? false : this.state.fetchingDraft
            });
        } else if (!currentDraft && !this.state.fetchingDraft) {
            this.getDraft(params.draftId);
        } else {
            this.setState({
                isNewDraft: false
            });
        }
        if (currentPathName.includes('/publish') || currentPathName.includes('/publish-status')) {
            this.context.router.setRouteLeaveHook(this.props.route, () => true);
        } else {
            this.context.router.setRouteLeaveHook(this.props.route, this.onPageLeave);
        }
    }

    componentWillUnmount () {
        const { entryActions } = this.props;
        entryActions.unloadFullEntry();
    }

    // display an alert when leaving route
    onPageLeave = (nextLocation) => { // eslint-disable-line consistent-return
        const nextIsPublish = nextLocation.pathname.includes('/publish');
        if (this.state.shouldBeSaved && !this.waitingConfirm && !nextIsPublish) {
            if (this.alertDialog) {
                this.alertDialog.show(((confirmed) => {
                    if (confirmed) {
                        this.context.router.replace(nextLocation);
                    }
                    this.waitingConfirm = false;
                }));
                this.waitingConfirm = true;
                return false;
            }
        }
    };

    // fetch draft with id
    getDraft = (draftId) => {
        const { draftActions } = this.props;
        if (draftId) {
            draftActions.getDraftById(parseInt(draftId, 10));
        }
    };

    convertEntryToDraft = (entry) => {
        if (!entry || !entry.content) {
            return null;
        }
        const draft = {};
        const { tags, ...content } = entry.content;
        draft.content = content;
        draft.tags = entry.content.tags;
        draft.entryId = entry.entryId;
        return draft;
    };

    _findCurrentDraft = (drafts) => {
        const { fullEntry, location, params } = this.props;
        if (location.query.editEntry) {
            const entry = fullEntry && fullEntry.toJS();
            if (entry) {
                return this.convertEntryToDraft(entry);
            }
            return null;
        }
        return drafts.find(draft => draft.id === parseInt(params.draftId, 10));
    };

    // we only want to check if it should be saved so no params needed
    _handleEditorChange = () => {
        this.setState({
            shouldBeSaved: true
        });
    };

    _handleDraftSave = () => {
        const { params } = this.props;
        this._saveDraft().then((draft) => {
            let draftId;
            if (draft.id) {
                draftId = draft.id;
            }
            if (typeof draft === 'number') {
                draftId = draft;
            }
            this.setState({
                shouldBeSaved: false
            }, () => {
                this.context.router.replace(`/${params.akashaId}/draft/${draftId}`);
            });
        });
    };

    // published draft structure
    /**
     * {
     *   content: { title, excerpt, licence, draft, wordCount }
     *   tags: []
     * }
     */
    _saveDraft = (showNotification = true) => {
        const { draftActions, params, drafts } = this.props;
        let { defaultLicence } = this.props;
        const draft = this.editor.getRawContent();
        const contentState = this.editor.getContent();
        const title = this.editor.getTitle();
        const wordCount = getWordCount(contentState);
        const excerpt = contentState.getPlainText().slice(0, 160).replace(/\r?\n|\r/g, '');
        const akashaId = params.akashaId;
        const currentDraft = this._findCurrentDraft(drafts);
        const entryId = (currentDraft && currentDraft.entryId) || null;
        if (!defaultLicence) {
            defaultLicence = { parent: null, id: '1' };
        }
        if (params.draftId !== 'new') {
            const draftId = parseInt(params.draftId, 10);
            const { tags = [], licence = defaultLicence } = currentDraft;
            return draftActions.updateDraft({
                id: draftId,
                content: {
                    title,
                    excerpt: (currentDraft && currentDraft.content.excerpt) || excerpt,
                    licence: (currentDraft && currentDraft.content.licence) || licence,
                    draft,
                    wordCount
                },
                tags: Array.isArray(tags) ? [] : tags.toJS(),
                akashaId,
                entryId
            }, showNotification);
        }

        return draftActions.createDraft(akashaId, {
            content: {
                title,
                draft,
                wordCount,
                excerpt: entryId ? currentDraft.content.excerpt : excerpt,
                licence: entryId ? currentDraft.content.licence : defaultLicence
            },
            tags: entryId ? currentDraft.tags : [],
            entryId
        }, showNotification);
    };

    _setupEntryForPublication = () => {
        const { params } = this.props;
        this._saveDraft(false).then((draft) => {
            let draftId;
            if (draft.id) {
                draftId = draft.id;
            }
            if (typeof draft === 'number') {
                draftId = draft;
            }
            this.context.router.replace(`/${params.akashaId}/draft/${draftId}/publish`);
        });
    };

    _getHeaderTitle = () => {
        const { savingDraft, entriesCount, drafts, draftsCount, location } = this.props;
        const { fetchingDraft, draftMissing, isNewDraft } = this.state;
        let headerTitle = 'First entry';
        const draft = this._findCurrentDraft(drafts);
        if (savingDraft) {
            headerTitle = 'Saving draft...';
        } else if (fetchingDraft) {
            headerTitle = 'Finding draft';
        } else if (draftMissing) {
            headerTitle = 'Draft is missing';
        } else if (!!location.query.editEntry || (draft && draft.entryId)) {
            headerTitle = 'Edit entry';
        } else if (!isNewDraft || entriesCount > 0 || draftsCount > 0) {
            headerTitle = 'New entry';
        }
        return headerTitle;
    };

    _handleDraftDelete = () => {
        const { params, draftActions, selectedTag } = this.props;
        const { draftId } = params;
        draftActions.deleteDraft(parseInt(draftId, 10));
        this.context.router.replace(`/${params.akashaId}/explore/tag/${selectedTag}`);
    };

    _getInitialContent = () => {
        const { drafts } = this.props;
        const { fetchingDraft, isNewDraft } = this.state;
        if (fetchingDraft || isNewDraft) {
            return null;
        }
        const currentDraft = this._findCurrentDraft(drafts);
        if (!currentDraft) {
            return null;
        }
        return currentDraft.content.draft;
    };

    _handleEditorErrors = (errorMessage) => {
        const { appActions } = this.props;
        appActions.showNotification({
            id: 'editorMessage',
            values: { errorMessage },
            duration: 3000
        });
    };

    renderEntryContent = () => {
        const { appActions, drafts, fetchingFullEntry, intl, location } = this.props;
        const { fetchingDraft, draftMissing } = this.state;
        const initialContent = this._getInitialContent();
        const currentDraft = this._findCurrentDraft(drafts);
        const draftTitle = currentDraft ? currentDraft.content.title : '';
        const flag = location.query.editEntry ?
            !fetchingFullEntry :
            !fetchingDraft && !draftMissing;
          //   &&
        if (!flag) {
            return null;
        }
        return (
          <div className="col-xs-12" style={{ paddingRight: 0 }}>
            <EntryEditor
              editorRef={(editor) => { this.editor = editor; }}
              onChange={this._handleEditorChange}
              readOnly={false}
              content={initialContent}
              title={draftTitle}
              showTitle
              placeHolder="Write something"
              showTerms={appActions.showTerms}
              onError={this._handleEditorErrors}
            />
            <AlertDialog
              ref={(alert) => { this.alertDialog = alert; }}
              message={'Are you sure you want to leave? Unsaved changes will be lost!'}
              confirmLabel={intl.formatMessage(generalMessages.leave)}
              cancelLabel={intl.formatMessage(generalMessages.cancel)}
            />
          </div>
        );
    };

    render () {
        const { drafts, savingDraft } = this.props;
        const { fetchingDraft, draftMissing, isNewDraft } = this.state;
        const currentDraft = this._findCurrentDraft(drafts);
        return (
          <div>
            <Toolbar
              className="row"
              style={{
                  backgroundColor: '#FFF',
                  borderBottom: '1px solid rgb(204, 204, 204)',
                  position: 'fixed',
                  left: 64,
                  right: 0,
                  top: 0,
                  zIndex: 10
              }}
            >
              <ToolbarGroup>
                <h3 style={{ fontWeight: '200' }}>{this._getHeaderTitle()}</h3>
              </ToolbarGroup>
              <ToolbarGroup>
                <FlatButton
                  primary
                  label="Save"
                  disabled={savingDraft}
                  onClick={this._handleDraftSave}
                />
                <FlatButton
                  primary
                  label={currentDraft && currentDraft.entryId ? 'Update' : 'Publish'}
                  onClick={this._setupEntryForPublication}
                />
                <IconMenu
                  iconButtonElement={
                    <IconButton>
                      <MoreVertIcon />
                    </IconButton>
                  }
                  anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                  targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                  style={{ margin: '4px 0' }}
                >
                  <MenuItem primaryText="Delete draft" disabled={isNewDraft} onClick={isNewDraft ? () => {} : this._handleDraftDelete} />
                </IconMenu>
              </ToolbarGroup>
            </Toolbar>
            <div
              className="row center-xs"
              style={{
                  marginTop: 56
              }}
            >
              {fetchingDraft &&
                <div>Loading draft...</div>
              }
              {!fetchingDraft && draftMissing &&
                <div>The draft you are looking for cannot be found!</div>
              }
              {this.renderEntryContent()}
            </div>
            {this.props.children &&
              <div className="row">
                {React.cloneElement(this.props.children, { draft: currentDraft })}
                <div
                  style={{
                      position: 'fixed',
                      overflow: 'hidden',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      zIndex: 15,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                />
              </div>
            }
          </div>
        );
    }
}
AddEntryPage.propTypes = {
    appActions: PropTypes.shape(),
    children: PropTypes.node,
    defaultLicence: PropTypes.shape(),
    draftActions: PropTypes.shape().isRequired,
    drafts: PropTypes.shape(),
    draftsCount: PropTypes.number,
    entriesCount: PropTypes.number,
    entryActions: PropTypes.shape(),
    fetchingFullEntry: PropTypes.bool,
    fullEntry: PropTypes.shape(),
    intl: PropTypes.shape(),
    location: PropTypes.shape({
        query: PropTypes.shape(),
        pathname: PropTypes.string
    }),
    params: PropTypes.shape(),
    route: PropTypes.shape(),
    savingDraft: PropTypes.bool,
    selectedTag: PropTypes.string
};
AddEntryPage.contextTypes = {
    router: PropTypes.shape()
};
export default injectIntl(AddEntryPage);

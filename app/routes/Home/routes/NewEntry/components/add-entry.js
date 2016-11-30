import React, { Component } from 'react';
import {
    Toolbar,
    ToolbarGroup,
    FlatButton,
    IconButton,
    IconMenu,
    MenuItem } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { getWordCount } from 'utils/dataModule'; // eslint-disable-line import/no-unresolved, import/extensions
import EntryEditor from 'shared-components/EntryEditor'; // eslint-disable-line import/no-unresolved, import/extensions

class AddEntryPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            publishable: true,
            draftToEdit: {},
            isNewDraft: false,
            fetchingDraft: false
        };
    }
    componentWillMount () {
        const { params, draftActions } = this.props;
        if (params.draftId === 'new') {
            return this.setState({
                isNewDraft: true,
                fetchingDraft: false
            });
        }
        return this.setState({
            fetchingDraft: true
        }, () => {
            draftActions.getDraftById(parseInt(params.draftId, 10));
        });
    }
    componentWillReceiveProps (nextProps) {
        const { drafts } = nextProps;
        // logic for populating existing draft;
        const currentDraft = this._findCurrentDraft(drafts);
        if (this.state.isNewDraft) {
            return this.setState({
                fetchingDraft: false
            });
        }
        return this.setState({
            fetchingDraft: (typeof currentDraft === 'undefined')
        });
    }
    _findCurrentDraft = (drafts) => {
        const { params } = this.props;
        return drafts.find(draft => draft.id === parseInt(params.draftId, 10));
    }

    _checkIfMustSave = () => {
        if (this.state.shouldBeSaved) {
            return 'You have unsaved changes!, Are you sure you want to leave?';
        }
        return true;
    }
    _handleDraftSave = () => {
        this._saveDraft();
    }
    _saveDraft = () => {
        const { draftActions, params, loggedProfile, drafts } = this.props;
        const content = this.editor.getRawContent();
        const contentState = this.editor.getContent();
        const title = this.editor.getTitle();
        const wordCount = getWordCount(contentState);
        const excerpt = contentState.getPlainText().slice(0, 160).replace(/\r?\n|\r/g, '');
        if (params.draftId !== 'new') {
            const draftId = parseInt(params.draftId, 10);
            const currentDraft = this._findCurrentDraft(drafts);
            const { tags = [], licence = {}, profile, featuredImage, status } = currentDraft;
            return draftActions.updateDraft({
                id: draftId,
                content,
                tags: tags.toJS(),
                licence: licence.toJS(),
                profile,
                featuredImage,
                status,
                title,
                wordCount,
                excerpt
            });
        }

        return draftActions
            .createDraft(loggedProfile.get('profile'), { content, title, wordCount, excerpt });
    };
    _setupEntryForPublication = () => {
        const { params } = this.props;
        this._saveDraft().then((draft) => {
            let draftId;
            if (draft.id) {
                draftId = draft.id;
            }
            if (typeof draft === 'number') {
                draftId = draft;
            }
            this.context.router.push(`/${params.akashaId}/draft/${draftId}/publish`);
        });
    }
    _getHeaderTitle = () => {
        const { savingDraft } = this.props;
        const { fetchingDraft, draftMissing, isNewDraft } = this.state;
        let headerTitle = 'First entry';
        if (savingDraft) {
            headerTitle = 'Saving draft...';
        } else if (fetchingDraft) {
            headerTitle = 'Finding draft';
        } else if (draftMissing) {
            headerTitle = 'Draft is missing';
        } else if (!isNewDraft) {
            headerTitle = 'New Entry';
        }
        return headerTitle;
    }
    _getInitialContent = () => {
        const { isNewDraft, fetchingDraft } = this.state;
        const { drafts } = this.props;
        if (isNewDraft || fetchingDraft) {
            return null;
        }
        return this._findCurrentDraft(drafts).get('content');
    }
    render () {
        const { drafts, savingDraft } = this.props;
        const { fetchingDraft, draftMissing } = this.state;
        const currentDraft = this._findCurrentDraft(drafts);
        const initialContent = this._getInitialContent();
        const draftTitle = currentDraft ? currentDraft.title : '';
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
                  label="Publish"
                  disabled={!this.state.publishable}
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
                  <MenuItem primaryText="Create public link" />
                  <MenuItem primaryText="Word count" />
                  <MenuItem primaryText="Delete draft" />
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
              {!fetchingDraft && !draftMissing &&
                <div className="col-xs-12">
                  <EntryEditor
                    editorRef={(editor) => { this.editor = editor; }}
                    onChange={this._handleEditorChange}
                    readOnly={false}
                    content={initialContent}
                    title={draftTitle}
                    showTitle
                    placeHolder="Write something"
                  />
                </div>
              }
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
    draftActions: React.PropTypes.shape().isRequired,
    loggedProfile: React.PropTypes.shape(),
    params: React.PropTypes.shape(),
    children: React.PropTypes.node,
    drafts: React.PropTypes.shape(),
    savingDraft: React.PropTypes.bool
};
AddEntryPage.contextTypes = {
    router: React.PropTypes.shape()
};
export default AddEntryPage;

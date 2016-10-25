import React, { Component } from 'react';
import {
    Toolbar,
    ToolbarGroup,
    FlatButton,
    IconButton,
    IconMenu,
    MenuItem } from 'material-ui';
import { getWordCount } from 'utils/dataModule';
import EntryEditor from 'shared-components/EntryEditor';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { is } from 'immutable';

class AddEntryPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            publishable: true,
            draftToEdit: {},
            isNewDraft: false,
            shouldBeSaved: true,
            fetchingDraft: false,
            draftMissing: false
        };
    }
    componentWillMount () {
        const { params, draftActions } = this.props;
        if (params.draftId === 'new') {
            this.setState({
                isNewDraft: true
            });
        } else {
            this.setState({
                fetchingDraft: true
            }, () => {
                draftActions.getDraftById(params.draftId);
            });
        }
    }
    componentWillReceiveProps (nextProps) {
        const { drafts, params } = nextProps;
        const currentDraft = this._findCurrentDraft(drafts);

        // logic for populating existing draft;
        if (params.draftId !== 'new') {
            if (this.props.drafts.size !== drafts.size) {
                // means that the drafts are fetched;
                this.setState({
                    fetchingDraft: false
                });
                // drafts are fetched but the currentDraft was not found somehow
                if (typeof currentDraft === 'undefined') {
                    this.setState({
                        draftMissing: true
                    });
                }
            }
        }
    }
    _findCurrentDraft = (drafts) => {
        const { params } = this.props;
        return drafts.find(draft => draft.id === params.draftId);
    }
    // componentWillReceiveProps (nextProps) {
    //     const { draftState, draftActions, params } = this.props;
    //     if (is(draftState, nextProps.draftState)) {
    //         return;
    //     }
    //     // this.context.router.push(`${params.username}/${params.draftId}`)
    //     this.setState({
    //         isNewDraft: false,
    //         draftToEdit: draftState.get('drafts').find()
    //     }, () => {
    //         draftActions.createDraft();
    //     });
    // }

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
        const { draftActions, params, loggedProfile } = this.props;
        console.log(loggedProfile, 'loggedProfile');
        const content = this.editor.getRawContent();
        const contentState = this.editor.getContent();
        const title = this.editor.getTitle();
        const wordCount = getWordCount(contentState);

        if (params.draftId !== 'new') {
            const draftId = parseInt(params.draftId, 10);
            return draftActions.updateDraft({ id: draftId, content, title, wordCount });
        }

        return draftActions
            .createDraftSync(loggedProfile.get('userName'), { content, title, wordCount });
    };
    _setupEntryForPublication = () => {
        const { params } = this.props;
        this._saveDraft().then(() => {
            this.context.router.push(`${params.username}/draft/${params.draftId}/publish`);
        });
    }
    _getHeaderTitle = () => {
        const { drafts, savingDraft } = this.props;
        const { fetchingDraft, draftMissing } = this.state;
        let headerTitle = 'First entry';
        if (fetchingDraft) {
            headerTitle = 'Finding draft';
        } else if (draftMissing) {
            headerTitle = 'Draft is missing';
        } else if (!savingDraft) {
            headerTitle = 'New Entry';
        } else if (savingDraft) {
            headerTitle = 'Saving draft...';
        }
        return headerTitle;
    }
    render () {
        const { draftState } = this.props;
        const { shouldBeSaved, fetchingDraft, draftMissing } = this.state;

        return (
          <div style={{ height: '100%', position: 'relative' }}>
            <Toolbar
              className="row"
              style={{ backgroundColor: '#FFF', borderBottom: '1px solid rgb(204, 204, 204)' }}
            >
              <ToolbarGroup>
                <h3 style={{ fontWeight: '200' }}>{this._getHeaderTitle()}</h3>
              </ToolbarGroup>
              <ToolbarGroup>
                <FlatButton
                  primary
                  label="Publish"
                  disabled={!this.state.publishable}
                  onClick={this._setupEntryForPublication}
                />
                <FlatButton
                  primary
                  label="Save"
                  disabled={!shouldBeSaved}
                  onClick={this._handleDraftSave}
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
                  marginTop: '32px',
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 24,
                  bottom: 0,
                  overflowY: 'auto',
                  padding: '24px 0'
              }}
            >
              {fetchingDraft &&
                <div>Preparing draft...</div>
              }
              {!fetchingDraft && draftMissing &&
                <div>The draft you are looking for cannot be found!</div>
              }
              {!fetchingDraft && !draftMissing &&
                <div className="col-xs-12">
                  <EntryEditor
                    editorRef={(editor) => { this.editor = editor; }}
                    onChange={this._handleEditorChange}
                    onTitleChange={this._handleTitleChange}
                    readOnly={false}
                    content={{}}
                    title={'draft.title'}
                    showTitleField
                    textHint="Write something"
                  />
                </div>
              }
            </div>
            {this.props.children &&
              <div className="row">
                {React.cloneElement(this.props.children, { draft: 'draft' })}
                <div
                  style={{
                      position: 'absolute',
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
    draftState: React.PropTypes.shape().isRequired,
    loggedProfile: React.PropTypes.shape(),
    params: React.PropTypes.shape(),
    children: React.PropTypes.node,
    route: React.PropTypes.shape()
};
AddEntryPage.contextTypes = {
    router: React.PropTypes.shape()
};
export default AddEntryPage;

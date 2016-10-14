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

class NewEntryPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            publishable: false,
            draftToEdit: {}
        };
    }
    componentWillMount () {
        this._setDraftToEdit(this.props);
    }
    componentWillReceiveProps (nextProps) {
        this._setDraftToEdit(nextProps);
    }
    _setDraftToEdit = (props) => {
        const { entryState, params } = props;
        if (params.draftId !== 'new') {
            const draftToEdit = entryState.get('drafts').find(draft =>
                draft.id === parseInt(params.draftId, 10)
            );
            this.setState({
                draftToEdit,
                publishable: true //draftToEdit.wordCount > 1
            });
        } else {
            this.setState({
                draftToEdit: {}
            });
        }
    };
    _setupEntryForPublication = () => {
        const { profileState, params } = this.props;
        const loggedProfile = profileState.get('loggedProfile');
        this._saveDraft(() => {
            this.context.router.push(
                `/${loggedProfile.get('userName')}/draft/${params.draftId}/publish`
            );
        });
    };
    _saveDraft = (cb) => {
        const { entryActions, params, profileState } = this.props;
        const loggedProfile = profileState.get('loggedProfile');
        const content = this.editor.getRawContent();
        const contentState = this.editor.getContent();
        const htmlContent = this.editor.getHtmlContent();
        const title = this.editor.getTitle();
        const wordCount = getWordCount(contentState);
        console.log(htmlContent, 'htmlContent');
        if (params.draftId !== 'new') {
            const draftId = parseInt(params.draftId, 10);
            entryActions.updateDraftThrottled({ id: draftId, content, title, wordCount });
        } else {
            entryActions.createDraft(loggedProfile.get('userName'), { content, title, wordCount });
        }
        if (typeof cb === 'function') {
            cb();
        }
    };
    _handleEditorAutosave = () => {
        this._saveDraft();
    };
    _handleTitleChange = () => {};
    render () {
        const { entryState } = this.props;
        const draft = this.state.draftToEdit;
        let entryTitle = 'First entry';
        if (entryState.get('drafts').size > 1 && !entryState.get('savingDraft')) {
            entryTitle = 'New Entry';
        } else if (entryState.get('savingDraft')) {
            entryTitle = 'Saving draft...';
        }
        return (
          <div style={{ height: '100%', position: 'relative' }}>
            <Toolbar
              className="row"
              style={{ backgroundColor: '#FFF', borderBottom: '1px solid rgb(204, 204, 204)' }}
            >
              <ToolbarGroup>
                <h3 style={{ fontWeight: '200' }}>{entryTitle}</h3>
              </ToolbarGroup>
              <ToolbarGroup>
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
              <div className="col-xs-6">
                <EntryEditor
                  editorRef={(editor) => { this.editor = editor; }}
                  onAutosave={this._handleEditorAutosave}
                  onTitleChange={this._handleTitleChange}
                  readOnly={false}
                  content={draft.content}
                  title={draft.title}
                  showTitleField
                  textHint="Write something"
                />
              </div>
            </div>
            {this.props.children &&
              <div className="row">
                {React.cloneElement(this.props.children, { draft })}
                <div
                  style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      zIndex: 5,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                />
              </div>
            }
          </div>
        );
    }
}
NewEntryPage.propTypes = {
    entryActions: React.PropTypes.object.isRequired,
    entryState: React.PropTypes.object.isRequired,
    profileState: React.PropTypes.object.isRequired,
    params: React.PropTypes.object,
    children: React.PropTypes.node
};
NewEntryPage.contextTypes = {
    router: React.PropTypes.object
};
export default NewEntryPage;

import React, { Component } from 'react';
import {
    Toolbar,
    ToolbarGroup,
    FlatButton,
    IconButton,
    IconMenu,
    MenuItem } from 'material-ui';
import { convertFromRaw } from 'draft-js';
import EntryEditor from 'shared-components/EntryEditor';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { is } from 'immutable';

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
            const draftToEdit = entryState.get('drafts').find(draft => {
                return draft.id === parseInt(params.draftId, 10);
            });
            this.setState({
                draftToEdit,
                publishable: draftToEdit.wordCount > 1
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
    _getWordCount = (content) => {
        const plainText = content.getPlainText('');
        // new line, carriage return, line feed
        const regex = /(?:\r\n|\r|\n)/g;
        // replace above characters w/ space
        const cleanString = plainText.replace(regex, ' ').trim();
        // matches words according to whitespace
        const wordArray = cleanString.match(/\S+/g);
        return wordArray ? wordArray.length : 0;
    };
    _saveDraft = (cb) => {
        const { entryActions, params } = this.props;
        const content = this.editor.getRawContent();
        const contentState = this.editor.getContent();
        const title = this.editor.getTitle();
        const wordCount = this._getWordCount(contentState);
        if (params.draftId !== 'new') {
            const draftId = parseInt(params.draftId, 10);
            entryActions.updateDraftThrottled({ id: draftId, content, title, wordCount });
        } else {
            entryActions.createDraft({ content, title, wordCount });
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
          <div style={{ height: '100%' }}>
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
            <div className="row center-xs" style={{ marginTop: '32px' }}>
              <div className="col-xs-6">
                <EntryEditor
                  editorRef={(editor) => { this.editor = editor; }}
                  onAutosave={this._handleEditorAutosave}
                  onTitleChange={this._handleTitleChange}
                  readOnly={false}
                  content={draft.content}
                  title={draft.title}
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

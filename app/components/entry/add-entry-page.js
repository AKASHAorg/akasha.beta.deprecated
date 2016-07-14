import React, { Component } from 'react';
import {
    Toolbar,
    ToolbarGroup,
    TextField,
    RaisedButton,
    IconButton,
    IconMenu,
    MenuItem } from 'material-ui';
import EntryEditor from '../ui/entry-editor';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import throttle from 'lodash.throttle';

class NewEntryPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            publishable: false
        };
        this.throttledSave = throttle(this._saveDraft, 1000, { trailing: true, leading: false });
    }
    componentWillUpdate (nextProps) {
        const { params } = nextProps;
        if (params.draftId && (this.props.params.draftId !== params.draftId)) {
            this._loadSavedDrafts();
        }
    }
    _loadSavedDrafts = () => {
        const { entryActions } = this.props;
        return entryActions.getDrafts();
    }
    _setupEntryForPublication = (ev) => {
        const { appActions } = this.props;
        this._saveDraft((entry) => {
            appActions.showPanel({ name: 'publishEntry', overlay: false });
        });
    }
    _saveDraft = (cb) => {
        const { entryActions, entryState } = this.props;
        const params = this.props.params;
        let currentDraft = {};
        if (params.draftId) {
            currentDraft = entryState.get('drafts')
                                     .find(draft => draft.id === parseInt(params.draftId, 10));
        }
        const content = this.editor.getContent();
        const title = this.state.title;
        currentDraft.content = content;
        currentDraft.title = title;
        if (currentDraft.id) {
            entryActions.updateDraft({ ...currentDraft }).then(() => {
                if (typeof cb === 'function') {
                    cb({ ...currentDraft });
                }
            });
            return;
        }
        entryActions.createDraft({ ...currentDraft }).then(() => {
            if (typeof cb === 'function') {
                cb({ title, content });
            }
        });
    }
    _cancelEntryCreate = (ev) => {

    }
    _handleEditorChange = (text) => {
        const txt = text.trim();

        if (txt.length > 0) {
            this.setState({
                publishable: true
            });
        } else {
            this.setState({
                publishable: false
            });
        }
        this.throttledSave();
    }
    _handleTitleChange = (ev) => {
        this.setState({ title: ev.target.value });
        this.throttledSave();
    }
    render () {
        const { entryState } = this.props;
        const draft = entryState.get('drafts').find(currentDraft => currentDraft.id === parseInt(this.props.params.draftId, 10));
        let entryTitle = 'First entry';
        if (entryState.get('drafts').size > 0 && !entryState.get('savingDraft')) {
            entryTitle = 'New Entry';
        } else if (entryState.get('savingDraft')) {
            entryTitle = 'Saving draft...';
        }
        let title = '';
        if (this.state.title) {
            title = this.state.title;
        } else if (draft && draft.title) {
            title = draft.title;
        }
        return (
          <div>
            <Toolbar
              className="row"
              style={{ backgroundColor: '#FFF', borderBottom: '1px solid rgb(204, 204, 204)' }}
            >
              <ToolbarGroup>
                <h3>{entryTitle}</h3>
              </ToolbarGroup>
              <ToolbarGroup>
                <RaisedButton
                  primary
                  label="Publish"
                  disabled={!this.state.publishable}
                  onClick={this._setupEntryForPublication}
                />
                <IconMenu
                  iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                  anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                  targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                >
                  <MenuItem primaryText="Create public link" />
                  <MenuItem primaryText="Word count" />
                  <MenuItem primaryText="Delete draft" />
                </IconMenu>
                <IconButton onClick={this._cancelEntryCreate}>
                  <CloseIcon />
                </IconButton>
              </ToolbarGroup>
            </Toolbar>
            <div className="row center-xs" style={{ marginTop: '32px' }}>
              <div className="col-xs-6">
                <EntryEditor
                  editorRef={(editor) => { this.editor = editor; }}
                  onChange={this._handleEditorChange}
                  onTitleChange={this._handleTitleChange}
                  readOnly={false}
                  content={(draft ? draft.content : null)}
                  title={title}
                />
              </div>
            </div>
          </div>
        );
    }
}
NewEntryPage.propTypes = {
    entryActions: React.PropTypes.object,
    entryState: React.PropTypes.object,
    params: React.PropTypes.object
};
export default NewEntryPage;

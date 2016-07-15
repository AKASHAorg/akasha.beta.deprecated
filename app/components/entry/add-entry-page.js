import React, { Component } from 'react';
import {
    Toolbar,
    ToolbarGroup,
    FlatButton,
    IconButton,
    IconMenu,
    MenuItem } from 'material-ui';
import EntryEditor from '../ui/entry-editor';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import r from 'ramda';

class NewEntryPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            publishable: false,
            draftToEdit: {}
        };
    }
    componentWillMount () {
        const { entryActions, params } = this.props;
        if (params.draftId !== 'new') {
            entryActions.getDraftById(params.draftId);
        }
    }
    componentDidMount () {
        const { params, entryState } = this.props;
        if (params.draftId !== 'new') {
            const draft = entryState.get('drafts').find(
                drft => drft.id === parseInt(params.draftId, 10));
            this.editor.setTitle(draft.title);
            this.editor.setContent(draft.content);
        }
    }
    _setupEntryForPublication = () => {
        const { appActions } = this.props;
        this._saveDraft(() => {
            appActions.showPanel({ name: 'publishEntry', overlay: false });
        });
    }
    _saveDraft = (cb) => {
        const { entryActions, entryState, params } = this.props;
        let draft;
        if (params.draftId !== 'new') {
            draft = entryState.get('drafts').find(drft => drft.id === parseInt(params.draftId, 10));
        } else {
            draft = r.clone(this.state.draftToEdit);
        }
        const content = this.editor.getContent();
        const title = this.editor.getTitle();
        draft.content = content;
        draft.title = title;
        if (params.draftId !== 'new') {
            entryActions.updateDraft({ ...draft });
        } else {
            entryActions.createDraft({ ...draft });
        }
        this.setState({
            draftToEdit: draft
        });
        if (typeof cb === 'function') {
            cb();
        }
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
        console.log('editorChange')
        this._saveDraft();
    }
    _handleTitleChange = () => {
        this._saveDraft();
    }
    render () {
        const { entryState } = this.props;
        const draft = this.state.draftToEdit;
        let entryTitle = 'First entry';
        if (entryState.get('drafts').size > 0 && !entryState.get('savingDraft')) {
            entryTitle = 'New Entry';
        } else if (entryState.get('savingDraft')) {
            entryTitle = 'Saving draft...';
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
                <FlatButton
                  primary
                  label="Publish"
                  disabled={!this.state.publishable}
                  onClick={this._setupEntryForPublication}
                />
                <IconMenu
                  iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
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
                  onChange={this._handleEditorChange}
                  onTitleChange={this._handleTitleChange}
                  readOnly={false}
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
    params: React.PropTypes.object,
    appActions: React.PropTypes.object
};
export default NewEntryPage;

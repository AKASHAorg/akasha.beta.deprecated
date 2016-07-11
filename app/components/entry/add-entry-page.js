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
    _setupEntryForPublication = (ev) => {
        const { appActions } = this.props;
        this._saveDraft((entry) => {
            console.log('redirect to publish panel..', entry);
        });
        appActions.showPanel({ name: 'publishEntry', overlay: false });

        // console.log('attempt to save entry');
        // console.log(this.props);
    }
    _saveDraft = (cb) => {
        const { entryActions } = this.props;
        const content = this.editor.getContent();
        const title = this.state.entryTitle;
        console.log('saving..', { title, content });

        if (typeof cb === 'function') {
            cb({ title, content });
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
        this.throttledSave();
    }
    _handleTitleChange = (ev) => {
        this.setState({ entryTitle: ev.target.value });
        this.throttledSave();
    }
    render () {
        return (
          <div>
            <Toolbar
              className="row"
              style={{ backgroundColor: '#FFF', borderBottom: '1px solid rgb(204, 204, 204)' }}
            >
              <ToolbarGroup>
                <h3>First entry</h3>
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
                />
              </div>
            </div>
          </div>
        );
    }
}

export default NewEntryPage;

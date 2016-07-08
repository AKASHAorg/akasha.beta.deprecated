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

class NewEntryPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            publishable: false
        };
    }
    _attemptToSave = (ev) => {
        const { appActions } = this.props;
        appActions.showPanel({ name: 'publishEntry', overlay: true });
        console.log('attempt to save entry');
        console.log(this.props);
    }
    _cancelEntryCreate = (ev) => {

    }
    _handleEditorChange = (text) => {
        if (text.length > 30) {
            this.setState({
                publishable: true
            });
        } else {
            this.setState({
                publishable: false
            });
        }
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
                  onClick={this._attemptToSave}
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
                <EntryEditor onChange={this._handleEditorChange} readOnly={false} />
              </div>
            </div>
          </div>
        );
    }
}

export default NewEntryPage;

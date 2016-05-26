import React, { Component } from 'react';
import { Paper, TextField } from 'material-ui';
import EntryEditor from '../ui/entry-editor';

class NewEntryPage extends Component {
    render () {
        return (
            <div>
				<Paper className = "row" style={{ padding: '64px 8px 16px 16px' }}>
					<div className = "col-xs-9">First Entry</div>
					<div className = "col-xs-3">Menus</div>
				</Paper>
				<div className = "row center-xs">
					<div className = "col-xs-6">
                        <TextField
                          hintText = "Title"
                          underlineShow={false}
                          hintStyle={{ fontSize: 32 }}
                          inputStyle={{ fontSize: 32 }}
                          fullWidth
                        />
                        <EntryEditor />
					</div>
				</div>
            </div>
        );
    }
}

export default NewEntryPage;

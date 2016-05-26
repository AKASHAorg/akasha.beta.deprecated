import React, { Component, PropTypes } from 'react';
import { TextField, SvgIcon } from 'material-ui';
import AddCircle from 'material-ui/svg-icons/content/add-circle-outline';

class EntryEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: 1
        };
    }
    render () {
        console.log(this.state);
        return (
            <div className = "editor" style = {{position: 'relative'}}>
                <div style = {{position: 'absolute', top: ((this.state.rows - 1) * 24) + 14, left: -32}}>
                    <SvgIcon style={{cursor: 'pointer'}} onClick = {this._handleAddAttach}>
                        <AddCircle color="#DDD" hoverColor = '#444'/>
                    </SvgIcon>
                </div>
                <TextField 
                    fullWidth
                    hintText="Type your text"
                    underlineShow={false}
                    multiLine
                    onKeyDown = {this._handleChange}
                />
            </div>
        );
    }
    _handleChange = (ev, value) => {
        this.setState({
            rows: Math.floor(ev.target.scrollHeight / 24)
        })
    }
    _handleAddAttach = (ev) => {
        console.log('open dialog')
    }
}

export default EntryEditor;

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import {
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
    IconButton,
    SvgIcon,
    } from 'material-ui';
import clickAway from '../../../../utils/clickAway';
import BoldIcon from 'material-ui/svg-icons/editor/format-bold';
import ItalicIcon from 'material-ui/svg-icons/editor/format-italic';
import QuoteIcon from 'material-ui/svg-icons/editor/format-quote';
import BulletListIcon from 'material-ui/svg-icons/editor/format-list-bulleted';
import NumberListIcon from 'material-ui/svg-icons/editor/format-list-numbered';
import InsertLinkIcon from 'material-ui/svg-icons/editor/insert-link';

class EditorToolbar extends Component {
    constructor (props) {
        super(props);
        this.state = {};
    }
    componentWillReceiveProps (newProps) {
        const selection = window.getSelection();
        if (selection.toString().length > 0) {
            // we have a text selection
            const ranges = [];

            for (let i = 0; i < selection.rangeCount; i++) {
                ranges[i] = selection.getRangeAt(i);
            }
            const selectionPosition = ranges[0].getBoundingClientRect();
            const left = selectionPosition.left + (selectionPosition.width / 2) +
                    window.scrollX -
                    (ReactDOM.findDOMNode(this).getBoundingClientRect().width / 2);
            this.setState({
                isVisible: true,
                top: selectionPosition.top - 60 + window.scrollY,
                left
            });
        }
    }
    _handleBoldText = (ev) => {
        this.setState({
            isVisible: true
        });
        console.log(ev);
    }
    render () {
        const { isVisible } = this.state;
        const rootStyle = {
            height: 'auto',
            padding: 0,
            borderRadius: 3,
            backgroundColor: '#525252',
            position: 'absolute',
            zIndex: isVisible ? 5 : -1,
            top: isVisible ? this.state.top : -100,
            opacity: isVisible ? 1 : 0,
            left: isVisible ? this.state.left : 0
        };

        return (
            <Toolbar style = {rootStyle}>
                <ToolbarGroup>
                    <IconButton onMouseDown = {this._handleBoldText}>
                        <SvgIcon>
                            <BoldIcon color="#FFF" />
                        </SvgIcon>
                    </IconButton>
                    <IconButton onClick = {this._handleItalicText}>
                        <SvgIcon>
                            <ItalicIcon color="#FFF" />
                        </SvgIcon>
                    </IconButton>
                    <ToolbarSeparator style={{ marginLeft: 8 }} />
                    <IconButton onClick = {this._handleQuoteText}>
                        <SvgIcon>
                            <QuoteIcon color="#FFF" />
                        </SvgIcon>
                    </IconButton>
                    <IconButton onClick = {this._handleBulletList} >
                        <SvgIcon>
                            <BulletListIcon color="#FFF" />
                        </SvgIcon>
                    </IconButton>
                    <IconButton onClick = {this._handleNumberList} >
                        <SvgIcon>
                            <NumberListIcon color="#FFF" />
                        </SvgIcon>
                    </IconButton>
                    <ToolbarSeparator style={{ marginLeft: 8 }} />
                    <IconButton onClick = {this._handleLinkCreate} >
                        <SvgIcon>
                            <InsertLinkIcon color="#FFF" />
                        </SvgIcon>
                    </IconButton>
                    <div className = "caret-down" style = {{ borderTopColor: '#525252', position: 'absolute', bottom: '-8px', left: '50%', marginLeft: '-10px' }} />
                </ToolbarGroup>
            </Toolbar>
        );
    }
}
EditorToolbar.propTypes = {
    isVisible: PropTypes.bool,
    toggleVisibility: PropTypes.func
};
export default EditorToolbar;

import React, { Component, PropTypes } from 'react';
import {
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
    IconButton,
    SvgIcon,
    } from 'material-ui';
import BoldIcon from 'material-ui/svg-icons/editor/format-bold';
import ItalicIcon from 'material-ui/svg-icons/editor/format-italic';
import QuoteIcon from 'material-ui/svg-icons/editor/format-quote';
import BulletListIcon from 'material-ui/svg-icons/editor/format-list-bulleted';
import NumberListIcon from 'material-ui/svg-icons/editor/format-list-numbered';
import InsertLinkIcon from 'material-ui/svg-icons/editor/insert-link';

class EditorToolbar extends Component {

    render () {
        const rootStyle = {
            height: 'auto',
            padding: 0,
            borderRadius: 3,
            backgroundColor: '#525252',
            position: 'absolute'
        };
        
        return (
            <Toolbar style = {rootStyle}>
                <ToolbarGroup>
                    <IconButton>
                        <SvgIcon>
                            <BoldIcon color="#FFF" />
                        </SvgIcon>
                    </IconButton>
                    <IconButton>
                        <SvgIcon>
                            <ItalicIcon color="#FFF" />
                        </SvgIcon>
                    </IconButton>
                    <ToolbarSeparator style={{ marginLeft: 8 }} />
                    <IconButton>
                        <SvgIcon>
                            <QuoteIcon color="#FFF" />
                        </SvgIcon>
                    </IconButton>
                    <IconButton>
                        <SvgIcon>
                            <BulletListIcon color="#FFF" />
                        </SvgIcon>
                    </IconButton>
                    <IconButton>
                        <SvgIcon>
                            <NumberListIcon color="#FFF" />
                        </SvgIcon>
                    </IconButton>
                    <ToolbarSeparator style={{ marginLeft: 8 }} />
                    <IconButton>
                        <SvgIcon>
                            <InsertLinkIcon color="#FFF" />
                        </SvgIcon>
                    </IconButton>
                </ToolbarGroup>
            </Toolbar>
        );
    }
}

export default EditorToolbar;

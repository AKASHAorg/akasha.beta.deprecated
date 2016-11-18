import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { IconButton } from 'material-ui';
import AddCircle from 'material-ui/svg-icons/content/add-circle-outline';
import 'setimmediate';

class BlockStyles extends Component {
    onChange = (editorState) => {
        this.props.onChange(editorState);
        this.props.toggle();
    }
    render () {
        const className = this.props.open ? 'sidemenu__items--open' : 'sidemenu__items';

        return (
          <ul className={className}>
            {this.props.plugins.map((item) => {
                const Button = item.buttonComponent;
                return (
                  <li key={item.type} className="sidemenu__item">
                    <Button
                      className="sidemenu__button"
                      editorState={this.props.editorState}
                      onChange={this.onChange}
                    />
                  </li>
                );
            })}
          </ul>
        );
    }
}
BlockStyles.propTypes = {
    onChange: React.PropTypes.func,
    open: React.PropTypes.bool,
    plugins: React.PropTypes.arrayOf(React.PropTypes.shape()),
    editorState: React.PropTypes.shape()
};

export class ToggleButton extends Component {
    render () {
        let style = {
            opacity: 0,
            visibility: 'hidden'
        };
        if (this.props.open || this.props.isVisible) {
            style = {
                opacity: 1,
                visibility: 'visible'
            };
        }
        return (
          <IconButton type="button" style={style} onClick={this.props.toggle}>
            <AddCircle />
          </IconButton>
        );
    }
}
ToggleButton.propTypes = {
    open: React.PropTypes.bool,
    isVisible: React.PropTypes.bool,
    toggle: React.PropTypes.func
};


export class SideMenu extends Component {
    constructor (props) {
        super(props);
        this.state = {
            open: false
        };
    }
    componentWillUnmount () {
        this.setState({
            open: false
        });
    }
    onChange = (editorState) => {
        this.props.onChange(editorState);
    }

    toggle = () => {
        this.setState({
            open: !this.state.open
        });
    }

    render () {
        return (
          <li className="sidemenu">
            <ToggleButton
              toggle={this.toggle}
              open={this.state.open}
              isVisible={this.props.sidebarVisible}
            />
            <BlockStyles
              editorState={this.props.editorState}
              plugins={this.props.plugins}
              open={this.state.open}
              onChange={this.onChange}
              toggle={this.toggle}
            />
          </li>
        );
    }
}
SideMenu.propTypes = {
    sidebarVisible: React.PropTypes.bool,
    plugins: React.PropTypes.arrayOf(React.PropTypes.shape()),
    editorState: React.PropTypes.shape(),
    onChange: React.PropTypes.func
};

export default class SideBar extends Component {
    constructor (props) {
        super(props);
        this.state = {
            top: -1,
            sidebarVisible: false
        };
    }
    shouldComponentUpdate (nextProps, nextState) {
        return (nextState.top !== this.state.top) ||
            (nextState.sidebarVisible !== this.state.sidebarVisible) ||
            (nextState.left !== this.state.left) ||
            (nextProps.editorState !== this.props.editorState);
    }
    componentDidUpdate () {
        this.updateSidebarPosition();
    }
    componentWillUnmount () {
        this.setState({
            sidebarVisible: false
        });
    }
    onChange = (editorState) => {
        this.props.onChange(editorState);
        this.updateSidebarPosition();
    }
    getSelectedBlockElement = () => {
        const { editorState } = this.props;
        const selection = window.getSelection();
        const startKey = editorState.getSelection().getStartKey();
        const hasText = editorState.getCurrentContent().getBlockForKey(startKey).text !== '';
        console.log(hasText);
        if ((selection.rangeCount === 0) || (selection.anchorOffset > 0) || hasText) {
            this.setState({
                sidebarVisible: false
            });
            return null;
        }
        let node = selection.anchorNode;
        if (node.nodeType === 3) { // if it is text node take the parent
            node = node.parentNode;
        }
        return node;
    }
    getValidSidebarPlugins () {
        const plugins = [];
        for (const plugin of this.props.plugins) {
            if (!plugin.buttonComponent || typeof plugin.buttonComponent !== 'function') {
                continue;
            }
            plugins.push(plugin);
        }
        return plugins;
    }
    setBarPosition () {
        const container = this.container;
        const element = this.getSelectedBlockElement();
        if (!element || !container) {
            return;
        }
        const containerTop =
            (container.getBoundingClientRect().top + 16) - document.documentElement.clientTop;
        const left = element.offsetLeft - 50;
        let top = element.getBoundingClientRect().top - containerTop;
        top = Math.floor(top) + 4;

        if ((this.state.top !== top)) {
            this.setState({
                sidebarVisible: true,
                top,
                left
            });
        }
    }
    resetSidebarPosition = () => {
        this.setState({
            top: -1,
            sidebarVisible: false
        });
    }
    updateSidebarPosition = () => {
        if (this.updatingPosition) {
            clearImmediate(this.updatingPosition);
        }
        this.updatingPosition = null;
        this.updatingPosition = setImmediate(() => this.setBarPosition());
    }
    render () {
        const isVisible = this.state.sidebarVisible;
        if (this.props.readOnly) {
            return null;
        }
        return (
          <div
            ref={(container) => { this.container = container; }}
            className={`sidebar ${isVisible ? 'visible' : 'hidden'}`}
          >
            <div style={{ top: `${this.state.top}px`, left: `${this.state.left}px`, zIndex: 9 }} className="sidebar__menu">
              <ul className="sidebar__sidemenu-wrapper">
                <SideMenu
                  sidebarVisible={isVisible}
                  editorState={this.props.editorState}
                  onChange={this.onChange}
                  plugins={this.getValidSidebarPlugins()}
                />
              </ul>
            </div>
          </div>
        );
    }
}
SideBar.propTypes = {
    onChange: React.PropTypes.func,
    editorState: React.PropTypes.shape(),
    readOnly: React.PropTypes.bool,
    plugins: React.PropTypes.arrayOf(React.PropTypes.shape())
};

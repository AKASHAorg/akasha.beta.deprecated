import React, { Component } from 'react';
import 'setimmediate';
import SideMenu from './side-menu';

class SideBar extends Component {
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

        if ((selection.anchorOffset > 0) || hasText) {
            this.setState({
                sidebarVisible: false
            });
            return null;
        }
        let node = selection.anchorNode;
        if (node && (node.nodeType === 3)) { // if it is text node take the parent
            node = node.parentNode;
        }
        return node;
    }
    getValidSidebarPlugins () {
        const plugins = [];
        this.props.plugins.forEach((plugin) => {
            if (plugin.buttonComponent || typeof plugin.buttonComponent === 'function') {
                plugins.push(plugin);
            }
        });
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

export default SideBar;

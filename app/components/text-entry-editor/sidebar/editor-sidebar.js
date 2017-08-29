import PropTypes from 'prop-types';
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
            (nextProps.editorState !== this.props.editorState) ||
            (nextProps.editorHasFocus !== this.props.editorHasFocus);
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
        if (selection.rangeCount === 0 || hasText) {
            this.setState({
                sidebarVisible: false
            });
            return null;
        }
        let node = selection.getRangeAt(0).startContainer;

        do {
            if (node.getAttribute && node.getAttribute('data-block') === 'true') {
                return node;
            }
            node = node.parentNode;
        } while (node != null);
        return null;
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
    setSidebarPosition () {
        const container = this.container;
        const element = this.getSelectedBlockElement();
        const blacklistedTagNames = ['LI', 'BLOCKQUOTE', 'FIGURE'];
        const isBlackListed = element && blacklistedTagNames.includes(element.tagName);
        if (!element || !container || isBlackListed) {
            return;
        }
        const containerTop =
            (container.getBoundingClientRect().top) - document.documentElement.clientTop;
        const cursorNode = element.querySelector('span');
        const left = cursorNode.offsetLeft - 46;
        let top = element.getBoundingClientRect().top - containerTop;
        top = Math.floor(top);

        this.setState({
            sidebarVisible: true,
            top,
            left
        });
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
        this.updatingPosition = setImmediate(() => this.setSidebarPosition());
    }
    render () {
        const isVisible = this.state.sidebarVisible;
        if (this.props.readOnly) {
            return null;
        }
        return (
          <div ref={(container) => { this.container = container; }} >
            <div
              style={{
                  top: `${this.state.top}px`,
                  left: `${this.state.left}px`,
                  zIndex: 9
              }}
              className="sidebar__menu"
            >
              <ul className="sidebar__sidemenu-wrapper">
                <SideMenu
                  sidebarVisible={isVisible}
                  editorState={this.props.editorState}
                  onChange={this.onChange}
                  plugins={this.getValidSidebarPlugins()}
                  showTerms={this.props.showTerms}
                  onError={this.props.onError}
                  onSidebarToggle={this.props.onSidebarToggle}
                  editorHasFocus={this.props.editorHasFocus}
                />
              </ul>
            </div>
          </div>
        );
    }
}
SideBar.propTypes = {
    onChange: PropTypes.func,
    editorState: PropTypes.shape(),
    readOnly: PropTypes.bool,
    plugins: PropTypes.arrayOf(PropTypes.shape()),
    showTerms: PropTypes.func,
    onError: PropTypes.func,
    onSidebarToggle: PropTypes.func,
    editorHasFocus: PropTypes.bool
};

export default SideBar;

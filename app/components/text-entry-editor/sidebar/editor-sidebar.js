import PropTypes from 'prop-types';
import React, { Component } from 'react';
import 'setimmediate';
import SideMenu from './side-menu';

class SideBar extends Component {
    constructor (props) {
        super(props);
        this.state = {
            top: -1,
            sidebarVisible: true
        };
    }
    shouldComponentUpdate (nextProps, nextState) {
        return (nextState.top !== this.state.top) ||
            (nextState.left !== this.state.left) ||
            !nextProps.editorState.getSelection().equals(this.props.editorState.getSelection()) ||
            (nextProps.editorHasFocus !== this.props.editorHasFocus);
    }
    componentDidUpdate (prevProps) {
        // if (nextProps.editorState.getSelection().equals(this.props.editorState.getSelection()))
        this.updateSidebarPosition(this.props);
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
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            let node = selection.getRangeAt(0).startContainer;
            do {
                if (node.getAttribute && node.getAttribute('data-block') === 'true') {
                    return node;
                }
                node = node.parentNode;
            } while (node != null);
        }
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
        // console.log(element, container, isBlackListed);

        if ((!element || !container || isBlackListed)) {
            return null;
            // return this.setState({
            //     top: -9999,
            //     left: -9999
            // });
        }
        const containerTop =
            (container.getBoundingClientRect().top) - document.documentElement.clientTop;
        const cursorNode = element.querySelector('span');
        const left = cursorNode.offsetLeft - 46;
        let top = element.getBoundingClientRect().top - containerTop;
        top = Math.floor(top);

        return this.setState({
            top,
            left
        });
    }

    resetSidebarPosition = () => {
        this.setState({
            top: -1,
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
        if (this.props.readOnly) {
            return null;
        }
        return (
          <div ref={(container) => { this.container = container; }} >
            <div
              style={{
                  top: `${this.state.top}px`,
                  left: `${this.state.left}px`,
                  zIndex: 9,
                  transition: 'top 0.13s ease-in-out',
              }}
              className="sidebar__menu"
            >
              <ul className="sidebar__sidemenu-wrapper">
                <SideMenu
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

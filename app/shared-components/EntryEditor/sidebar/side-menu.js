import React, { Component } from 'react';
import BlockStyles from './block-styles';
import ToggleButton from './toggle-button';

class SideMenu extends Component {
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
              showTerms={this.props.showTerms}
            />
          </li>
        );
    }
}
SideMenu.propTypes = {
    sidebarVisible: React.PropTypes.bool,
    plugins: React.PropTypes.arrayOf(React.PropTypes.shape()),
    editorState: React.PropTypes.shape(),
    onChange: React.PropTypes.func,
    showTerms: React.PropTypes.func
};

export default SideMenu;

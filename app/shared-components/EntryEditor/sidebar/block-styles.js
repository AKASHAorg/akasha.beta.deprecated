import React, { Component } from 'react';

class BlockStyles extends Component {
    onChange = (editorState) => {
        this.props.onChange(editorState);
    }
    handleClick = (ev) => {
        if (this.props.open) this.props.toggle(ev);
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
                      onClick={this.handleClick}
                      showTerms={this.props.showTerms}
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
    editorState: React.PropTypes.shape(),
    showTerms: React.PropTypes.func
};
BlockStyles.propTypes = {
    toggle: React.PropTypes.func
};

export default BlockStyles;

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { IconButton } from 'material-ui';

class CircleIcon extends Component {
    constructor (props) {
        super(props);

        this.state = {
            isHovered: false
        };
    }

    handleMouseEnter = () => {
        this.setState({
            isHovered: true
        });
    };

    handleMouseLeave = () => {
        this.setState({
            isHovered: false
        });
    };

    render () {
        const { children, disabled, iconStyle, isActive, onClick, tooltip } = this.props;
        const { palette } = this.context.muiTheme;
        const { isHovered } = this.state;
        const style = {
            marginTop: '16px',
            boxShadow: 'none',
            width: '36px',
            height: '36px',
            padding: 0,
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: !disabled && (isActive || isHovered) ?
                palette.primary1Color :
                palette.disabled,
            borderRadius: '50%'
        };
        return (
          <div onMouseEnter={this.handleMouseEnter} onMouseLeave={this.handleMouseLeave}>
            <IconButton
              tooltip={tooltip}
              style={style}
              disabled={disabled}
              iconStyle={Object.assign({ width: '32px', height: '32px', fill: '#000' }, iconStyle)}
              onClick={onClick}
            >
              {children}
            </IconButton>
          </div>
        );
    }
}

CircleIcon.propTypes = {
    children: PropTypes.element,
    disabled: PropTypes.bool,
    isActive: PropTypes.bool,
    iconStyle: PropTypes.shape(),
    onClick: PropTypes.func,
    tooltip: PropTypes.string,
};

CircleIcon.contextTypes = {
    muiTheme: PropTypes.shape()
};

export default CircleIcon;

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SvgIcon } from 'material-ui';
import { getMuiTheme } from 'material-ui/styles';
import { MenuAkashaLogo } from '../svg';

class IconLogo extends Component {
    static defaultProps = {
        logoStyle: {
            width: '40px', height: '40px', position: 'relative', top: '4px', cursor: 'initial'
        },
        viewBox: '0 0 32 32'
    };

    static propTypes = {
        color: PropTypes.string,
        hoverColor: PropTypes.string,
        logoStyle: PropTypes.shape(),
        viewBox: PropTypes.string
    };

    static contextTypes = {
        muiTheme: PropTypes.object
    };

    static childContextTypes = {
        muiTheme: PropTypes.object
    };

    state = {
        muiTheme: this.context.muiTheme || getMuiTheme()
    };

    getChildContext () {
        return {
            muiTheme: this.state.muiTheme
        };
    }

    render () {
        const { logoStyle, viewBox, hoverColor, color } = this.props;
        return (
          <SvgIcon
            className={'hand-icon'}
            color={color || this.context.muiTheme.palette.textColor}
            hoverColor={hoverColor || this.context.muiTheme.palette.disabledColor}
            style={logoStyle}
            viewBox={viewBox}
          >
            <MenuAkashaLogo />
          </SvgIcon>
        );
    }
}

export default IconLogo;

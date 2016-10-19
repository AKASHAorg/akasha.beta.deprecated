import React, { PropTypes, Component } from 'react';
import { SvgIcon } from 'material-ui';
import { getMuiTheme } from 'material-ui/styles';
import { MenuAkashaLogo } from '../svg';
import Radium from 'radium';

class IconLogo extends Component {
    static defaultProps = {
        iconStyle: { width: '32px', height: '32px' },
        viewBox: '0 0 32 32'
    };

    static propTypes = {
        color: PropTypes.string,
        hoverColor: PropTypes.string,
        iconStyle: PropTypes.object,
        viewBox: PropTypes.string
    };

    static contextTypes = {
        muiTheme: React.PropTypes.object
    };

    static childContextTypes = {
        muiTheme: React.PropTypes.object
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
        const { iconStyle, viewBox, hoverColor, color, ...other } = this.props;
        return (
          <SvgIcon
            className={'hand-icon'}
            color={color || this.context.muiTheme.palette.textColor}
            hoverColor={hoverColor || this.context.muiTheme.palette.disabledColor}
            style={iconStyle}
            viewBox={viewBox}
            {...other}
          >
            <MenuAkashaLogo />
          </SvgIcon>
        );
    }
}

export default Radium(IconLogo);

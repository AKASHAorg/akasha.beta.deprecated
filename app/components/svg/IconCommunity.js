import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SvgIcon } from 'material-ui';
import { colors } from 'material-ui/styles';
import CircleIcon from './CircleIcon';
import { MenuCommunities } from '../svg';


export default class IconCommunity extends Component {
    state = {
        muiTheme: this.context.muiTheme
    };

    static propTypes = {
        style: PropTypes.object,
        iconStyle: PropTypes.object,
        viewBox: PropTypes.string,
        hoverColor: PropTypes.string,
        color: PropTypes.string
    };

    static defaultProps = {
        style: {
            width: '32px',
            height: '32px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: '50%'
        },
        viewBox: '0 0 32 32',
        color: colors.lightBlack,
        hoverColor: colors.darkBlack
    };

    static contextTypes = {
        muiTheme: PropTypes.object
    };

    static childContextTypes = {
        muiTheme: PropTypes.object
    };

    getChildContext () {
        return {
            muiTheme: this.state.muiTheme
        };
    }

    render () {
        let { style, iconStyle, viewBox, hoverColor, color, disabled, tooltip, ...other } = this.props;
        const {
            baseTheme: {
                palette
            }
        } = this.state.muiTheme;

        style = Object.assign(style, {
            borderColor: colors.faintBlack,
            ':hover': {
                borderColor: palette.primary1Color
            }
        }
        );

        return (
          <CircleIcon
            disabled={disabled}
            tooltip={tooltip}
            onClick={this._handleClick}
          >
            <SvgIcon
              color={color}
              hoverColor={hoverColor}
              style={iconStyle}
              viewBox={viewBox}
              {...other}
            >
              <MenuCommunities />
            </SvgIcon>
          </CircleIcon>
        );
    }
    _handleClick = (ev) => {
        if (this.props.onClick) return this.props.onClick(ev);
    }
}


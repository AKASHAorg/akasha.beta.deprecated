import React, { PropTypes, Component } from 'react';
import { Badge } from 'material-ui';
import { colors } from 'material-ui/styles';
import Avatar from '../Avatar/avatar';

export default class IconProfile extends Component {

    state = {
        muiTheme: this.context.muiTheme
    };

    static propTypes = {
        avatar: PropTypes.string,
        style: PropTypes.object,
        iconStyle: PropTypes.object,
        viewBox: PropTypes.string,
        hoverColor: PropTypes.string,
        color: PropTypes.string,
        userInitials: PropTypes.string,
        onClick: PropTypes.func
    };

    static defaultProps = {
        style: {
            width: '38px',
            height: '38px',
            borderWidth: '1px',
            borderStyle: 'solid',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        },
        iconStyle: { width: '32px', height: '32px', visibility: 'visible', display: 'flex', justifyContent: 'center', alignItems: 'center' },
        viewBox: '0 0 32 32',
        color: colors.lightBlack,
        hoverColor: colors.darkBlack
    };

    static contextTypes = {
        muiTheme: React.PropTypes.object
    };

    static childContextTypes = {
        muiTheme: React.PropTypes.object
    };

    getChildContext () {
        return {
            muiTheme: this.state.muiTheme
        };
    }

    render () {
        const { avatar, style, iconStyle, userInitials, viewBox, hoverColor, color,
            ...other } = this.props;
        const {
            baseTheme: {
              palette
            }
        } = this.state.muiTheme;

        return (
          <Badge
            badgeContent={'99+'}
            badgeStyle={{
                top: '-6px',
                right: '-6px',
                fontSize: '10px',
                width: '18px',
                height: '18px',
                backgroundColor: colors.red500
            }}
            primary
            style={{ padding: 0 }}
            onClick={this.props.onClick}
          >
            <div
              style={Object.assign(style, { borderColor: palette.primary1Color })}
              className="user-icon"
            >
              <Avatar
                style={iconStyle}
                image={avatar}
                radius={34}
                userInitials={userInitials}
                userInitialsStyle={{
                    textTransform: 'uppercase',
                    fontSize: '12px',
                    fontWeight: '600',
                    margin: '0px'
                }}
              />
            </div>
          </Badge>
        );
    }
}

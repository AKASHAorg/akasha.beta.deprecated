import React, { PropTypes, Component } from 'react';
import { Badge } from 'material-ui';
import { colors } from 'material-ui/styles';
import Avatar from '../Avatar/avatar';

class IconProfile extends Component {

    state = {
        muiTheme: this.context.muiTheme
    };

    getChildContext () {
        return {
            muiTheme: this.state.muiTheme
        };
    }

    render () {
        const { avatar, style, iconStyle, userInitials, activePanel, viewBox, hoverColor, color,
            ...other } = this.props;
        const { palette } = this.state.muiTheme;
        const avatarWrapperStyle = {
            borderColor: palette.primary1Color,
            cursor: 'pointer',
            visibility: activePanel === 'userProfile' ?
                'visible' :
                null
        };

        return (
          <Badge
            badgeContent={3}
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
              className="user-icon"
              style={Object.assign({}, style, avatarWrapperStyle)}
            >
              <Avatar
                style={avatar ?
                    Object.assign({}, iconStyle, { position: 'relative', top: '3px' }) :
                    iconStyle
                }
                image={avatar}
                radius={32}
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

IconProfile.propTypes = {
    activePanel: PropTypes.string,
    avatar: PropTypes.string,
    style: PropTypes.object,
    iconStyle: PropTypes.object,
    viewBox: PropTypes.string,
    hoverColor: PropTypes.string,
    color: PropTypes.string,
    userInitials: PropTypes.string,
    onClick: PropTypes.func
};

IconProfile.defaultProps = {
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

IconProfile.contextTypes = {
    muiTheme: React.PropTypes.object
};

IconProfile.childContextTypes = {
    muiTheme: React.PropTypes.object
};

export default IconProfile;

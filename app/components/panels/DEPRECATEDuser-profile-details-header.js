import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { colors } from 'material-ui/styles';
import { SvgIcon, IconButton } from 'material-ui';
import { ToolbarWallet, ToolbarComments,
    ToolbarVotes, ToolbarEthereum, ToolbarProfile,
    ToolbarSettings, ToolbarLogout } from '../svg';
import { Avatar } from '../';

const svgStyle = {
    style: {
        width: '20px',
        height: '20px',
        transform: 'scale(1.2)'
    },
    color: colors.minBlack,
    hoverColor: colors.lightBlack,
    viewBox: '0 0 20 20'
};

class UserProfileHeader extends PureComponent {
    showPanel = panel => (ev) => {
        console.log('navigate to panel', panel);
    }
    render () {
        const { muiTheme, onPanelNavigate, loggedProfileData } = this.props;
        // this should be removed; this component (or it's parent) should be
        // connected to the redux store in order to get its props
        if (!loggedProfileData) {
            return null;
        }
        const { palette } = muiTheme;
        const avatarImage = null;
        const userInitials = 'SA';
        return (
          <div className="col-xs-12">
            <div className="row">
              <div className="col-xs-4">
                <Avatar
                  size={100}
                  image={avatarImage}
                  editable={false}
                  offsetBorder="1px solid rgba(0, 0, 0, 0.41)"
                  userInitials={userInitials}
                />
              </div>
              <div className="col-xs-8">
                <div className="row">
                  <div data-tip="Wallet">
                    <IconButton
                      style={{ width: '40px', height: '40px' }}
                      iconStyle={svgStyle.style}
                      disabled
                    >
                      <SvgIcon
                        viewBox={svgStyle.viewBox}
                        className={'hand-icon'}
                        color={svgStyle.color}
                        hoverColor={svgStyle.hoverColor}
                      >
                        <ToolbarWallet />
                      </SvgIcon>
                    </IconButton>
                  </div>
                  <div data-tip="Comments">
                    <IconButton
                      style={{ width: '40px', height: '40px' }}
                      iconStyle={svgStyle.style}
                      disabled
                    >
                      <SvgIcon
                        viewBox={svgStyle.viewBox}
                        className={'hand-icon'}
                        color={svgStyle.color}
                        hoverColor={svgStyle.hoverColor}
                      >
                        <ToolbarComments />
                      </SvgIcon>
                    </IconButton>
                  </div>
                  <div data-tip="Votes">
                    <IconButton
                      style={{ width: '40px', height: '40px' }}
                      iconStyle={svgStyle.style}
                      disabled
                    >
                      <SvgIcon
                        viewBox={svgStyle.viewBox}
                        className={'hand-icon'}
                        color={svgStyle.color}
                        hoverColor={svgStyle.hoverColor}
                      >
                        <ToolbarVotes />
                      </SvgIcon>
                    </IconButton>
                  </div>
                  <div data-tip="Network">
                    <IconButton
                      style={{ width: '40px', height: '40px' }}
                      iconStyle={svgStyle.style}
                      disabled
                    >
                      <SvgIcon
                        viewBox={svgStyle.viewBox}
                        className={'hand-icon'}
                        color={svgStyle.color}
                        hoverColor={svgStyle.hoverColor}
                      >
                        <ToolbarEthereum />
                      </SvgIcon>
                    </IconButton>
                  </div>
                  <div data-tip="Profile">
                    <IconButton
                      style={{ width: '40px', height: '40px' }}
                      iconStyle={svgStyle.style}
                      onTouchTap={onPanelNavigate('editProfile')}
                    >
                      <SvgIcon
                        viewBox={svgStyle.viewBox}
                        className="hand-icon"
                        hoverColor={svgStyle.hoverColor}
                      >
                        <ToolbarProfile />
                      </SvgIcon>
                    </IconButton>
                  </div>
                  <div data-tip="Settings">
                    <IconButton
                      style={{ width: '40px', height: '40px' }}
                      iconStyle={svgStyle.style}
                      disabled
                    >
                      <SvgIcon
                        viewBox={svgStyle.viewBox}
                        className={'hand-icon'}
                        color={svgStyle.color}
                        hoverColor={svgStyle.hoverColor}
                      >
                        <ToolbarSettings />
                      </SvgIcon>
                    </IconButton>
                  </div>
                  <div data-tip="Logout">
                    <IconButton
                      style={{ width: '40px', height: '40px' }}
                      iconStyle={svgStyle.style}
                      onTouchTap={() => { /**profileActions.logout(profileAddress);*/ }}
                    >
                      <SvgIcon
                        viewBox={svgStyle.viewBox}
                        className={'hand-icon'}
                        color={palette.textColor}
                        hoverColor={svgStyle.hoverColor}
                      >
                        <ToolbarLogout />
                      </SvgIcon>
                    </IconButton>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xs-12">{loggedProfileData.get('firstName')} {loggedProfileData.get('lastName')}</div>
            <div className="col-xs-12">@{loggedProfileData.get('akashaId')}</div>
          </div>
        );
    }
}

UserProfileHeader.propTypes = {
    muiTheme: PropTypes.shape(),
    onPanelNavigate: PropTypes.func,
    loggedProfileData: PropTypes.shape()
};

export default UserProfileHeader;

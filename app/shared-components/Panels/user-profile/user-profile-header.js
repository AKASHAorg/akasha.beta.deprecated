import React, { PropTypes } from 'react';
import { IconButton, SvgIcon } from 'material-ui';
import { colors } from 'material-ui/styles';
import Avatar from '../../Avatar/avatar';
import {
  ToolbarWallet,
  ToolbarComments,
  ToolbarVotes,
  ToolbarEthereum,
  ToolbarProfile,
  ToolbarSettings,
  ToolbarLogout
} from '../../svg';

const UserProfileHeader = (props, { router, muiTheme }) => {
    const { profile, profileAddress, profileActions, showPanel } = props;
    const { palette } = muiTheme;
    // const avatarImage = `data:image/gif;base64,${
    //     btoa(String.fromCharCode.apply(null, profile.getIn(['optionalData', 'avatar'])))
    // }`;
    const avatarImage = profile.get('avatar');
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
    const navigateToProfile = () => {
        props.hidePanel();
        router.push(`/${profile.get('profile')}/profile/${profileAddress}`);
    };
    const profileName = `${profile.get('firstName')} ${profile.get('lastName')}`;
    const userInitials = profileName.match(/\b\w/g).reduce((prev, current) => prev + current, '');
    return (
      <div style={props.rootStyle} >
        <div className="row top-xs" >
          <div className="col-xs-4" >
            <Avatar
              radius={130}
              image={avatarImage}
              editable={false}
              offsetBorder="1px solid rgba(0, 0, 0, 0.41)"
              userInitials={userInitials}
            />
          </div>
          <div className="col-xs-8" style={{ marginTop: '-20px' }} >
            <div className="row end-xs" >
              <IconButton
                tooltip="Wallet"
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
              <IconButton
                tooltip="Comments"
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
              <IconButton
                tooltip="Votes"
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
              <IconButton
                tooltip="Network"
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
              <IconButton
                tooltip="Profile"
                style={{ width: '40px', height: '40px' }}
                iconStyle={svgStyle.style}
                onTouchTap={() => { showPanel({ name: 'editProfile', overlay: true }); }}
              >
                <SvgIcon
                  viewBox={svgStyle.viewBox}
                  className="hand-icon"
                  color={palette.textColor}
                  hoverColor={svgStyle.hoverColor}
                >
                  <ToolbarProfile />
                </SvgIcon>
              </IconButton>
              <IconButton
                tooltip="Settings"
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
              <IconButton
                tooltip="Logout"
                style={{ width: '40px', height: '40px' }}
                iconStyle={svgStyle.style}
                onTouchTap={() => { profileActions.logout(profileAddress); }}
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
        <div className="row start-xs" >
          <div
            className="col-xs-12 textLink"
            onClick={navigateToProfile}
            style={{
                fontSize: '36px',
                fontWeight: 400,
                textTransform: 'capitalize'
            }}
          >
            {`${profile.get('firstName')} ${profile.get('lastName')}`}
          </div>
          <div
            className="col-xs-12 textLink"
            onClick={navigateToProfile}
            style={{ fontSize: '20px' }}
          >
            {`@${profile.get('akashaId')}`}
          </div>
        </div>
      </div>
    );
};

UserProfileHeader.propTypes = {
    rootStyle: PropTypes.shape(),
    profileActions: PropTypes.shape(),
    profileAddress: PropTypes.string,
    profile: PropTypes.shape(),
    showPanel: PropTypes.func,
    hidePanel: PropTypes.func
};
UserProfileHeader.contextTypes = {
    router: PropTypes.shape(),
    muiTheme: PropTypes.shape()
};
UserProfileHeader.defaultProps = {
    rootStyle: {
        width: '100%',
        borderBottom: '2px solid #cccccc',
        paddingTop: '16px',
        paddingLeft: '32px',
        paddingRight: '32px',
        paddingBottom: '64px',
        backgroundColor: 'rgba(0, 0, 0, 0.03)'
    }
};
export default UserProfileHeader;

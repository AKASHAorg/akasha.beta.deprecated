import PropTypes from 'prop-types';
import React from 'react';
import { IconButton, SvgIcon } from 'material-ui';
import { colors } from 'material-ui/styles';
import { getInitials } from '../../../utils/dataModule';
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
    const userInitials = getInitials(profile.get('firstName'), profile.get('lastName'));
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
        </div>
        <div className="row start-xs" >
          <div
            className="content-link"
            onClick={navigateToProfile}
            style={{
                fontSize: '36px',
                fontWeight: 400,
                textTransform: 'capitalize',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                width: '100%'
            }}
          >
            {`${profile.get('firstName')} ${profile.get('lastName')}`}
          </div>
          <div
            className="content-link"
            onClick={navigateToProfile}
            style={{
                fontSize: '20px',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                width: '100%'
            }}
          >
            {`@${profile.get('akashaId')}`}
          </div>
        </div>
      </div>
    );
};

UserProfileHeader.propTypes = {
    hidePanel: PropTypes.func,
    profile: PropTypes.shape(),
    profileActions: PropTypes.shape(),
    profileAddress: PropTypes.string,
    rootStyle: PropTypes.shape(),
    showPanel: PropTypes.func,
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

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

const UserProfileHeader = (props) => {
    const { profile } = props;
    const profileAddress = profile.get('address');
    const avatarImage = `data:image/gif;base64,${
        btoa(String.fromCharCode.apply(null, profile.getIn(['optionalData', 'avatar'])))
    }`;
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
    return (
      <div style={props.rootStyle} >
        <div className="row top-xs" >
          <div className="col-xs-4" >
            <Avatar
              radius={130}
              image={avatarImage}
              editable={false}
              offsetBorder="1px solid rgba(0, 0, 0, 0.41)"
            />
          </div>
          <div className="col-xs-8" style={{ marginTop: '-20px' }} >
            <div className="row end-xs" >
              <IconButton
                tooltip="Wallet"
                style={{ width: '40px', height: '40px' }}
                iconStyle={svgStyle.style}
              >
                <SvgIcon
                  viewBox={svgStyle.viewBox}
                  className={"hand-icon"}
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
              >
                <SvgIcon
                  viewBox={svgStyle.viewBox}
                  className={"hand-icon"}
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
              >
                <SvgIcon
                  viewBox={svgStyle.viewBox}
                  className={"hand-icon"}
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
              >
                <SvgIcon
                  viewBox={svgStyle.viewBox}
                  className={"hand-icon"}
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
              >
                <SvgIcon
                  viewBox={svgStyle.viewBox}
                  className={"hand-icon"}
                  color={svgStyle.color}
                  hoverColor={svgStyle.hoverColor}
                >
                  <ToolbarProfile />
                </SvgIcon>
              </IconButton>
              <IconButton
                tooltip="Settings"
                style={{ width: '40px', height: '40px' }}
                iconStyle={svgStyle.style}
              >
                <SvgIcon
                  viewBox={svgStyle.viewBox}
                  className={"hand-icon"}
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
                onTouchTap={() => { props.profileActions.logout(profileAddress); }}
              >
                <SvgIcon
                  viewBox={svgStyle.viewBox}
                  className={"hand-icon"}
                  color={svgStyle.color}
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
            className="col-xs-12"
            style={{
                fontSize: '48px',
                fontWeight: 500,
                textTransform: 'capitalize'
            }}
          >
            {`${profile.get('lastName')} ${profile.get('firstName')}`}
          </div>
          <div
            className="col-xs-12"
            style={{ fontSize: '28px', fontWeight: 200 }}
          >
            {`@${profile.get('userName')}`}
          </div>
        </div>
      </div>
    );
};

UserProfileHeader.propTypes = {
    scrollPos: PropTypes.object,
    rootStyle: PropTypes.object,
    profileActions: PropTypes.object,
};
UserProfileHeader.defaultProps = {
    rootStyle: {
        width: '100%',
        borderBottom: '2px solid #cccccc',
        paddingTop: '32px',
        paddingLeft: '32px',
        paddingRight: '32px',
        paddingBottom: '104px',
        backgroundColor: 'rgba(0, 0, 0, 0.03)'
    }
};
export default UserProfileHeader;

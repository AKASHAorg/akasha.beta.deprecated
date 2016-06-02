import React, { Component, PropTypes } from 'react';
import { Paper, IconButton, SvgIcon } from 'material-ui';
import { colors } from 'material-ui/styles';
import {
  ToolbarWallet,
  ToolbarComments,
  ToolbarVotes,
  ToolbarEthereum,
  ToolbarProfile,
  ToolbarSettings,
  ToolbarLogout
} from '../../ui/svg';

class UserProfileHeader extends Component {
    render () {
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
            <div style={ this.props.rootStyle } >
                <div className="row top-xs" >
                    <div className="col-xs-4" >
                        <Paper style={{ width: '100px', height: '100px' }}
                          zDepth={1}
                          circle
                        />
                    </div>
                    <div className="col-xs-8" style={{ marginTop: '-20px' }} >
                        <div className="row end-xs" >
                            <IconButton tooltip="Wallet" style={{ width: '40px', height: '40px' }}
                              iconStyle={svgStyle.style}
                            >
                                <SvgIcon viewBox={svgStyle.viewBox}
                                  className={"hand-icon"}
                                  color={svgStyle.color}
                                  hoverColor={svgStyle.hoverColor}
                                >
                                    <ToolbarWallet />
                                </SvgIcon>
                            </IconButton>
                        <IconButton tooltip="Comments" style={{ width: '40px', height: '40px' }}
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
                        <IconButton tooltip="Votes" style={{ width: '40px', height: '40px' }}
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
                        <IconButton tooltip="Network" style={{ width: '40px', height: '40px' }}
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
                        <IconButton tooltip="Profile" style={{ width: '40px', height: '40px' }}
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
                        <IconButton tooltip="Settings" style={{ width: '40px', height: '40px' }}
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
                        <IconButton tooltip="Logout" style={{ width: '40px', height: '40px' }}
                          iconStyle={ svgStyle.style}
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
                <div className="col-xs-12"
                  style={{ fontSize: '58px', fontFamily: 'Roboto', fontWeight: 500 }}
                >
                    {"John Doe"}
                </div>
                <div className="col-xs-12"
                  style={{ fontSize: '28px', fontFamily: 'Roboto', fontWeight: 200 }}
                >
                    {"@johnDoe"}
                </div>
            </div>
        </div>
        );
    }
}
UserProfileHeader.propTypes = {
    scrollPos: PropTypes.object,
    rootStyle: PropTypes.object
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

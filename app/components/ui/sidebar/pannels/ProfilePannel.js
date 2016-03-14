import Pannel from './Pannel';
import React, { PropTypes, Component } from 'react';
import Radium from 'radium';
import * as Colors from 'material-ui/lib/styles/colors';
import Paper from 'material-ui/lib/paper';
import SvgIcon from 'material-ui/lib/svg-icon';
import IconButton from 'material-ui/lib/icon-button';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import Avatar from 'material-ui/lib/avatar';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';

import {ToolbarWallet, ToolbarComments, ToolbarVotes, ToolbarEthereum,
  ToolbarProfile, ToolbarSettings, ToolbarLogout} from '../../svg';

const svgStyle = {
  style:      {
    width:     '20px',
    height:    '20px',
    transform: 'scale(1.2)'
  },
  color:      Colors.minBlack,
  hoverColor: Colors.lightBlack,
  viewBox:    '0 0 20 20'
};

const tabStyles = {
  default_tab: {
    color:      Colors.grey500,
    fontWeight: 400,
  },
  active_tab:  {
    color: Colors.deepOrange700,
  }
};

const iconButtonElement = (
  <IconButton
    touch={true}
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={Colors.grey400}/>
  </IconButton>
);

const rightIconMenu = (
  <IconMenu iconButtonElement={iconButtonElement}>
    <MenuItem>Reply</MenuItem>
    <MenuItem>Forward</MenuItem>
    <MenuItem>Delete</MenuItem>
  </IconMenu>
);

class ProfilePannel extends Component {

  render () {

    return (
      <Pannel>
        <div
          style={{width:"100%", borderBottom: '2px solid #cccccc', paddingTop: "32px", paddingLeft: "32px", paddingRight: "32px", paddingBottom: "104px", backgroundColor:'rgba(0, 0, 0, 0.03)'}}>
          <div className="row top-xs">
            <div className="col-xs-4">
              <Paper style={{width:'100px', height:'100px'}} zDepth={1} circle={true}/>
            </div>
            <div className="col-xs-8" style={{marginTop: '-20px'}}>
              <div className="row end-xs">
                <IconButton tooltip="Wallet" style={{width: '40px', height: '40px'}} iconStyle={svgStyle.style}>
                  <SvgIcon viewBox={svgStyle.viewBox}
                           className={"hand-icon"}
                           color={svgStyle.color}
                           hoverColor={svgStyle.hoverColor}
                  >
                    <ToolbarWallet />
                  </SvgIcon>
                </IconButton>
                <IconButton tooltip="Comments" style={{width: '40px', height: '40px'}} iconStyle={svgStyle.style}>
                  <SvgIcon
                    viewBox={svgStyle.viewBox}
                    className={"hand-icon"}
                    color={svgStyle.color}
                    hoverColor={svgStyle.hoverColor}
                  >
                    <ToolbarComments />
                  </SvgIcon>
                </IconButton>
                <IconButton tooltip="Votes" style={{width: '40px', height: '40px'}} iconStyle={svgStyle.style}>
                  <SvgIcon
                    viewBox={svgStyle.viewBox}
                    className={"hand-icon"}
                    color={svgStyle.color}
                    hoverColor={svgStyle.hoverColor}
                  >
                    <ToolbarVotes />
                  </SvgIcon>
                </IconButton>
                <IconButton tooltip="Network" style={{width: '40px', height: '40px'}} iconStyle={svgStyle.style}>
                  <SvgIcon
                    viewBox={svgStyle.viewBox}
                    className={"hand-icon"}
                    color={svgStyle.color}
                    hoverColor={svgStyle.hoverColor}
                  >
                    <ToolbarEthereum />
                  </SvgIcon>
                </IconButton>
                <IconButton tooltip="Profile" style={{width: '40px', height: '40px'}} iconStyle={svgStyle.style}>
                  <SvgIcon
                    viewBox={svgStyle.viewBox}
                    className={"hand-icon"}
                    color={svgStyle.color}
                    hoverColor={svgStyle.hoverColor}
                  >
                    <ToolbarProfile />
                  </SvgIcon>
                </IconButton>
                <IconButton tooltip="Settings" style={{width: '40px', height: '40px'}} iconStyle={svgStyle.style}>
                  <SvgIcon
                    viewBox={svgStyle.viewBox}
                    className={"hand-icon"}
                    color={svgStyle.color}
                    hoverColor={svgStyle.hoverColor}
                  >
                    <ToolbarSettings />
                  </SvgIcon>
                </IconButton>
                <IconButton tooltip="Logout" style={{width: '40px', height: '40px'}} iconStyle={svgStyle.style}>
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
          <div className="row start-xs">
            <div className="col-xs-12" style={{fontSize: '58px', fontFamily: "Roboto", fontWeight: 500}}>
              {"John Doe"}
            </div>
            <div className="col-xs-12" style={{fontSize: '28px', fontFamily: "Roboto", fontWeight: 200}}>
              {"@johnDoe"}
            </div>
          </div>
        </div>
        <div style={{width:"100%", marginTop: '-48px'}}>
          <div>
            <Tabs tabItemContainerStyle={{backgroundColor: 'transparent'}}>
              <Tab label="FEED" style={tabStyles.default_tab}>
                <div>
                  <List subheader="Wednesday, 27 January 2016">
                    <ListItem
                      leftAvatar={<Avatar src="" />}
                      rightIconButton={rightIconMenu}
                      primaryText={<strong style={{color: Colors.darkBlack}}>Vasile Ghita</strong>}
                      secondaryText={
            <p>
              <span style={{color: Colors.darkBlack}}>Commented on <a href="#">Entry name</a></span><br/>
              Jan10
            </p>
          }
                      secondaryTextLines={2}
                    />
                    <Divider/>
                    <ListItem
                      leftAvatar={<Avatar src=""/>}
                      rightIconButton={rightIconMenu}
                      primaryText={<strong style={{color: Colors.darkBlack}}>Vasile Ghita</strong>}
                      secondaryText={
            <p>
              <span style={{color: Colors.darkBlack}}>Commented on <a href="#">Entry name</a></span><br/>
              Jan10
            </p>
          }
                      secondaryTextLines={2}
                    />
                    <Divider/>
                  </List>
                  <List subheader="Last week">
                    <ListItem
                      leftAvatar={<Avatar src=""/>}
                      rightIconButton={rightIconMenu}
                      primaryText={<strong style={{color: Colors.darkBlack}}>Vasile Ghita</strong>}
                      secondaryText={
            <p>
              <span style={{color: Colors.darkBlack}}>Published on <a href="#">Entry name</a></span><br/>
              Jan10
            </p>
          }
                      secondaryTextLines={2}
                    />
                    <Divider/>
                    <ListItem
                      leftAvatar={<Avatar src="" />}
                      rightIconButton={rightIconMenu}
                      primaryText={<strong style={{color: Colors.darkBlack}}>Vasile Ghita</strong>}
                      secondaryText={
            <p>
              <span style={{color: Colors.darkBlack}}>Voted on <a href="#">Entry name</a></span><br/>
              Jan10
            </p>
          }
                      secondaryTextLines={2}
                    />
                    <Divider/>
                    <ListItem
                      leftAvatar={<Avatar src=""/>}
                      rightIconButton={rightIconMenu}
                      primaryText={<strong style={{color: Colors.darkBlack}}>Vasile Ghita</strong>}
                      secondaryText={
            <p>
              <span style={{color: Colors.darkBlack}}>Updated on <a href="#">Entry name</a></span><br/>
              Jan10
            </p>
          }
                      secondaryTextLines={2}
                    />
                    <Divider/>

                  </List>

                </div>
              </Tab>
              <Tab label={<span>You <sup style={{color: Colors.red500}}>(3)</sup></span>} style={tabStyles.default_tab}>
                <div></div>
              </Tab>
              <Tab label="MESSAGES" style={tabStyles.default_tab}>
                <div></div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </Pannel>
    )

  }
}
export default Radium(ProfilePannel);

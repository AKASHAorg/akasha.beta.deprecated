import React, { PropTypes, PureComponent } from 'react';
import { colors } from 'material-ui/styles';
import {
  Paper,
  IconButton,
  Tabs,
  Tab,
  List,
  Subheader,
  ListItem,
  Divider,
  Avatar,
  IconMenu,
  MenuItem } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import UserProfileHeader from './user-profile/user-profile-header';

const tabStyles = {
    default_tab: {
        color: colors.grey500,
        fontWeight: 400,
    },
    active_tab: {
        color: colors.deepOrange700,
    }
};

const iconButtonElement = (
  <IconButton
    touch
    tooltip="more"
    tooltipPosition="bottom-left"
  >
    <MoreVertIcon color={colors.grey400} />
  </IconButton>
);

const rightIconMenu = (
  <IconMenu iconButtonElement={iconButtonElement} >
    <MenuItem>Reply</MenuItem>
    <MenuItem>Forward</MenuItem>
    <MenuItem>Delete</MenuItem>
  </IconMenu>
);

class UserProfilePanel extends PureComponent {
    render () {
        const { loggedProfileData, profileActions, profileAddress, showPanel } = this.props;
        return (
          <Paper
            style={{
                width: (this.props.width || 480),
                zIndex: 10,
                position: 'relative',
                height: '100%',
                borderRadius: 0
            }}
          >
            <UserProfileHeader
              profile={loggedProfileData}
              profileActions={profileActions}
              profileAddress={profileAddress}
              showPanel={showPanel}
            />
            <div style={{ width: '100%', marginTop: '-48px' }} >
              <div>
                <Tabs tabItemContainerStyle={{ backgroundColor: 'transparent' }} >
                  <Tab label="FEED" style={tabStyles.default_tab} >
                    <div>
                      <List >
                        <Subheader>Wednesday, 27 January 2016</Subheader>
                        <ListItem
                          leftAvatar={<Avatar src="" />}
                          rightIconButton={rightIconMenu}
                          primaryText={
                            <strong style={{ color: colors.darkBlack }}>
                              Vasile Ghita
                            </strong>
                          }
                          secondaryText={
                            <p>
                              <span style={{ color: colors.darkBlack }}>
                                Commented on <a href="#">Entry name</a>
                              </span>
                              <br />
                              Jan10
                            </p>
                          }
                          secondaryTextLines={2}
                        />
                        <Divider />
                      </List>
                      <List>
                        <Subheader>Last week</Subheader>
                        <ListItem
                          leftAvatar={<Avatar src="" />}
                          rightIconButton={rightIconMenu}
                          primaryText={
                            <strong style={{ color: colors.darkBlack }}>
                              Vasile Ghita
                            </strong>
                          }
                          secondaryText={
                            <p>
                              <span style={{ color: colors.darkBlack }}>
                                Published on <a href="#">Entry name</a>
                              </span><br />
                              Jan10
                            </p>
                          }
                          secondaryTextLines={2}
                        />
                        <Divider />
                      </List>
                    </div>
                  </Tab>
                  <Tab
                    label={
                      <span>
                        You <sup style={{ color: colors.red500 }}>(3)</sup>
                      </span>
                    }
                    style={tabStyles.default_tab}
                  >
                    <div></div>
                  </Tab>
                  <Tab label="MESSAGES" style={tabStyles.default_tab} >
                    <div></div>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </Paper>
        );
    }
}
UserProfilePanel.propTypes = {
    width: PropTypes.string,
    loggedProfileData: PropTypes.shape(),
    profileActions: PropTypes.shape(),
    profileAddress: PropTypes.string,
    showPanel: PropTypes.func
};

export default UserProfilePanel;

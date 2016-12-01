import React, { PropTypes, Component } from 'react';
import { colors } from 'material-ui/styles';
import {
  Paper,
  Tabs,
  Tab,
  List,
  Subheader,
  ListItem,
  Divider,
  Avatar
} from 'material-ui';
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
const selectedStyle = {
    position: "fixed",
    top: "296px",
    width: "480px",
    bottom: "0px",
    overflow: "auto"
};
const [FEED_SELECTED, YOU_SELECTED, MESSAGES_SELECTED] = [1, 2, 3];

class UserProfilePanel extends Component{
    constructor (props) {
        super(props);
        this.state = {
            selected: FEED_SELECTED
        };
    }
    getStyle = (identity) => {
      if(identity === this.state.selected){
          return selectedStyle;
      }
      return {};
    };

    getFeedNotifications = () => {
        const { notificationsActions } = this.props;
    };

    getYouNotifications = () => {
        const { notificationsActions } = this.props;

    };

    readSubscriptionNotif = () => {
      const { notificationsActions } = this.props;
      notificationsActions.readFeedNotif();
    };

    readYouNotif = (number) => {
        const { notificationsActions } = this.props;
        notificationsActions.readYouNotif(number);
    };

    render () {
        const { loggedProfileData, profileActions, profileAddress, showPanel, notificationsState } = this.props;
        console.log(notificationsState);
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
                  <Tab label="FEED" style={tabStyles.default_tab}
                       onActive={()=> { this.setState({selected: FEED_SELECTED }); this.readSubscriptionNotif();}}
                  >
                    <div style={this.getStyle(FEED_SELECTED)}>
                      <List >
                        <Subheader>Wednesday, 27 January 2016</Subheader>
                        <ListItem
                          leftAvatar={<Avatar src="" />}
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
                        <List>
                            <Subheader>Last week</Subheader>
                            <ListItem
                                leftAvatar={<Avatar src="" />}
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
                        <List>
                            <Subheader>Last week</Subheader>
                            <ListItem
                                leftAvatar={<Avatar src="" />}
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
                    onActive={()=> {this.setState({selected: YOU_SELECTED}); this.readYouNotif(1);}}
                  >
                    <div style={this.getStyle(YOU_SELECTED)}></div>
                  </Tab>
                  <Tab label="MESSAGES" style={tabStyles.default_tab}  onActive={()=> this.setState({selected: MESSAGES_SELECTED})}>
                    <div style={this.getStyle(MESSAGES_SELECTED)}></div>
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

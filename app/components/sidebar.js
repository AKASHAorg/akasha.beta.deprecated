import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import { Button, Popover, Progress, Tooltip } from 'antd';
import panels from '../constants/panels';
import { genId } from '../utils/dataModule';
import { balanceToNumber } from '../utils/number-formatter';
import { Avatar, EssencePopover, Icon, ManaPopover, SidebarIcon } from './';
import { generalMessages, profileMessages } from '../locale-data/messages';
import { draftCreate } from '../local-flux/actions/draft-actions';
import { profileEditToggle } from '../local-flux/actions/app-actions';
import { profileLogout } from '../local-flux/actions/profile-actions';
import { selectLoggedProfileData, selectLoggedProfile,
    selectProfileEditToggle } from '../local-flux/selectors';

class Sidebar extends Component {
    state = {
        overlayVisible: false,
        showEntryMenu: false,
        visible: false
    };
    wasVisible = false;

    hide = () => {
        this.setState({
            visible: false,
        });
    }

    handleVisibleChange = (visible) => {
        this.wasVisible = true;
        this.setState({ visible });
    }

    handleSearch = () => this.handlePanelShow(panels.search);

    _toggleEntryMenu = (ev) => {
        ev.preventDefault();
        this.setState(prevState => ({
            overlayVisible: !prevState.overlayVisible,
            showEntryMenu: !prevState.showEntryMenu
        }));
    }

    _isSidebarVisible = (location) => {
        /**
         * specify blacklisted routes
         *  on which we should not show sidebar
         */
        const blackList = ['setup'];
        return !blackList.every(route => location.pathname.includes(route));
    }
    _navigateTo = (path) => {
        const { history, userSelectedLicense, loggedProfile } = this.props;
        return () => {
            this.setState({
                overlayVisible: false,
                showEntryMenu: false,
            }, () => {
                const draftId = genId();
                if (path === '/draft/article/new') {
                    this.props.draftCreate({
                        id: draftId,
                        ethAddress: loggedProfile.get('ethAddress'),
                        content: {
                            featuredImage: {},
                            licence: userSelectedLicense,
                            entryType: 'article',
                        },
                        tags: [],
                    });
                    return history.push(`/draft/article/${draftId}`);
                }
                if (path === '/draft/link/new') {
                    this.props.draftCreate({
                        id: draftId,
                        ethAddress: loggedProfile.get('ethAddress'),
                        content: {
                            featuredImage: {},
                            licence: userSelectedLicense,
                            entryType: 'link'
                        },
                        tags: [],
                    });
                    return history.push(`/draft/link/${draftId}`);
                }
                return history.push(path);
            });
        };
    }
    _checkActiveIcon = (name) => {
        const { location } = this.props;
        return location.pathname.includes(name);
    }

    _toggleOverlay = () => {
        this.setState({
            overlayVisible: false,
            showEntryMenu: false,
        });
    }

    _handleLogout = () => {
        if (this.props.isProfileEditToggled) {
            this.props.profileEditToggle();
        }
        this.props.profileLogout();
    }

    render () {
        const { activeDashboard, intl, location, loggedProfileData } = this.props;
        const karmaScore = balanceToNumber(loggedProfileData.get('karma'));
        const karmaLevel = Math.floor(karmaScore / 1000);
        const nextLevel = (karmaLevel + 1) * 1000;
        const percent = (karmaScore / nextLevel) * 100;
        const tooltip = (
          <div>
            <div>{intl.formatMessage(profileMessages.karmaLevel, { karmaLevel })}</div>
            <div>{karmaScore} / {nextLevel}</div>
          </div>
        );

        const menu = (
          <div onClick={this.hide}>
            <div
              onClick={this.props.profileEditToggle}
              className="popover-menu__item"
            >
              {intl.formatMessage(generalMessages.editProfile)}
            </div>
            <div
              onClick={this._handleLogout}
              className="popover-menu__item"
            >
              {intl.formatMessage(generalMessages.logout)}
            </div>
          </div>
        );

        return (
          <div className={`sidebar ${this._isSidebarVisible(location) && 'sidebar_shown'}`}>
            <div className="sidebar__top-icons">
              <div className="flex-center-x sidebar__new-entry">
                <div className="content-link flex-center sidebar__new-entry-wrapper">
                  <Icon
                    className="sidebar__new-entry-icon"
                    onClick={this._toggleEntryMenu}
                    type="newEntry"
                  />
                </div>
                <div
                  className={
                    `sidebar__entry-menu
                    sidebar__entry-menu${this.state.showEntryMenu ? '_active' : ''}`
                  }
                >
                  <ul className="sidebar__entry-menu-buttons">
                    <li>
                      <Tooltip
                        title={intl.formatMessage(generalMessages.sidebarTooltipDraftText)}
                        placement="bottom"
                      >
                        <Button
                          type="entry-menu-button"
                          size="large"
                          className="borderless"
                          icon="file"
                          ghost
                          onClick={this._navigateTo('/draft/article/new')}
                        />
                      </Tooltip>
                    </li>
                    <li>
                      <Tooltip
                        title={intl.formatMessage(generalMessages.sidebarTooltipDraftLink)}
                        placement="bottom"
                      >
                        <Button
                          type="entry-menu-button"
                          size="large"
                          className="borderless"
                          icon="link"
                          ghost
                          onClick={this._navigateTo('/draft/link/new')}
                        />
                      </Tooltip>
                    </li>
                  </ul>
                </div>
              </div>
              <SidebarIcon
                activePath="/dashboard"
                linkTo={`/dashboard/${activeDashboard || ''}`}
                iconType="dashboard"
                tooltipTitle={intl.formatMessage(generalMessages.sidebarTooltipDashboard)}
              />
              <SidebarIcon
                activePath="/profileoverview"
                className="sidebar__profile-icon"
                linkTo="/profileoverview/myentries"
                iconType="profileOverview"
                tooltipTitle={intl.formatMessage(generalMessages.sidebarTooltipProfile)}
              />
              <SidebarIcon
                activePath="/community"
                linkTo="/community"
                iconType="community"
                tooltipTitle={intl.formatMessage(generalMessages.sidebarTooltipCommunity)}
                disabled
              />
              <SidebarIcon
                activePath="/search"
                linkTo="/search/entries"
                iconType="search"
                tooltipTitle={intl.formatMessage(generalMessages.sidebarTooltipSearch)}
              />
              <SidebarIcon
                activePath="/chat"
                linkTo="/chat"
                iconType="chat"
                tooltipTitle={intl.formatMessage(generalMessages.sidebarTooltipChat)}
                disabled
              />
            </div>
            <div className="flex-center-x content-link sidebar__progress-wrapper">
              <ManaPopover />
            </div>
            <div className="flex-center-x content-link sidebar__progress-wrapper">
              <EssencePopover />
            </div>
            <div className="flex-center-x sidebar__progress-wrapper">
              <Tooltip
                placement="topLeft"
                title={tooltip}
              >
                <Progress
                  className="sidebar__karma-progress"
                  format={() => <Icon className="sidebar__karma-icon" type="karma" />}
                  percent={percent}
                  strokeWidth={10}
                  type="circle"
                  width={35}
                />
              </Tooltip>
            </div>
            <div className="flex-center-x sidebar__avatar">
              <Popover
                arrowPointAtCenter
                placement="topRight"
                content={this.wasVisible ? menu : null}
                trigger="click"
                overlayClassName="popover-menu"
                visible={this.state.visible}
                onVisibleChange={this.handleVisibleChange}
              >
                <Avatar
                  firstName={loggedProfileData.get('firstName')}
                  image={loggedProfileData.get('avatar')}
                  lastName={loggedProfileData.get('lastName')}
                  size="small"
                />
              </Popover>
            </div>
            <div
              className={
                  `sidebar__overlay
                  sidebar__overlay${this.state.overlayVisible ? '_visible' : ''}`
              }
              onClick={this._toggleOverlay}
            />
          </div>
        );
    }
}

Sidebar.propTypes = {
    activeDashboard: PropTypes.string,
    draftCreate: PropTypes.func,
    history: PropTypes.shape(),
    intl: PropTypes.shape(),
    isProfileEditToggled: PropTypes.bool,
    location: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    profileEditToggle: PropTypes.func,
    profileLogout: PropTypes.func,
    userSelectedLicense: PropTypes.shape(),
};

function mapStateToProps (state) {
    return {
        activeDashboard: state.dashboardState.get('activeDashboard'),
        balance: state.profileState.get('balance'),
        draftsCount: state.draftState.get('draftsCount'),
        hasFeed: state.notificationsState.get('hasFeed'),
        isProfileEditToggled: selectProfileEditToggle(state),
        loggedProfile: selectLoggedProfile(state),
        loggedProfileData: selectLoggedProfileData(state),
        notificationsCount: state.notificationsState.get('youNrFeed'),
        searchQuery: state.searchState.get('query'),
        userSelectedLicense: state.settingsState.getIn(['userSettings', 'defaultLicense'])
    };
}

export default connect(
    mapStateToProps,
    {
        draftCreate,
        profileEditToggle,
        profileLogout
    },
    null,
    {
        pure: false
    }
)(withRouter(injectIntl(Sidebar)));

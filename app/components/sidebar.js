import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import { Button, Popover, Tooltip } from 'antd';
import panels from '../constants/panels';
import { genId } from '../utils/dataModule';
import { Avatar, EssencePopover, Icon, ManaPopover, SidebarIcon } from './';
import { generalMessages } from '../locale-data/messages';
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
    }

    hide = () => {
        this.setState({
            visible: false,
        });
    }

    handleVisibleChange = (visible) => {
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
                        },
                        tags: [],
                        entryType: 'article',
                    });
                    return history.push(`/draft/article/${draftId}`);
                }
                if (path === '/draft/link/new') {
                    this.props.draftCreate({
                        id: draftId,
                        ethAddress: loggedProfile.get('ethAddress'),
                        content: {
                            featuredImage: {},
                            licence: userSelectedLicense
                        },
                        tags: [],
                        entryType: 'link'
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

        const menu = (
          <div className="sidebar__menu" onClick={this.hide}>
            <div
              onClick={this.props.profileEditToggle}
              className="sidebar__button-text"
            >
              {intl.formatMessage(generalMessages.editProfile)}
            </div>
            <div
              onClick={this._handleLogout}
              className="sidebar__button-text"
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
                        title="Text Entry"
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
                        title="Link Entry"
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
              />
              <SidebarIcon
                activePath="/profileoverview"
                linkTo="/profileoverview/myentries"
                iconType="question"
              />
              <SidebarIcon
                activePath="/community"
                linkTo="/community"
                iconType="community"
              />
              <SidebarIcon
                activePath="/search"
                linkTo="/search/entries"
                iconType="search"
              />
              <SidebarIcon
                activePath="/chat"
                linkTo="/chat"
                iconType="chat"
              />
            </div>
            <div className="flex-center-x sidebar__progress-wrapper">
              <ManaPopover />
            </div>
            <div className="flex-center-x sidebar__progress-wrapper">
              <EssencePopover />
            </div>
            <div className="flex-center-x sidebar__avatar">
              <Popover
                arrowPointAtCenter
                placement="topRight"
                content={menu}
                trigger="click"
                overlayClassName="sidebar__popover"
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

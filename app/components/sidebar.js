import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, Tooltip } from 'antd';
import { LogoButton } from './';
import { ChatIcon, PeopleIcon,
    SearchIcon, StreamsIcon } from './svg';
import { generalMessages } from '../locale-data/messages';
import panels from '../constants/panels';
import { genId } from '../utils/dataModule';

class Sidebar extends Component {
    state = {
        overlayVisible: false,
        showEntryMenu: false,
    }

    handleSearch = () => this.handlePanelShow(panels.search);

    _toggleEntryMenu = (ev) => {
        ev.preventDefault();
        this.setState(prevState => ({
            overlayVisible: !prevState.overlayVisible,
            showEntryMenu: !prevState.showEntryMenu
        }));
    }

    getWrapperProps = message => ({
        'data-tip': this.props.intl.formatMessage(message),
        'data-place': 'right'
    });

    _isSidebarVisible = (location) => {
        /**
         * specify blacklisted routes
         *  on which we should not show sidebar
         */
        const blackList = ['setup'];
        return !blackList.every(route => location.pathname.includes(route));
    }
    _navigateTo = (path) => {
        const { history, draftCreate, userSelectedLicence, loggedProfile } = this.props;
        return () => {
            this.setState({
                overlayVisible: false,
                showEntryMenu: false,
            }, () => {
                if (path === '/draft/article/new') {
                    const draftId = genId();
                    draftCreate({
                        id: draftId,
                        akashaId: loggedProfile.get('akashaId'),
                        content: {
                            featuredImage: {},
                            licence: userSelectedLicence,
                        },
                        tags: [],
                        type: 'article',
                    });
                    return history.push(`/draft/article/${draftId}`);
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

    render () {
        const { activeDashboard, intl, loggedProfileData, location } = this.props;
        const { showEntryMenu } = this.state;
        const hasAkashaId = !!loggedProfileData.get('akashaId');

        return (
          <div className={`sidebar ${this._isSidebarVisible(location) && 'sidebar_shown'}`}>
            <div className="sidebar__entry-icon" style={{ zIndex: showEntryMenu ? 5 : 0 }} >
              <Tooltip
                placement={showEntryMenu ? 'bottom' : 'right'}
                title={
                    intl.formatMessage(showEntryMenu ? generalMessages.close : generalMessages.addNewEntry)
                }
              >
                <Button
                  icon={showEntryMenu ? 'close' : 'edit'}
                  type="sidebar-icon"
                  size="large"
                  className="borderless sidebar__icon-button"
                  disabled={!hasAkashaId}
                  ghost
                  onClick={this._toggleEntryMenu}
                />
              </Tooltip>
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
            <div className="sidebar__search-icon">
              <Tooltip
                placement="right"
                title={intl.formatMessage(generalMessages.search)}
              >
                <Link to="/search/entries">
                  <SearchIcon
                    isActive={this._checkActiveIcon('search')}
                  />
                </Link>
              </Tooltip>
            </div>
            <div className="sidebar__stream-icon" >
              <Tooltip
                title={intl.formatMessage(generalMessages.stream)}
                placement="right"
              >
                <Link to={`${activeDashboard ? `/dashboard/${activeDashboard}` : '/dashboard'}`}>
                  <StreamsIcon isActive={this._checkActiveIcon('dashboard')} />
                </Link>
              </Tooltip>
              <Tooltip
                title={intl.formatMessage(generalMessages.people)}
                placement="right"
              >
                <Link to="/people">
                  <PeopleIcon isActive={this._checkActiveIcon('people')} />
                </Link>
              </Tooltip>
              <Tooltip
                title={intl.formatMessage(generalMessages.chat)}
                placement="right"
              >
                <Link to="/chat">
                  <ChatIcon isActive={this._checkActiveIcon('chat')} />
                </Link>
              </Tooltip>
            </div>
            <div className="sidebar__logo">
              <LogoButton />
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
    location: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    userSelectedLicence: PropTypes.shape(),
};

export default Sidebar;

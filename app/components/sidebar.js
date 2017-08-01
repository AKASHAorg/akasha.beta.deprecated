import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { LogoButton } from './';
import { ChatIcon, PeopleIcon,
    SearchIcon, StreamsIcon } from './svg';
import { generalMessages } from '../locale-data/messages';
import panels from '../constants/panels';

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

    _checkActiveIcon = (name) => {
        const { location } = this.props;
        return location.pathname.includes(name);
    }

    render () {
        const { activeDashboard, loggedProfileData, location } = this.props;
        const isLoggedIn = !!loggedProfileData.get('akashaId');

        return (
          <div className={`sidebar ${this._isSidebarVisible(location) && 'sidebar_shown'}`}>
            <div className="sidebar__entry-icon" >
              <div {...this.getWrapperProps(generalMessages.addNewEntry)}>
                <Button
                  icon="edit"
                  type="sidebar-icon"
                  size="large"
                  className="borderless sidebar__button "
                  ghost
                  onClick={this._toggleEntryMenu}
                />
                {/* <AddEntryIcon
                  disabled={!isLoggedIn}
                  isActive={this._checkActiveIcon('draft/new')}
                  onClick={this._toggleEntryMenu}
                /> */}
                <div
                  className={
                      `sidebar__entry-menu
                      sidebar__entry-menu${this.state.showEntryMenu ? '_active' : ''}`
                  }
                >
                  <ul className="sidebar__entry-menu-buttons">
                    <li>TE</li>
                    <li>LE</li>
                  </ul>
                </div>
              </div>
              <div {...this.getWrapperProps(generalMessages.search)}>
                <SearchIcon
                  onClick={this.handleSearch}
                  isActive={false}
                />
              </div>
            </div>
            <div className="sidebar__stream-icon" >
              <div {...this.getWrapperProps(generalMessages.stream)}>
                <Link to={`/dashboard/${activeDashboard || ''}`}>
                  <StreamsIcon isActive={this._checkActiveIcon('dashboard')} />
                </Link>
              </div>
              <div {...this.getWrapperProps(generalMessages.people)}>
                <Link to="/people">
                  <PeopleIcon isActive={this._checkActiveIcon('people')} />
                </Link>
              </div>
              <div {...this.getWrapperProps(generalMessages.chat)}>
                <Link to="/chat">
                  <ChatIcon isActive={this._checkActiveIcon('chat')} />
                </Link>
              </div>
            </div>
            <div className="sidebar__logo">
              <LogoButton />
            </div>
            <div
              className={
                  `sidebar__overlay
                  sidebar__overlay${this.state.overlayVisible ? '_visible' : ''}`
              }
            />
          </div>
        );
    }
}

Sidebar.propTypes = {
    activeDashboard: PropTypes.string,
    draftsCount: PropTypes.number,
    intl: PropTypes.shape(),
    location: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
};

export default Sidebar;

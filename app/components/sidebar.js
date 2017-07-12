import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { LogoButton } from './';
import { getInitials } from '../utils/dataModule';
import { AddEntryIcon, ChatIcon, EntriesIcon, PeopleIcon, ProfileIcon,
    SearchIcon, StreamsIcon } from '../shared-components/svg';
import { generalMessages } from '../locale-data/messages';
import panels from '../constants/panels';
import styles from './sidebar.scss';

class Sidebar extends Component {
    handleSearch = () => this.handlePanelShow(panels.search);
    _handleNewEntry = () => {
        console.log('new entry');
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
    _navigateTo = path => (ev) => {
        console.log('Please navigate to', path);
    }
    render () {
        const { activeDashboard, draftsCount, intl, loggedProfileData,
          notificationsCount, location } = this.props;
        const { palette } = this.context.muiTheme;
        const entriesCount = parseInt(loggedProfileData.get('entriesCount'), 10);
        const isLoggedIn = !!loggedProfileData.get('akashaId');
        return (
          <div
            className={`${styles.root} ${this._isSidebarVisible(location) && styles.shown}`}
            style={{ backgroundColor: palette.sidebarColor }}
          >
            <div className={`${styles.sidebarInner}`}>
              <div className={`${styles.entryIcon}`} >
                {(entriesCount > 0 || draftsCount > 0) ?
                  <div {...this.getWrapperProps(generalMessages.myEntries)}>
                    <EntriesIcon
                      disabled={!isLoggedIn}
                      isActive={false}
                      onClick={this._handleNewEntry}
                    />
                  </div> :
                  <div {...this.getWrapperProps(generalMessages.addNewEntry)}>
                    <AddEntryIcon
                      disabled={!isLoggedIn}
                      isActive={this._checkActiveIcon('draft/new')}
                      onClick={this._handleNewEntry}
                    />
                  </div>
                }
                <div {...this.getWrapperProps(generalMessages.search)}>
                  <SearchIcon
                    onClick={this.handleSearch}
                    isActive={false}
                  />
                </div>
              </div>
              <div className={`${styles.streamIcon}`} >
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
              <div
                className={`${styles.logo}`}
              >
                <LogoButton />
              </div>
            </div>
          </div>
        );
    }
}

Sidebar.contextTypes = {
    muiTheme: PropTypes.shape()
};

Sidebar.propTypes = {
    activeDashboard: PropTypes.string,
    balance: PropTypes.string,
    draftsCount: PropTypes.number,
    hasFeed: PropTypes.bool,
    history: PropTypes.shape(),
    intl: PropTypes.shape(),
    location: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    notificationsCount: PropTypes.number,
};

export default Sidebar;

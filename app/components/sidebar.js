import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { Button, Tooltip, Icon } from 'antd';
import panels from '../constants/panels';
import { genId } from '../utils/dataModule';
import { AddEntryIcon, ChatIcon, PeopleIcon, SearchIcon, StreamsIcon } from './svg';

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
                const draftId = genId();
                if (path === '/draft/article/new') {
                    draftCreate({
                        id: draftId,
                        ethAddress: loggedProfile.get('ethAddress'),
                        content: {
                            featuredImage: {},
                            licence: userSelectedLicence,
                        },
                        tags: [],
                        entryType: 'article',
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
        const { activeDashboard, history, location } = this.props;

        return (
          <div className={`sidebar ${this._isSidebarVisible(location) && 'sidebar_shown'}`}>
            <div className="sidebar__nav-container">
              <Icon className="content-link" onClick={history.goBack} type="left" />
              <Icon className="content-link" onClick={history.goForward} type="right" />
            </div>
            <div className="sidebar__entry-icon" >
              <div>
                <AddEntryIcon
                  isActive={this._checkActiveIcon('draft/new')}
                  onClick={this._toggleEntryMenu}
                />
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
              <div>
                <Link to="/search/entries">
                  <SearchIcon
                    isActive={this._checkActiveIcon('search')}
                  />
                </Link>
              </div>
            </div>
            <div className="sidebar__stream-icon" >
              <div>
                <Link to={`/dashboard/${activeDashboard || ''}`}>
                  <StreamsIcon isActive={this._checkActiveIcon('dashboard')} />
                </Link>
              </div>
              <div>
                <Link to="/people">
                  <PeopleIcon isActive={this._checkActiveIcon('people')} />
                </Link>
              </div>
              <div>
                <Link to="/chat">
                  <ChatIcon isActive={this._checkActiveIcon('chat')} />
                </Link>
              </div>
              <div>
                <Link to="/profileoverview/overview">
                  <Icon type="info-circle-o" style={{ fontSize: '32px' }} />
                </Link>
              </div>
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
    location: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    userSelectedLicence: PropTypes.shape(),
};

export default withRouter(Sidebar);

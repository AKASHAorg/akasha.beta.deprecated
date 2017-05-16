import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { LogoButton, PanelContainer } from './';
import { getInitials } from '../utils/dataModule';
import { AddEntryIcon, ChatIcon, EntriesIcon, PeopleIcon, ProfileIcon,
    SearchIcon, StreamsIcon } from '../shared-components/svg';
import { generalMessages } from '../locale-data/messages';
import panels from '../constants/panels';
import styles from './sidebar.scss';

class Sidebar extends Component {
    constructor (props) {
        super(props);
        this.state = {
            panelContentVisible: this._checkIsPanel()
        };
    }

    componentWillReceiveProps (nextProps) {
        const { history, loggedProfile, location } = nextProps;

        // the condition below is equivalent to a successful logout action
        if (!loggedProfile.get('account') && this.props.loggedProfile.get('account') && this._isSidebarVisible(location)) {
            history.push('/setup/authenticate');
        }
    }

    _getRootPath = (rootPath) => {
        const path = rootPath.split('/');
        return path.slice(0, path.length - 2).join('/');
    }
    _navigateToPanel = (panelName) => {
        const { history, location } = this.props;
        return (ev) => {
            if (!location.pathname.includes('/panel/')) {
                history.push(`${location.pathname}/panel/${panelName}${location.search}`);
            } else if (location.pathname.includes('/panel/') && !location.pathname.includes(panelName)) {
                history.push(`${this._getRootPath(location.pathname)}/panel/${panelName}${location.search}`);
            } else if (location.pathname.includes(panelName)) {
                history.push(`${this._getRootPath(location.pathname)}${location.search}`);
            }
            if (ev) ev.preventDefault();
        };
    }
    _closePanel = () => {
        const { history, location } = this.props;
        const rootPath = this._getRootPath(location.pathname);
        return history.push(`${rootPath}${location.search}`);
    }

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
    _checkIsPanel = () => {
        const { location } = this.props;
        return location.pathname.includes('/panel/');
    }
    _handlePanelVisible = () => {
        this.setState({
            panelContentVisible: !this.state.panelContentVisible
        });
    }
    render () {
        const { balance, draftsCount, hasFeed, intl, loggedProfileData,
          notificationsCount, location, children } = this.props;
        const { palette } = this.context.muiTheme;
        const userInitials =
            getInitials(loggedProfileData.get('firstName'), loggedProfileData.get('lastName'));
        const entriesCount = parseInt(loggedProfileData.get('entriesCount'), 10);
        const isLoggedIn = !!loggedProfileData.get('akashaId');
        return (
          <div
            className={`${styles.root} ${this._isSidebarVisible(location) && styles.shown}`}
            style={{ backgroundColor: palette.sidebarColor }}
          >
            <div className={`${styles.sidebarInner}`}>
              <div className={`${styles.profileIcon}`} >
                <ProfileIcon
                  isActive={this._checkActiveIcon('uprofile')}
                  avatar={loggedProfileData.get('avatar')}
                  userInitials={userInitials}
                  hasFeed={hasFeed}
                  notificationsCount={notificationsCount}
                  onClick={this._navigateToPanel('uprofile')}
                />
              </div>
              {isLoggedIn &&
                <div className={`${styles.balanceInfo}`}>
                  <div className={`${styles.balanceAmount} center-xs`}>
                    {balance && balance.slice(0, 6)}
                  </div>
                  <div className={`${styles.balanceCurrency} center-xs`}>
                    {intl.formatMessage(generalMessages.aeth)}
                  </div>
                </div>
              }
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
                  <Link to="/dashboard">
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
              <div
                className={`${styles.panelWrapper} ${this._checkIsPanel() && styles.open} col-xs-12`}
                onTransitionEnd={this._handlePanelVisible}
              >
                <PanelContainer
                  maxWidth="100%"
                  width="100%"
                >
                  {React.cloneElement(children, { onPanelNavigate: this._navigateToPanel })}
                </PanelContainer>
              </div>
            </div>
            <div
              className={`${styles.panelWrapperOverlay} ${this._checkIsPanel() && styles.overlayVisible}`}
              onClick={this._closePanel}
            />
          </div>
        );
    }
}

Sidebar.contextTypes = {
    muiTheme: PropTypes.shape()
};

Sidebar.propTypes = {
    balance: PropTypes.string,
    children: PropTypes.element,
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

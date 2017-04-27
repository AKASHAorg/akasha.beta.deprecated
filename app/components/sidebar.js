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
    componentDidMount () {
        const { bootstrapHome, entryVoteCost, gethGetStatus, licenseGetAll } = this.props;
        bootstrapHome();
        entryVoteCost();
        licenseGetAll();
        // make requests for geth status every 30s for updating the current block
        gethGetStatus();
        this.interval = setInterval(() => {
            gethGetStatus();
        }, 30000);
    }

    componentWillReceiveProps (nextProps) {
        const { history, loggedProfile } = nextProps;

        // the condition below is equivalent to a successful logout action
        if (!loggedProfile.get('account') && this.props.loggedProfile.get('account')) {
            history.push('/setup/authenticate');
        }
    }

    handleNewEntry = () => {
        const { activePanel, draftsCount, history, loggedProfileData, panelHide,
            panelShow } = this.props;
        const entriesCount = parseInt(loggedProfileData.get('entriesCount'), 10);

        if (activePanel === panels.newEntry) {
            panelHide();
        } else if (entriesCount > 0 || draftsCount > 0) {
            panelShow(panels.newEntry);
        } else {
            panelHide();
            history.push('/draft/new');
        }
    };

    handleProfile = () => this.handlePanelShow(panels.userProfile);

    handleSearch = () => this.handlePanelShow(panels.search);

    handlePanelShow = (panel) => {
        const { activePanel, panelHide, panelShow } = this.props;
        if (activePanel === panel) {
            panelHide();
        } else {
            panelShow(panel);
        }
    };

    getWrapperProps = message => ({
        'data-tip': this.props.intl.formatMessage(message),
        'data-place': 'right'
    });

    render () {
        const { activePanel, balance, draftsCount, hasFeed, intl, location, loggedProfileData,
            notificationsCount } = this.props;
        const { palette } = this.context.muiTheme;
        const { pathname } = location;
        const isAddEntryActive = !activePanel && pathname === '/draft/new';
        const isStreamActive = !activePanel && pathname === '/dashboard';
        const isPeopleActive = !activePanel && pathname === '/people';
        const isChatActive = !activePanel && pathname === '/chat';
        const userInitials =
            getInitials(loggedProfileData.get('firstName'), loggedProfileData.get('lastName'));
        const entriesCount = parseInt(loggedProfileData.get('entriesCount'), 10);
        const isLoggedIn = !!loggedProfileData.get('akashaId');

        return (
          <div className={styles.root} style={{ backgroundColor: palette.sidebarColor }} >
            <div style={{ flexGrow: 0, padding: '14px 14px 5px' }} >
              <ProfileIcon
                activePanel={activePanel}
                avatar={loggedProfileData.get('avatar')}
                userInitials={userInitials}
                hasFeed={hasFeed}
                notificationsCount={notificationsCount}
                onClick={this.handleProfile}
              />
            </div>
            {isLoggedIn &&
              <div style={{ flexGrow: 0, fontSize: '14px', fontWeight: '100' }}>
                <div style={{ textAlign: 'center' }}>
                  {balance && balance.slice(0, 6)}
                </div>
                <div style={{ textAlign: 'center' }}>
                  {intl.formatMessage(generalMessages.aeth)}
                </div>
              </div>
            }
            <div style={{ flexGrow: 1, padding: '14px' }} >
              {(entriesCount > 0 || draftsCount > 0) ?
                <div {...this.getWrapperProps(generalMessages.myEntries)}>
                  <EntriesIcon
                    disabled={!isLoggedIn}
                    isActive={activePanel === 'newEntry'}
                    onClick={this.handleNewEntry}
                  />
                </div> :
                <div {...this.getWrapperProps(generalMessages.addNewEntry)}>
                  <AddEntryIcon
                    disabled={!isLoggedIn}
                    isActive={isAddEntryActive}
                    onClick={this.handleNewEntry}
                  />
                </div>
              }
              <div {...this.getWrapperProps(generalMessages.search)}>
                <SearchIcon
                  onClick={this.handleSearch}
                  isActive={activePanel === 'search'}
                />
              </div>
            </div>
            <div style={{ flexGrow: 4, padding: '14px' }} >
              <div {...this.getWrapperProps(generalMessages.stream)}>
                <Link to="/dashboard">
                  <StreamsIcon isActive={isStreamActive} />
                </Link>
              </div>
              <div {...this.getWrapperProps(generalMessages.people)}>
                <Link to="/people">
                  <PeopleIcon isActive={isPeopleActive} />
                </Link>
              </div>
              <div {...this.getWrapperProps(generalMessages.chat)}>
                <Link to="/chat">
                  <ChatIcon isActive={isChatActive} />
                </Link>
              </div>
            </div>
            <div
              className="flex-center-x"
              style={{ flexGrow: 1, padding: '14px 8px', alignItems: 'flex-end' }}
            >
              <LogoButton />
            </div>
          </div>
        );
    }
}

Sidebar.contextTypes = {
    muiTheme: PropTypes.shape()
};

Sidebar.propTypes = {
    activePanel: PropTypes.string,
    balance: PropTypes.string,
    bootstrapHome: PropTypes.func.isRequired,
    draftsCount: PropTypes.number,
    entryVoteCost: PropTypes.func.isRequired,
    gethGetStatus: PropTypes.func.isRequired,
    hasFeed: PropTypes.bool,
    history: PropTypes.shape(),
    intl: PropTypes.shape(),
    licenseGetAll: PropTypes.func.isRequired,
    location: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    notificationsCount: PropTypes.number,
    panelHide: PropTypes.func.isRequired,
    panelShow: PropTypes.func.isRequired,
};

export default Sidebar;

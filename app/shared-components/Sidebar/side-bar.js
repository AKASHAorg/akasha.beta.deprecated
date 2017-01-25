import React, { PropTypes, Component } from 'react';
import ReactTooltip from 'react-tooltip';
import { getInitials } from 'utils/dataModule';
import {
    ProfileIcon,
    AddEntryIcon,
    EntriesIcon,
    SearchIcon,
    StreamsIcon,
    PortalsIcon,
    CommunityIcon,
    PeopleIcon,
    ChatIcon } from '../svg';
import LogoButton from '../../routes/components/logo-button';

class SideBar extends Component {
    componentWillMount () {
        const { profileActions } = this.props;
        profileActions.getProfileBalance();
    }
    _handleNewEntry = () => {
        const { activePanel, appActions, loggedProfileData,
            draftsCount } = this.props;
        const entriesCount = parseInt(loggedProfileData.get('entriesCount'), 10);

        if (activePanel === 'newEntry') {
            appActions.hidePanel();
        } else if (entriesCount > 0 || draftsCount > 0) {
            appActions.showPanel({ name: 'newEntry', overlay: true });
        } else {
            appActions.hidePanel();
            this.context.router.push(`/${loggedProfileData.get('akashaId')}/draft/new`);
        }
    };
    _handleNavigation = (to) => {
        const { appActions, loggedProfileData } = this.props;
        const basePath = loggedProfileData.get('akashaId');
        appActions.hidePanel();
        if (!to) {
            // navigate to index route
            return this.context.router.push(basePath);
        }
        return this.context.router.push(`${basePath}/${to}`);
    };
    _handlePeople = () => {
        const path = 'people';
        this._handleNavigation(path);
    }
    _handleChat = () => {
        const { activeChannel } = this.props;
        const path = `chat/channel/${activeChannel}`;
        this._handleNavigation(path);
    }
    _handlePanelShow = (panelName) => {
        const { activePanel, appActions } = this.props;
        if (activePanel === panelName.name) {
            appActions.hidePanel();
        } else {
            appActions.showPanel(panelName);
        }
    };

    render () {
        const { style, loggedProfileData, activePanel, notificationsCount, hasFeed,
            draftsCount, selectedTag } = this.props;
        const { router } = this.context;
        const pathName = router.location.pathname;
        const isAddEntryActive = !activePanel &&
            pathName.indexOf(`${loggedProfileData.get('akashaId')}/draft/new`) !== -1;
        const isStreamActive = !activePanel &&
            pathName.indexOf(`${loggedProfileData.get('akashaId')}/explore/`) !== -1;
        const isPeopleActive = !activePanel &&
            pathName.indexOf(`${loggedProfileData.get('akashaId')}/people`) !== -1;
        const isChatActive = !activePanel &&
            pathName.indexOf(`${loggedProfileData.get('akashaId')}/chat`) !== -1;
        const userInitials =
            getInitials(loggedProfileData.get('firstName'), loggedProfileData.get('lastName'));
        const balance = loggedProfileData.get('balance');
        const entriesCount = parseInt(loggedProfileData.get('entriesCount'), 10);
        return (
          <div style={style} >
            <div style={{ flexGrow: 0, padding: '14px 14px 5px' }} >
              <ProfileIcon
                activePanel={activePanel}
                avatar={loggedProfileData.get('avatar')}
                userInitials={userInitials}
                hasFeed={hasFeed}
                notificationsCount={notificationsCount}
                onClick={() => this._handlePanelShow({ name: 'userProfile', overlay: true })}
              />
            </div>
            <div style={{ flexGrow: 0, fontSize: '14px', fontWeight: '100', fontFamily: 'Roboto' }}>
              <div style={{ textAlign: 'center' }}>
                {balance && balance.slice(0, 6)}
              </div>
              <div style={{ textAlign: 'center' }}>AETH</div>
            </div>
            <div style={{ flexGrow: 1, padding: '14px' }} >
              {(entriesCount > 0 || draftsCount > 0) ?
                <div data-tip="My entries" data-place="right">
                  <EntriesIcon
                    onClick={this._handleNewEntry}
                    isActive={activePanel === 'newEntry'}
                  />
                </div> :
                <div data-tip="Add new entry" data-place="right">
                  <AddEntryIcon
                    onClick={this._handleNewEntry}
                    isActive={isAddEntryActive}
                  />
                </div>
              }
              <div data-tip="Coming Soon" data-place="right">
                <SearchIcon
                  onClick={this._handleSearch}
                  disabled
                />
              </div>
            </div>
            <div style={{ flexGrow: 4, padding: '14px' }} >
              <div data-tip="Stream" data-place="right">
                <StreamsIcon
                  onClick={() =>
                      (!isStreamActive ? this._handleNavigation(`explore/tag/${selectedTag}`) : null)
                  }
                  isActive={isStreamActive}
                />
              </div>
              <div data-tip="Coming Soon" data-place="right">
                <PortalsIcon disabled />
              </div>
              <div data-tip="Coming Soon" data-place="right">
                <CommunityIcon disabled />
              </div>
              <div data-tip="People" data-place="right">
                <PeopleIcon
                  onClick={this._handlePeople}
                  isActive={isPeopleActive}
                />
              </div>
              <div data-tip="Chat" data-place="right">
                <ChatIcon
                  onClick={this._handleChat}
                  isActive={isChatActive}
                />
              </div>
            </div>
            <div style={{ flexGrow: 1, padding: '14px 8px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }} >
              <LogoButton />
            </div>
          </div>
        );
    }
}
SideBar.propTypes = {
    activeChannel: PropTypes.string,
    activePanel: PropTypes.string,
    style: PropTypes.shape(),
    appActions: PropTypes.shape(),
    hasFeed: PropTypes.bool,
    profileActions: PropTypes.shape(),
    notificationsCount: PropTypes.number,
    draftsCount: PropTypes.number,
    loggedProfileData: PropTypes.shape(),
    selectedTag: PropTypes.string,
};

SideBar.contextTypes = {
    router: React.PropTypes.object,
};
SideBar.defaultProps = {
    style: {
        height: '100%',
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: '#f3f3f3',
        borderRight: '1px solid #cccccc',
        width: '64px'
    },
    iconStyle: {
        width: '32px',
        height: '32px'
    },
    viewBox: '0 0 32 32',
    color: '#000'
};

export default SideBar;

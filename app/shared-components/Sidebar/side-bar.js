import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import {
    ProfileIcon,
    AddEntryIcon,
    SearchIcon,
    StreamsIcon,
    PortalsIcon,
    CommunityIcon,
    PeopleIcon } from '../svg';
import LogoButton from '../../routes/components/logo-button';

class SideBar extends Component {
    componentWillMount () {
        const { profileActions, account } = this.props;
        profileActions.getProfileBalance(account);
    }
    _handleNewEntry = () => {
        const { draftActions, appActions, loggedProfileData, entriesCount,
            draftsCount } = this.props;

        if (entriesCount > 0 || draftsCount > 0) {
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
        const path = 'profile';
        this._handleNavigation(path);
    }
    _handlePanelShow = (panelName) => {
        this.props.appActions.showPanel(panelName);
    };
    render () {
        const { style, loggedProfileData, activePanel } = this.props;
        const userInitials =
            `${loggedProfileData.get('firstName')[0]}${loggedProfileData.get('lastName')[0]}`;
        const balance = loggedProfileData.get('balance');
        return (
          <div style={style} >
            <div style={{ flexGrow: 0, padding: '14px 14px 5px' }} >
              <ProfileIcon
                activePanel={activePanel}
                avatar={loggedProfileData.get('avatar')}
                userInitials={userInitials}
                onClick={() => this._handlePanelShow({ name: 'userProfile', overlay: true })}
              />
            </div>
            <div style={{ flexGrow: 0, fontSize: '14px', fontWeight: '100', fontFamily: 'Roboto' }}>
              <div style={{ textAlign: 'center' }}>
                {balance && balance.slice(0, 6)}
              </div>
              <div style={{ textAlign: 'center' }}>ETH</div>
            </div>
            <div style={{ flexGrow: 1, padding: '14px' }} >
              <AddEntryIcon onClick={this._handleNewEntry} tooltip="Add new entry" />
              <SearchIcon onClick={this._handleSearch} tooltip="Search" />
            </div>
            <div style={{ flexGrow: 4, padding: '14px' }} >
              <StreamsIcon
                onClick={() => this._handleNavigation('explore/stream')}
                tooltip="Stream"
              />
              <PortalsIcon disabled tooltip="Coming Soon" />
              <CommunityIcon disabled tooltip="Coming Soon" />
              <PeopleIcon onClick={this._handlePeople} tooltip="People" />
            </div>
            <div style={{ flexGrow: 1, padding: '14px 8px', display: 'flex', justifyContent: 'center' }} >
              <LogoButton />
            </div>
          </div>
        );
    }
}
SideBar.propTypes = {
    activePanel: PropTypes.string,
    style: PropTypes.shape(),
    account: PropTypes.string,
    appActions: PropTypes.shape(),
    profileActions: PropTypes.shape(),
    draftActions: PropTypes.shape(),
    entriesCount: PropTypes.number,
    draftsCount: PropTypes.number,
    loggedProfileData: PropTypes.shape()
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

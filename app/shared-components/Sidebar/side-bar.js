import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { AppActions, ProfileActions, EntryActions, DraftActions } from 'local-flux';
import {
    ProfileIcon,
    AddEntryIcon,
    SearchIcon,
    StreamsIcon,
    PortalsIcon,
    CommunityIcon,
    PeopleIcon,
    LogoIcon } from '../svg';

class SideBar extends Component {
    componentWillMount () {
        const { profileActions, loggedProfile } = this.props;
        profileActions.getProfileBalance(loggedProfile.get('address'));
    }
    _handleNewEntry = () => {
        const { draftActions, entryState, profileState, appActions } = this.props;
        const entriesCount = entryState.get('entriesCount');
        const draftsCount = entryState.get('draftsCount');
        const loggedProfile = profileState.get('loggedProfile');

        if (entriesCount > 0 && draftsCount > 0) {
            appActions.showPanel({ name: 'newEntry', overlay: true });
            draftActions.getDrafts(loggedProfile.get('userName'));
        } else {
            appActions.hidePanel();
            this.context.router.push(`/${loggedProfile.get('userName')}/draft/new`);
        }
    };
    _handleNavigation = (to) => {
        const { appActions, loggedProfile } = this.props;
        const basePath = loggedProfile.get('userName');
        appActions.hidePanel();
        if (!to) {
            // navigate to index route
            return this.context.router.push(basePath);
        }
        return this.context.router.push(`${basePath}/${to}`);
    };
    _handlePanelShow = (panelName) => {
        this.props.appActions.showPanel(panelName);
    };
    render () {
        const { style, loggedProfile } = this.props;
        return (
          <div style={style} >
            <div style={{ flexGrow: 1, padding: '16px' }} >
              <ProfileIcon
                onClick={() => this._handlePanelShow({ name: 'userProfile', overlay: true })}
              />
            </div>
            <div>{`${loggedProfile.get('balance')} ETH`}</div>
            <div style={{ flexGrow: 1, padding: '16px' }} >
              <AddEntryIcon onClick={this._handleNewEntry} tooltip="Add new entry" />
              <SearchIcon onClick={this._handleSearch} tooltip="Search" />
            </div>
            <div style={{ flexGrow: 4, padding: '16px' }} >
              <StreamsIcon
                onClick={() => this._handleNavigation('explore/stream')}
                tooltip="Stream"
              />
              <PortalsIcon disabled tooltip="Coming Soon" />
              <CommunityIcon disabled tooltip="Coming Soon" />
              <PeopleIcon onClick={this._handlePeople} tooltip="People" />
            </div>
            <div style={{ flexGrow: 1, padding: '16px' }} >
              <LogoIcon
                style={{ position: 'absolute', bottom: '16px', width: '32px', height: '32px' }}
              />
            </div>
          </div>
        );
    }
}
SideBar.propTypes = {
    style: PropTypes.shape(),
    appActions: PropTypes.shape(),
    profileState: PropTypes.shape(),
    profileActions: PropTypes.shape(),
    entryActions: PropTypes.shape(),
    draftActions: PropTypes.shape(),
    entryState: PropTypes.shape(),
    loggedProfile: PropTypes.shape()
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
export default connect(
    state => ({
        panelState: state.panelState,
        profileState: state.profileState,
        entryState: state.entryState,
        draftState: state.draftState,
        loggedProfile: state.profileState.find(profile =>
            profile.get('address') === state.profileState.getIn(['loggedProfile', 'profile']))
    }),
    dispatch => ({
        appActions: new AppActions(dispatch),
        profileActions: new ProfileActions(dispatch),
        entryActions: new EntryActions(dispatch),
        draftActions: new DraftActions(dispatch)
    })
)(SideBar);

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { AppActions, ProfileActions, EntryActions } from '../../../actions';
import Profile from './IconProfile';
import AddEntry from './IconAddEntry';
import Search from './IconSearch';
import Streams from './IconStreams';
import Portals from './IconPortals';
import Community from './IconCommunity';
import People from './IconPeople';
import Logo from './IconLogo';

class SideBar extends Component {
    componentWillMount () {
        const { profileState, profileActions, entryActions } = this.props;
        if (profileState.get('loggedProfile').size === 0) {
            profileActions.checkLoggedProfile({ noRedirect: true });
        }
    }
    _handleNewEntry = () => {
        const { entryState, profileState } = this.props;
        const publishedEntries = entryState.get('published');
        const draftEntries = entryState.get('drafts');
        const loggedProfile = profileState.get('loggedProfile');
        if (publishedEntries.size > 0 || draftEntries.size > 0) {
            this.props.appActions.showPanel({ name: 'newEntry', overlay: true });
        } else {
            this.props.appActions.hidePanel();
            this.context.router.push(`/${loggedProfile.get('username')}/draft/new`);
        }
    }
    _handleNavigation = (to) => {
        const { profileState } = this.props;
        const loggedUser = profileState.get('loggedProfile');
        const basePath = loggedUser.get('username');
        this.props.appActions.hidePanel();
        if (!to) {
            // navigate to index route
            return this.context.router.push(basePath);
        }
        return this.context.router.push(`${basePath}/${to}`);
    }
    _handlePanelShow = (panelName) => {
        this.props.appActions.showPanel(panelName);
    }
    render () {
        const {
            style,
            iconStyle,
            innerStyle,
            ...other } = this.props;
        return (
          <div style={style} >
            <div style={{ flexGrow: 1, padding: '16px' }} >
              <Profile
                onClick={() => this._handlePanelShow({ name: 'userProfile', overlay: true })}
              />
            </div>
            <div style={{ flexGrow: 1, padding: '16px' }} >
              <AddEntry onClick={this._handleNewEntry} tooltip="Add new entry" />
              <Search onClick={this._handleSearch} tooltip="Search" />
            </div>
            <div style={{ flexGrow: 4, padding: '16px' }} >
              <Streams onClick={() => this._handleNavigation(null)} tooltip="Stream" />
              <Portals disabled tooltip="Coming Soon" />
              <Community disabled tooltip="Coming Soon" />
              <People onClick={this._handlePeople} tooltip="People" />
            </div>
            <div style={{ flexGrow: 1, padding: '16px' }} >
              <Logo
                style={{ position: 'absolute', bottom: '16px', width: '32px', height: '32px' }}
              />
            </div>
          </div>
        );
    }
}
SideBar.propTypes = {
    style: PropTypes.object,
    iconStyle: PropTypes.object,
    innerStyle: PropTypes.object,
    viewBox: PropTypes.string,
    color: PropTypes.string,
    appActions: PropTypes.object,
    profileState: PropTypes.object,
    profileActions: PropTypes.object,
    entryActions: PropTypes.object,
    entryState: PropTypes.object
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
        entryState: state.entryState
    }),
    dispatch => ({
        appActions: new AppActions(dispatch),
        profileActions: new ProfileActions(dispatch),
        entryActions: new EntryActions(dispatch)
    })
)(SideBar);

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { AppActions, DraftActions, ProfileActions, EntryActions } from 'local-flux';
import { Sidebar } from 'shared-components';
import '../../styles/core.scss';
import styles from './home.scss';
import PanelLoader from './components/panel-loader-container';
import EntryModal from './components/entry-modal';
import PublishEntryRunner from './components/publish-entry-runner';

class HomeContainer extends React.Component {
    componentDidMount () {
        const { profileActions, draftActions, params } = this.props;
        const username = params.username;
        profileActions.getLoggedProfile();
        draftActions.getDraftsCount(username);
    }
    componentWillReceiveProps (nextProps) {
        if (!nextProps.loggedProfile.get('profile') && !nextProps.fetchingLoggedProfile && !nextProps.loginRequested) {
            this.context.router.push('/authenticate/');
        }
    }
    componentWillUpdate (nextProps) {
        const { profileActions, entryActions, draftActions } = this.props;
        if (nextProps.loggedProfile && nextProps.loggedProfile.get('profile')) {
            profileActions.getProfileData([{ profile: nextProps.loggedProfile.get('profile') }]);
            entryActions.getEntriesCount(nextProps.loggedProfile.get('profile'));
            draftActions.getPublishingDrafts(nextProps.loggedProfile.get('username'));
        }
    }
    componentWillUnmount () {
        this.props.appActions.hidePanel();
    }
    _getLoadingMessage = () => {
        const { fetchingLoggedProfile, fetchingDraftsCount, fetchingPublishedEntries } = this.props;

        if (fetchingLoggedProfile) {
            return 'Loading profile data';
        }
        if (fetchingDraftsCount) {
            return 'Loading drafts';
        }
        if (fetchingPublishedEntries) {
            return 'Loading your published entries';
        }
        return 'Loading...';
    }
    render () {
        const { appActions, draftActions, fetchingLoggedProfile, loggedProfileData,
            profileActions, entriesCount, draftsCount, loggedProfile, activePanel,
            fetchingDraftsCount, fetchingPublishedEntries, params } = this.props;
        const profileAddress = loggedProfile.get('profile');
        const account = loggedProfile.get('account');

        if (fetchingLoggedProfile || fetchingDraftsCount || fetchingPublishedEntries) {
            return (
              <div>{this._getLoadingMessage()}</div>
            );
        }
        if (!loggedProfileData) {
            return <div>Logging out...</div>;
        }
        return (
          <div className={styles.root} >
            <div className={styles.sideBar} >
              <Sidebar
                activePanel={activePanel}
                account={account}
                appActions={appActions}
                draftActions={draftActions}
                loggedProfileData={loggedProfileData}
                profileActions={profileActions}
                entriesCount={entriesCount}
                draftsCount={draftsCount}
              />
            </div>
            <div className={styles.panelLoader} >
              <PanelLoader
                profile={loggedProfileData}
                profileAddress={profileAddress}
                params={params}
              />
            </div>
            <EntryModal />
            <div className={`col-xs-12 ${styles.childWrapper}`} >
              {this.props.children}
            </div>
            <PublishEntryRunner />
          </div>
        );
    }
}

HomeContainer.propTypes = {
    activePanel: PropTypes.string,
    appActions: PropTypes.shape(),
    children: PropTypes.element,
    draftActions: PropTypes.shape(),
    draftsCount: PropTypes.number,
    entriesCount: PropTypes.number,
    fetchingLoggedProfile: PropTypes.bool,
    fetchingDraftsCount: PropTypes.bool,
    fetchingPublishedEntries: PropTypes.bool,
    loggedProfile: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    profileActions: PropTypes.shape(),
    entryActions: PropTypes.shape(),
    params: PropTypes.shape()
};

HomeContainer.contextTypes = {
    router: PropTypes.shape(),
    muiTheme: PropTypes.shape()
};

HomeContainer.contextTypes = {
    router: PropTypes.shape(),
    muiTheme: PropTypes.shape()
};

function mapStateToProps (state, ownProps) {
    return {
        fetchingLoggedProfile: state.profileState.get('fetchingLoggedProfile'),
        fetchingDraftsCount: state.draftState.get('fetchingDraftsCount'),
        fetchingPublishedEntries: state.draftState.get('fetchingPublishedEntries'),
        activePanel: state.panelState.get('activePanel').get('name'),
        loginRequested: state.profileState.get('loginRequested'),
        loggedProfile: state.profileState.get('loggedProfile'),
        loggedProfileData: state.profileState.get('profiles').find(profile =>
            profile.get('profile') === state.profileState.getIn(['loggedProfile', 'profile'])),
        entriesCount: state.entryState.get('entriesCount'),
        draftsCount: state.draftState.get('draftsCount')
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        draftActions: new DraftActions(dispatch),
        entryActions: new EntryActions(dispatch),
        profileActions: new ProfileActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeContainer);

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { AppActions, DraftActions, ProfileActions, EntryActions,
    TransactionActions } from 'local-flux';
import { Sidebar } from 'shared-components';
import '../../styles/core.scss';
import styles from './home.scss';
import PanelLoaderContainer from './components/panel-loader-container';
import EntryModal from './components/entry-modal';
import ProfileUpdater from './components/profile-updater';
import PublishEntryRunner from './components/publish-entry-runner';
import TagPublisher from './components/tag-publisher';
import FollowRunner from './components/follow-runner';

class HomeContainer extends React.Component {
    constructor (props) {
        super(props);
        this.dataLoaded = false;
    }

    componentWillMount () {
        const { profileActions } = this.props;
        profileActions.resetFlags();
    }
    componentDidMount () {
        const { profileActions } = this.props;
        profileActions.getLoggedProfile();
    }
    componentWillReceiveProps (nextProps) {
        const { profileActions, entryActions, draftActions, transactionActions } = this.props;
        const { loggedProfile, fetchingLoggedProfile } = nextProps;

        // action to modify status of a draft to stop publishing it :)
        // draftActions.updateDraft({
        //     id: 2,
        //     status: {
        //         currentAction: null,
        //         publishing: false,
        //         publishConfirmed: false
        //     }
        // });

        if (!loggedProfile.get('account') && !fetchingLoggedProfile) {
            this.context.router.push('/authenticate/');
        }
        if (loggedProfile && loggedProfile.get('profile') && !this.dataLoaded) {
            this.dataLoaded = true;
            profileActions.getProfileData([{ profile: loggedProfile.get('profile') }]);
            transactionActions.getMinedTransactions();
            transactionActions.getPendingTransactions();
            draftActions.getDraftsCount(loggedProfile.get('profile'));
            entryActions.getEntriesCount(loggedProfile.get('akashaId'));
        }
    }
    componentWillUnmount () {
        this.props.appActions.hidePanel();
    }
    _getLoadingMessage = () => {
        const { fetchingDraftsCount, fetchingEntriesCount, fetchingLoggedProfile,
            fetchingProfileData } = this.props;
        if (fetchingLoggedProfile) {
            return 'Loading profile';
        }
        if (fetchingProfileData) {
            return 'Loading profile data';
        }
        if (fetchingDraftsCount) {
            return 'Loading drafts';
        }
        if (fetchingEntriesCount) {
            return 'Loading your published entries';
        }
        return 'Loading...';
    }

    updateProfileData = (profileData) => {
        const { profileActions, loggedProfile } = this.props;
        profileActions.updateProfileData(profileData, loggedProfile);
    };

    render () {
        const { appActions, draftActions, fetchingLoggedProfile, loggedProfileData,
            profileActions, entriesCount, draftsCount, loggedProfile, activePanel,
            params, loginRequested, updatingProfile, entries } = this.props;
        const profileAddress = loggedProfile.get('profile');
        const account = loggedProfile.get('account');
        const loadingInProgress = !loggedProfileData || fetchingLoggedProfile;

        if (loadingInProgress) {
            return (
              <div>{this._getLoadingMessage()}</div>
            );
        }
        if (!account) {
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
              <PanelLoaderContainer
                loggedProfileData={loggedProfileData}
                profileAddress={profileAddress}
                params={params}
                showPanel={appActions.showPanel}
                hidePanel={appActions.hidePanel}
                updateProfileData={this.updateProfileData}
                updatingProfile={updatingProfile}
              />
            </div>
            <EntryModal />
            <div className={`col-xs-12 ${styles.childWrapper}`} >
              {this.props.children}
            </div>
            <ProfileUpdater />
            <FollowRunner />
            <PublishEntryRunner />
            <TagPublisher />
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
    fetchingProfileData: PropTypes.bool,
    fetchingDraftsCount: PropTypes.bool,
    loginRequested: PropTypes.bool,
    fetchingEntriesCount: PropTypes.bool,
    loggedProfile: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    updatingProfile: PropTypes.bool,
    profileActions: PropTypes.shape(),
    entryActions: PropTypes.shape(),
    transactionActions: PropTypes.shape(),
    params: PropTypes.shape(),
    entries: PropTypes.shape()
};

HomeContainer.contextTypes = {
    router: PropTypes.shape()
};

function mapStateToProps (state, ownProps) {
    return {
        fetchingLoggedProfile: state.profileState.getIn(['flags', 'fetchingLoggedProfile']),
        fetchingProfileData: state.profileState.getIn(['flags', 'fetchingProfileData']),
        fetchingDraftsCount: state.draftState.getIn(['flags', 'fetchingDraftsCount']),
        fetchingPublishedEntries: state.draftState.get('fetchingPublishedEntries'),
        fetchingPublishingDrafts: state.draftState.getIn(['flags', 'fetchingPublishingDrafts']),
        fetchingEntriesCount: state.entryState.getIn(['flags', 'fetchingEntriesCount']),
        activePanel: state.panelState.get('activePanel').get('name'),
        loginRequested: state.profileState.getIn(['flags', 'loginRequested']),
        loggedProfile: state.profileState.get('loggedProfile'),
        loggedProfileData: state.profileState.get('profiles').find(profile =>
        profile.get('profile') === state.profileState.getIn(['loggedProfile', 'profile'])),
        updatingProfile: state.profileState.getIn(['flags', 'updatingProfile']),
        entriesCount: state.entryState.get('entriesCount'),
        draftsCount: state.draftState.get('draftsCount'),
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        draftActions: new DraftActions(dispatch),
        entryActions: new EntryActions(dispatch),
        profileActions: new ProfileActions(dispatch),
        transactionActions: new TransactionActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeContainer);

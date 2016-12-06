import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { AppActions, DraftActions, ProfileActions, EntryActions,
    TransactionActions, TagActions, EProcActions, NotificationsActions } from 'local-flux';
import { Sidebar } from 'shared-components';
import '../../styles/core.scss';
import styles from './home.scss';
import PanelLoaderContainer from './components/panel-loader-container';
import EntryModal from './components/entry-modal';
import CommonRunner from './components/common-runner';
import ProfileUpdater from './components/profile-updater';
import PublishEntryRunner from './components/publish-entry-runner';
import TagPublisher from './components/tag-publisher';
import FollowRunner from './components/follow-runner';
import VoteRunner from './components/vote-runner';

class HomeContainer extends React.Component {
    constructor (props) {
        super(props);
        this.dataLoaded = false;
        this.interval = null;
    }

    componentWillMount () {
        const { profileActions, eProcActions, entryActions } = this.props;
        profileActions.resetFlags();
        eProcActions.getGethStatus();
        this.interval = setInterval(() => {
            eProcActions.getGethStatus();
        }, 30000);
        for (let i = 1; i <= 10; i += 1) {
            entryActions.voteCost(i);
        }
    }
    componentDidMount () {
        const { profileActions } = this.props;
        profileActions.getLoggedProfile();
    }
    componentWillReceiveProps (nextProps) {
        const { profileActions, entryActions, draftActions, tagActions,
            transactionActions, notificationsActions } = this.props;
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
            profileActions.getProfileData([{ profile: loggedProfile.get('profile') }], true);
            transactionActions.getMinedTransactions();
            transactionActions.getPendingTransactions();
            draftActions.getDraftsCount(loggedProfile.get('profile'));
            if (!loggedProfile.get('akashaId')) {
                console.error('logged profile does not have akashaId');
            }
            entryActions.getEntriesCount(loggedProfile.get('akashaId'));
            entryActions.getSavedEntries(loggedProfile.get('akashaId'));
            tagActions.getSelectedTag(loggedProfile.get('akashaId'));
            // will be modified
            notificationsActions.setFilter([]);
        }
    }
    componentWillUnmount () {
        this.props.appActions.hidePanel();
        this.props.tagActions.clearSelectedTag();
        this.props.profileActions.clearLocalProfiles();
        clearInterval(this.interval);
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
        profileActions.addUpdateProfileDataAction(profileData, loggedProfile);
    };

    render () {
        const { appActions, draftActions, fetchingLoggedProfile, loggedProfileData,
            profileActions, entriesCount, draftsCount, loggedProfile, activePanel,
            params, updatingProfile, notificationsCount, hasFeed } = this.props;

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
                appActions={appActions}
                draftActions={draftActions}
                loggedProfileData={loggedProfileData}
                notificationsCount={notificationsCount}
                hasFeed={hasFeed}
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
            <CommonRunner />
            <ProfileUpdater />
            <FollowRunner />
            <PublishEntryRunner />
            <TagPublisher />
            <VoteRunner />
          </div>
        );
    }
}

HomeContainer.propTypes = {
    appActions: PropTypes.shape(),
    entryActions: PropTypes.shape(),
    eProcActions: PropTypes.shape(),
    profileActions: PropTypes.shape(),
    tagActions: PropTypes.shape(),
    activePanel: PropTypes.string,
    children: PropTypes.element,
    draftActions: PropTypes.shape(),
    draftsCount: PropTypes.number,
    entriesCount: PropTypes.number,
    fetchingLoggedProfile: PropTypes.bool,
    fetchingProfileData: PropTypes.bool,
    fetchingDraftsCount: PropTypes.bool,
    fetchingEntriesCount: PropTypes.bool,
    loggedProfile: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    updatingProfile: PropTypes.bool,
    transactionActions: PropTypes.shape(),
    params: PropTypes.shape(),
    notificationsActions: PropTypes.shape(),
    notificationsCount: PropTypes.number,
    hasFeed: PropTypes.bool
};

HomeContainer.contextTypes = {
    router: PropTypes.shape()
};
/* eslint-disable no-unused-vars */
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
        notificationsCount: state.notificationsState.get('youNrFeed'),
        hasFeed: state.notificationsState.get('hasFeed'),
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        draftActions: new DraftActions(dispatch),
        entryActions: new EntryActions(dispatch),
        eProcActions: new EProcActions(dispatch),
        notificationsActions: new NotificationsActions(dispatch),
        profileActions: new ProfileActions(dispatch),
        tagActions: new TagActions(dispatch),
        transactionActions: new TransactionActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeContainer);

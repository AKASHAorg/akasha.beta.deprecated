import React, { PropTypes } from 'react';
import ReactTooltip from 'react-tooltip';
import { connect } from 'react-redux';
import { AppActions, DraftActions, ProfileActions, SettingsActions, EntryActions,
    TransactionActions, TagActions, EProcActions, NotificationsActions } from 'local-flux';
import { DataLoader, Sidebar } from 'shared-components';
import '../../styles/core.scss';
import styles from './home.scss';
import PanelLoaderContainer from './components/panel-loader-container';
import ClaimRunner from './components/claim-runner';
import CommentsPublisher from './components/comments-publisher';
import CommonRunner from './components/common-runner';
import ProfileUpdater from './components/profile-updater';
import PublishEntryRunner from './components/publish-entry-runner';
import TagPublisher from './components/tag-publisher';
import TipRunner from './components/tip-runner';
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
        entryActions.getLicences();
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
        const { profileActions, settingsActions, entryActions, draftActions, tagActions,
            transactionActions, notificationsActions } = this.props;
        const { loggedProfile, fetchingLoggedProfile, params, userSettings,
            selectedTag } = nextProps;

        if (!loggedProfile.get('account') && !fetchingLoggedProfile) {
            this.context.router.push('/authenticate/');
        }
        if (loggedProfile && loggedProfile.get('profile') && !this.dataLoaded) {
            this.dataLoaded = true;
            profileActions.getProfileData([{ profile: loggedProfile.get('profile') }], true);
            transactionActions.getMinedTransactions();
            transactionActions.getPendingTransactions();
            draftActions.getDraftsCount(loggedProfile.get('akashaId'));
            entryActions.getSavedEntries(loggedProfile.get('akashaId'));
            tagActions.getSelectedTag(loggedProfile.get('akashaId'));
            settingsActions.getUserSettings(loggedProfile.get('akashaId'));
        }
        if (!userSettings && this.props.userSettings) {
            notificationsActions.setFilter([]);
        } else if (userSettings && userSettings.akashaId !== this.props.userSettings.akashaId) {
            notificationsActions.setFilter(
                [], userSettings.lastBlockNr, userSettings.notifications.muted
            );
        }
        if (selectedTag !== this.props.selectedTag && params.filter === 'tag' &&
                params.tag !== selectedTag) {
            this.context.router.push(`/${params.akashaId}/explore/tag/${selectedTag}`);
        }
        if (params.tag && params.tag !== this.props.params.tag) {
            tagActions.saveTag(params.tag);
        }
        if (nextProps.blockNr !== this.props.blockNr) {
            settingsActions.saveLastBlockNr(loggedProfile.get('akashaId'), nextProps.blockNr);
        }
    }
    componentWillUnmount () {
        const { appActions } = this.props;
        appActions.cleanStore();
        clearInterval(this.interval);
        ReactTooltip.hide();
    }
    _getLoadingMessage = () => {
        const { fetchingDraftsCount, fetchingLoggedProfile, fetchingProfileData } = this.props;
        if (fetchingLoggedProfile) {
            return 'Loading profile';
        }
        if (fetchingProfileData) {
            return 'Loading profile data';
        }
        if (fetchingDraftsCount) {
            return 'Loading drafts';
        }
        return 'Loading...';
    }

    updateProfileData = (profileData) => {
        const { profileActions, loggedProfile } = this.props;
        profileActions.addUpdateProfileDataAction(profileData, loggedProfile);
    };

    render () {
        const { appActions, draftActions, fetchingLoggedProfile, loggedProfileData,
            profileActions, draftsCount, loggedProfile, activePanel, selectedTag,
            params, updatingProfile, notificationsCount, hasFeed } = this.props;

        const profileAddress = loggedProfile.get('profile');
        const account = loggedProfile.get('account');
        const loadingInProgress = !loggedProfileData || fetchingLoggedProfile || !account;

        return (
          <DataLoader flag={loadingInProgress} size={80} timeout={500} style={{ paddingTop: '50px' }}>
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
                  draftsCount={draftsCount}
                  selectedTag={selectedTag}
                />
              </div>
              <div className={styles.panelLoader} >
                <PanelLoaderContainer
                  profileAddress={profileAddress}
                  params={params}
                  showPanel={appActions.showPanel}
                  hidePanel={appActions.hidePanel}
                  updateProfileData={this.updateProfileData}
                  updatingProfile={updatingProfile}
                />
              </div>
              <div className={`col-xs-12 ${styles.childWrapper}`}>
                {this.props.children}
              </div>
              <ClaimRunner />
              <CommentsPublisher />
              <CommonRunner />
              <ProfileUpdater />
              <FollowRunner />
              <PublishEntryRunner />
              <TagPublisher />
              <TipRunner />
              <VoteRunner />
            </div>
          </DataLoader>
        );
    }
}

HomeContainer.propTypes = {
    appActions: PropTypes.shape(),
    blockNr: PropTypes.number,
    entryActions: PropTypes.shape(),
    eProcActions: PropTypes.shape(),
    profileActions: PropTypes.shape(),
    tagActions: PropTypes.shape(),
    activePanel: PropTypes.string,
    children: PropTypes.element,
    draftActions: PropTypes.shape(),
    draftsCount: PropTypes.number,
    fetchingLoggedProfile: PropTypes.bool,
    fetchingProfileData: PropTypes.bool,
    fetchingDraftsCount: PropTypes.bool,
    loggedProfile: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    updatingProfile: PropTypes.bool,
    transactionActions: PropTypes.shape(),
    params: PropTypes.shape(),
    notificationsActions: PropTypes.shape(),
    notificationsCount: PropTypes.number,
    hasFeed: PropTypes.bool,
    selectedTag: PropTypes.string,
    settingsActions: PropTypes.shape(),
    userSettings: PropTypes.shape()
};

HomeContainer.contextTypes = {
    router: PropTypes.shape()
};
/* eslint-disable no-unused-vars */
function mapStateToProps (state, ownProps) {
    return {
        blockNr: state.externalProcState.getIn(['gethStatus', 'blockNr']),
        fetchingLoggedProfile: state.profileState.getIn(['flags', 'fetchingLoggedProfile']),
        fetchingProfileData: state.profileState.getIn(['flags', 'fetchingProfileData']),
        fetchingDraftsCount: state.draftState.getIn(['flags', 'fetchingDraftsCount']),
        fetchingPublishedEntries: state.draftState.get('fetchingPublishedEntries'),
        fetchingPublishingDrafts: state.draftState.getIn(['flags', 'fetchingPublishingDrafts']),
        activePanel: state.panelState.get('activePanel').get('name'),
        loginRequested: state.profileState.getIn(['flags', 'loginRequested']),
        loggedProfile: state.profileState.get('loggedProfile'),
        loggedProfileData: state.profileState.get('profiles').find(profile =>
            profile.get('profile') === state.profileState.getIn(['loggedProfile', 'profile'])),
        updatingProfile: state.profileState.getIn(['flags', 'updatingProfile']),
        draftsCount: state.draftState.get('draftsCount'),
        notificationsCount: state.notificationsState.get('youNrFeed'),
        hasFeed: state.notificationsState.get('hasFeed'),
        selectedTag: state.tagState.get('selectedTag'),
        savingTag: state.tagState.getIn(['flags', 'savingTag']),
        userSettings: state.settingsState.get('userSettings')
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
        settingsActions: new SettingsActions(dispatch),
        tagActions: new TagActions(dispatch),
        transactionActions: new TransactionActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeContainer);

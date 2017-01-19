import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { AppActions, EntryActions, ProfileActions, SettingsActions, TagActions } from 'local-flux';
import { DataLoader } from 'shared-components';
import ProfileDetails from './components/profile-details';
import ProfileActivity from './components/profile-activity';

class ProfileDetailsContainer extends Component {
    constructor (props) {
        super(props);

        this.state = {
            isFollowerRequested: false
        };
    }

    componentWillMount () {
        const { profileActions, params } = this.props;
        const { profileAddress } = params;
        profileActions.getProfileData([{ profile: profileAddress }], true);
    }

    componentWillReceiveProps (nextProps) {
        const { profiles, profileActions, params, profileData, loggedProfileData } = nextProps;
        if (params.profileAddress !== this.props.params.profileAddress) {
            profileActions.getProfileData([{ profile: params.profileAddress }], true);
            if (profiles.size > 1) {
                profileActions.clearOtherProfiles();
            }
        } else if (!this.state.isFollowerRequested && profileData && profileData.get('akashaId')) {
            profileActions.isFollower(loggedProfileData.get('akashaId'), profileData.get('akashaId'));
            this.setState({
                isFollowerRequested: true
            });
        }
    }

    componentWillUnmount () {
        const { profileActions } = this.props;
        profileActions.clearOtherProfiles();
    }

    followProfile = (akashaId) => {
        const { profileActions } = this.props;
        profileActions.addFollowProfileAction(akashaId);
    }

    unfollowProfile = (akashaId) => {
        const { profileActions } = this.props;
        profileActions.addUnfollowProfileAction(akashaId);
    }

    selectProfile = (address) => {
        const { router } = this.context;
        const loggedAkashaId = this.props.loggedProfileData.get('akashaId');
        router.push(`/${loggedAkashaId}/profile/${address}`);
    }

    sendTip = (profileData) => {
        const { profileActions } = this.props;
        const { akashaId, firstName, lastName, profile } = profileData;
        profileActions.addSendTipAction({ akashaId, firstName, lastName, profile });
    };

    render () {
        const { appActions, profileActions, entryActions, profileData, profiles, profileEntries,
            votePending, followPending, fetchingFollowers, fetchingFollowing,
            fetchingProfileEntries, loggedProfileData, isFollowerPending, blockNr,
            savedEntriesIds, moreProfileEntries, fetchingMoreProfileEntries, fetchingMoreFollowers,
            fetchingMoreFollowing, sendingTip, tagActions, settingsActions,
            mutedList } = this.props;
        const isFollower = profileData &&
            loggedProfileData.getIn(['isFollower', profileData.get('akashaId')]);
        const isMuted = profileData && mutedList &&
            mutedList.indexOf(profileData.get('profile')) !== -1;

        return (<DataLoader
          flag={!profileData}
          timeout={300}
          size={80}
          style={{ paddingTop: '120px' }}
        >
          <div style={{ display: 'flex', height: '100%' }}>
            <ProfileDetails
              disableNotifFrom={settingsActions.disableNotifFrom}
              enableNotifFrom={settingsActions.enableNotifFrom}
              followPending={followPending}
              followProfile={this.followProfile}
              isFollower={isFollower}
              isMuted={isMuted}
              loggedAddress={loggedProfileData.get('profile')}
              profileData={profileData}
              sendingTip={sendingTip}
              sendTip={this.sendTip}
              showNotification={appActions.showNotification}
              showPanel={appActions.showPanel}
              unfollowProfile={this.unfollowProfile}
            />
            <ProfileActivity
              loggedProfileData={loggedProfileData}
              profileData={profileData}
              profileEntries={profileEntries}
              savedEntriesIds={savedEntriesIds}
              blockNr={blockNr}
              entryActions={entryActions}
              profileActions={profileActions}
              getEntriesCount={entryActions.getEntriesCount}
              profiles={profiles}
              fetchingFollowers={fetchingFollowers}
              fetchingFollowing={fetchingFollowing}
              fetchingMoreFollowers={fetchingMoreFollowers}
              fetchingMoreFollowing={fetchingMoreFollowing}
              fetchingMoreProfileEntries={fetchingMoreProfileEntries}
              fetchingProfileEntries={fetchingProfileEntries}
              moreProfileEntries={moreProfileEntries}
              mutedList={mutedList}
              followPending={followPending}
              followProfile={this.followProfile}
              unfollowProfile={this.unfollowProfile}
              selectProfile={this.selectProfile}
              selectTag={tagActions.saveTag}
              sendingTip={sendingTip}
              sendTip={this.sendTip}
              settingsActions={settingsActions}
              showPanel={appActions.showPanel}
              isFollowerPending={isFollowerPending}
              votePending={votePending}
            />
          </div>
        </DataLoader>);
    }
}

ProfileDetailsContainer.propTypes = {
    appActions: PropTypes.shape(),
    blockNr: PropTypes.number,
    entryActions: PropTypes.shape(),
    fetchingFollowers: PropTypes.bool,
    fetchingFollowing: PropTypes.bool,
    fetchingMoreFollowers: PropTypes.bool,
    fetchingMoreFollowing: PropTypes.bool,
    fetchingMoreProfileEntries: PropTypes.bool,
    fetchingProfileEntries: PropTypes.bool,
    followPending: PropTypes.shape(),
    isFollowerPending: PropTypes.bool,
    loggedProfileData: PropTypes.shape(),
    moreProfileEntries: PropTypes.bool,
    mutedList: PropTypes.arrayOf(PropTypes.string),
    params: PropTypes.shape(),
    profileActions: PropTypes.shape(),
    profileData: PropTypes.shape(),
    profileEntries: PropTypes.shape(),
    profiles: PropTypes.shape(),
    savedEntriesIds: PropTypes.shape(),
    sendingTip: PropTypes.shape(),
    settingsActions: PropTypes.shape(),
    tagActions: PropTypes.shape(),
    votePending: PropTypes.shape()
};

ProfileDetailsContainer.contextTypes = {
    router: PropTypes.shape(),
    muiTheme: PropTypes.shape()
};

function mapStateToProps (state, ownProps) {
    const { profileAddress } = ownProps.params;
    const profileData = state.profileState.get('profiles').find(profile =>
            profile && profile.get('profile') === profileAddress);
    const akashaId = profileData ? profileData.get('akashaId') : '';
    return {
        blockNr: state.externalProcState.getIn(['gethStatus', 'blockNr']),
        fetchingFollowers: state.profileState.getIn(['flags', 'fetchingFollowers']),
        fetchingFollowing: state.profileState.getIn(['flags', 'fetchingFollowing']),
        fetchingMoreFollowers: state.profileState.getIn(['flags', 'fetchingMoreFollowers']),
        fetchingMoreFollowing: state.profileState.getIn(['flags', 'fetchingMoreFollowing']),
        fetchingMoreProfileEntries: state.entryState.getIn(['flags', 'fetchingMoreProfileEntries']),
        fetchingProfileEntries: state.entryState.getIn(['flags', 'fetchingProfileEntries']),
        followPending: state.profileState.getIn(['flags', 'followPending']),
        isFollowerPending: state.profileState.getIn(['flags', 'isFollowerPending']),
        loggedProfile: state.profileState.get('loggedProfile'),
        loggedProfileData: state.profileState.get('profiles').find(profile =>
            profile.get('profile') === state.profileState.getIn(['loggedProfile', 'profile'])),
        loginRequested: state.profileState.getIn(['flags', 'loginRequested']),
        moreProfileEntries: state.entryState.get('moreProfileEntries'),
        mutedList: state.settingsState.get('userSettings').notifications.muted,
        profileData,
        profileEntries: state.entryState.get('entries').filter(entry =>
            entry.get('type') === 'profileEntry'
                && entry.get('akashaId') === akashaId
            ).map(entry => entry.get('content')),
        profiles: state.profileState.get('profiles'),
        savedEntriesIds: state.entryState.get('savedEntries').map(entry => entry.get('entryId')),
        sendingTip: state.profileState.getIn(['flags', 'sendingTip']),
        votePending: state.entryState.getIn(['flags', 'votePending']),
    };
}

function mapDispatchToProps (dispatch) {
    return {
        appActions: new AppActions(dispatch),
        entryActions: new EntryActions(dispatch),
        profileActions: new ProfileActions(dispatch),
        settingsActions: new SettingsActions(dispatch),
        tagActions: new TagActions(dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDetailsContainer);

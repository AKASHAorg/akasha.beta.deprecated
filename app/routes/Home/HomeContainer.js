import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { AppActions, DraftActions, ProfileActions } from 'local-flux';
import { Sidebar } from 'shared-components';
import '../../styles/core.scss';
import styles from './home.scss';
import PanelLoader from './components/panel-loader-container';
import EntryModal from './components/entry-modal';

class HomeContainer extends React.Component {
    componentDidMount () {
        const { profileActions } = this.props;
        profileActions.getLoggedProfile();
    }
    componentWillReceiveProps (nextProps) {
        if (!nextProps.loggedProfile.get('profile') && !nextProps.fetchingLoggedProfile && !nextProps.loginRequested) {
            console.log('navigate to authenticate');
            this.context.router.push('/authenticate/');
        }
    }
    componentWillUpdate (nextProps) {
        const { profileActions } = this.props;
        if (nextProps.loggedProfile && nextProps.loggedProfile.get('profile')) {
            profileActions.getProfileData([{ profile: nextProps.loggedProfile.get('profile') }]);
        }
    }
    render () {
        const { appActions, draftActions, fetchingLoggedProfile, loggedProfileData,
            profileActions, entriesCount, draftsCount, loggedProfile } = this.props;
        const profileAddress = loggedProfile.get('profile');
        const account = loggedProfile.get('account');
        if (fetchingLoggedProfile) {
            return (
              <div>Loading profile data</div>
            );
        }
        if (!loggedProfileData) {
            console.log('logging out');
            return <div>Logging out...</div>;
        }
        return (
          <div className={styles.root} >
            <div className={styles.sideBar} >
              <Sidebar
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
              <PanelLoader profile={loggedProfileData} profileAddress={profileAddress} />
            </div>
            <EntryModal />
            <div className={`col-xs-12 ${styles.childWrapper}`} >
              {this.props.children}
            </div>
          </div>
        );
    }
}

HomeContainer.propTypes = {
    appActions: PropTypes.shape(),
    children: PropTypes.element,
    draftActions: PropTypes.shape(),
    draftsCount: PropTypes.number,
    entriesCount: PropTypes.number,
    fetchingLoggedProfile: PropTypes.bool,
    loggedProfile: PropTypes.shape(),
    loggedProfileData: PropTypes.shape(),
    profileActions: PropTypes.shape()
};

HomeContainer.contextTypes = {
    router: PropTypes.shape(),
    muiTheme: PropTypes.shape()
};

function mapStateToProps (state) {
    return {
        fetchingLoggedProfile: state.profileState.get('fetchingLoggedProfile'),
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
        profileActions: new ProfileActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeContainer);

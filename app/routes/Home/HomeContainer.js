import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { ProfileActions } from 'local-flux';
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
    componentWillUpdate (nextProps) {
        const { profileActions } = this.props;
        if (nextProps.loggedProfile && nextProps.loggedProfile.get('profile')) {
            profileActions.getProfileData([{ profile: nextProps.loggedProfile.get('profile') }]);
        }
    }
    render () {
        const { fetchingLoggedProfile } = this.props;
        if (fetchingLoggedProfile) {
            return (
              <div>Loading profile data</div>
            );
        }
        return (
          <div className={styles.root} >
            <div className={styles.sideBar} >
              <Sidebar />
            </div>
            <div className={styles.panelLoader} >
              <PanelLoader />
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
    children: PropTypes.element,
    profileActions: PropTypes.shape(),
    loggedProfile: PropTypes.shape(),
    fetchingLoggedProfile: PropTypes.bool
};

function mapStateToProps (state) {
    return {
        loggedProfile: state.profileState.get('loggedProfile'),
        fetchingLoggedProfile: state.profileState.get('fetchingLoggedProfile'),
    };
}

function mapDispatchToProps (dispatch) {
    return {
        profileActions: new ProfileActions(dispatch)
    };
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeContainer);

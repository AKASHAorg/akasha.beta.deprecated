import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import { Sidebar } from '../components';
import { selectLoggedProfileData, selectLoggedProfile } from '../local-flux/selectors';


function mapStateToProps (state) {
    return {
        activeDashboard: state.dashboardState.get('activeDashboard'),
        balance: state.profileState.get('balance'),
        draftsCount: state.draftState.get('draftsCount'),
        hasFeed: state.notificationsState.get('hasFeed'),
        loggedProfile: selectLoggedProfile(state),
        loggedProfileData: selectLoggedProfileData(state),
        notificationsCount: state.notificationsState.get('youNrFeed'),
        searchQuery: state.searchState.get('query'),
        userSelectedLicence: state.settingsState.getIn(['userSettings', 'defaultLicence'])
    };
}

export default connect(
    mapStateToProps,
    {}
)(withRouter(injectIntl(Sidebar)));

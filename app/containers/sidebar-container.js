import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import { Sidebar } from '../components';
import { selectLoggedProfileData } from '../local-flux/selectors';


function mapStateToProps (state) {
    return {
        balance: state.profileState.get('balance'),
        draftsCount: state.draftState.get('draftsCount'),
        hasFeed: state.notificationsState.get('hasFeed'),
        loggedProfile: state.profileState.get('loggedProfile'),
        loggedProfileData: selectLoggedProfileData(state),
        notificationsCount: state.notificationsState.get('youNrFeed'),
    };
}

export default connect(
    mapStateToProps,
    {}
)(withRouter(injectIntl(Sidebar)));

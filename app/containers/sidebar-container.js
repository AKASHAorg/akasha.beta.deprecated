import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router';
import { Sidebar } from '../components';
import { selectActivePanel, selectLoggedProfileData } from '../local-flux/selectors';
import { bootstrapHome, panelHide, panelShow } from '../local-flux/actions/app-actions';
import { entryVoteCost } from '../local-flux/actions/entry-actions';
import { gethGetStatus } from '../local-flux/actions/external-process-actions';
import { licenseGetAll } from '../local-flux/actions/license-actions';

function mapStateToProps (state) {
    return {
        activePanel: selectActivePanel(state),
        balance: state.profileState.get('balance'),
        draftsCount: state.draftState.get('draftsCount'),
        hasFeed: state.notificationsState.get('hasFeed'),
        loggedProfile: state.profileState.get('loggedProfile'),
        loggedProfileData: selectLoggedProfileData(state),
        notificationsCount: state.notificationsState.get('youNrFeed'),
        selectedTag: state.tagState.get('selectedTag'),
    };
}

export default connect(
    mapStateToProps,
    {
        bootstrapHome,
        gethGetStatus,
        entryVoteCost,
        licenseGetAll,
        panelHide,
        panelShow
    },
    null,
    {
        pure: false
    }
)(withRouter(injectIntl(Sidebar)));

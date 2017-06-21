import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { Dashboard, SecondarySidebar, PageContent } from '../components';
import { Runners } from '../components/runners';
import { DataLoader } from '../shared-components';
import { selectActiveDashboard } from '../local-flux/selectors';
import { profileLogout } from '../local-flux/actions/profile-actions';
import { EntryPageContainer } from './';

class HomeContainer extends Component {
    componentWillReceiveProps (nextProps) {
        const { activeDashboard, history } = this.props;
        if (!nextProps.activeDashboard) {
            return;
        }
        const { params } = nextProps.match;
        const newDashboardName = nextProps.activeDashboard.name;
        const isCorrectRoute = newDashboardName === params.dashboardName;
        // navigate to the active dashboard when it changes
        if (!isCorrectRoute && (!activeDashboard || newDashboardName !== activeDashboard.name)) {
            history.push(`/dashboard/${newDashboardName}`);
        }
    }

    render () {
        const { columns, dashboards, homeReady } = this.props;

        return (
          <DataLoader flag={!homeReady} style={{ paddingTop: '200px' }}>
            <div>
              <div>
                <SecondarySidebar />
                <PageContent>
                  <button style={{ position: 'absolute', right: 0 }} onClick={this.props.profileLogout}>
                    Logout
                  </button>
                  <Dashboard columns={columns} dashboards={dashboards} />
                </PageContent>
              </div>
              {/**
               * a more complete path would be:
               * <Route path="/dashboard/(@:akashaId)/(:slug)?-:entryId(\\d+)" component={EntryPage} />
               */}
              <Route path="/dashboard/:entryId(\d+)" component={EntryPageContainer} />
              <Runners />
            </div>
          </DataLoader>
        );
    }
}

HomeContainer.propTypes = {
    activeDashboard: PropTypes.shape(),
    columns: PropTypes.shape(),
    dashboards: PropTypes.shape(),
    history: PropTypes.shape().isRequired,
    homeReady: PropTypes.bool,
    match: PropTypes.shape(),
    profileLogout: PropTypes.func.isRequired
};

function mapStateToProps (state) {
    return {
        activeDashboard: selectActiveDashboard(state),
        columns: state.dashboardState.get('columnById'),
        dashboards: state.dashboardState.get('dashboardById'),        
        entryPageOverlay: state.entryState.get('entryPageOverlay'),
        homeReady: state.appState.get('homeReady'),
    };
}

export default connect(
    mapStateToProps,
    {
        profileLogout
    }
)(HomeContainer);

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { Dashboard } from '../components';
import { Runners } from '../components/runners';
import { DataLoader } from '../shared-components';
import { dashboardSetActive } from '../local-flux/actions/dashboard-actions';
import { profileLogout } from '../local-flux/actions/profile-actions';
import { EntryPageContainer } from './';

class DashboardPage extends Component {
    componentWillReceiveProps (nextProps) {
        const { activeDashboard, history } = this.props;
        if (!nextProps.activeDashboard) {
            return;
        }
        const { params } = nextProps.match;
        const newDashboardName = nextProps.activeDashboard;
        const isCorrectRoute = newDashboardName === params.dashboardName;
        if (!params.dashboardName && this.props.match.params.dashboardName) {
            this.props.dashboardSetActive('');
        }
        // navigate to the active dashboard when it changes
        if (!isCorrectRoute && (!activeDashboard || newDashboardName !== activeDashboard)) {
            history.push(`/dashboard/${newDashboardName}`);
        }
    }

    render () {
        const { columns, dashboards, homeReady } = this.props;

        return (
          <DataLoader flag={!homeReady} style={{ paddingTop: '200px' }}>
            <div>
              <div>
                <button style={{ position: 'absolute', right: 0 }} onClick={this.props.profileLogout}>
                  Logout
                </button>
                <Dashboard columns={columns} dashboards={dashboards} />
              </div>
              {/**
               * a more complete path would be:
               * <Route path="/dashboard/(@:akashaId)/(:slug)?-:entryId(\\d+)" component={EntryPage} />
               */}
              <Route path="/@:akashaId/:entryId(\d+)" component={EntryPageContainer} />
              <Runners />
            </div>
          </DataLoader>
        );
    }
}

DashboardPage.propTypes = {
    activeDashboard: PropTypes.string,
    columns: PropTypes.shape(),
    dashboards: PropTypes.shape(),
    dashboardSetActive: PropTypes.func.isRequired,
    history: PropTypes.shape().isRequired,
    homeReady: PropTypes.bool,
    match: PropTypes.shape(),
    profileLogout: PropTypes.func.isRequired
};

function mapStateToProps (state) {
    return {
        activeDashboard: state.dashboardState.get('activeDashboard'),
        columns: state.dashboardState.get('columnById'),
        dashboards: state.dashboardState.get('dashboardById'),        
        entryPageOverlay: state.entryState.get('entryPageOverlay'),
        homeReady: state.appState.get('homeReady'),
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardSetActive,
        profileLogout
    }
)(DashboardPage);

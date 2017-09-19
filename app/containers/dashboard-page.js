import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Dashboard, DataLoader } from '../components';
import { dashboardSetActive, dashboardUpdateNewColumn } from '../local-flux/actions/dashboard-actions';
import { selectEntryFlag, selectFullEntry } from '../local-flux/selectors';

class DashboardPage extends Component {
    dashboardRef = null;

    componentWillReceiveProps (nextProps) {
        if (!nextProps.activeDashboard) {
            return;
        }
        const { params } = nextProps.match;
        if (!params.dashboardName && this.props.match.params.dashboardName) {
            this.props.dashboardSetActive('');
        }
    }

    componentDidUpdate (prevProps) {
        if (!prevProps.newColumn && this.props.newColumn && this.dashboardRef) {
            this.dashboardRef.scrollLeft = 9999;
        }
    }

    getDashboardRef = el => (this.dashboardRef = el);

    render () {
        const { columns, dashboards, homeReady, newColumn, isHidden } = this.props;

        return (
          <div style={{ height: '100%', display: isHidden ? 'none' : 'initial' }}>
            <DataLoader flag={!homeReady} size="large" style={{ paddingTop: '200px' }}>
              <div style={{ height: '100%' }}>
                <Dashboard
                  columns={columns}
                  dashboards={dashboards}
                  getDashboardRef={this.getDashboardRef}
                  navigateRight={this.navigateRight}
                  newColumn={newColumn}
                  updateNewColumn={this.props.dashboardUpdateNewColumn}
                />
              </div>
            </DataLoader>
          </div>
        );
    }
}

DashboardPage.propTypes = {
    activeDashboard: PropTypes.string,
    columns: PropTypes.shape(),
    dashboards: PropTypes.shape(),
    dashboardSetActive: PropTypes.func.isRequired,
    dashboardUpdateNewColumn: PropTypes.func.isRequired,
    homeReady: PropTypes.bool,
    isHidden: PropTypes.bool,
    match: PropTypes.shape(),
    newColumn: PropTypes.shape(),
};

function mapStateToProps (state) {
    return {
        activeDashboard: state.dashboardState.get('activeDashboard'),
        columns: state.dashboardState.get('columnById'),
        dashboards: state.dashboardState.get('dashboardById'),
        entryPageOverlay: state.entryState.get('entryPageOverlay'),
        homeReady: state.appState.get('homeReady'),
        isHidden: !!selectFullEntry(state) || !!selectEntryFlag(state, 'fetchingFullEntry'),
        newColumn: state.dashboardState.get('newColumn')
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardSetActive,
        dashboardUpdateNewColumn
    }
)(DashboardPage);

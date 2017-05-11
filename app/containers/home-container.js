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
    render () {
        const { activeDashboard, columns, homeReady } = this.props;

        return (
          <DataLoader flag={!homeReady} style={{ paddingTop: '200px' }}>
            <div>
              <div>
                <SecondarySidebar />
                <PageContent>
                  <button style={{ position: 'absolute', right: 0 }} onClick={this.props.profileLogout}>
                    Logout
                  </button>
                  <Dashboard columns={columns} activeDashboard={activeDashboard} />
                </PageContent>
              </div>
              <Route path="/dashboard/:entryId" component={EntryPageContainer} />
              <Runners />
            </div>
          </DataLoader>
        );
    }
}

HomeContainer.propTypes = {
    activeDashboard: PropTypes.shape(),
    columns: PropTypes.shape(),
    homeReady: PropTypes.bool,
    profileLogout: PropTypes.func.isRequired
};

function mapStateToProps (state) {
    return {
        activeDashboard: selectActiveDashboard(state),
        columns: state.dashboardState.get('columnById'),
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

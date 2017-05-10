import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { Dashboard, SecondarySidebar, PageContent } from '../components';
import { Runners } from '../components/runners';
import { DataLoader } from '../shared-components';
import { selectActiveDashboard } from '../local-flux/selectors';
import EntryPage from '../routes/Home/routes/Entry/EntryContainer';

class HomeContainer extends Component {
    render () {
        const { activeDashboard, columns, history, homeReady } = this.props;

        return (
          <DataLoader flag={!homeReady} style={{ paddingTop: '200px' }}>
            <div>
              <div>
                <SecondarySidebar />
                <PageContent>
                  <button style={{ position: 'absolute', right: 0 }} onClick={() => { history.push('/setup/authenticate'); }}>
                    Logout
                  </button>
                  <Dashboard columns={columns} activeDashboard={activeDashboard} />
                </PageContent>
              </div>
              <Route path="/dashboard/:entryId" component={EntryPage} />
              <Runners />
            </div>
          </DataLoader>
        );
    }
}

HomeContainer.propTypes = {
    activeDashboard: PropTypes.shape(),
    columns: PropTypes.shape(),
    history: PropTypes.shape(),
    homeReady: PropTypes.bool
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
    null
)(HomeContainer);

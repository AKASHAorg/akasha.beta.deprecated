import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Dashboard, SecondarySidebar, PageContent } from '../components';

class HomeContainer extends Component {
    render() {
        const { columns, selectedDashboard, history } = this.props;
        return (
          <div>
            <SecondarySidebar>
              Secondary sidebar
            </SecondarySidebar>
            <PageContent>
              <button style={{ position: 'absolute', right: 0 }} onClick={() => { history.push('/setup/authenticate'); }}>
                Logout
              </button>
              <Dashboard columns={columns} selectedDashboard={selectedDashboard} />
            </PageContent>
          </div>
        );
    }
}

HomeContainer.propTypes = {
    columns: PropTypes.shape(),
    selectedDashboard: PropTypes.shape(),
    history: PropTypes.shape(),
};

function mapStateToProps (state) {
    return {
        columns: state.dashboardState.get('columnById'),
        selectedDashboard: state.dashboardState.getIn(['byName', state.dashboardState.get('selectedDashboard')])
    };
}

export default connect(
    mapStateToProps,
    null
)(HomeContainer);

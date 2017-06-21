import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { dashboardAdd, dashboardAddColumn, dashboardDelete,
    dashboardSetActive } from '../../local-flux/actions/dashboard-actions';
import { searchQuery, searchHandshake } from '../../local-flux/actions/search-actions';
import { selectDashboards } from '../../local-flux/selectors';
import { columnType } from '../../constants/columns';

let input;
let queryInput;

const DashboardSecondarySidebar = props => (
  <div>
    Dashboards:
    <ul style={{ listStyleType: 'none', marginBottom: '15px' }}>
      {props.dashboards.toList().map(dashboard => (
        <li key={dashboard.get('id')} style={{ display: 'flex' }}>
          <div onClick={() => props.dashboardSetActive(dashboard.get('name'))}>
            {dashboard.get('name')}
          </div>
          {props.activeDashboard !== dashboard.get('name') &&
            <button
              onClick={(ev) => {
                  ev.stopPropagation();
                  props.dashboardDelete(dashboard.get('name'));
              }}
              style={{ flex: '0 0 auto', marginRight: '20px' }}
            >
              x
            </button>
          }
        </li>
      ))}
    </ul>
    <input ref={el => (input = el)} />
    <button onClick={() => props.dashboardAdd(input.value)} style={{ marginBottom: '15px' }}>Add dashboard</button>
    <button onClick={() => props.dashboardAddColumn(columnType.latest)}>Add latest column</button>
    <button onClick={() => props.dashboardAddColumn(columnType.tag)}>Add tag column</button>
    <button onClick={() => props.dashboardAddColumn(columnType.profile)}>Add profile column</button>
    <button onClick={() => props.dashboardAddColumn(columnType.stream)}>Add stream column</button>
    <input ref={el => (queryInput = el)} />
    <button onClick={() => props.searchQuery(queryInput.value)}> Search </button>
    <button onClick={() => props.searchHandshake()}> Handshake </button>
    <div>{ props.handshakePending && 'Handshaking'} </div>
  </div>
);

DashboardSecondarySidebar.contextTypes = {
    muiTheme: PropTypes.shape()
};

DashboardSecondarySidebar.propTypes = {
    activeDashboard: PropTypes.string,
    dashboardAdd: PropTypes.func.isRequired,
    dashboardAddColumn: PropTypes.func.isRequired,
    dashboardDelete: PropTypes.func.isRequired,
    dashboards: PropTypes.shape(),
    dashboardSetActive: PropTypes.func.isRequired,
    searchQuery: PropTypes.func.isRequired,
    searchHandshake: PropTypes.func.isRequired,
    handshakePending: PropTypes.bool
};

function mapStateToProps (state) {
    return {
        activeDashboard: state.dashboardState.get('activeDashboard'),
        dashboards: selectDashboards(state),
        handshakePending: state.searchState.getIn(['flags','handshakePending'])
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardAdd,
        dashboardAddColumn,
        dashboardDelete,
        dashboardSetActive,
        searchQuery,
        searchHandshake
    }
)(DashboardSecondarySidebar);

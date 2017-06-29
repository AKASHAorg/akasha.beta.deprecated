import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { List, ListItem, IconButton, Subheader } from 'material-ui';
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline';
import { dashboardMessages } from '../../locale-data/messages';
import { dashboardAdd, dashboardAddColumn, dashboardDelete,
    dashboardSetActive } from '../../local-flux/actions/dashboard-actions';
import { searchQuery, searchHandshake } from '../../local-flux/actions/search-actions';
import { selectDashboards } from '../../local-flux/selectors';
import * as columnTypes from '../../constants/columns';
import styles from './dashboard-secondary-sidebar.scss';

let input;
let queryInput;

const buttonStyle = {
    position: 'absolute',
    right: 0,
    top: 0,
    width: '22px',
    height: '22px',
    padding: '4px',
    margin: '0px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const innerDivStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 15px',
};

const DashboardSecondarySidebar = props => (
  <div style={{ padding: '20px 10px' }}>
    <Subheader className={styles.subheader}>
      <small className={styles.subheaderText}>
        {props.intl.formatMessage(dashboardMessages.myBoards)}
        <IconButton
          style={buttonStyle}
          iconStyle={{ width: '14px', height: '14px' }}
        >
          <AddIcon />
        </IconButton>
      </small>
    </Subheader>
    <List>
      {props.dashboards.toList().map(dashboard => (
        <div key={dashboard.get('id')} style={{ position: 'relative' }}>
          <ListItem
            innerDivStyle={innerDivStyle}
            onClick={() => props.dashboardSetActive(dashboard.get('name'))}
            primaryText={<div>{dashboard.get('name')}</div>}
            style={{ display: 'flex', borderRadius: '5px' }}
          />
          {props.activeDashboard !== dashboard.get('name') &&
            <button
              onClick={(ev) => {
                  ev.stopPropagation();
                  props.dashboardDelete(dashboard.get('name'));
              }}
              style={{ position: 'absolute', top: 0, right: 0, zIndex: 99 }}
            >
              x
            </button>
          }
        </div>
      ))}
    </List>
    <input ref={el => (input = el)} />
    <button onClick={() => props.dashboardAdd(input.value)} style={{ marginBottom: '15px' }}>Add dashboard</button>
    <button onClick={() => props.dashboardAddColumn(columnTypes.latest)}>Add latest column</button>
    <button onClick={() => props.dashboardAddColumn(columnTypes.tag)}>Add tag column</button>
    <button onClick={() => props.dashboardAddColumn(columnTypes.profile)}>Add profile column</button>
    <button onClick={() => props.dashboardAddColumn(columnTypes.stream)}>Add stream column</button>
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
    intl: PropTypes.shape(),
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
)(injectIntl(DashboardSecondarySidebar));

import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { List, ListItem, IconButton, Subheader } from 'material-ui';
import AddIcon from 'material-ui/svg-icons/content/add-circle-outline';
import { dashboardMessages } from '../../locale-data/messages';
import { dashboardAdd, dashboardAddColumn, dashboardDelete,
    dashboardSetActive } from '../../local-flux/actions/dashboard-actions';
import { listAdd, listAddEntry, listDelete, listDeleteEntry } from '../../local-flux/actions/list-actions';
import { selectDashboards } from '../../local-flux/selectors';
import * as columnTypes from '../../constants/columns';
import styles from './dashboard-secondary-sidebar.scss';

let input;
let listDescr;
let listInput;

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
          <Link className="unstyled-link" to={`/dashboard/${dashboard.get('name')}`}>
            <ListItem
              innerDivStyle={innerDivStyle}
              primaryText={<div>{dashboard.get('name')}</div>}
              style={{ display: 'flex', borderRadius: '5px' }}
            />
          </Link>
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
    <div style={{ marginTop: '20px' }}>List title</div>
    <input ref={el => (listInput = el)} />
    <div>List description</div>
    <textarea ref={el => (listDescr = el)} />
    <button onClick={() => props.listAdd({ name: listInput.value, description: listDescr.value })}>Add list</button>
    <button onClick={() => props.listDelete(listInput.value)}>Delete list</button>
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
    listAdd: PropTypes.func.isRequired,
    listDelete: PropTypes.func.isRequired,
};

function mapStateToProps (state) {
    return {
        activeDashboard: state.dashboardState.get('activeDashboard'),
        dashboards: selectDashboards(state),
        lists: state.listState.get('byName')
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardAdd,
        dashboardAddColumn,
        dashboardDelete,
        dashboardSetActive,
        listAdd,
        listAddEntry,
        listDelete,
        listDeleteEntry
    }
)(injectIntl(DashboardSecondarySidebar));

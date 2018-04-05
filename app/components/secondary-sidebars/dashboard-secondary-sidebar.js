import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Tooltip } from 'antd';
import { equals } from 'ramda';
import { dashboardMessages } from '../../locale-data/messages';
import { entryNewestIteratorSuccess } from '../../local-flux/actions/entry-actions';
import { dashboardAdd, dashboardDelete, dashboardDeleteNew,
    dashboardRename, dashboardReorder } from '../../local-flux/actions/dashboard-actions';
import { selectActiveDashboardId, selectAllDashboards } from '../../local-flux/selectors';
import { DashboardSidebarRow, PlusSquareIcon } from '../index';

class DashboardSecondarySidebar extends Component {
    state = {
        newDashboard: null,
        renameDashboard: null,
        renameValue: null,
    };

    componentWillReceiveProps (nextProps) {
        const { history } = this.props;
        if (nextProps.activeDashboard !== this.props.activeDashboard &&
            nextProps.match.params.dashboardId !== nextProps.activeDashboard
        ) {
            history.push(`/dashboard/${nextProps.activeDashboard}`);
        }
        if (nextProps.dashboards.size > this.props.dashboards.size) {
            this.setState({ newDashboard: null });
            this.props.dashboardDeleteNew();
        }
        if (!nextProps.renamingDashboard && this.props.renamingDashboard) {
            this.setState({ renameDashboard: null, renameValue: null });
        }
        // Handle creating a new dashboard from outside this component
        if (nextProps.newDashboard && !this.props.newDashboard) {
            this.onToggleNewDashboard();
        }
    }

    shouldComponentUpdate (nextProps, nextState) {
        const { activeDashboard, dashboards, renamingDashboard } = this.props;
        const { newDashboard, renameDashboard, renameValue } = this.state;
        if (activeDashboard !== nextProps.activeDashboard ||
            !equals(dashboards, nextProps.dashboards) ||
            renamingDashboard !== nextProps.renamingDashboard ||
            this.props.newDashboard !== nextProps.newDashboard ||
            newDashboard !== nextState.newDashboard ||
            renameDashboard !== nextState.renameDashboard ||
            renameValue !== nextState.renameValue
        ) {
            return true;
        }
        return false;
    }

    onChange = (ev) => {
        const value = ev.target.value;
        const changes = this.state.renameDashboard !== null ?
            { renameValue: value } :
            { newDashboard: value };
        this.setState(changes);
    };

    onKeyDown = (ev) => {
        if (ev.key === 'Enter') {
            this.onNewName();
        }
        if (ev.key === 'Escape') {
            const { renameDashboard } = this.state;
            const dashboard = this.props.dashboards.find(board => board.get('id') === renameDashboard);
            const initialName = dashboard && dashboard.get('name');
            const changes = renameDashboard ?
                { renameValue: initialName } :
                { newDashboard: '' };
            this.setState(changes);
        }
    };

    onNewName = () => {
        const { newDashboard, renameDashboard, renameValue } = this.state;
        const dashboard = this.props.dashboards.find(board => board.get('id') === renameDashboard);
        if (newDashboard) {
            this.props.dashboardAdd(newDashboard);
        } else if (renameDashboard && dashboard.get('name') !== renameValue) {
            this.props.dashboardRename(renameDashboard, renameValue);
        } else {
            this.setState({ newDashboard: null, renameDashboard: null, renameValue: null });
            this.props.dashboardDeleteNew();
        }
    };

    onRename = (dashboard) => {
        this.setState({
            renameDashboard: dashboard.get('id'),
            renameValue: dashboard.get('name')
        });
    };

    onToggleNewDashboard = () => {
        this.setState({ newDashboard: '' });
    };
    _deleteDashboard = (dashBoardId) => {
        const {history, dashboardDelete} = this.props;
        dashboardDelete(dashBoardId);
        history.push('/dashboard');
    }
    // _simNewEntries = () => {
    //     const { entries } = this.props;
    //     const { author, blockNumber, entryType, tags } = entries.first().toJS();
    //     this.props.entryNewestIteratorSuccess({
    //         collection: [{
    //             author,
    //             blockNumber,
    //             entryType,
    //             tags,
    //             entryId: '0x3543e25511384ce4fb4eaf1908fb424096566d920f7f89db11d67ee9d91ca5f2'
    //         }]
    //     }, {
    //         columnId: 'd20c386e-b934-4d26-8739-7fc796ff5cd7',
    //         reversed: true
    //     });
    // }
    renderEditRow = () => {
        const { newDashboard, renameDashboard, renameValue } = this.state;
        const value = this.state.newDashboard === null ? renameValue : newDashboard;
        const rowClass = 'dashboard-secondary-sidebar__row';
        const inputRowClass = `flex-center-y ${rowClass} ${rowClass}_active ${rowClass}_input`;

        return (
          <div className={inputRowClass} key={renameDashboard}>
            <input
              autoFocus // eslint-disable-line jsx-a11y/no-autofocus
              className="dashboard-secondary-sidebar__input"
              id="new-dashboard-input"
              onBlur={this.onNewName}
              onChange={this.onChange}
              onKeyDown={this.onKeyDown}
              value={value}
            />
          </div>
        );
    };

    render () {
        const { activeDashboard, dashboards, intl } = this.props;
        return (
          <div className="dashboard-secondary-sidebar">
            <div className="flex-center-y dashboard-secondary-sidebar__title">
              {intl.formatMessage(dashboardMessages.myBoards)}
              <Tooltip title={intl.formatMessage(dashboardMessages.createNew)}>
                <div onClick={this.onToggleNewDashboard}>
                  <PlusSquareIcon />
                </div>
              </Tooltip>
            </div>
            <div className="dashboard-secondary-sidebar__list">
              {dashboards.toList().map((dashboard, i) => {
                  const isRenamed = this.state.renameDashboard === dashboard.get('id');
                  if (isRenamed) {
                      return this.renderEditRow();
                  }

                  return (
                    <DashboardSidebarRow
                      activeDashboard={activeDashboard}
                      dashboard={dashboard}
                      dashboardDelete={this._deleteDashboard}
                      isRenamed={isRenamed}
                      key={dashboard.get('id')}
                      index={i}
                      newDashboard={this.state.newDashboard}
                      onRename={this.onRename}
                      reorder={
                          (source, target) =>
                              this.props.dashboardReorder(this.props.activeDashboardId, source, target)
                      }
                    />
                  );
              })}
              {this.state.newDashboard !== null && this.renderEditRow()}
              {/* <div onClick={this._simNewEntries}>Sim new Entries</div> */}
            </div>
          </div>
        );
    }
}

DashboardSecondarySidebar.propTypes = {
    activeDashboard: PropTypes.string,
    dashboardAdd: PropTypes.func.isRequired,
    dashboardDelete: PropTypes.func.isRequired,
    dashboardDeleteNew: PropTypes.func.isRequired,
    activeDashboardId: PropTypes.string,
    dashboardReorder: PropTypes.func.isRequired,
    dashboardRename: PropTypes.func.isRequired,
    dashboards: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    newDashboard: PropTypes.bool,
    renamingDashboard: PropTypes.bool,
};

function mapStateToProps (state) {
    return {
        activeDashboard: state.dashboardState.get('activeDashboard'),
        entries: state.entryState.get('byId'),
        dashboards: selectAllDashboards(state),
        activeDashboardId: selectActiveDashboardId(state),
        lists: state.listState.get('byName'),
        newDashboard: state.dashboardState.get('newDashboard'),
        renamingDashboard: state.dashboardState.getIn(['flags', 'renamingDashboard'])
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardAdd,
        dashboardDelete,
        dashboardDeleteNew,
        dashboardRename,
        dashboardReorder,
        entryNewestIteratorSuccess,
    }
)(injectIntl(DashboardSecondarySidebar));

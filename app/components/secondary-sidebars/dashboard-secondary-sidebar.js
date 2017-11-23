import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { Icon, Modal, Popover } from 'antd';
import classNames from 'classnames';
import { dashboardMessages, generalMessages } from '../../locale-data/messages';
import { dashboardAdd, dashboardDelete, dashboardRename } from '../../local-flux/actions/dashboard-actions';
import { selectDashboards } from '../../local-flux/selectors';

const { confirm } = Modal;

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
        }
        if (!nextProps.renamingDashboard && this.props.renamingDashboard) {
            this.setState({ renameDashboard: null, renameValue: null });
        }
    }

    onChange = (ev) => {
        const value = ev.target.value;
        const changes = this.state.renameDashboard !== null ?
            { renameValue: value } :
            { newDashboard: value };
        this.setState(changes);
    };

    onDeleteDashboard = (dashboard) => {
        const { intl } = this.props;
        const onOk = (cb) => {
            this.props.dashboardDelete(dashboard.get('id'));
            cb();
        };
        const content = intl.formatMessage(dashboardMessages.deleteDashboardConfirmation, {
            name: dashboard.get('name')
        });
        confirm({
            content,
            okText: intl.formatMessage(generalMessages.yes),
            okType: 'danger',
            cancelText: intl.formatMessage(generalMessages.no),
            onOk,
            onCancel: () => {}
        });
    };

    onKeyDown = (ev) => {
        if (ev.key === 'Enter') {
            this.onNewName();
        }
        if (ev.key === 'Escape') {
            const { renameDashboard } = this.state;
            const dashboard = this.props.dashboards.find(board => board.get('id') === renameDashboard);
            const initialName = dashboard.get('name');
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

    renderRow = (dashboard) => {
        const { activeDashboard, dashboards, intl } = this.props;
        const { newDashboard, renameDashboard } = this.state;
        const isLastDashboard = dashboards.size === 1;
        const isActive = dashboard.get('id') === activeDashboard;
        const editMode = dashboard.get('id') === renameDashboard;
        const onDelete = () => this.onDeleteDashboard(dashboard);
        const deleteClass = classNames('flex-center-y popover-menu__item', {
            'popover-menu__item_disabled': isLastDashboard
        });
        const menu = (
          <div className="dashboard-secondary-sidebar__popover-content">
            <div
              className="flex-center-y popover-menu__item"
              onClick={() => this.onRename(dashboard)}
            >
              {intl.formatMessage(generalMessages.rename)}
            </div>
            <div
              className={deleteClass}
              onClick={!isLastDashboard && onDelete}
            >
              {intl.formatMessage(generalMessages.delete)}
            </div>
          </div>
        );
        const className = classNames('has-hidden-action flex-center-y', {
            'dashboard-secondary-sidebar__row': true,
            'dashboard-secondary-sidebar__row_active': isActive && newDashboard === null
        });

        if (editMode) {
            return this.renderEditRow();
        }

        return (
          <Link
            className="unstyled-link"
            key={dashboard.get('id')}
            to={`/dashboard/${dashboard.get('id')}`}
          >
            <div className={className}>
              <div className="overflow-ellipsis dashboard-secondary-sidebar__name">
                {dashboard.get('name')}
              </div>
              <Popover
                arrowPointAtCenter
                content={menu}
                onClick={ev => ev.stopPropagation()}
                overlayClassName="popover-menu"
                placement="bottomLeft"
                trigger="click"
              >
                <Icon
                  className="hidden-action dashboard-secondary-sidebar__menu-icon"
                  type="ellipsis"
                />
              </Popover>
            </div>
          </Link>
        );
    };

    render () {
        const { dashboards, intl } = this.props;

        return (
          <div className="dashboard-secondary-sidebar">
            <div className="flex-center-y dashboard-secondary-sidebar__title">
              {intl.formatMessage(dashboardMessages.myBoards)}
              <Icon
                className="content-link dashboard-secondary-sidebar__add-icon"
                onClick={this.onToggleNewDashboard}
                type="plus-square"
              />
            </div>
            <div className="dashboard-secondary-sidebar__list">
              {dashboards.toList().map(this.renderRow)}
              {this.state.newDashboard !== null && this.renderEditRow()}
            </div>
          </div>
        );
    }
}

DashboardSecondarySidebar.propTypes = {
    activeDashboard: PropTypes.string,
    dashboardAdd: PropTypes.func.isRequired,
    dashboardDelete: PropTypes.func.isRequired,
    dashboardRename: PropTypes.func.isRequired,
    dashboards: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    match: PropTypes.shape().isRequired,
    renamingDashboard: PropTypes.bool,
};

function mapStateToProps (state) {
    return {
        activeDashboard: state.dashboardState.get('activeDashboard'),
        dashboards: selectDashboards(state),
        lists: state.listState.get('byName'),
        renamingDashboard: state.dashboardState.getIn(['flags', 'renamingDashboard'])
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardAdd,
        dashboardDelete,
        dashboardRename,
    }
)(injectIntl(DashboardSecondarySidebar));

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { Button, Icon, Input, Modal, Popover } from 'antd';
import classNames from 'classnames';
import { dashboardMessages, generalMessages } from '../../locale-data/messages';
import { dashboardAdd, dashboardDelete } from '../../local-flux/actions/dashboard-actions';
import { selectDashboards } from '../../local-flux/selectors';

const { confirm } = Modal;

class DashboardSecondarySidebar extends Component {
    state = {
        addDashboard: false
    };

    onDeleteDashboard = (dashboard) => {
        const { intl } = this.props;
        const onOk = (cb) => {
            this.props.dashboardDelete(dashboard.get('name'));
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

    onToggleNewDashboard = () => {
        this.setState({ addDashboard: !this.state.addDashboard });
    };

    onAddNewDashboard = () => {
        const input = document.getElementById('new-dashboard-input');
        this.props.dashboardAdd(input.value);
    };

    renderRow = (dashboard) => {
        const { activeDashboard, intl } = this.props;
        const menu = (
          <div className="dashboard-secondary-sidebar__popover-content">
            <div
              className="flex-center-y popover-menu__item"
              onClick={() => {}}
            >
              {intl.formatMessage(generalMessages.rename)}
            </div>
            <div
              className="flex-center-y popover-menu__item"
              onClick={() => this.onDeleteDashboard(dashboard)}
            >
              {intl.formatMessage(generalMessages.delete)}
            </div>
          </div>
        );
        const className = classNames('has-hidden-action flex-center-y', {
            'dashboard-secondary-sidebar__row': true,
            'dashboard-secondary-sidebar__row_active': dashboard.get('name') === activeDashboard
        });

        return (
          <div className={className} key={dashboard.get('id')}>
            <Link
              className="unstyled-link overflow-ellipsis dashboard-secondary-sidebar__link"
              to={`/dashboard/${dashboard.get('name')}`}
            >
              {dashboard.get('name')}
            </Link>
            <Popover
              content={menu}
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
            {this.state.addDashboard &&
              <div>
                <Input id="new-dashboard-input" />
                <div>
                  <Button onClick={this.onToggleNewDashboard}>Cancel</Button>
                  <Button onClick={this.onAddNewDashboard}>Add</Button>
                </div>
              </div>
            }
            <div>
              {dashboards.toList().map(this.renderRow)}
            </div>
          </div>
        );
    }
}

DashboardSecondarySidebar.propTypes = {
    activeDashboard: PropTypes.string,
    dashboardAdd: PropTypes.func.isRequired,
    dashboardDelete: PropTypes.func.isRequired,
    dashboards: PropTypes.shape(),
    intl: PropTypes.shape(),
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
        dashboardDelete,
    }
)(injectIntl(DashboardSecondarySidebar));

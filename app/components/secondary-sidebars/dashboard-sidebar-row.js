import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Modal, Popover } from 'antd';
import classNames from 'classnames';
import { dashboardMessages, generalMessages } from '../../locale-data/messages';
import { Icon } from '../';

const { confirm } = Modal;

class DashboardSidebarRow extends Component {
    state = {
        popoverVisible: false
    };

    onDelete = () => {
        const { dashboard, dashboardDelete, intl } = this.props;
        this.setState({ popoverVisible: false });
        const onOk = (cb) => {
            dashboardDelete(dashboard.get('id'));
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

    onVisibleChange = (popoverVisible) => {
        this.setState({
            popoverVisible
        });
    };

    render () {
        const { activeDashboard, dashboard, intl, isTheOnlyDashboard,
            newDashboard } = this.props;
        const { popoverVisible } = this.state;
        const isActive = dashboard.get('id') === activeDashboard;
        const closePopover = () => this.onVisibleChange(false);
        const className = classNames('has-hidden-action flex-center-y', {
            'dashboard-secondary-sidebar__row': true,
            'dashboard-secondary-sidebar__row_hovered': popoverVisible,
            'dashboard-secondary-sidebar__row_active': isActive && newDashboard === null
        });
        const deleteClass = classNames('flex-center-y popover-menu__item', {
            'popover-menu__item_disabled': isTheOnlyDashboard
        });
        const menu = (
          <div className="dashboard-secondary-sidebar__popover-content">
            <div
              className="flex-center-y popover-menu__item"
              onClick={() => this.props.onRename(dashboard)}
            >
              {intl.formatMessage(generalMessages.rename)}
            </div>
            <div
              className={deleteClass}
              onClick={!isTheOnlyDashboard ? this.onDelete : closePopover}
            >
              {intl.formatMessage(generalMessages.delete)}
            </div>
          </div>
        );

        return (
          <Link
            className="unstyled-link"
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
                onVisibleChange={this.onVisibleChange}
                overlayClassName="popover-menu"
                placement="bottomLeft"
                trigger="click"
                visible={popoverVisible}
              >
                <Icon
                  className="hidden-action dashboard-secondary-sidebar__menu-icon"
                  type="more"
                />
              </Popover>
            </div>
          </Link>
        );
    }
}

DashboardSidebarRow.propTypes = {
    activeDashboard: PropTypes.string,
    dashboard: PropTypes.shape().isRequired,
    dashboardDelete: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    isTheOnlyDashboard: PropTypes.bool,
    newDashboard: PropTypes.string,
    onRename: PropTypes.func.isRequired,
};

export default injectIntl(DashboardSidebarRow);

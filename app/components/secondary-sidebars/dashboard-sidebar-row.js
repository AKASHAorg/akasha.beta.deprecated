import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {injectIntl} from 'react-intl';
import {Link} from 'react-router-dom';
import {Modal, Popover} from 'antd';
import classNames from 'classnames';
import {DragSource, DropTarget} from 'react-dnd';
import {dashboardMessages, generalMessages} from '../../locale-data/messages';
import {Icon} from '../index';

const {confirm} = Modal;


const dragSource = {
    beginDrag(props) {
        return {
            id: props.key,
            index: props.index,
        };
    }
};
const cardTarget = {
    hover(props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;
        if (dragIndex === hoverIndex) {
            return;
        }
        props.reorder(dragIndex, hoverIndex);
        monitor.getItem().index = hoverIndex;
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

function collectDrop(connect) {
    return {
        connectDropTarget: connect.dropTarget(),
    };
}

class DashboardSidebarRow extends Component {
    state = {
        popoverVisible: false
    };
    wasVisible = false;

    onDelete = () => {
        const {dashboard, dashboardDelete, intl} = this.props;
        this.setState({popoverVisible: false});
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
            onCancel: () => {
            }
        });
    };

    onVisibleChange = (popoverVisible) => {
        this.wasVisible = true;
        this.setState({
            popoverVisible
        });
    };

    render() {
        const {activeDashboard, dashboard, intl, newDashboard, connectDragSource, connectDropTarget, isDragging} = this.props;
        const {popoverVisible} = this.state;
        const isActive = dashboard.get('id') === activeDashboard;
        const className = classNames('has-hidden-action flex-center-y', {
            'dashboard-secondary-sidebar__row': true,
            'dashboard-secondary-sidebar__row_hovered': popoverVisible,
            'dashboard-secondary-sidebar__row_active': isActive && newDashboard === null
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
                    className="flex-center-y popover-menu__item"
                    onClick={this.onDelete}
                >
                    {intl.formatMessage(generalMessages.delete)}
                </div>
            </div>
        );

        return connectDragSource(
            connectDropTarget(
                <div style={{
                    opacity: isDragging ? 0.2 : 1,
                    cursor: 'move'
                }}
                >
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
                                content={this.wasVisible ? menu : null}
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
                </div>
            ));
    }
}

DashboardSidebarRow.propTypes = {
    activeDashboard: PropTypes.string,
    dashboard: PropTypes.shape().isRequired,
    dashboardDelete: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    newDashboard: PropTypes.string,
    onRename: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    reorder: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired
};

export default DropTarget('dragRow', cardTarget, collectDrop)(DragSource('dragRow', dragSource, collect)(injectIntl(DashboardSidebarRow)));

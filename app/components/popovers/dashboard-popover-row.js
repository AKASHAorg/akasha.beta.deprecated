import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Modal } from 'antd';
import classNames from 'classnames';
import { DragSource, DropTarget } from 'react-dnd';
import { dashboardMessages, generalMessages } from '../../locale-data/messages';
import { Icon } from '../';

const { confirm } = Modal;


const dragSource = {
    beginDrag (props) {
        return {
            id: props.key,
            index: props.index,
        };
    }
};
const cardTarget = {
    hover (props, monitor) {
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;
        if (dragIndex === hoverIndex) {
            return;
        }
        props.reorder(dragIndex, hoverIndex);
        monitor.getItem().index = hoverIndex;
    }
};

function collect (connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    };
}

function collectDrop (connect) {
    return {
        connectDropTarget: connect.dropTarget(),
    };
}

class DashboardPopoverRow extends Component {
    onDelete = () => {
        const { closePopover, dashboard, dashboardDelete, intl } = this.props;
        closePopover()
        const onOk = () => {
            dashboardDelete(dashboard.get('id'));
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

    render () {
        const { activeDashboard, dashboard, connectDragSource, connectDropTarget, isDragging } = this.props;
        const isActive = dashboard.get('id') === activeDashboard;
        const className = classNames('has-hidden-action flex-center-y', {
            'dashboard-popover__row': true,
            'dashboard-popover__row_active': isActive
        });

        const menu = (
            <div className="dashboard-popover__row-menu hidden-action">
                <div>
                    <Icon
                        className="content-link dashboard-popover__icon"
                        onClick={ () => this.props.onRename(dashboard) }
                        type="edit"
                    />
                </div>
                <Icon
                    className="content-link dashboard-popover__icon dashboard-popover__icon_delete"
                    onClick={ this.onDelete }
                    type="trash"
                />
            </div>
        );

        return connectDragSource(
            connectDropTarget(
                <div style={ {
                    opacity: isDragging ? 0.2 : 1,
                    cursor: 'move'
                } }
                >
                    <div className={ className }>
                        <Link
                            className="unstyled-link dashboard-popover__link"
                            to={ `/dashboard/${ dashboard.get('id') }` }
                        >
                            <div className="overflow-ellipsis dashboard-popover__name">
                                { dashboard.get('name') }
                            </div>
                        </Link>
                        { menu }
                    </div>
                </div>
            ));
    }
}

DashboardPopoverRow.propTypes = {
    activeDashboard: PropTypes.string,
    closePopover: PropTypes.func,
    dashboard: PropTypes.shape().isRequired,
    dashboardDelete: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    onRename: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    reorder: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired
};

export default DropTarget('dragRow', cardTarget, collectDrop)(DragSource('dragRow', dragSource, collect)(injectIntl(DashboardPopoverRow)));

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Popover } from 'antd';
import { dashboardMessages } from '../../locale-data/messages';
import { toggleNewDashboardModal } from '../../local-flux/actions/app-actions';
import { entryNewestIteratorSuccess } from '../../local-flux/actions/entry-actions';
import {
    dashboardAdd,
    dashboardDelete,
    dashboardRename,
    dashboardReorder
} from '../../local-flux/actions/dashboard-actions';
import { dashboardSelectors, entrySelectors } from '../../local-flux/selectors';
import { DashboardPopoverRow, Icon } from '../';

class DashboardPopover extends Component {
    state = {
        popoverVisible: false,
        renameDashboard: null,
        renameValue: null
    };

    componentWillReceiveProps (nextProps) {
        // if (!nextProps.renamingDashboard && this.props.renamingDashboard) {
        //     this.setState({ renameDashboard: null, renameValue: null });
        // }
    }

    resize = () => this.forceUpdate();

    componentDidMount () {
        window.addEventListener('resize', this.resize);
    }

    componentWillUnmount () {
        window.removeEventListener('resize', this.resize);
    }

    onVisibleChange = popoverVisible => {
        this.setState({
            popoverVisible
        });
    };

    handleNewBoard = () => {
        this.setState({ popoverVisible: false }, () => {
            this.props.toggleNewDashboardModal();
        });
    };

    onChange = ev => {
        const value = ev.target.value;
        this.setState({ renameValue: value });
    };

    onKeyDown = ev => {
        if (ev.key === 'Enter') {
            this.onNewName();
        }
        if (ev.key === 'Escape') {
            const { renameDashboard } = this.state;
            const dashboard = this.props.dashboards.find(board => board.get('id') === renameDashboard);
            const initialName = dashboard && dashboard.get('name');
            this.setState({ renameValue: initialName });
        }
    };

    onNewName = () => {
        const { renameDashboard, renameValue } = this.state;
        const dashboard = this.props.dashboards.find(board => board.get('id') === renameDashboard);
        if (renameDashboard && dashboard.get('name') !== renameValue) {
            this.props.dashboardRename(renameDashboard, renameValue);
        } else {
            this.setState({ renameDashboard: null, renameValue: null });
        }
    };

    onRename = dashboard => {
        this.setState({
            renameDashboard: dashboard.get('id'),
            renameValue: dashboard.get('name')
        });
    };

    _deleteDashboard = dashBoardId => {
        const { dashboardDelete } = this.props;
        dashboardDelete(dashBoardId);
    };

    renderEditRow = () => {
        const { renameDashboard, renameValue } = this.state;
        const rowClass = 'dashboard-popover__row';
        const inputRowClass = `flex-center-y ${ rowClass } ${ rowClass }_active ${ rowClass }_input`;

        return (
            <div className={ inputRowClass } key={ renameDashboard }>
                <input
                    autoFocus // eslint-disable-line jsx-a11y/no-autofocus
                    className="dashboard-popover__input"
                    id="new-dashboard-input"
                    onBlur={ this.onNewName }
                    onChange={ this.onChange }
                    onKeyDown={ this.onKeyDown }
                    value={ renameValue }
                />
            </div>
        );
    };

    renderContent = () => {
        const { intl, activeDashboardId, dashboards } = this.props;
        const bodyHeight = document.body.scrollHeight;
        const computedMaxHeight = `${ bodyHeight - 100 }px`;

        return (
            <div>
                <div className="dashboard-popover__list" style={ { maxHeight: computedMaxHeight } }>
                    { dashboards.toList().map((dashboard, i) => {
                        const isRenamed = this.state.renameDashboard === dashboard.get('id');
                        if (isRenamed) {
                            return this.renderEditRow();
                        }

                        return (
                            <DashboardPopoverRow
                                activeDashboard={ activeDashboardId }
                                closePopover={ () => {
                                    this.setState({ popoverVisible: false });
                                } }
                                dashboard={ dashboard }
                                dashboardDelete={ this._deleteDashboard }
                                key={ dashboard.get('id') }
                                index={ i }
                                onRename={ this.onRename }
                                reorder={ (source, target) =>
                                    this.props.dashboardReorder(this.props.activeDashboardId, source, target)
                                }
                            />
                        );
                    }) }
                </div>
                <div className="content-link dashboard-popover__button"
                     onClick={ this.handleNewBoard }>
                    <div className="dashboard-popover__left-item">
                        <Icon className="dashboard-popover__small-icon" type="plus"/>
                    </div>
                    <div className="dashboard-popover__new-board-label">
                        { intl.formatMessage(dashboardMessages.newBoard) }
                    </div>
                </div>
            </div>
        );
    };

    render () {
        const { activeDashboard, intl } = this.props;
        const title = activeDashboard
            ? activeDashboard.get('name')
            : intl.formatMessage(dashboardMessages.akashaBoard);

        return (
            <div className="dashboard-popover__title">
                <Popover
                    arrowPointAtCenter
                    content={ this.renderContent() }
                    onVisibleChange={ this.onVisibleChange }
                    overlayClassName="dashboard-popover"
                    placement="bottomLeft"
                    trigger="click"
                    visible={ this.state.popoverVisible }
                >
                    <Icon className="dashboard-popover__small-icon" type="arrowsUpDown"/>
                </Popover>
                <div
                    className="overflow-ellipsis dashboard-popover__title-text"
                    onMouseDown={ () => {
                        this.onVisibleChange(!this.state.popoverVisible);
                    } }
                >
                    { title }
                </div>
            </div>
        );
    }
}

DashboardPopover.propTypes = {
    activeDashboard: PropTypes.shape(),
    containerRef: PropTypes.shape(),
    dashboardAdd: PropTypes.func.isRequired,
    dashboardDelete: PropTypes.func.isRequired,
    activeDashboardId: PropTypes.string,
    dashboardReorder: PropTypes.func.isRequired,
    dashboardRename: PropTypes.func.isRequired,
    dashboards: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    newDashboard: PropTypes.bool,
    renamingDashboard: PropTypes.bool,
    toggleNewDashboardModal: PropTypes.func
};

function mapStateToProps (state) {
    return {
        activeDashboard: dashboardSelectors.getActiveDashboard(state),
        entries: entrySelectors.selectEntriesById(state),
        dashboards: dashboardSelectors.getAllDashboards(state),
        activeDashboardId: dashboardSelectors.selectActiveDashboardId(state),
        newDashboard: dashboardSelectors.selectNewDashboard(state)
        // renamingDashboard: dashboardSelectors.getRenamingDashboard(state)
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardAdd,
        dashboardDelete,
        dashboardRename,
        dashboardReorder,
        entryNewestIteratorSuccess,
        toggleNewDashboardModal
    }
)(injectIntl(DashboardPopover));

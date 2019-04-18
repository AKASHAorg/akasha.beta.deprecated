import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Popover } from 'antd';
import { AddToBoard, NewDashboardForm } from '../';

const DASHBOARDS = 'DASHBOARDS';
const NEW_DASHBOARD = 'NEW_DASHBOARD';

class AddToBoardPopover extends Component {
    state = {
        content: null,
        popoverVisible: false
    };
    wasVisible = false;

    componentWillUnmount () {
        if (this.resetTimeout) {
            clearTimeout(this.resetTimeout);
        }
        if (this.focusTimeout) {
            clearTimeout(this.focusTimeout);
        }
    }

    closePopover = () => this.onVisibleChange(false);

    onAddToDashboard = () => {
        this.setInputFocusAsync();
        this.setState({
            content: DASHBOARDS
        });
    };

    onNewDashboard = () => {
        this.setState({
            content: NEW_DASHBOARD
        });
    };

    onVisibleChange = (popoverVisible) => {
        this.wasVisible = true;
        this.setState({
            content: popoverVisible ? DASHBOARDS : this.state.content,
            popoverVisible
        });
        // Delay state reset until popover animation is finished
        if (!popoverVisible) {
            this.resetTimeout = setTimeout(() => {
                this.resetTimeout = null;
                // this.props.dashboardSearch('');
                this.setState({
                    content: null
                });
            }, 100);
        } else {
            this.setInputFocusAsync();
        }
    };

    setInputFocusAsync = () => {
        this.focusTimeout = setTimeout(() => {
            this.focusTimeout = null;
            const input = document.getElementById('add-to-board-search');
            if (input) {
                input.focus();
            }
        }, 100);
    };

    renderContent = () => {
        const { profile, tag } = this.props;
        const { content } = this.state;

        switch (content) {
            case DASHBOARDS:
                return (
                    <AddToBoard
                        closePopover={ this.closePopover }
                        onNewDashboard={ this.onNewDashboard }
                        profile={ profile }
                        tag={ tag }
                    />
                );
            case NEW_DASHBOARD:
                return (
                    <NewDashboardForm
                        ethAddress={ profile && profile.ethAddress }
                        onCancel={ this.onAddToDashboard }
                        tag={ tag }
                    />
                );
            default:
                return null;
        }
    };

    render () {
        const { arrowPointAtCenter, containerRef } = this.props;
        const getPopupContainer = () => containerRef || document.body;

        return (
            <Popover
                arrowPointAtCenter={ arrowPointAtCenter }
                content={ this.wasVisible ? this.renderContent() : null }
                getPopupContainer={ getPopupContainer }
                onVisibleChange={ this.onVisibleChange }
                overlayClassName="profile-popover"
                placement="bottomLeft"
                trigger="click"
                visible={ this.state.popoverVisible }
            >
                { this.props.children }
            </Popover>
        );
    }
}

AddToBoardPopover.propTypes = {
    arrowPointAtCenter: PropTypes.bool,
    children: PropTypes.node.isRequired,
    containerRef: PropTypes.shape(),
    profile: PropTypes.shape(),
    tag: PropTypes.string,
};

export default AddToBoardPopover;

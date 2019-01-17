import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Popover, Tag } from 'antd';
import classNames from 'classnames';
import * as columnTypes from '../../constants/columns';
import { showPreview } from '../../local-flux/actions/app-actions';
import { dashboardSearch } from '../../local-flux/actions/dashboard-actions';
import { dashboardSelectors } from '../../local-flux/selectors';
import { dashboardMessages, generalMessages } from '../../locale-data/messages';
import { AddToBoard, NewDashboardForm } from '../';

const MENU = 'MENU';
const DASHBOARDS = 'DASHBOARDS';
const NEW_DASHBOARD = 'NEW_DASHBOARD';

class TagPopover extends Component {
    state = {
        content: null,
        visible: false
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

    showPreview = () => {
        const { tag } = this.props;
        this.closePopover();
        this.props.showPreview({ columnType: columnTypes.tag, value: tag });
    }

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

    onVisibleChange = (visible) => {
        this.wasVisible = true;
        this.setState({
            content: visible ? MENU : this.state.content,
            visible
        });
        // Delay state reset until popover animation is finished
        if (!visible) {
            this.resetTimeout = setTimeout(() => {
                this.resetTimeout = null;
                this.props.dashboardSearch('');
                this.setState({
                    content: null
                });
            }, 100);
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
        const { intl, tag } = this.props;
        const { content } = this.state;

        switch (content) {
            case DASHBOARDS:
                return (
                  <AddToBoard
                    closePopover={this.closePopover}
                    onNewDashboard={this.onNewDashboard}
                    tag={tag}
                  />
                );
            case NEW_DASHBOARD:
                return (
                  <NewDashboardForm
                    onCancel={this.onAddToDashboard}
                    tag={tag}
                  />
                );
            case MENU:
                return (
                  <div>
                    <div
                      className="popover-menu__item"
                      onClick={this.onAddToDashboard}
                    >
                      <span>{intl.formatMessage(dashboardMessages.addToBoard)}</span>
                    </div>
                    <div
                      className="popover-menu__item"
                      onClick={this.showPreview}
                    >
                      <span>{intl.formatMessage(generalMessages.preview)}</span>
                    </div>
                  </div>
                );
            default:
                return null;
        }
    };

    render () {
        const { containerRef, tag } = this.props;
        const overlayClassName = classNames('popover-menu tag-popover', {
            'tag-popover_narrow': this.state.content === MENU
        });

        return (
          <Popover
            content={this.wasVisible ? this.renderContent() : null}
            getPopupContainer={() => containerRef || document.body}
            onVisibleChange={this.onVisibleChange}
            overlayClassName={overlayClassName}
            placement="bottomLeft"
            trigger="click"
            visible={this.state.visible}
          >
            <Tag className="uppercase tag-popover__tag">
              {tag}
            </Tag>
          </Popover>
        );
    }
}

TagPopover.propTypes = {
    containerRef: PropTypes.shape(),
    dashboardSearch: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    showPreview: PropTypes.func.isRequired,
    tag: PropTypes.string.isRequired,
};

function mapStateToProps (state) {
    return {
        dashboards: dashboardSelectors.getAllDashboards(state),
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardSearch,
        showPreview
    }
)(injectIntl(TagPopover));

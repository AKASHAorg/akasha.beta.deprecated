import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Checkbox, Input, Popover, Tag } from 'antd';
import { List } from 'immutable';
import classNames from 'classnames';
import * as columnTypes from '../../constants/columns';
import { dashboardAdd, dashboardDelete, dashboardSearch,
    dashboardToggleTagColumn } from '../../local-flux/actions/dashboard-actions';
import { selectColumns, selectDashboards, selectDashboardSearch } from '../../local-flux/selectors';
import { dashboardMessages, tagMessages } from '../../locale-data/messages';
import { Icon, NewDashboardForm } from '../';

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

    isSaved = (dashboard) => {
        const { columns, tag } = this.props;
        return dashboard.get('columns').some(id =>
            columns.getIn([id, 'type']) === columnTypes.tag &&
            columns.getIn([id, 'value']) === tag
        );
    };

    groupByState = (dashboards) => {
        let saved = new List();
        let unsaved = new List();
        dashboards.forEach((dashboard) => {
            if (this.isSaved(dashboard)) {
                saved = saved.push(dashboard);
            } else {
                unsaved = unsaved.push(dashboard);
            }
        });
        return saved.concat(unsaved);
    };

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

    onKeyDown = (ev) => {
        if (ev.key === 'Escape') {
            this.props.dashboardSearch('');
        }
    };

    onSearchChange = (ev) => {
        this.props.dashboardSearch(ev.target.value);
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
            const input = document.getElementById('tag-popover-search');
            if (input) {
                input.focus();
            }
        }, 100);
    };

    renderContent = () => {
        const { dashboards, intl, search, tag } = this.props;
        const { content } = this.state;

        switch (content) {
            case DASHBOARDS:
                return (
                  <div>
                    <div>
                      <Input
                        className="tag-popover__search"
                        id="tag-popover-search"
                        onChange={this.onSearchChange}
                        onKeyDown={this.onKeyDown}
                        placeholder={intl.formatMessage(dashboardMessages.searchForBoard)}
                        prefix={<Icon type="search" />}
                        size="large"
                        value={search}
                      />
                    </div>
                    <div className="tag-popover__list-wrapper">
                      {this.groupByState(dashboards).map((dashboard) => {
                          const toggleDashboard = () => {
                                this.onVisibleChange(false);
                                this.props.dashboardToggleTagColumn(dashboard.get('id'), tag);
                          };
                          const isSaved = this.isSaved(dashboard);
                          const root = 'tag-popover__left-item tag-popover__row-icon';
                          const modifier = 'tag-popover__row-icon_saved';
                          const className = `${root} ${isSaved && modifier}`;
                          return (
                            <div
                              className="has-hidden-action content-link tag-popover__row"
                              key={dashboard.get('id')}
                              onClick={toggleDashboard}
                            >
                              <div className={`hidden-action-reverse ${className}`}>
                                {dashboard.get('columns').size}
                              </div>
                              <div className="hidden-action tag-popover__left-item">
                                <Checkbox checked={isSaved} />
                              </div>
                              <div className="overflow-ellipsis tag-popover__name">
                                {dashboard.get('name')}
                              </div>
                              <div className="hidden-action flex-center tag-popover__icon">
                                <Icon
                                  type="trash"
                                  onClick={(ev) => {
                                      ev.preventDefault();
                                      ev.stopPropagation();
                                      this.props.dashboardDelete(dashboard.get('id'));
                                  }}
                                />
                              </div>
                            </div>
                          );
                      })}
                    </div>
                    <div className="content-link tag-popover__button" onClick={this.onNewDashboard}>
                      <div className="tag-popover__left-item">
                        <Icon className="tag-popover__icon" type="plus" />
                      </div>
                      <div style={{ flex: '1 1 auto' }}>
                        {intl.formatMessage(dashboardMessages.createNew)}
                      </div>
                    </div>
                  </div>
                );
            case NEW_DASHBOARD:
                return (
                  <NewDashboardForm
                    dashboards={dashboards}
                    onCancel={this.onAddToDashboard}
                    onSave={this.props.dashboardAdd}
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
                      <span>{intl.formatMessage(tagMessages.addToDashboard)}</span>
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
    columns: PropTypes.shape().isRequired,
    containerRef: PropTypes.shape(),
    dashboardAdd: PropTypes.func.isRequired,
    dashboardDelete: PropTypes.func.isRequired,
    dashboards: PropTypes.shape().isRequired,
    dashboardSearch: PropTypes.func.isRequired,
    dashboardToggleTagColumn: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    search: PropTypes.string,
    tag: PropTypes.string.isRequired,
};

function mapStateToProps (state) {
    return {
        columns: selectColumns(state),
        dashboards: selectDashboards(state),
        search: selectDashboardSearch(state)
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardAdd,
        dashboardDelete,
        dashboardSearch,
        dashboardToggleTagColumn
    }
)(injectIntl(TagPopover));

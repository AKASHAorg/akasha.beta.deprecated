import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Checkbox, Input } from 'antd';
import { List } from 'immutable';
import { Icon } from '../';
import * as columnTypes from '../../constants/columns';
import { dashboardDelete, dashboardSearch,
    dashboardToggleTagColumn } from '../../local-flux/actions/dashboard-actions';
import { selectColumns, selectDashboards, selectDashboardSearch } from '../../local-flux/selectors';
import { dashboardMessages } from '../../locale-data/messages';

class AddToBoard extends Component {
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

    onKeyDown = (ev) => {
        if (ev.key === 'Escape') {
            this.props.dashboardSearch('');
        }
    };

    onSearchChange = (ev) => {
        this.props.dashboardSearch(ev.target.value);
    };

    render () {
        const { closePopover, dashboards, intl, onNewDashboard, search, tag } = this.props;
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
                        closePopover();
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
            <div className="content-link tag-popover__button" onClick={onNewDashboard}>
              <div className="tag-popover__left-item">
                <Icon className="tag-popover__icon" type="plus" />
              </div>
              <div style={{ flex: '1 1 auto' }}>
                {intl.formatMessage(dashboardMessages.createNew)}
              </div>
            </div>
          </div>
        );
    }
}

AddToBoard.propTypes = {
    closePopover: PropTypes.func.isRequired,
    columns: PropTypes.shape().isRequired,
    dashboardDelete: PropTypes.func.isRequired,
    dashboards: PropTypes.shape().isRequired,
    dashboardSearch: PropTypes.func.isRequired,
    dashboardToggleTagColumn: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    onNewDashboard: PropTypes.func.isRequired,
    search: PropTypes.string,
    tag: PropTypes.string.isRequired,
};

function mapStateToProps (state) {
    return {
        columns: selectColumns(state),
        dashboards: selectDashboards(state),
        search: selectDashboardSearch(state),
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardDelete,
        dashboardSearch,
        dashboardToggleTagColumn
    }
)(injectIntl(AddToBoard));

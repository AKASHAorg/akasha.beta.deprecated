import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Checkbox, Input } from 'antd';
import { List } from 'immutable';
import classNames from 'classnames';
import { Icon } from '../';
import * as columnTypes from '../../constants/columns';
import { dashboardDelete, dashboardSearch, dashboardToggleProfileColumn,
    dashboardToggleTagColumn } from '../../local-flux/actions/dashboard-actions';
import { selectColumns, selectDashboards, selectDashboardSearch } from '../../local-flux/selectors';
import { dashboardMessages } from '../../locale-data/messages';

class AddToBoard extends Component {
    isSaved = (dashboard) => {
        const { columns, ethAddress, tag } = this.props;
        const columnType = tag ? columnTypes.tag : columnTypes.profile;
        const value = tag || ethAddress;
        return dashboard.get('columns').some(id =>
            columns.getIn([id, 'type']) === columnType &&
            columns.getIn([id, 'value']) === value
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
        const { closePopover, dashboards, ethAddress, intl, onNewDashboard, search, tag } = this.props;
        return (
          <div>
            <div>
              <Input
                className="add-to-board__search"
                id="add-to-board-search"
                onChange={this.onSearchChange}
                onKeyDown={this.onKeyDown}
                placeholder={intl.formatMessage(dashboardMessages.searchForBoard)}
                prefix={<Icon type="search" />}
                size="large"
                value={search}
              />
            </div>
            <div className="add-to-board__list-wrapper">
              {this.groupByState(dashboards).map((dashboard) => {
                  const toggleDashboard = () => {
                        closePopover();
                        if (tag) {
                            this.props.dashboardToggleTagColumn(dashboard.get('id'), tag);
                        } else {
                            this.props.dashboardToggleProfileColumn(dashboard.get('id'), ethAddress);
                        }
                  };
                  const isSaved = this.isSaved(dashboard);
                  const className = classNames('add-to-board__left-item add-to-board__row-icon', {
                      'add-to-board__row-icon_saved': isSaved
                  });
                  return (
                    <div
                      className="has-hidden-action add-to-board__row"
                      key={dashboard.get('id')}
                      onClick={toggleDashboard}
                    >
                      <div className={`hidden-action-reverse ${className}`}>
                        {dashboard.get('columns').size}
                      </div>
                      <div className="hidden-action add-to-board__left-item">
                        <Checkbox checked={isSaved} />
                      </div>
                      <div className="overflow-ellipsis add-to-board__name">
                        {dashboard.get('name')}
                      </div>
                      <div className="hidden-action flex-center add-to-board__icon">
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
            <div className="content-link add-to-board__button" onClick={onNewDashboard}>
              <div className="add-to-board__left-item">
                <Icon className="add-to-board__icon" type="plus" />
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
    dashboardToggleProfileColumn: PropTypes.func.isRequired,
    dashboardToggleTagColumn: PropTypes.func.isRequired,
    ethAddress: PropTypes.string,
    intl: PropTypes.shape().isRequired,
    onNewDashboard: PropTypes.func.isRequired,
    search: PropTypes.string,
    tag: PropTypes.string,
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
        dashboardToggleProfileColumn,
        dashboardToggleTagColumn
    }
)(injectIntl(AddToBoard));

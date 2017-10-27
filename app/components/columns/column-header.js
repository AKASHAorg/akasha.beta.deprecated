import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { AutoComplete } from 'material-ui';
import { Icon, Modal, Popover } from 'antd';
import { dashboardDeleteColumn,
    dashboardUpdateColumn } from '../../local-flux/actions/dashboard-actions';
import { dashboardMessages, generalMessages } from '../../locale-data/messages';

const { confirm } = Modal;

class ColumnHeader extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isFocused: false,
            isHovered: false,
            popoverVisible: false,
            value: props.column.get('value')
        };
    }

    onBlur = () => {
        this.setState({
            isFocused: false
        });
    };

    onChange = (value) => {
        if (this.props.onInputChange) {
            this.props.onInputChange(value);
        }
        this.setState({
            value
        });
    };

    onFocus = () => {
        this.setState({
            isFocused: true
        });
    };

    onMouseEnter = () => {
        this.setState({
            isHovered: true
        });
    };

    onMouseLeave = () => {
        this.setState({
            isHovered: false
        });
    };

    onNewRequest = (value) => {
        this.setState({
            value
        }, () => this.updateColumnValue());
    };

    onRefresh = () => {
        this.props.onRefresh();
        this.setState({ popoverVisible: false });
    }

    onVisibleChange = (popoverVisible) => { this.setState({ popoverVisible }); };

    deleteColumn = () => {
        const { column, intl } = this.props;
        this.setState({ popoverVisible: false });
        const onOk = (cb) => {
            this.props.dashboardDeleteColumn(column.get('id'));
            cb();
        };
        const content = intl.formatMessage(dashboardMessages.deleteColumnConfirmation);
        confirm({
            content,
            okText: intl.formatMessage(generalMessages.yes),
            okType: 'danger',
            cancelText: intl.formatMessage(generalMessages.no),
            onOk,
            onCancel: () => {}
        });
    }

    switchColumnWidth = () => {
        const { column } = this.props;
        this.setState({ popoverVisible: false });
        const large = !column.get('large');
        this.props.dashboardUpdateColumn(column.get('id'), { large });
    };

    updateColumnValue = () => {
        const { column } = this.props;
        const { value } = this.state;
        if (value !== column.get('value')) {
            this.props.dashboardUpdateColumn(column.get('id'), { value });
        }
    }

    renderContent = () => {
        const { column, intl } = this.props;
        const message = column.get('large') ? dashboardMessages.small : dashboardMessages.large;

        return (
          <div className="dashboard-secondary-sidebar__popover-content">
            <div
              className="flex-center-y popover-menu__item"
              onClick={this.onRefresh}
            >
              {intl.formatMessage(generalMessages.refresh)}
            </div>
            <div
              className="flex-center-y popover-menu__item"
              onClick={this.switchColumnWidth}
            >
              {intl.formatMessage(message)}
            </div>
            <div
              className="flex-center-y popover-menu__item"
              onClick={this.deleteColumn}
            >
              {intl.formatMessage(generalMessages.delete)}
            </div>
          </div>
        );
    };

    render () {
        const { icon, readOnly, title } = this.props;
        const { isFocused, isHovered, value } = this.state;

        return (
          <div
            className="flex-center-y column-header"
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
          >
            {icon &&
              <svg
                viewBox="0 0 18 18"
                style={{ flex: '0 0 auto', width: '18px', height: '18px', marginRight: '5px' }}
              >
                {icon}
              </svg>
            }
            <div className="column-header__title-wrapper">
              {readOnly &&
                <div className="column-header__title">{title}</div>
              }
              {!readOnly &&
                <AutoComplete
                  id="value"
                  dataSource={[]}
                  searchText={value}
                  onBlur={this.onBlur}
                  onUpdateInput={this.onChange}
                  onFocus={this.onFocus}
                  onNewRequest={this.onNewRequest}
                  openOnFocus
                  underlineShow={isHovered || isFocused}
                />
              }
            </div>
            <Popover
              content={this.renderContent()}
              onVisibleChange={this.onVisibleChange}
              overlayClassName="popover-menu"
              trigger="click"
              visible={this.state.popoverVisible}
            >
              <Icon className="content-link column-header__menu-icon" type="menu-fold" />
            </Popover>
          </div>
        );
    }
}

ColumnHeader.propTypes = {
    column: PropTypes.shape().isRequired,
    dashboardDeleteColumn: PropTypes.func.isRequired,
    dashboardUpdateColumn: PropTypes.func.isRequired,
    icon: PropTypes.element,
    intl: PropTypes.shape().isRequired,
    onInputChange: PropTypes.func,
    onRefresh: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    title: PropTypes.string,
};

export default connect(
    null,
    {
        dashboardDeleteColumn,
        dashboardUpdateColumn
    }
)(injectIntl(ColumnHeader));

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { AutoComplete, Modal, Popover, Select } from 'antd';
import classNames from 'classnames';
import * as columnTypes from '../../constants/columns';
import { dashboardDeleteColumn,
    dashboardUpdateColumn } from '../../local-flux/actions/dashboard-actions';
import { dashboardMessages, generalMessages } from '../../locale-data/messages';
import { Icon } from '../';

const { Option } = Select;

class ColumnHeader extends Component {
    constructor (props) {
        super(props);
        this.state = {
            editMode: false,
            modalVisible: false,
            popoverVisible: false,
            value: props.column && props.column.get('value')
        };
    }

    wasVisible = false;

    getInputRef = (el) => { this.input = el; };

    onBlur = () => {
        if (!this.selecting) {
            this.onCancel();
        }
        this.selecting = false;
    };

    onCancel = () => {
        const { column } = this.props;
        this.setState({ editMode: false, value: column.get('value') });
    };

    onChange = (value) => { this.setState({ value }); };

    onKeyDown = (ev) => {
        const { dataSource } = this.props;
        if (ev.key === 'Enter') {
            if (!dataSource.size || !this.selecting) {
                this.onSelect(this.state.value);
            }
            this.selecting = false;
        }
    };

    onMouseDown = (ev) => { ev.preventDefault(); };

    onRefresh = () => {
        this.props.onRefresh();
        this.setState({ popoverVisible: false });
    };

    onSearch = (value) => {
        const { onSearch } = this.props;
        if (onSearch) {
            onSearch(value, true);
        }
    };

    onSelect = (value) => {
        const { column } = this.props;
        this.selecting = true;
        if (value !== column.get('value')) {
            this.props.dashboardUpdateColumn(column.get('id'), { value });
        }
        this.setState({
            editMode: false
        });
    };

    onVisibleChange = (popoverVisible) => {
        this.wasVisible = true;
        this.setState({ popoverVisible });
    };

    deleteColumn = () => {
        this.setState({
            popoverVisible: false,
            modalVisible: true
        });
    };

    showModal = () => {
        const { column, intl } = this.props;
        const onOk = () => {
            this.props.dashboardDeleteColumn(column.get('id'));
        };
        const content = intl.formatMessage(dashboardMessages.deleteColumnConfirmation);
        return (
          <Modal
            visible={this.state.modalVisible}
            className={'delete-modal'}
            width={320}
            okText={intl.formatMessage(generalMessages.delete)}
            okType={'danger'}
            cancelText={intl.formatMessage(generalMessages.cancel)}
            onOk={onOk}
            onCancel={() => { this.setState({ modalVisible: false }); }}
            closable={false}
          >
            {content}
          </Modal>
        );
    };

    editColumn = (ev) => {
        ev.preventDefault();
        this.setState({ editMode: true, popoverVisible: false });
        setTimeout(() => {
            if (this.input) {
                this.input.focus();
            }
        }, 0);
    };

    switchColumnWidth = () => {
        const { column } = this.props;
        this.setState({ popoverVisible: false });
        const large = !column.get('large');
        this.props.dashboardUpdateColumn(column.get('id'), { large });
    };

    renderEditMode = () => {
        const { column, dataSource, intl } = this.props;
        const { value } = this.state;
        if (column.get('type') === columnTypes.list) {
            return (
              <Select
                className="column-header__select"
                filterOption
                notFoundContent={intl.formatMessage(generalMessages.notFound)}
                onChange={this.onChange}
                onSelect={this.onSelect}
                showSearch
                size="large"
                value={value}
              >
                {dataSource.map(option => (
                  <Option key={option.get('id')} value={option.get('id')}>
                    {option.get('name')}
                  </Option>
                ))}
              </Select>
            );
        }
        return (
          <AutoComplete
            className="column-header__auto-complete"
            dataSource={dataSource}
            onChange={this.onChange}
            onSearch={this.onSearch}
            onSelect={this.onSelect}
            size="large"
            value={value}
          >
            <input
              className="column-header__input"
              onBlur={this.onBlur}
              onKeyDown={this.onKeyDown}
              ref={this.getInputRef}
            />
          </AutoComplete>
        );
    };

    renderContent = () => {
        const { column, intl, notEditable, readOnly } = this.props;
        const message = column && column.get('large') ? dashboardMessages.small : dashboardMessages.large;
        return (
          <div className="dashboard-secondary-sidebar__popover-content">
            <div
              className="flex-center-y popover-menu__item"
              onClick={this.onRefresh}
            >
              {intl.formatMessage(generalMessages.refresh)}
            </div>
            {!notEditable &&
              <div
                className="flex-center-y popover-menu__item"
                onClick={this.switchColumnWidth}
              >
                {intl.formatMessage(message)}
              </div>
            }
            {(!notEditable && !readOnly) &&
              <div
                className="flex-center-y popover-menu__item"
                onClick={this.editColumn}
              >
                {intl.formatMessage(generalMessages.edit)}
              </div>
            }
            {!notEditable &&
              <div
                className="flex-center-y popover-menu__item"
                onClick={this.deleteColumn}
              >
                {intl.formatMessage(generalMessages.delete)}
              </div>
            }
          </div>
        );
    };

    render () {
        const { column, iconType, readOnly, title } = this.props;
        const { editMode, value } = this.state;
        const titleWrapperClass = classNames('column-header__title-wrapper', {
            'column-header__title-wrapper_no-icon': !iconType
        });
        const titleClass = classNames('overflow-ellipsis column-header__title', {
            'column-header__title_large': column && column.get('large')
        });

        return (
          <div className="flex-center-y column-header">
            {iconType &&
              <Icon className="dark-icon column-header__icon" type={iconType} />
            }
            <div className={titleWrapperClass}>
              {(readOnly || !editMode) &&
                <div
                  className={titleClass}
                  onDoubleClick={!readOnly ? this.editColumn : undefined}
                  onMouseDown={this.onMouseDown}
                >
                  {title || value}
                </div>
              }
              {!readOnly && editMode && this.renderEditMode()}
            </div>
            {this.showModal()}
            {!editMode &&
              <Popover
                content={this.wasVisible ? this.renderContent() : null}
                onVisibleChange={this.onVisibleChange}
                overlayClassName="popover-menu"
                placement="bottom"
                trigger="click"
                visible={this.state.popoverVisible}
              >
                <Icon className="content-link column-header__menu-icon" type="menu" />
              </Popover>
            }
            {editMode &&
              <Icon
                className="content-link column-header__reset-icon"
                onClick={this.onCancel}
                type="close"
              />
            }
          </div>
        );
    }
}

ColumnHeader.propTypes = {
    column: PropTypes.shape(),
    dashboardDeleteColumn: PropTypes.func.isRequired,
    dashboardUpdateColumn: PropTypes.func.isRequired,
    dataSource: PropTypes.shape(),
    iconType: PropTypes.string,
    intl: PropTypes.shape().isRequired,
    // when true, column cannot be modified or deleted
    notEditable: PropTypes.bool,
    onRefresh: PropTypes.func.isRequired,
    onSearch: PropTypes.func,
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

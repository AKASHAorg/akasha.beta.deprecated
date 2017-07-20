import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { AutoComplete, SvgIcon } from 'material-ui';
import { dashboardDeleteColumn,
    dashboardUpdateColumn } from '../../local-flux/actions/dashboard-actions';
// import { UserMore } from '../svg';

class ColumnHeader extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isFocused: false,
            isHovered: false,
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

    deleteColumn = () => {
        const { column } = this.props;
        this.props.dashboardDeleteColumn(column.get('id'));
    }

    switchColumnWidth = () => {
        const { column } = this.props;
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

    render () {
        const { column, icon, readOnly, suggestions, title } = this.props;
        const { isFocused, isHovered, value } = this.state;

        return (
          <div
            className="flex-center-y"
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            style={{ height: '50px', flex: '0 0 auto' }}
          >
            {icon &&
              <SvgIcon
                viewBox="0 0 18 18"
                style={{ flex: '0 0 auto', width: '18px', height: '18px', marginRight: '5px' }}
              >
                {icon}
              </SvgIcon>
            }
            <div style={{ flex: '1 1 auto' }}>
              {readOnly &&
                <div>{title}</div>
              }
              {!readOnly &&
                <AutoComplete
                  id="value"
                  dataSource={suggestions ? suggestions.toJS() : []}
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
            <button onClick={this.switchColumnWidth} style={{ marginRight: '10px', flex: '0 0 auto' }}>
              {column.get('large') ? 'small' : 'large'}
            </button>
            <button onClick={this.deleteColumn} style={{ marginRight: '20px', flex: '0 0 auto' }}>x</button>
            {/*<div style={{ flex: '0 0 auto' }}>
              <SvgIcon
                viewBox="0 0 18 18"
                onClick={() => null}
                style={{
                    height: '100%',
                    width: '42px',
                    padding: '0 9px',
                    margin: '0 2px',
                    // color: muiTheme.palette.secondaryTextColor
                }}
              >
                <UserMore />
              </SvgIcon>
            </div>*/}
          </div>
        );
    }
}

ColumnHeader.propTypes = {
    column: PropTypes.shape().isRequired,
    dashboardDeleteColumn: PropTypes.func.isRequired,
    dashboardUpdateColumn: PropTypes.func.isRequired,
    icon: PropTypes.element,
    onInputChange: PropTypes.func,
    readOnly: PropTypes.bool,
    suggestions: PropTypes.shape(),
    title: PropTypes.string,
};

export default connect(
    null,
    {
        dashboardDeleteColumn,
        dashboardUpdateColumn
    }
)(ColumnHeader);

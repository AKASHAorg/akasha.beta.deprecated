import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SvgIcon, TextField } from 'material-ui';
import { dashboardDeleteColumn,
    dashboardUpdateColumn } from '../../local-flux/actions/dashboard-actions';
// import { UserMore } from '../../shared-components/svg';

class ColumnHeader extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isFocused: false,
            isHovered: false,
            value: props.value
        };
    }

    onBlur = () => {
        this.updateColumn();
        this.setState({
            isFocused: false
        });
    };

    onChange = (ev, value) => {
        this.setState({
            value
        });
    };

    onFocus = () => {
        this.setState({
            isFocused: true
        });
    };

    onKeyPress = (ev) => {
        if (ev.key === 'Enter') {
            this.updateColumn();
        }
    }

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

    deleteColumn = () => {
        const { columnId } = this.props;
        this.props.dashboardDeleteColumn(columnId);
    }

    updateColumn = () => {
        const { columnId, value } = this.props;
        if (this.state.value !== value) {
            this.props.dashboardUpdateColumn(columnId, this.state.value);
        }
    }

    render () {
        const { icon, readOnly, title } = this.props;
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
                <TextField
                  id="value"
                  value={value}
                  onBlur={this.onBlur}
                  onChange={this.onChange}
                  onFocus={this.onFocus}
                  onKeyPress={this.onKeyPress}
                  underlineShow={isHovered || isFocused}
                />
              }
            </div>
            <button onClick={this.deleteColumn} style={{ marginRight: '20px' }}>x</button>
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
    // columnId: PropTypes.string,
    dashboardDeleteColumn: PropTypes.func.isRequired,
    dashboardUpdateColumn: PropTypes.func.isRequired,
    icon: PropTypes.element,
    readOnly: PropTypes.bool,
    title: PropTypes.string,
    value: PropTypes.string
};

export default connect(
    null,
    {
        dashboardDeleteColumn,
        dashboardUpdateColumn
    }
)(ColumnHeader);

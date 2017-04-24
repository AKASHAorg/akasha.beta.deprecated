import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { SvgIcon, TextField } from 'material-ui';
import { UserMore } from '../../shared-components/svg';

class ColumnHeader extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isFocused: false,
            isHovered: false,
            value: props.title
        };
    }

    onBlur = () => {
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

    render () {
        const { icon, readOnly } = this.props;
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
                <div>{value}</div>
              }
              {!readOnly &&
                <TextField
                  id="value"
                  value={value}
                  onBlur={this.onBlur}
                  onChange={this.onChange}
                  onFocus={this.onFocus}
                  underlineShow={isHovered || isFocused}
                />
              }
            </div>
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
    icon: PropTypes.element,
    readOnly: PropTypes.bool,
    title: PropTypes.string
};

export default ColumnHeader;

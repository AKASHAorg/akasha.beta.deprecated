import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Popover } from 'antd';
import { SendTipForm } from '../';

class TipPopover extends Component {
    state = {
        visible: false
    };
    wasVisible = false;


    onVisibleChange = (visible) => {
        const { disabled } = this.props;
        this.wasVisible = true;
        if (!disabled) {
            this.setState({
                visible
            });
        }
    };

    render () {
        const { children, containerRef, profile } = this.props;

        return (
          <Popover
            content={this.wasVisible ?
              <SendTipForm profile={profile} /> :
              null
            }
            getPopupContainer={() => containerRef || document.body}
            onVisibleChange={this.onVisibleChange}
            placement="bottomLeft"
            trigger="click"
            visible={this.state.visible}
          >
            {children}
          </Popover>
        );
    }
}

TipPopover.propTypes = {
    children: PropTypes.node.isRequired,
    containerRef: PropTypes.shape(),
    disabled: PropTypes.bool,
    profile: PropTypes.shape().isRequired,
};

export default TipPopover;

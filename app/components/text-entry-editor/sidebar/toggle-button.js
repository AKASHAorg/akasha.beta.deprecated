import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'antd';

const ToggleButton = (props) => {
    const style = {
        opacity: 1,
        padding: 0,
        width: 32,
        height: 32,
        border: '1px solid #444',
        borderRadius: '50%',
        color: '#444',
    };
    // if (props.open || props.isVisible) {
    //     style.opacity = 1;
    //     style.visibility = 'visible';
    // }
    return (
        <Button
            type="button"
            style={ style }
            onClick={ (ev) => {
                ev.stopPropagation();
                props.toggle(ev);
            } }
            shape="circle"
            ghost
            icon="plus"
        />
    );
};
ToggleButton.propTypes = {
    open: PropTypes.bool,
    isVisible: PropTypes.bool,
    toggle: PropTypes.func
};

export default ToggleButton;

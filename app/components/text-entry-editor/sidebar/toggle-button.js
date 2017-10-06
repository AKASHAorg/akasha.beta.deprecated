import PropTypes from 'prop-types';
import React from 'react';
import { IconButton } from 'material-ui';
import AddCircle from 'material-ui/svg-icons/content/add';

const ToggleButton = (props) => {
    const style = {
        opacity: 0,
        visibility: 'hidden',
        padding: 0,
        width: 32,
        height: 32,
        border: '1px solid #444',
        borderRadius: '50%',
    };
    if (props.open || props.isVisible) {
        style.opacity = 1;
        style.visibility = 'visible';
    }
    return (
      <IconButton
        type="button"
        style={style}
        iconStyle={{ transform: `rotate(${props.open ? '135deg' : '0deg'})` }}
        onClick={props.toggle}
      >
        <AddCircle />
      </IconButton>
    );
};
ToggleButton.propTypes = {
    open: PropTypes.bool,
    isVisible: PropTypes.bool,
    toggle: PropTypes.func
};

export default ToggleButton;

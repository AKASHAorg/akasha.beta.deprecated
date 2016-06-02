import React, { PropTypes } from 'react';
import { IconButton } from 'material-ui';
import radium from 'radium';


function CircleIcon ({ children, disabled, tooltip, onClick }) {
    const style = {
        marginTop: '16px',
        boxShadow: 'none',
        width: '36px',
        height: '36px',
        padding: 0,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'rgba(0, 0, 0, 0.117647)',
        ':hover': {
            borderColor: '#EEE'
        },
        borderRadius: '50%'
    };
    return (
        <IconButton
          tooltip = {tooltip}
          style={style}
          disabled = {disabled}
          iconStyle={{ width: '32px', height: '32px', fill: '#000' }}
          backgroundColor="rgba(0,0,0,0)"
          onClick = {onClick}
        >
            {children}
        </IconButton>
    );
}


CircleIcon.propTypes = {
    children: PropTypes.element,
    disabled: PropTypes.bool,
    tooltip: PropTypes.string,
    onClick: PropTypes.func
};


export default radium(CircleIcon);

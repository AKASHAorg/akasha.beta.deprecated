import React, { PropTypes, Component } from 'react';

const SideBarIcon = ({ children, handleClick, isActive, title }, { muiTheme }) => (
    <div style={{ position: 'relative' }} >
      <div
        className="sidebar-icon"
        style={{
            position: 'absolute',
            top: '13px',
            left: '-3px',
            width: '42px',
            height: '42px',
            borderWidth: isActive ? '1px' : null,
            borderStyle: 'solid',
            borderRadius: '50%',
            borderColor: muiTheme.palette.primary1Color,
            zIndex: '999'
        }}
        onClick={handleClick}
        title={title}
      />
      {children}
    </div>
);

SideBarIcon.propTypes = {
    children: PropTypes.element,
    handleClick: PropTypes.func,
    isActive: PropTypes.bool,
    title: PropTypes.string
};

SideBarIcon.contextTypes = {
    muiTheme: PropTypes.shape()
};

export default SideBarIcon;

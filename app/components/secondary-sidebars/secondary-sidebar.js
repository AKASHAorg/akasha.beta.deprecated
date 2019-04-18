import PropTypes from 'prop-types';
import React from 'react';

const SecondarySidebar = props => (
    <div
        className={ `secondary-sidebar secondary-sidebar${ props.shown ? '_open' : '' }` }
    >
        { props.children }
    </div>
);

SecondarySidebar.contextTypes = {
    muiTheme: PropTypes.shape()
};

SecondarySidebar.propTypes = {
    children: PropTypes.node,
    shown: PropTypes.bool
};

export default SecondarySidebar;

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class SvgIcon extends PureComponent {
    render () {
        const { children, style, viewBox, color } = this.props;
        const mergedStyles = Object.assign({
            color,
            height: 24,
            width: 24,
        }, style);

        return (
          <svg
            style={mergedStyles}
            className="svg-icon-root"
            viewBox={viewBox}
          >
            {children}
          </svg>
        );
    }
}

SvgIcon.defaultProps = {
    viewBox: '0 0 36 36',
};

SvgIcon.propTypes = {
    children: PropTypes.node,
    color: PropTypes.string,
    hoverColor: PropTypes.string,
    style: PropTypes.shape(),
    viewBox: PropTypes.string
};

export default SvgIcon;

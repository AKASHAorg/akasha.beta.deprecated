import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class SvgIcon extends PureComponent {
    render () {
        const { children, style, viewBox, color, className, height, width } = this.props;
        const mergedStyles = Object.assign({
            color,
            height,
            width,
        }, style);

        return (
            <svg
                style={ mergedStyles }
                className={ `svg-icon-root ${ className }` }
                viewBox={ viewBox }
            >
                { children }
            </svg>
        );
    }
}

SvgIcon.defaultProps = {
    viewBox: '0 0 36 36',
    height: 24,
    width: 24
};

SvgIcon.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    color: PropTypes.string,
    style: PropTypes.shape(),
    viewBox: PropTypes.string
};

export default SvgIcon;

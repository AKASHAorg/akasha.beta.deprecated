import PropTypes from 'prop-types';
import React from 'react';
import { autoPrefix, transitions } from 'material-ui/styles';

function getRelativeValue (value, min, max) {
    const clampedValue = Math.min(Math.max(min, value), max);
    const rangeValue = max - min;
    const relValue = Math.round((clampedValue / rangeValue) * 10000) / 10000;
    return relValue * 100;
}

function getStyles (props, context) {
    const {
        max,
        min,
        size,
        value
    } = props;

    const { palette } = context.muiTheme;

    const zoom = size * 1.3;
    const baseSize = 32;
    let margin = Math.round(((32 * zoom) - 32) / 2);

    if (margin < 0) margin = 0;

    const styles = {
        root: {
            position: 'relative',
            display: 'inline-block',
            width: baseSize,
            height: baseSize
        },

        wrapper: {
            width: baseSize,
            height: baseSize,
            margin: 'auto',
            display: 'inline-block',
            transition: transitions.create('transform', '20s', null, 'linear'),
            transitionTimingFunction: 'linear'
        },

        svg: {
            height: baseSize,
            position: 'relative',
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
            width: baseSize
        },

        path: {
            strokeDasharray: '89,200',
            strokeDashoffset: 0,
            stroke: props.color || palette.primary1Color,
            strokeLinecap: 'round',
            transition: transitions.create('all', '1.5s', null, 'ease-in-out')
        },
    };

    if (props.mode === 'determinate') {
        const relVal = getRelativeValue(value, min, max);
        styles.path.transition = transitions.create('all', '0.3s', null, 'linear');
        styles.path.strokeDasharray = `${Math.round(relVal * 0.92)},200`;
    }

    return styles;
}
class CircularProgress extends React.Component {
    constructor (props) {
        super(props);

        this.scalePathTimer = undefined;
        this.rotateWrapperTimer = undefined;
    }
    componentDidMount () {
        this._scalePath(this.path);
        this._rotateWrapper(this.wrapper);
    }

    componentWillUnmount () {
        clearTimeout(this.scalePathTimer);
        clearTimeout(this.rotateWrapperTimer);
    }

    getWrapperRef = el => (this.wrapper = el);
    getPathRef = el => (this.path = el);

    _scalePath (path, step) {
        if (this.props.mode !== 'indeterminate') return;

        step = step || 0;
        step %= 3;

        if (step === 0) {
            path.style.strokeDasharray = '1, 200';
            path.style.strokeDashoffset = 0;
            path.style.transitionDuration = '0ms';
        } else if (step === 1) {
            path.style.strokeDasharray = '89, 200';
            path.style.strokeDashoffset = -35;
            path.style.transitionDuration = '750ms';
        } else {
            path.style.strokeDasharray = '89,200';
            path.style.strokeDashoffset = -124;
            path.style.transitionDuration = '850ms';
        }

        this.scalePathTimer = setTimeout(() => this._scalePath(path, step + 1), step ? 750 : 250);
    }

    _rotateWrapper (wrapper) {
        if (this.props.mode !== 'indeterminate') return;

        autoPrefix.set(wrapper.style, 'transform', 'rotate(0deg)', this.context.muiTheme);
        autoPrefix.set(wrapper.style, 'transitionDuration', '0ms', this.context.muiTheme);

        setTimeout(() => {
            autoPrefix.set(wrapper.style, 'transform', 'rotate(1800deg)', this.context.muiTheme);
            autoPrefix.set(wrapper.style, 'transitionDuration', '10s', this.context.muiTheme);
            autoPrefix.set(
                wrapper.style,
                'transitionTimingFunction',
                'linear',
                this.context.muiTheme
            );
        }, 50);

        this.rotateWrapperTimer = setTimeout(() => this._rotateWrapper(wrapper), 10050);
    }

    render () {
        const {
            style,
            innerStyle,
            children,
            maskStyle,
            strokeWidth,
            radius,
            ...other,
        } = this.props;

        const { prepareStyles, palette } = this.context.muiTheme;
        const styles = getStyles(this.props, this.context);
        const defaultMaskStyle = {
            stroke: palette.disabledColor,
            opacity: 0.6,
            strokeDasharray: '95, 200'
        };

        return (
          <div {...other} style={prepareStyles(Object.assign(styles.root, style))} >
            <div ref={this.getWrapperRef} style={prepareStyles(Object.assign(styles.wrapper, innerStyle))} >
              <svg style={prepareStyles(styles.svg)} >
                {children}
                <circle
                  ref={this.getPathRef}
                  style={maskStyle || defaultMaskStyle}
                  cx="16"
                  cy="16"
                  r={radius}
                  fill="none"
                  strokeWidth={strokeWidth}
                  strokeMiterlimit="10"
                />
                <circle
                  ref={this.getPathRef}
                  style={prepareStyles(styles.path)}
                  cx="16"
                  cy="16"
                  r={radius}
                  fill="none"
                  strokeWidth={strokeWidth}
                  strokeMiterlimit="10"
                />
              </svg>
            </div>
          </div>
        );
    }
}
CircularProgress.defaultProps = {
    mode: 'indeterminate',
    value: 0,
    min: 0,
    max: 100,
    radius: '15',
    size: 1,
    strokeWidth: 1.5
};
CircularProgress.propTypes = {
    /**
     * Override the progress's color.
     */
    color: PropTypes.string,

    /**
     * Style for inner wrapper div.
     */
    innerStyle: PropTypes.object,

    maskStyle: PropTypes.object,

    /**
     * The max value of progress, only works in determinate mode.
     */
    max: PropTypes.number,

    /**
     * The min value of progress, only works in determinate mode.
     */
    min: PropTypes.number,

    /**
     * The mode of show your progress, indeterminate
     * for when there is no value for progress.
     */
    mode: PropTypes.oneOf(['determinate', 'indeterminate']),

    radius: PropTypes.string,

    /**
     * The size of the progress.
     */
    size: PropTypes.number,

    /**
     * Width of the progress line
     */
    strokeWidth: PropTypes.number,

    /**
     * Override the inline-styles of the root element.
     */
    style: PropTypes.object,

    /**
     * The value of progress, only works in determinate mode.
     */
    value: PropTypes.number,
    children: PropTypes.node
};
CircularProgress.contextTypes = {
    muiTheme: PropTypes.object
};
CircularProgress.childContextTypes = {
    muiTheme: PropTypes.object
};
export default CircularProgress;

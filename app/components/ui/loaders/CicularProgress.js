import React from 'react';
import autoPrefix from 'material-ui/lib/styles/auto-prefix';
import Transitions from 'material-ui/lib/styles/transitions';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';


function getRelativeValue (value, min, max) {
  const clampedValue = Math.min(Math.max(min, value), max);
  const rangeValue = max - min;
  const relValue = Math.round(clampedValue / rangeValue * 10000) / 10000;
  return relValue * 100;
}

function getStyles (props, state) {
  const {
    max,
    min,
    size,
    value
  } = props;

  const {
    baseTheme: {
      palette
    }
  } = state.muiTheme;

  const zoom = size * 1.3;
  const baseSize = 32;
  let margin = Math.round(((32 * zoom) - 32) / 2);

  if (margin < 0) margin = 0;

  let styles = {
    root: {
      position: 'relative',
      margin: '13% auto',
      display: 'inline-block',
      width: baseSize,
      height: baseSize
    },

    wrapper: {
      width: baseSize,
      height: baseSize,
      margin: 'auto',
      display: 'inline-block',
      transition: Transitions.create('transform', '20s', null, 'linear'),
      transitionTimingFunction: 'linear'
    },

    svg: {
      height: baseSize,
      position: 'relative',
      transform: `scale(${zoom})`,
      width: baseSize
    },

    path: {
      strokeDasharray: '89,200',
      strokeDashoffset: 0,
      stroke: props.color || palette.primary1Color,
      strokeLinecap: 'round',
      transition: Transitions.create('all', '1.5s', null, 'ease-in-out')
    },
  };

  if (props.mode === 'determinate') {
    const relVal = getRelativeValue(value, min, max);
    styles.path.transition = Transitions.create('all', '0.3s', null, 'linear');
    styles.path.strokeDasharray = `${Math.round(relVal * 0.92)},200`;
  }

  return styles;
}

const CircularProgress = React.createClass({

  propTypes: {

    /**
     * Override the progress's color.
     */
    color: React.PropTypes.string,

    /**
     * Style for inner wrapper div.
     */
    innerStyle: React.PropTypes.object,

    maskStyle: React.PropTypes.object,

    /**
     * The max value of progress, only works in determinate mode.
     */
    max: React.PropTypes.number,

    /**
     * The min value of progress, only works in determinate mode.
     */
    min: React.PropTypes.number,

    /**
     * The mode of show your progress, indeterminate
     * for when there is no value for progress.
     */
    mode: React.PropTypes.oneOf(['determinate', 'indeterminate']),

    radius: React.PropTypes.string,

    /**
     * The size of the progress.
     */
    size: React.PropTypes.number,

    /**
     * Width of the progress line
     */
    strokeWidth: React.PropTypes.number,

    /**
     * Override the inline-styles of the root element.
     */
    style: React.PropTypes.object,

    /**
     * The value of progress, only works in determinate mode.
     */
    value: React.PropTypes.number
  },

  contextTypes: {
    muiTheme: React.PropTypes.object
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object
  },

  getDefaultProps () {
    return {
      mode: 'indeterminate',
      value: 0,
      maskStyle: { stroke: "rgba(0, 0, 0, 0.15)", strokeDasharray: "95, 200" },
      min: 0,
      max: 100,
      radius: "15",
      size: 1,
      strokeWidth: 1.5
    };
  },

  getInitialState () {
    return {
      muiTheme: this.context.muiTheme || getMuiTheme()
    };
  },

  getChildContext () {
    return {
      muiTheme: this.state.muiTheme
    };
  },

  componentDidMount () {
    this._scalePath(this.refs.path);
    this._rotateWrapper(this.refs.wrapper);
  },

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      muiTheme: nextContext.muiTheme || this.state.muiTheme
    });
  },

  componentWillUnmount () {
    clearTimeout(this.scalePathTimer);
    clearTimeout(this.rotateWrapperTimer);
  },

  scalePathTimer: undefined,
  rotateWrapperTimer: undefined,

  _scalePath(path, step) {
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
  },

  _rotateWrapper (wrapper) {
    if (this.props.mode !== 'indeterminate') return;

    autoPrefix.set(wrapper.style, 'transform', 'rotate(0deg)', this.state.muiTheme);
    autoPrefix.set(wrapper.style, 'transitionDuration', '0ms', this.state.muiTheme);

    setTimeout(() => {
      autoPrefix.set(wrapper.style, 'transform', 'rotate(1800deg)', this.state.muiTheme);
      autoPrefix.set(wrapper.style, 'transitionDuration', '10s', this.state.muiTheme);
      autoPrefix.set(wrapper.style, 'transitionTimingFunction', 'linear', this.state.muiTheme);
    }, 50);

    this.rotateWrapperTimer = setTimeout(() => this._rotateWrapper(wrapper), 10050);
  },

  render () {
    let {
      style,
      innerStyle,
      maskStyle,
      size,
      strokeWidth,
      children,
      radius,
      ...other,
    } = this.props;

    const {
      prepareStyles,
    } = this.state.muiTheme;

    const styles = getStyles(this.props, this.state);

    return (
      <div {...other} style={prepareStyles(Object.assign(styles.root, style))} >
        <div ref="wrapper" style={prepareStyles(Object.assign(styles.wrapper, innerStyle))} >
          <svg style={prepareStyles(styles.svg)} >
            {children}
            <circle
              ref="path" style={maskStyle} cx="16"
              cy="16" r={radius} fill="none"
              strokeWidth={strokeWidth} strokeMiterlimit="10"
            />
            <circle
              ref="path" style={prepareStyles(styles.path)} cx="16"
              cy="16" r={radius} fill="none"
              strokeWidth={strokeWidth} strokeMiterlimit="10"
            />
          </svg>
        </div>
      </div>
    );
  }
});

export default CircularProgress;


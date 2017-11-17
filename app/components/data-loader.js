import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Spin } from 'antd';

class DataLoader extends Component {
    constructor (props) {
        super(props);

        this.timeout = null;
        this.state = {
            loading: props.timeout ? true : props.flag,
            timeoutExpired: !props.timeout
        };
    }

    componentDidMount () {
        const { timeout } = this.props;
        if (timeout) {
            this.timeout = setTimeout(() => { this.updateLoadingState(); }, timeout);
        }
    }

    componentWillReceiveProps (nextProps) {
        const { flag, timeout } = nextProps;
        const { loading, timeoutExpired } = this.state;
        if (flag && !this.props.flag) {
            clearTimeout(this.timeout);
            this.setState({
                loading: flag,
                timeoutExpired: !timeout
            });
            if (timeout) {
                this.timeout = setTimeout(() => { this.updateLoadingState(); }, timeout);
            }
        } else if ((!timeout || timeoutExpired) && loading !== flag) {
            this.setState({
                loading: flag
            });
        }
    }

    componentWillUnmount () {
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
    }

    updateLoadingState = () => {
        this.setState({
            loading: this.props.flag,
            timeoutExpired: true
        });
    };

    render () {
        const { size, style, message, className } = this.props;
        if (this.state.loading) {
            const innerClassName = size ? `data-loader__inner_${size}` : 'data-loader__inner';
            return (
              <div className={`data-loader ${className || ''}`} style={style}>
                <div className={innerClassName}>
                  <Spin size={size} />
                </div>
                {message &&
                  <div className="data-loader__message">
                    {message}
                  </div>
                }
              </div>
            );
        }
        return this.props.children;
    }
}

DataLoader.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    flag: PropTypes.bool,
    message: PropTypes.oneOfType([PropTypes.shape(), PropTypes.string]),
    timeout: PropTypes.number,
    size: PropTypes.string,
    style: PropTypes.shape()
};

DataLoader.defaultProps = {
    size: 'default'
};

export default DataLoader;

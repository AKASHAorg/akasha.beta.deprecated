import React, { Component, PropTypes } from 'react';
import { RefreshIndicator } from 'material-ui';

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
        } else if ((!timeout || timeoutExpired) && loading !== flag ) {
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
    }

    render () {
        const { size, style } = this.props;
        if (this.state.loading) {
            return (<div
              style={Object.assign({
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center'
              }, style)}
            >
              <div style={{ position: 'relative', width: size, height: size }}>
                <RefreshIndicator
                  top={0}
                  left={0}
                  size={size}
                  status="loading"
                />
              </div>
            </div>);
        }
        return this.props.children;
    }
}

DataLoader.propTypes = {
    flag: PropTypes.bool,
    timeout: PropTypes.number,
    size: PropTypes.number,
    style: PropTypes.shape()
};

DataLoader.defaultProps = {
    size: 50
};

export default DataLoader;
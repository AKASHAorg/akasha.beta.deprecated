import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Button } from 'antd';

class AppErrorBoundary extends Component {
    state = {
        errors: {}
    }
    componentDidCatch (err, compStack) {
        this.setState({
            errors: {
                error: err,
                stack: compStack
            }
        });
    }
    render () {
        const { errors } = this.state;
        if (errors.error || errors.stack) {
            return (
              <div>
                <h2>
                  Ah snap! Something went terribly wrong!
                </h2>
                <h4>Error info:</h4>
                <div
                  style={{
                    maxHeight: 350,
                    overflowY: 'auto',
                    maxWidth: '50%',
                    backgroundColor: '#fffff6'
                  }}
                >
                  <pre style={{ whiteSpace: 'pre-line' }}>
                    {errors.error.toString()}
                  </pre>
                  <pre style={{ whiteSpace: 'pre-line' }}>
                    {errors.stack.componentStack.toString()}
                  </pre>
                </div>
                <div>
                  <Button>
                    Reload
                  </Button>
                  <Button type="primary">
                      Report issue
                  </Button>
                  <span className="link">Copy error to clipboard</span>
                </div>
              </div>
            );
        }
        return this.props.children;
    }
}

AppErrorBoundary.propTypes = {
    children: PropTypes.node
};

export default AppErrorBoundary;

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button } from 'antd';
import { errorMessages, generalMessages } from '../../locale-data/messages';

class AppErrorBoundary extends Component {
    state = {
        error: null,
        stack: null
    };
    componentDidCatch (err, compStack) {
        this.setState({
            error: err,
            stack: compStack
        });
    }

    onCopy = () => {
        const { showNotification } = this.props;
        const { error, stack } = this.state;
        const textArea = document.createElement('textarea');
        const code = '```';
        textArea.value = `${code}\n${error.toString()}${stack.componentStack.toString()}\n${code}`;
        textArea.style.position = 'fixed';
        textArea.style.top = -99999;
        textArea.style.left = -99999;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification({
            id: 'errorCopiedToClipboard',
            duration: 2
        });
    };

    render () {
        const { children, intl, reloadPage } = this.props;
        const { error, stack } = this.state;
        if (error || stack) {
            return (
              <div className="app-error-boundary">
                <div className="app-error-boundary__title">
                  {intl.formatMessage(errorMessages.appErrorTitle)}
                </div>
                <div className="app-error-boundary__subtitle">
                  {intl.formatMessage(errorMessages.appErrorSubtitle)}
                </div>
                <div className="app-error-boundary__error-block-wrapper">                
                  <div className="app-error-boundary__error-block">
                    <pre style={{ whiteSpace: 'pre-line' }}>
                      {error.toString()}
                    </pre>
                    <pre style={{ whiteSpace: 'pre-line' }}>
                      {stack.componentStack.toString()}
                    </pre>
                  </div>
                </div>
                <div className="app-error-boundary__buttons-container">
                  <div className="app-error-boundary__copy-error" >
                    <span className="content-link flex-center-y" onClick={this.onCopy}>
                      {intl.formatMessage(errorMessages.copyError)}
                    </span>
                  </div>
                  <Button className="app-error-boundary__button" onClick={reloadPage}>
                    {intl.formatMessage(generalMessages.reload)}
                  </Button>
                  <Button className="app-error-boundary__button" type="primary">
                    <a className="unstyled-link" href="https://github.com/AkashaProject/dapp/issues">
                      {intl.formatMessage(generalMessages.reportIssue)}
                    </a>
                  </Button>
                </div>`
              </div>
            );
        }
        return children;
    }
}

AppErrorBoundary.propTypes = {
    children: PropTypes.node,
    intl: PropTypes.shape().isRequired,
    reloadPage: PropTypes.func.isRequired,
    showNotification: PropTypes.func.isRequired,
};

export default injectIntl(AppErrorBoundary);

import React from 'react';
import PropTypes from 'prop-types';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import BugReportIcon from 'material-ui/svg-icons/action/bug-report';
import { errorMessages } from '../../locale-data/messages';
import styles from './error-reporting-modal.scss';

const formatError = (error) => {
    const errString = JSON.stringify(error.toJS(), null, 2);
    return errString;
};
const onErrorCopy = (error) => {
    const textarea = document.createElement('textarea');
    textarea.style.height = 0;
    textarea.style.width = 0;
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    textarea.value = `\`\`\`js\n${error}\n\`\`\``;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
};

const ErrorReportingModal = ({ intl, open, onClose, error }) =>
  <Dialog
    autoScrollBodyContent
    title={
      <div>
        <BugReportIcon
          className={`${styles.bugIcon}`}
        />
        <div className={`${styles.titleText}`}>
          {intl.formatMessage(errorMessages.reportErrorTitle)}
        </div>
      </div>
    }
    titleClassName={`${styles.rootTitle}`}
    open={open}
    actions={
      <FlatButton
        primary
        label="Copy and Close"
        onClick={() => {
            onErrorCopy(formatError(error));
            if (typeof onClose === 'function') {
                onClose();
            }
        }}
      />
    }
    actionsContainerStyle={{ marginTop: 0 }}
  >
    <div className="row">
      <div className="col-xs-12">
        <h3>{intl.formatMessage(errorMessages.thankYouForYourFeedback)}</h3>
        <p>
          {intl.formatMessage(errorMessages.copyTheFollowingLines, {
              githubLink: <a href="https://github.com/AkashaProject/Alpha/issues" rel="noopener noreferrer" target="_blank">GitHub</a>
          })}
        </p>
        <p>{intl.formatMessage(errorMessages.alsoCheckForOpenedIssues)}</p>
      </div>
    </div>
    <div className="row">
      <div className={`${styles.codeBlock} col-xs-12`}>
        <code className={`${styles.code}`}>
          {`\`\`\`js\n${formatError(error)}\n\`\`\``}
        </code>
      </div>
    </div>
  </Dialog>;

ErrorReportingModal.propTypes = {
    error: PropTypes.shape(),
    intl: PropTypes.shape(),
    onClose: PropTypes.func,
    open: PropTypes.bool
};

export default ErrorReportingModal;

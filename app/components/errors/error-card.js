import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import SvgIcon from 'material-ui/SvgIcon';
import WarnIcon from 'material-ui/svg-icons/alert/warning';
import ErrorIcon from 'material-ui/svg-icons/alert/error';
import styles from './error-card.scss';

const ErrorCard = props =>
  <Paper className={`row ${styles.root} middle-xs`}>
    <div className={`col-xs-2 ${styles.icon}`}>
      <SvgIcon>
        {props.error.fatal &&
          <ErrorIcon color="red" />
        }
        {!props.error.fatal &&
          <WarnIcon color="yellow" />
        }
      </SvgIcon>
    </div>
    <div className="col-xs-6 start-xs">
      <div className={`${styles.errorMessage}`}>
        {props.error.message}
      </div>
    </div>
    <div className="col-xs-4 end-xs">
      {props.action &&
        props.action
      }
      {!props.action && /** default action */
        <FlatButton
          label={'Report'}
          onClick={() => {
              if (typeof props.onReport === 'function') {
                  props.onReport(props.error.id);
              }
          }}
        />
      }
    </div>
  </Paper>;

ErrorCard.propTypes = {
    error: PropTypes.shape(),
    /**
     * action can be any react element
     * button, details tooltip, etc.
     */
    action: PropTypes.node,
    /**
     * what happens when user reports an error?
     */
    onReport: PropTypes.func,
};

export default ErrorCard;

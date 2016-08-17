import React from 'react';
import { Paper, RaisedButton } from 'material-ui';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import InfoIcon from 'material-ui/svg-icons/action/info-outline';

const NotificationPaper = (props) => {
    return (
      <div className="col-xs-12 center-xs">
        <div className="row center-xs">
          <Paper className="col-xs-6" >
            <div className="row middle-xs">
              <div className="col-xs-1 center-xs">
                  {props.isWarning &&
                    <WarningIcon style={{ fill: '#d80000', width: 32, height: 32 }} />
                  }
                  {!props.isWarning &&
                    <InfoIcon style={{ fill: '#03a9f4', width: 32, height: 32 }} />
                  }
              </div>
              <div className="col-xs-7" style={{marginBottom: 16}}>
                <p style={{marginBottom: 0}}>{props.message}</p>
                <small>{props.messageDetails}</small>
              </div>
              <div className="col-xs-4 end-xs">
                {props.cancelable &&
                    <RaisedButton
                      label={props.cancelLabel}
                      style={{marginRight: '8px'}}
                      onTouchTap={(ev) => props.onCancel(ev)}
                    />
                }
                <RaisedButton label={props.acceptLabel} primary />
              </div>
            </div>
          </Paper>
        </div>
      </div>
    );
};
NotificationPaper.defaultProps = {
    cancelable: true,
    isWarning: false,
    acceptLabel: 'Accept',
    cancelLabel: 'Cancel'
};
NotificationPaper.propTypes = {
    message: React.PropTypes.string,
    cancelable: React.PropTypes.bool,
    isWarning: React.PropTypes.bool,
    onCancel: React.PropTypes.func,
    onAccept: React.PropTypes.func,
    acceptLabel: React.PropTypes.string,
    cancelLabel: React.PropTypes.string
};
export default NotificationPaper;

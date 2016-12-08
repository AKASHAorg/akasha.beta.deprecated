import React, { Component } from 'react';
import { RaisedButton } from 'material-ui';
import { injectIntl } from 'react-intl';
import PanelHeader from '../components/setup-header';

class GethError extends Component {

    render () {
        const { style, settingsState, gethLogs } = this.props;
        const logListStyle = {
            maxHeight: 500,
            overflowY: 'scroll',
            paddingLeft: 4,
            overflowX: 'hidden',
            fontFamily: 'Consolas',
            backgroundColor: 'rgba(0,0,0,0.02)'
        };
        return (
          <div style={style}>
            <div className="start-xs">
              <div
                className="col-xs"
                style={{ flex: 1, padding: 0 }}
              >
                <PanelHeader />
                {settingsState.get('isAdvanced') &&
                <div style={{ marginTop: '24px' }}>
                          Geth cannot start with your submitted configuration
                          <h4>Configuration:</h4>
                  {Object.keys(settingsState.get('geth').toJS()).map(key => (
                    <p key={key}>
                      <b>{key}: </b>
                      <b>{settingsState.get('geth').toJS()[key]}</b>
                    </p>
                            ))}
                </div>
                      }
                {!settingsState.get('isAdvanced') &&
                <div>
                          Ouch, Geth cannot start!
                        </div>
                      }
                <div>Logs:</div>
                <div>
                  <ul style={logListStyle}>
                    {gethLogs.map((log, key) => (
                      <li key={key} style={{ marginBottom: '8px' }}>
                        <abbr title="Log Level">{log.level}</abbr>
                        <span> {new Date(log.timestamp).toLocaleString()} =></span>
                        <p>{log.message}</p>
                      </li>
                        ))}
                  </ul>
                </div>
                <div>
                  <RaisedButton label="Retry" onClick={this._retrySetup} />
                  <RaisedButton label="Send Report" onClick={this._sendReport} />
                </div>
              </div>
            </div>
          </div>
        );
    }
}
GethError.propTypes = {
    style: React.PropTypes.shape(),
    settingsState: React.PropTypes.shape(),
    gethLogs: React.PropTypes.shape()
};

export default injectIntl(GethError);

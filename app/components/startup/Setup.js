import React, { Component, PropTypes } from 'react';
import LoginHeader from '../../components/ui/partials/LoginHeader';
import * as Colors from 'material-ui/lib/styles/colors';
import RadioButton from 'material-ui/lib/radio-button';
import RadioButtonGroup from 'material-ui/lib/radio-button-group';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';
import Checkbox from 'material-ui/lib/checkbox';
import {hashHistory} from 'react-router';

import { Scrollbars } from 'react-custom-scrollbars';

class Setup extends Component {

  constructor (props, context) {
    super(props, context);
  }

  handleChange = (event, value)=> {
    const {actions, setupConfig} = this.props;
    const show = 'advanced' === value;
    if (setupConfig.get('toggleAdvanced') === show) {
      return;
    }
    actions.toggleAdvanced(show);
  };

  handleGethDatadir = (event)=> {
    const {actions, setupConfig} = this.props;
    const target         = event.target;
    const currentDatadir = setupConfig.get('gethPath');
    if (currentDatadir === target.value || !target.value) {
      return;
    }
    actions.setupGeth(target.value);
  };

  handleGethIpc = (event)=> {
    const {actions, setupConfig} = this.props;
    const target         = event.target;
    const currentIpcPath = setupConfig.get('gethPathIpc');
    if (currentIpcPath === target.value || !target.value) {
      return;
    }
    actions.setGethIpc(target.value);
  };

  handleIpfsPath = (event)=> {
    const {actions, setupConfig} = this.props;
    const target         = event.target;
    const currentIpfsApi = setupConfig.get('ipfsApiPath');
    if (currentIpfsApi === target.value || !target.value) {
      return;
    }
    actions.setupIPFS(target.value);

  };

  /**
   *
   * @param event
   */
  handleSubmit = (event)=> {
    const {actions, setupConfig} = this.props;

    if (!setupConfig.get('toggleAdvanced')) {
      actions.defaultOptions();
    }
    actions.submitOptions();
    hashHistory.push('sync-status');
  };

  render () {
    let advancedOptions      = '';
    const {style, setupConfig} = this.props;
    const radioStyle         = {marginTop: '10px', marginBottom: '10px'};
    const buttonsStyle       = {padding: 0, position: 'absolute', bottom: 0, right: 0};
    const errorStyle         = {color: Colors.minBlack};
    const floatingLabelStyle = {color: Colors.lightBlack};
    const inputStyle         = {color: Colors.darkBlack};
    const rootStyle          = {width: '400px'};

    const defaultSelected = (!setupConfig.get('toggleAdvanced')) ? 'express' : 'advanced';

    if (setupConfig.get('toggleAdvanced')) {
      advancedOptions = (
        <div style={{paddingLeft: '12px'}}>
          <TextField
            errorStyle={errorStyle}
            errorText={"Change this if geth has different data directory"}
            floatingLabelStyle={floatingLabelStyle}
            floatingLabelText="Geth Datadir path"
            hintText={setupConfig.get('gethPath')}
            inputStyle={inputStyle}
            onBlur={this.handleGethDatadir}
            style={rootStyle}

          />
          <TextField
            errorStyle={errorStyle}
            errorText={"Change this if geth is already started with --ipcpath"}
            floatingLabelStyle={floatingLabelStyle}
            floatingLabelText="Geth ipc path"
            hintText={setupConfig.get('gethPathIpc')}
            inputStyle={inputStyle}
            onBlur={this.handleGethIpc}
            style={rootStyle}
          />
          <TextField
            errorStyle={errorStyle}
            errorText={"Change this if ipfs daemon is already running"}
            floatingLabelStyle={floatingLabelStyle}
            floatingLabelText="Ipfs api path"
            hintText={setupConfig.get('ipfsApiPath')}
            inputStyle={inputStyle}
            onBlur={this.handleIpfsPath}
            style={rootStyle}
          />
        </div>
      );
    }
    return (
      <div style={style}>
        <div className="start-xs">
          <div
            className="col-xs"
            style={{flex: 1, padding: 0}}
          >
            <LoginHeader />
            <Scrollbars
              style={{ height: 540 }}
            >
              <h1 style={{fontWeight: '400'}}>{'First time setup'}</h1>
              <div>
                <p>{'AKASHA is a next-generation social blogging network powered by a new kind of world computers' +
                ' known as Ethereum and the Inter Planetary File System.'}
                </p>
                <p>
                  {'If you haven’t heard of these technologies before don’t worry, simply click next and we’ll take' +
                  ' care' + ' of the rest.'}
                </p>
                <p>
                  {'If you already have the Ethereum Go client or IPFS installed on your machine please choose the' +
                  ' advanced option.'}
                </p>
              </div>
              <div style={{paddingLeft: '12px'}}>
                <RadioButtonGroup defaultSelected={defaultSelected}
                                  name="installType"
                                  onChange={this.handleChange}
                >
                  <RadioButton
                    label={'Express setup'}
                    style={radioStyle}
                    value={'express'}
                  />
                  <RadioButton
                    label={'Advanced'}
                    style={radioStyle}
                    value={'advanced'}
                  />
                </RadioButtonGroup>
                {advancedOptions}
              </div>

            </Scrollbars>
          </div>
        </div>
        <div className="end-xs"
             style={{flex: 1}}
        >
          <div className="col-xs"
               style={buttonsStyle}
          >
            <RaisedButton label="Next"
                          primary={true}
                          style={{marginLeft: '12px'}}
                          onClick={this.handleSubmit}
            />
          </div>
        </div>
      </div>
    );
  }
}

Setup.propTypes = {
  actions:     PropTypes.object.isRequired,
  setupConfig: PropTypes.object.isRequired,
  style:       PropTypes.object
};

Setup.contextTypes = {
  muiTheme: React.PropTypes.object
};

Setup.defaultProps = {
  style: {
    width:         '100%',
    height:        '100%',
    display:       'flex',
    flexDirection: 'column',
    position:      'relative'
  }
};

export default Setup;



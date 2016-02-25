import React, { Component, PropTypes } from 'react';
import LoginHeader from '../../components/ui/partials/LoginHeader';

import RadioButton from 'material-ui/lib/radio-button';
import RadioButtonGroup from 'material-ui/lib/radio-button-group';
import RaisedButton from 'material-ui/lib/raised-button';
import TextField from 'material-ui/lib/text-field';
import Checkbox from 'material-ui/lib/checkbox';

import { Scrollbars } from 'react-custom-scrollbars';

class Setup extends Component {

  constructor (props, context) {
    super(props, context);
  }

  render () {
    const {style, actions, setupConfig} = this.props;
    const radioStyle   = {marginTop: '10px', marginBottom: '10px'};
    const buttonsStyle = {padding: 0, position: 'absolute', bottom: 0, right: 0};
    return (
      <div style={style}>
        <div className="start-xs">
          <div
            className="col-xs"
            style={{flex: 1, padding: 0}}
          >
            <LoginHeader />
            <Scrollbars autoHide
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
                <RadioButtonGroup defaultSelected="express"
                                  name="installType"
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
                <div style={{paddingLeft: '12px'}}>
                  <TextField
                    floatingLabelText="Geth Datadir path"
                    hintText={setupConfig.get('gethPath')}
                  />
                  <Checkbox
                    label="Geth already running"
                  />
                  <TextField
                    floatingLabelText="geth ipc path"
                    hintText="absolute path to geth ipc file"
                  />
                  <Checkbox
                    label="ipfs already running"
                  />
                  <TextField
                    floatingLabelText="ipfs api path"
                    hintText="http/socket path to ipfs"
                  />
                </div>
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
            <RaisedButton label="Cancel"
                          style={{marginLeft: '12px'}}
            />
            <RaisedButton label="Next"
                          primary={true}
                          style={{marginLeft: '12px'}}
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



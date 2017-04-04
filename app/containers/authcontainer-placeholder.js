import React, { Component } from 'react';
import { RaisedButton } from 'material-ui';
import PanelContainerFooter from '../components/PanelContainer/panel-container-footer';

class Auth extends Component {
    render () {
        return (
          <div className="col-xs-12">
            Profiles List
            <PanelContainerFooter >
              <RaisedButton primary label={"New Identity"} onClick={() => this.props.history.push('/new-identity')} />
            </PanelContainerFooter>
          </div>
        );
    }
}

export default Auth;

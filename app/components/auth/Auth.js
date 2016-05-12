import React, { Component } from 'react';
import { List, ListItem, Avatar, Divider, Dialog, FlatButton, TextField, RaisedButton } from 'material-ui';
import LoginHeader from '../../components/ui/partials/LoginHeader';
import { Scrollbars } from 'react-custom-scrollbars';
import { hashHistory } from 'react-router';

class Auth extends Component {

  constructor (props, context) {
    super(props, context);
    this.state = {
      openModal: false,
      selectedIndex: false,
      avatar: {}
    }
  }

  componentDidMount () {
    const { actions } = this.props;
    actions.getAccountsList();
  }

  handleTouchTap = (index) => {
    this.setState({ openModal: true });
  };

  handleModalClose = () => {
    this.setState(({ openModal: false }));
  };

  handleLogin = () => {
    const { actions } = this.props;
    actions.authenticate('0xcf5290ff9d98794fe6e30ffca512b3ed71710d85',
      this.passwordRef.getValue(), 60);//for testing
  };

  render () {
    const { style, authState } = this.props;
    const { openModal, avatar } = this.state;
    const profiles = authState.get('profiles');
    const modalActions = [
      <FlatButton label="Cancel" onTouchTap={this.handleModalClose} />,
      <FlatButton label="Submit" primary={true} onTouchTap={this.handleLogin} />
    ];
    const localProfiles = this._getLocalProfiles();

    return (
      <div style={style} >
        <div className="start-xs" >
          <div
            className="col-xs"
            style={{ flex: 1, padding: 0 }}
          >
            <LoginHeader title={'Log in'} />
            <div style={{paddingTop: '30px'}} >
              <Scrollbars style={{ height: '440px' }} >
                <List>
                  {localProfiles}
                </List>
              </Scrollbars>
            </div>
            <div style={{float: 'right'}} >
              <RaisedButton label="IMPORT IDENTITY" />
              <RaisedButton label="CREATE NEW IDENTITY"
                            primary={true} 
                            style={{marginLeft: '10px'}} 
                            onMouseUp={this._handleIdentityCreate}
              />
            </div>
            <Dialog
              title="Authentication"
              modal
              open={openModal}
              actions={modalActions}
              contentStyle={{width: '82%'}}
            >
              <Avatar>JD</Avatar>
              <TextField
                disabled
                fullWidth
                floatingLabelText="Username"
                value="gigi"
              />
              <TextField
                disabled
                fullWidth
                floatingLabelText="Ethereum address"
              />
              <TextField type="password"
                         fullWidth
                         floatingLabelText="Password"
                         ref={node => this.passwordRef=node}
              />
            </Dialog>
          </div>
        </div>
      </div>
    );
  }
  _getLocalProfiles() {
    const { authState } = this.props;
    if(!authState.get('profiles').size) {
      return <div>No profiles found. Create a new identity or import an existing one.</div>;
    }
    return authState.get('profiles').map((account, index) => {
      return (
        <div key={index} >
          <ListItem
            key={`l${index}`}
            leftAvatar={<Avatar>aa</Avatar>}
            primaryText={account.get('address')}
            secondaryText={account.get('userName')}
            secondaryTextLines={1}
            value={account.get('address')}
            onTouchTap={()=> this.handleTouchTap(index)}
          />
          <Divider key={`d${index}`} inset />
        </div>
      )
    });
  }
  _handleIdentityCreate = (ev) => {
    ev.preventDefault();
    hashHistory.push('new-profile');
  }
}

Auth.propTypes = {
  actions: React.PropTypes.object.isRequired,
  authState: React.PropTypes.object.isRequired,
  style: React.PropTypes.object
};

Auth.contextTypes = {
  muiTheme: React.PropTypes.object
};

Auth.defaultProps = {
  style: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  }
};

export default Auth;



import React, { Component } from 'react';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Avatar from 'material-ui/lib/avatar';
import LoginHeader from '../../components/ui/partials/LoginHeader';
import Divider from 'material-ui/lib/divider';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';

class Auth extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      openModal: false,
      selectedIndex: false
    }
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.getAccountsList();
  }

  handleTouchTap = (index) => {
    this.setState({openModal: true});
  };

  handleModalClose = () => {
    this.setState(({openModal: false}));
  };

  handleLogin = () => {
    const { actions } = this.props;
    actions.authenticate('0x0cf0346267f94ac3d224c6e503f96fea69ac86e3',
      this.passwordRef.getValue(), 60);//for testing
  };

  render() {
    const { style, authState } = this.props;
    const { openModal } = this.state;
    const profiles = authState.get('profiles');
    const modalActions = [
      <FlatButton label="Cancel" onTouchTap={this.handleModalClose} />,
      <FlatButton label="Submit" primary={true} onTouchTap={this.handleLogin}/>
    ];
    return (
      <div style={style}>
        <div className="start-xs">
          <div
            className="col-xs"
            style={{ flex: 1, padding: 0 }}
          >
            <LoginHeader title={'Log in'}/>
            <List>
              { profiles.map((account, index) =>
                (
                  <div key={index}>
                    <ListItem
                      key={`l${index}`}
                      leftAvatar={<Avatar>JD</Avatar>}
                      primaryText={account.get('address')}
                      secondaryText={account.get('userName')}
                      secondaryTextLines={1}
                      value={account.get('address')}
                      onTouchTap={()=> this.handleTouchTap(index)}
                    />
                    <Divider key={`d${index}`} inset/>
                  </div>
                )
              )}
            </List>
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



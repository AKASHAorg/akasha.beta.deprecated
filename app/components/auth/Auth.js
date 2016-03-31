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
  componentDidMount() {
    const { actions } = this.props;
    actions.getAccountsList();
  }

  render() {
    const { style, authState } = this.props;
    const profiles = authState.get('profiles');
    const modalActions = [
      <FlatButton label="Cancel"/>,
      <FlatButton label="Submit" primary={true}/>
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
                    />
                    <Divider key={`d${index}`} inset />
                  </div>
                )
              )}
            </List>
            <Dialog
              title="Authentication"
              modal
              open
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
                value={profiles.getIn(['0', 'address'])}
              />
              <TextField type="password"
                         fullWidth
                         floatingLabelText="Password"
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



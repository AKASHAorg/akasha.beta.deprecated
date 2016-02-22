import React, { Component, PropTypes } from 'react';
import Logo from '../ui/sidebar/IconLogo';
import Paper from 'material-ui/lib/paper';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import MenuItem from 'material-ui/lib/menus/menu-item';
import getMuiTheme from 'material-ui/lib/styles/getMuiTheme';
import Avatar from 'material-ui/lib/avatar';


export default class Setup extends Component {

  static propTypes = {
    style: PropTypes.object
  };

  static contextTypes = {
    muiTheme: React.PropTypes.object
  };

  static defaultProps = {
    style: {
      width:         '100%',
      height:        '100%',
      display:       'flex',
      flexDirection: 'column',
      position:      'relative'
    }
  };

  render () {
    const {style, ...other} = this.props;
    const { prepareStyles } = this.context.muiTheme;
    console.log(this.context);
    return (
      <div className="center-xs">
        <div
          className="col-xs"
          style={style}
        >
          <div style={{margin:0,
           paddingTop: '10px',
           paddingBottom: '10px',
           paddingLeft: '42',
           paddingRight: 0,
           lineHeight: '18px',
           fontSize: '18px'}}
          >
            <div style={prepareStyles({textAlign: 'left'})}>{'AKASHA'}</div>
            <Logo style={{width: '32px', height: '32px', position: 'absolute', left:0, top: '3px' }}/>

            <IconMenu
              iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              style={{position: 'absolute', top:'-6px', right: '-22px'}}
            >
              <MenuItem primaryText="Refresh"/>
              <MenuItem primaryText="Send feedback"/>
              <MenuItem primaryText="Settings"/>
              <MenuItem primaryText="Help"/>
              <MenuItem primaryText="Sign out"/>
            </IconMenu>
          </div>
        </div>
      </div>
    );
  }
}

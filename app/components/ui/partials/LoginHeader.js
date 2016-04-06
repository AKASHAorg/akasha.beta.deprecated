import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/lib/menus/icon-menu';
import IconButton from 'material-ui/lib/icon-button';
import MenuItem from 'material-ui/lib/menus/menu-item';
import * as Colors from 'material-ui/lib/styles/colors';
import Logo from '../sidebar/IconLogo';
import React from 'react';

const style = {
  borderBottom: `1px solid ${Colors.minBlack}`,
  margin: 0,
  paddingTop: '10px',
  paddingBottom: '10px',
  paddingLeft: '42',
  paddingRight: 0,
  lineHeight: '18px',
  fontSize: '18px'
};

function LoginHeader({ title }) {
  return (
    <div style={style}>
      <div style={{ fontWeight: '300' }}>{ title }</div>
      <Logo style={{ width: '32px', height: '32px', position: 'absolute', left: 0, top: '3px' }} />
      <IconMenu
        anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
        style={{ position: 'absolute', top: '-6px', right: '-18px' }}
        targetOrigin={{ horizontal: 'right', vertical: 'top' }}
      >
        <MenuItem primaryText="Refresh" />
        <MenuItem primaryText="Send feedback" />
        <MenuItem primaryText="Settings" />
        <MenuItem primaryText="Help" />
        <MenuItem primaryText="Sign out" />
      </IconMenu>
    </div>
  );
}

LoginHeader.contextTypes = {
  muiTheme: React.PropTypes.object
};

LoginHeader.propTypes = {
  title: React.PropTypes.string.isRequired
};

LoginHeader.defaultProps = {
  title: 'AKASHA'
};

export default LoginHeader;


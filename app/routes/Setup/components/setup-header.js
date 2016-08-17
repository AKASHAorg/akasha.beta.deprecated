import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { IconMenu, IconButton, MenuItem } from 'material-ui';
import Logo from 'shared-components/Sidebar/IconLogo';
import React from 'react';
import { generalMessages } from 'locale-data/messages';
import { injectIntl } from 'react-intl';

function SetupHeader ({ title, intl }) {
    const { formatMessage } = intl;
    return (
      <div className="col-xs-12">
        <div className="row middle-xs" >
          <Logo className="col-xs-1 start-xs" />
          <div className="col-xs-3" style={{ fontWeight: '300' }} >{title}</div>
          <div className="col-xs-8 end-xs">
            <IconMenu
              anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
              iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
              targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
              <MenuItem primaryText={formatMessage(generalMessages.refresh)} />
              <MenuItem primaryText={formatMessage(generalMessages.sendFeedback)} />
              <MenuItem primaryText={formatMessage(generalMessages.settings)} />
              <MenuItem primaryText={formatMessage(generalMessages.help)} />
              <MenuItem primaryText={formatMessage(generalMessages.signOut)} />
            </IconMenu>
          </div>
        </div>
      </div>
    );
}

SetupHeader.contextTypes = {
    muiTheme: React.PropTypes.object
};

SetupHeader.propTypes = {
    title: React.PropTypes.string.isRequired,
    intl: React.PropTypes.object
};

SetupHeader.defaultProps = {
    title: 'AKASHA'
};

export default injectIntl(SetupHeader);

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { IconMenu, IconButton, MenuItem } from 'material-ui';
import React, { PropTypes } from 'react';
import { generalMessages } from 'locale-data/messages';
import { injectIntl } from 'react-intl';
import LogoButton from '../../components/logo-button';

function LoginHeader ({ title, intl }) {
    const { formatMessage } = intl;
    const forceRefresh = () => {
        window.location.reload();
    };
    return (
      <div className="col-xs-12" >
        <div className="row middle-xs" style={{ display: 'flex' }}>
          <div style={{ flex: '0 0 auto' }}>
            <LogoButton />
          </div>
          <div style={{ fontWeight: '300', flex: '1 1 auto' }} >{ title }</div>
          <div style={{ flex: '0 0 auto' }}>
            <IconMenu
              anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
              iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
              targetOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
              <MenuItem
                primaryText={formatMessage(generalMessages.refresh)}
                onTouchTap={forceRefresh}
              />
              <MenuItem primaryText={formatMessage(generalMessages.sendFeedback)} />
              <MenuItem primaryText={formatMessage(generalMessages.settings)} />
              <MenuItem primaryText={formatMessage(generalMessages.help)} />
            </IconMenu>
          </div>
        </div>
      </div>
    );
}

LoginHeader.contextTypes = {
    muiTheme: PropTypes.object
};

LoginHeader.propTypes = {
    title: PropTypes.string.isRequired,
    intl: PropTypes.shape()
};

LoginHeader.defaultProps = {
    title: 'AKASHA'
};

export default injectIntl(LoginHeader);

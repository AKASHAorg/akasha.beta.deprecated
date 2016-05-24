import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { IconMenu, IconButton, MenuItem } from 'material-ui';
import * as Colors from 'material-ui/styles/colors';
import Logo from '../sidebar/IconLogo';
import React from 'react';
import { generalMessages } from '../../../locale-data/messages';
import { injectIntl } from 'react-intl';

const style = {
    borderBottom: `1px solid ${Colors.minBlack}`,
    margin: 0,
    paddingTop: '10px',
    paddingBottom: '10px',
    paddingLeft: '42px',
    paddingRight: 0,
    lineHeight: '18px',
    fontSize: '18px'
};

function LoginHeader ({ title, intl }) {
    const { formatMessage } = intl;
    return (
        <div style={style} >
            <div style={{ fontWeight: '300' }} >{ title }</div>
                <Logo style={{
                    width: '32px',
                    height: '32px',
                    position: 'absolute',
                    left: 0,
                    top: '3px' }}
                />
                <IconMenu
                  anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
                  iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
                  style={{ position: 'absolute', top: '-6px', right: '-18px' }}
                  targetOrigin={{ horizontal: 'right', vertical: 'top' }}
                >
                <MenuItem primaryText={formatMessage(generalMessages.refresh)} />
                <MenuItem primaryText={formatMessage(generalMessages.sendFeedback)} />
                <MenuItem primaryText={formatMessage(generalMessages.settings)} />
                <MenuItem primaryText={formatMessage(generalMessages.help)} />
                <MenuItem primaryText={formatMessage(generalMessages.signOut)} />
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

export default injectIntl(LoginHeader);


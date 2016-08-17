import React from 'react';
import * as Colors from 'material-ui/styles/colors';
import { FormattedMessage } from 'react-intl';
import { MenuAkashaLogo } from 'shared-components/svg';
import { SvgIcon } from 'material-ui';

export default function CreateProfileHeader (props) {
    return (
        <div>
          <SvgIcon
            color={Colors.lightBlack}
            viewBox="0 0 32 32"
            style={{
                width: '32px',
                height: '32px',
                marginRight: '10px',
                verticalAlign: 'middle' }}
          >
            <MenuAkashaLogo />
          </SvgIcon>
          <FormattedMessage {...props.title} />
        </div>
    )
}

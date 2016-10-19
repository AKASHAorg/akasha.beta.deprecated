import React from 'react';
import * as Colors from 'material-ui/styles/colors';
import { FormattedMessage } from 'react-intl';
import { MenuAkashaLogo } from 'shared-components/svg';
import { SvgIcon } from 'material-ui';
import LogoButton from '../../components/logo-button';

export default function CreateProfileHeader (props) {
    return (
      <div className="col-xs-12">
        <div className="row middle-xs" style={{ display: 'flex' }}>
          <div style={{ flex: '0 0 auto' }}>
            <LogoButton />
          </div>
          <div style={{ flex: '1 1 auto' }}>
            <FormattedMessage {...props.title} />
          </div>
        </div>
      </div>
    )
}

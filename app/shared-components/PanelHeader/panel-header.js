import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { LogoButton, ServiceStatusBar } from '../';
import { generalMessages } from '../../locale-data/messages';

function PanelHeader ({ disableStopService, intl, noStatusBar, noLogoButton, title }) {
    return (
      <div className="col-xs-12">
        <div className="row middle-xs" style={{ display: 'flex' }} >
          {!noLogoButton &&
            <div style={{ flex: '0 0 auto' }}>
              <LogoButton />
            </div>
          }
          <div style={{ fontWeight: '300', flex: '1 1 auto', marginLeft: '10px' }} >
            {title || intl.formatMessage(generalMessages.akasha)}
          </div>
          {!noStatusBar &&
            <div style={{ flex: '0 0 auto' }} >
              <ServiceStatusBar disableStopService={disableStopService} />
            </div>
          }
        </div>
      </div>
    );
}

PanelHeader.propTypes = {
    disableStopService: PropTypes.bool,
    intl: PropTypes.shape(),
    noStatusBar: PropTypes.bool,
    noLogoButton: PropTypes.bool,
    title: PropTypes.node.isRequired,
};

export default injectIntl(PanelHeader);

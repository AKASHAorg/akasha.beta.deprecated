import React, { PropTypes } from 'react';
import ServiceStatusBar from './service-status-bar';
import LogoButton from './logo-button';

function PanelHeader ({ title, disableStopService, noStatusBar, noLogoButton }) {
    return (
      <div className="col-xs-12">
        <div className="row middle-xs" style={{ display: 'flex' }} >
          {!noLogoButton &&
            <div style={{ flex: '0 0 auto' }}>
              <LogoButton />
            </div>
          }
          <div style={{ fontWeight: '300', flex: '1 1 auto', marginLeft: '10px' }} >{title}</div>
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
    title: PropTypes.node.isRequired,
    disableStopService: PropTypes.bool,
    noStatusBar: PropTypes.bool,
    noLogoButton: PropTypes.bool
};

PanelHeader.defaultProps = {
    title: 'AKASHA'
};

export default PanelHeader;

import React, { PropTypes } from 'react';
import ServiceStatusBar from './service-status-bar';
import LogoButton from './logo-button';

function PanelHeader ({ title, disableStopService }) {
    return (
      <div className="col-xs-12">
        <div className="row middle-xs" style={{ display: 'flex' }} >
          <div style={{ flex: '0 0 auto' }}>
            <LogoButton />
          </div>
          <div style={{ fontWeight: '300', flex: '1 1 auto' }} >{title}</div>
          <div style={{ flex: '0 0 auto' }} >
            <ServiceStatusBar disableStopService={disableStopService} />
          </div>
        </div>
      </div>
    );
}

PanelHeader.propTypes = {
    title: PropTypes.string.isRequired,
    disableStopService: PropTypes.bool
};

PanelHeader.defaultProps = {
    title: 'AKASHA'
};

export default PanelHeader;

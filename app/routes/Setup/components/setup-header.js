import React, { PropTypes } from 'react';
import ServiceStatusBar from '../../components/service-status-bar';
import LogoButton from '../../components/logo-button';

function SetupHeader ({ title }) {
    return (
      <div className="col-xs-12">
        <div className="row middle-xs" style={{ display: 'flex' }} >
          <div style={{ flex: '0 0 auto' }}>
            <LogoButton />
          </div>
          <div style={{ fontWeight: '300', flex: '1 1 auto' }} >{title}</div>
          <div style={{ flex: '0 0 auto' }} >
            <ServiceStatusBar />
          </div>
        </div>
      </div>
    );
}

SetupHeader.contextTypes = {
    muiTheme: PropTypes.object
};

SetupHeader.propTypes = {
    title: PropTypes.string.isRequired
};

SetupHeader.defaultProps = {
    title: 'AKASHA'
};

export default SetupHeader;

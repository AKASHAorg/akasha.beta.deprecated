import React, { PropTypes } from 'react';
import ServiceStatusBar from '../../components/service-status-bar';
import LogoButton from '../../components/logo-button'

function SetupHeader ({ title }) {
    return (
      <div className="col-xs-12">
        <div className="row middle-xs" >
          <LogoButton />
          <div className="col-xs-3" style={{ fontWeight: '300' }} >{title}</div>
          <div className="col-xs-8 end-xs">
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

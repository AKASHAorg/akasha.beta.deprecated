import { LogoIcon } from 'shared-components/svg';
import React, { PropTypes } from 'react';
import ServiceStatusBar from '../../components/service-status-bar';

function SetupHeader ({ title }) {
    return (
      <div className="col-xs-12">
        <div className="row middle-xs" >
          <LogoIcon className="col-xs-1 start-xs" />
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

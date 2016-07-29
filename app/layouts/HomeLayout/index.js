import React, { PropTypes } from 'react';
import SideBar from '../../shared-components/ui/sidebar';
import '../../styles/core.scss';
import PanelLoader from '../../containers/PanelLoader';

function MainLayout ({ children }) {
    return (
      <div style={{ height: '100%' }}>
        <div
          style={{ width: '64px', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 999 }}
        >
          <SideBar />
        </div>
        <div
          className="panel-loader"
          style={{ position: 'absolute', left: 64, top: 0, bottom: 0, zIndex: 990 }}
        >
          <PanelLoader />
        </div>
        <div className="col-xs-12" style={{ paddingLeft: '64px' }} >
          {children}
        </div>
      </div>
    );
}

MainLayout.propTypes = {
    children: PropTypes.element
};

export default MainLayout;

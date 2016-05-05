import React, { PropTypes } from 'react';
import SideBar from '../../components/ui/sidebar';
import '../../styles/core.scss';

function MainLayout ({ children }) {
  return (
    <div style={{height: '100%'}} className="row" >
      <div style={{height: '100%'}} className="col-xs-3" >
        <SideBar />
      </div>
      <div className="col-xs-9" >
        {children}
      </div>
    </div>
  );
}


MainLayout.propTypes = {
  children: PropTypes.element
};


export default MainLayout;

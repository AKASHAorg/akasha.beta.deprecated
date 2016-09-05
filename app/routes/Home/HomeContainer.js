import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-connect';
import { BootstrapBundleActions } from 'local-flux';
import { Sidebar } from 'shared-components';
import '../../styles/core.scss';
import styles from './home.scss';
import PanelLoader from './components/panel-loader-container';
import EntryModal from './components/entry-modal';

function HomeContainer ({ children }) {
    return (
      <div className={styles.root} >
        <div className={styles.sideBar} >
          <Sidebar />
        </div>
        <div className={styles.panelLoader} >
          <PanelLoader />
        </div>
        <EntryModal />
        <div className={`col-xs-12 ${styles.childWrapper}`} >
          {children}
        </div>
      </div>
    );
}

HomeContainer.propTypes = {
    children: PropTypes.element
};

function mapStateToProps () {
    return {};
}

function mapDispatchToProps () {
    return {};
}

export default asyncConnect([{
    promise: ({ store: { dispatch, getState } }) => {
        const bootstrapActions = new BootstrapBundleActions(dispatch);
        Promise.resolve(bootstrapActions.initHome(getState));
    }
}])(connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeContainer));

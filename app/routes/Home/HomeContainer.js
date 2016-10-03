import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { BootstrapBundleActions } from 'local-flux';
import { Sidebar } from 'shared-components';
import '../../styles/core.scss';
import styles from './home.scss';
import PanelLoader from './components/panel-loader-container';
import EntryModal from './components/entry-modal';

class HomeContainer extends React.Component {
    render () {
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
              {this.props.children}
            </div>
          </div>
        );
    }
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeContainer);

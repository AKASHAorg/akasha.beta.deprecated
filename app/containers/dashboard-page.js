import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Carousel, Modal } from 'antd';
import { Dashboard, DataLoader } from '../components';
import { toggleNewDashboardModal } from '../local-flux/actions/app-actions';
import { dashboardHideTutorial, dashboardSetActive,
    dashboardUpdateNewColumn, dashboardReorderColumn } from '../local-flux/actions/dashboard-actions';
import { appSelectors, entrySelectors, dashboardSelectors, settingsSelectors } from '../local-flux/selectors';
import { setupMessages, generalMessages } from '../locale-data/messages';

class DashboardPage extends Component {
    state = {
        carouselEnd: false,
        modalVisible: this.props.firstDashboardReady
    }

    dashboardRef = null;

    componentWillReceiveProps (nextProps) {
        if (!nextProps.activeDashboard) {
            return;
        }
        const { params } = nextProps.match;
        if (!params.dashboardId && this.props.match.params.dashboardId) {
            this.props.dashboardSetActive('');
        }
        if (params.dashboardId !== this.props.match.params.dashboardId) {
            this.props.dashboardSetActive(params.dashboardId);
        }
    }

    componentDidUpdate (prevProps) {
        if (!prevProps.newColumn && this.props.newColumn && this.dashboardRef) {
            this.dashboardRef.scrollLeft = 9999;
        }
    }

    getDashboardRef = (el) => { this.dashboardRef = el; };

    handleClose = () => {
        this.setState({ modalVisible: false });
        this.props.dashboardHideTutorial();
    }

    handleCarouselChange = (newIndex) => {
        if (newIndex === 2) {
            this.setState({ carouselEnd: true });
        }
    }

    render () {
        const { intl, columns, darkTheme, dashboards, homeReady, isHidden } = this.props;
        const modalFooterBtn = this.state.carouselEnd ?
            (<Button key="submit" type="primary" onClick={this.handleClose}>
              {intl.formatMessage(generalMessages.okTutorial)}
            </Button>) :
            (<Button key="next" type="primary" onClick={() => this.slider.next()}>
              {intl.formatMessage(generalMessages.next)}
            </Button>);

        return (
          <div style={{ height: '100%', display: isHidden ? 'none' : 'initial' }}>
            <Modal
              title={intl.formatMessage(setupMessages.tutorialTitle)}
              className="tutorial-modal"
              visible={this.state.modalVisible}
              onOk={this.handleClose}
              onCancel={this.handleClose}
              footer={[
                modalFooterBtn,
              ]}
              width="50%"
            >
              <Carousel
                ref={(c) => { this.slider = c; }}
                afterChange={this.handleCarouselChange}
              >
                <div className="tutorial-modal__page">
                  <div className="tutorial-modal__test-img" />
                  <div className="tutorial-modal__text">
                    {intl.formatMessage(setupMessages.tutorialEth)}
                  </div>
                </div>
                <div className="tutorial-modal__page">
                  <div className="tutorial-modal__aeth-wallet-img" />
                  <div className="tutorial-modal__text">
                    {intl.formatMessage(setupMessages.tutorialMana)}
                  </div>
                </div>
                <div className="tutorial-modal__page">
                  <div className="tutorial-modal__mana-popover-img" />
                  <div className="tutorial-modal__text">
                    {intl.formatMessage(setupMessages.tutorialManaAlt)}
                  </div>
                </div>
              </Carousel>
            </Modal>
            <DataLoader flag={!homeReady} size="large" style={{ paddingTop: '200px' }}>
              <div style={{ height: '100%' }}>
                <Dashboard
                  columns={columns}
                  darkTheme={darkTheme}
                  dashboardCreateNew={this.props.toggleNewDashboardModal}
                  dashboards={dashboards}
                  getDashboardRef={this.getDashboardRef}
                  navigateRight={this.navigateRight}
                  updateNewColumn={this.props.dashboardUpdateNewColumn}
                  dashboardReorderColumn={this.props.dashboardReorderColumn}
                  activeDashboardId={this.props.activeDashboard}
                  pendingEntries={this.props.pendingEntries}
                />
              </div>
            </DataLoader>
          </div>
        );
    }
}

DashboardPage.propTypes = {
    activeDashboard: PropTypes.string,
    columns: PropTypes.shape(),
    darkTheme: PropTypes.bool,
    dashboards: PropTypes.shape(),
    dashboardHideTutorial: PropTypes.func,
    dashboardSetActive: PropTypes.func.isRequired,
    dashboardUpdateNewColumn: PropTypes.func.isRequired,
    dashboardReorderColumn: PropTypes.func,
    firstDashboardReady: PropTypes.bool,
    homeReady: PropTypes.bool,
    intl: PropTypes.shape(),
    isHidden: PropTypes.bool,
    match: PropTypes.shape(),
    newColumn: PropTypes.shape(),
    pendingEntries: PropTypes.shape(),
    toggleNewDashboardModal: PropTypes.func
};

function mapStateToProps (state) {
    return {
        activeDashboard: dashboardSelectors.selectActiveDashboardId(state),
        columns: dashboardSelectors.selectColumns(state),
        darkTheme: settingsSelectors.getThemeSettings(state),
        dashboards: dashboardSelectors.selectDashboardsById(state),
        entryPageOverlay: entrySelectors.selectEntryPageOverlay(state),
        firstDashboardReady: dashboardSelectors.getFirstDashboardReady(state),
        homeReady: appSelectors.selectHomeReady(state),
        isHidden: !!entrySelectors.selectFullEntry(state) || !!entrySelectors.selectEntryFlag(state, 'fetchingFullEntry'),
        newColumn: dashboardSelectors.selectNewColumn(state),
        pendingEntries: dashboardSelectors.getDashboardColumnPendingEntries(state, dashboardSelectors.selectActiveDashboardId(state)),
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardHideTutorial,
        dashboardSetActive,
        dashboardUpdateNewColumn,
        dashboardReorderColumn,
        toggleNewDashboardModal
    }
)(injectIntl(DashboardPage));

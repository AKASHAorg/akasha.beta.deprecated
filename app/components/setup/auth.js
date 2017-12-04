import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import throttle from 'lodash.throttle';
import { AuthProfileList, Icon } from '../';
import { setupMessages } from '../../locale-data/messages';

class Auth extends Component {
    state = {
        isScrolled: false
    }

    componentDidMount () {
        const { gethStatus, profileDeleteLogged, profileGetLocal } = this.props;
        if (gethStatus.get('process')) {
            profileGetLocal();
        }
        profileDeleteLogged();
    }

    componentWillReceiveProps (nextProps) {
        const { gethStatus, ipfsStatus, profileGetLocal } = nextProps;
        const oldIpfsStatus = this.props.ipfsStatus;
        const ipfsStatusChanged = (ipfsStatus.get('started') && !oldIpfsStatus.get('started'))
            || (ipfsStatus.get('process') && !oldIpfsStatus.get('process'));
        const gethStatusChanged = gethStatus.get('process') && !this.props.gethStatus.get('process');

        if (gethStatusChanged || ipfsStatusChanged) {
            profileGetLocal();
        }
    }

    componentWillUnmount () {
        this.props.profileClearLocal();
        if (this.listContainer) {
            this.listContainer.removeEventListener('scroll', this.throttledHandler);
        }
    }

    getListContainerRef = (el) => {
        this.listContainer = el;
        if (!this.listenerRegistered && this.listContainer) {
            this.listenerRegistered = true;
            this.listContainer.addEventListener('scroll', this.throttledHandler);
        }
        if (!this.listContainer) {
            this.listenerRegistered = false;
        }
    };

    handleProfileListScroll = (ev) => {
        const { isScrolled } = this.state;
        if (ev.srcElement.scrollTop === 0 && isScrolled) {
            this.setState({
                isScrolled: false
            });
        } else if (ev.srcElement.scrollTop > 0 && !isScrolled) {
            this.setState({
                isScrolled: true
            });
        }
    };

    throttledHandler = throttle(this.handleProfileListScroll, 300);

    handleNewIdentity = () => {
        this.props.history.push('/setup/new-identity');
    };

    render () {
        const { backupKeysRequest, backupPending, gethStatus, intl, ipfsStatus, localProfiles,
            localProfilesFetched, pendingListProfiles } = this.props;
        const { isScrolled } = this.state;
        const withShadow = this.listContainer && isScrolled && 'auth__title-wrapper_with-shadow';
        return (
          <div className="setup-content auth">
            <div className="flex-center-x setup-content__column_full">
              <div className="flex-center-x setup-content__column-content auth__content">
                <div className="auth__content-inner">
                  <div className={`auth__title-wrapper ${withShadow}`}>
                    <div className="auth__title heading">
                      {intl.formatMessage(setupMessages.welcomeBack)}
                    </div>
                    <div className="auth__subtitle">
                      {intl.formatMessage(setupMessages.chooseIdentity)}
                    </div>
                  </div>
                  <div className="auth__list-wrapper">
                    <AuthProfileList
                      displayShadow={this.displayShadow}
                      fetchingProfiles={!localProfilesFetched}
                      gethStatus={gethStatus}
                      getListContainerRef={this.getListContainerRef}
                      intl={intl}
                      ipfsStatus={ipfsStatus}
                      pendingListProfiles={pendingListProfiles}
                      profiles={localProfiles}
                    />
                  </div>
                </div>
              </div>
              <div className="setup-content__column-footer auth__footer">
                <div className="flex-center-y auth__buttons-wrapper">
                  <Button
                    className="auth__button auth__button_no-border"
                    size="large"
                  >
                    <div className="flex-center-y">
                      <Icon
                        className="auth__icon"
                        type="importIcon"
                      />
                      {intl.formatMessage(setupMessages.importKeys)}
                    </div>
                  </Button>
                  <Button
                    className="auth__button auth__button_no-border"
                    disabled={backupPending}
                    onClick={backupKeysRequest}
                    size="large"
                  >
                    <div className="flex-center-y">
                      <Icon
                        className="auth__icon"
                        type="zipFile"
                      />
                      {intl.formatMessage(setupMessages.backup)}
                    </div>
                  </Button>
                </div>
                <div id="button" className="auth__new-identity-button">
                  <Link to="/setup/new-identity">
                    <Button
                      className="auth__button"
                      size="large"
                    >
                      {intl.formatMessage(setupMessages.createIdentity)}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
    }
}

Auth.propTypes = {
    backupKeysRequest: PropTypes.func.isRequired,
    backupPending: PropTypes.bool,
    gethStatus: PropTypes.shape().isRequired,
    history: PropTypes.shape().isRequired,
    intl: PropTypes.shape(),
    ipfsStatus: PropTypes.shape().isRequired,
    localProfiles: PropTypes.shape().isRequired,
    localProfilesFetched: PropTypes.bool,
    pendingListProfiles: PropTypes.shape().isRequired,
    profileClearLocal: PropTypes.func.isRequired,
    profileDeleteLogged: PropTypes.func.isRequired,
    profileGetLocal: PropTypes.func.isRequired,
};

export default Auth;

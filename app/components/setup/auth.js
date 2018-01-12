import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import classNames from 'classnames';
import throttle from 'lodash.throttle';
import { AuthProfileList, Icon } from '../';
import { setupMessages } from '../../locale-data/messages';
import { navBackCounterReset } from '../../local-flux/actions/app-actions';

class Auth extends Component {
    state = {
        isScrolled: false
    };
    interval = null;

    componentDidMount () {
        const { profileDeleteLogged } = this.props;
        this.getLocalIdentities();
        this.interval = setInterval(this.getLocalIdentities, 10000, true);
        profileDeleteLogged();
        this.props.navBackCounterReset();
    }

    componentWillReceiveProps (nextProps) {
        const { gethStatus } = nextProps;
        const gethStatusChanged = gethStatus.get('process') && !this.props.gethStatus.get('process');

        if (gethStatusChanged && this.interval) {
            console.log('reset interval');
            clearInterval(this.interval);
            this.interval = setInterval(this.getLocalIdentities, 10000, true);
        }
    }

    componentWillUnmount () {
        this.props.profileClearLocal();
        if (this.listContainer) {
            this.listContainer.removeEventListener('scroll', this.throttledHandler);
        }
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    getLocalIdentities = (polling) => {
        const { gethStatus, profileGetLocal } = this.props;
        if (gethStatus.get('process')) {
            profileGetLocal(polling);
        }
    };

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
        const { backupKeysRequest, backupPending, intl, localProfiles, localProfilesFetched,
            pendingListProfiles } = this.props;
        const { isScrolled } = this.state;
        const withShadow = this.listContainer && isScrolled && 'auth__title-wrapper_with-shadow';
        const backupButtonClass = classNames('auth__button auth__button_no-border', {
            'auth__button_no-border_disabled': backupPending
        });
        return (
          <div className="setup-content auth">
            <div className="flex-center-x setup-content__column_full">
              <div className="flex-center-x setup-content__column-content auth__content">
                <div className="auth__content-inner">
                  <div className={`auth__title-wrapper ${withShadow}`}>
                    <div className="auth__title heading">
                      {intl.formatMessage(setupMessages.welcome)}
                    </div>
                    <div className="auth__subtitle">
                      {localProfiles.size ?
                        intl.formatMessage(setupMessages.chooseIdentity) :
                        intl.formatMessage(setupMessages.getStarted)
                      }
                    </div>
                  </div>
                  <div className="auth__list-wrapper">
                    <AuthProfileList
                      displayShadow={this.displayShadow}
                      fetchingProfiles={!localProfilesFetched}
                      getListContainerRef={this.getListContainerRef}
                      intl={intl}
                      pendingListProfiles={pendingListProfiles}
                      profiles={localProfiles}
                    />
                  </div>
                </div>
              </div>
              <div className="setup-content__column-footer auth__footer">
                <div className="flex-center-y auth__buttons-wrapper">
                  {/* <Button className="auth__button auth__button_no-border">
                    <div className="flex-center-y">
                      <Icon
                        className="auth__icon"
                        type="importIcon"
                      />
                      {intl.formatMessage(setupMessages.importKeys)}
                    </div>
                  </Button> */}
                  <Button
                    className={backupButtonClass}
                    disabled={backupPending || !localProfiles.size}
                    onClick={backupKeysRequest}
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
                <div id="button" className={`${localProfiles.size && 'auth__new-identity-button'}`}>
                  <Link to="/setup/new-identity">
                    {localProfiles.size ?
                      <Button className="auth__button">
                        {intl.formatMessage(setupMessages.createIdentity)}
                      </Button> :
                      <Button className="auth__button" type="primary">
                        {intl.formatMessage(setupMessages.createIdentity)}
                      </Button>
                    }
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
    localProfiles: PropTypes.shape().isRequired,
    localProfilesFetched: PropTypes.bool,
    navBackCounterReset: PropTypes.func,
    pendingListProfiles: PropTypes.shape().isRequired,
    profileClearLocal: PropTypes.func.isRequired,
    profileDeleteLogged: PropTypes.func.isRequired,
    profileGetLocal: PropTypes.func.isRequired,
};

export default connect(
    () => ({}),
    {
        navBackCounterReset
    }
)(Auth);

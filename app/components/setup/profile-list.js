import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Avatar, DataLoader, LoginForm } from '../';
import { getInitials } from '../../utils/dataModule';
import { isInViewport } from '../../utils/domUtils';
import { setupMessages } from '../../locale-data/messages';

class ProfileList extends Component {
    container = null;
    selectedElement = null;
    state = {
        hoveredAccount: null,
        selectedAccount: null
    };

    componentDidUpdate (prevProps, prevState) {
        const { selectedAccount } = this.state;
        if (selectedAccount && selectedAccount !== prevState.selectedAccount) {
            const el = document.getElementById(`account-${selectedAccount}`);
            console.log('is in viewport', isInViewport(el));
            if (el && this.container && !isInViewport(el)) {
                console.log('scroll into view');
                el.scrollIntoView({ block: 'end', behavior: 'smooth' });
                // console.log('before', this.container.scrollTop);
                // this.container.scrollTop -= 150;
                // console.log('after', this.container.scrollTop);
            }
        }
    }

    getContainerRef = el => (this.container = el);

    onCancelLogin = () => {
        this.setState({
            selectedAccount: null
        });
    };

    onSubmitLogin = () => {};

    onMouseEnter = (account) => {
        this.setState({
            hoveredAccount: account,
        });
    };

    onMouseLeave = () => {
        this.setState({
            hoveredAccount: null
        });
    };

    onSelectAccount = (account) => {
        this.setState({
            selectedAccount: account
        });
    };

    renderListItem = (account, profile) => {
        const { hoveredAccount, selectedAccount } = this.state;
        const { palette } = this.context.muiTheme;
        const profileName = `${profile.get('firstName')} ${profile.get('lastName')}`;
        const userInitials = getInitials(profile.get('firstName'), profile.get('lastName'));
        const avatar = profile.get('avatar');
        const akashaId = profile.get('akashaId');
        const isSelected = account === selectedAccount;
        const isHovered = account === hoveredAccount && !isSelected;
        const onClick = isSelected ? undefined : () => this.onSelectAccount(account);
        const header = akashaId ?
            (
              <div style={{ display: 'flex', height: '48px' }}>
                <Avatar
                  image={avatar}
                  radius={48}
                  style={{ flex: '0 0 auto', marginRight: '16px' }}
                  userInitials={userInitials}
                  userInitialsStyle={{ fontSize: '20px' }}
                />
                <div style={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column', padding: '2px 0' }}>
                  <div className="overflow-ellipsis" style={{ flex: '3 3 auto', width: '100%', fontSize: '16px' }}>
                    <b>{profileName}</b>
                  </div>
                  <div style={{ flex: '1 1 auto' }}>
                    <small>@{akashaId}</small>
                  </div>
                </div>
              </div>
            ) :
            <div className="overflow-ellipsis">{account}</div>;

        return (
          <div
            id={`account-${account}`}
            key={account}
            onClick={onClick}
            onMouseEnter={() => this.onMouseEnter(account)}
            onMouseLeave={this.onMouseLeave}
            style={{
                border: `2px solid ${palette.borderColor}`,
                width: '100%',
                padding: '16px',
                marginBottom: '16px',
                cursor: isHovered ? 'pointer' : 'auto',
                backgroundColor: isHovered ? palette.entryPageBackground : palette.canvasColor,
                opacity: selectedAccount && !isSelected ? 0.3 : 1
            }}
          >
            {header}
            <ReactCSSTransitionGroup
              transitionName="loginForm"
              transitionEnterTimeout={200}
              transitionLeaveTimeout={200}
            >
              {isSelected &&
                <LoginForm
                  account={account}
                  onCancel={this.onCancelLogin}
                  onSubmit={this.onSubmitLogin}
                />
              }
            </ReactCSSTransitionGroup>
          </div>
        );
    };

    render () {
        const { fetchingProfiles, profiles, gethStatus, intl, ipfsStatus } = this.props;
        let placeholderMessage;

        if (!gethStatus.get('api')) {
            placeholderMessage = intl.formatMessage(setupMessages.gethStopped);
        } else if (!ipfsStatus.get('process') && !ipfsStatus.get('started')) {
            placeholderMessage = intl.formatMessage(setupMessages.ipfsStopped);
        } else if (profiles.size === 0 && !fetchingProfiles) {
            placeholderMessage = intl.formatMessage(setupMessages.noProfilesFound);
        }

        if (placeholderMessage) {
            return (
              <div
                style={{ display: 'flex', alignItems: 'center', height: '100%', textAlign: 'center' }}
              >
                {placeholderMessage}
              </div>
            );
        }

        return (
          <DataLoader flag={fetchingProfiles} style={{ paddingTop: '100px' }}>
            <div
              style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  maxWidth: '450px'
              }}
            >
              <div
                style={{
                    position: 'absolute',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '5px 24px'
                }}
                ref={this.getContainerRef}
              >
                {profiles.map(({ account, profile }) => this.renderListItem(account, profile))}
              </div>
            </div>
          </DataLoader>
        );
    }
}

ProfileList.propTypes = {
    fetchingProfiles: PropTypes.bool,
    gethStatus: PropTypes.shape().isRequired,
    intl: PropTypes.shape().isRequired,
    ipfsStatus: PropTypes.shape().isRequired,
    profiles: PropTypes.shape().isRequired,
};

ProfileList.contextTypes = {
    muiTheme: PropTypes.shape()
};

export default ProfileList;

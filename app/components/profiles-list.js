import PropTypes from 'prop-types';
import React from 'react';
import { List, ListItem } from 'material-ui';
import { Avatar, DataLoader } from '../shared-components';
import { getInitials } from '../utils/dataModule';
import { setupMessages } from '../locale-data/messages';

const ProfilesList = (props, { muiTheme }) => {
    const { fetchingProfiles, profiles, gethStatus, intl, ipfsStatus, handleSelect } = props;
    const { palette } = muiTheme;
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
        <List>
          {profiles.map((profile) => {
              const profileName = `${profile.get('firstName')} ${profile.get('lastName')}`;
              const userInitials = getInitials(profile.get('firstName'), profile.get('lastName'));
              const avatar = profile.get('avatar');
              const akashaId = profile.get('akashaId');

              return (
                <ListItem
                  key={akashaId}
                  leftAvatar={
                    <Avatar
                      image={avatar}
                      radius={48}
                      style={{ top: '12px' }}
                      userInitials={userInitials}
                      userInitialsStyle={{ fontSize: '20px' }}
                    />
                  }
                  primaryText={
                    <div
                      style={{
                          marginLeft: 16,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                      }}
                    >
                      <b>{profileName}</b>
                    </div>
                  }
                  secondaryText={
                    <div style={{ marginLeft: 16 }}>
                      @{akashaId}
                    </div>
                  }
                  secondaryTextLines={1}
                  onTouchTap={() => handleSelect(profile.get('akashaId'))}
                  style={{ border: `1px solid ${palette.borderColor}`, marginBottom: 8 }}
                />
              );
          })}
        </List>
      </DataLoader>
    );
};

ProfilesList.propTypes = {
    fetchingProfiles: PropTypes.bool,
    gethStatus: PropTypes.shape().isRequired,
    handleSelect: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    ipfsStatus: PropTypes.shape().isRequired,
    profiles: PropTypes.shape().isRequired,
};

ProfilesList.contextTypes = {
    muiTheme: PropTypes.shape()
};

export default ProfilesList;

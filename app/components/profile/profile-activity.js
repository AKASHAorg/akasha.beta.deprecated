import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { injectIntl } from 'react-intl';
import { EntryListContainer } from '../../shared-components';
import { ACTIVITY } from '../../constants/context-types';

class ProfileActivity extends Component {
    componentWillMount () {
        const { akashaId, entryProfileIterator } = this.props;
        entryProfileIterator(null, akashaId);
    }

    componentWillUpdate (nextProps) {
        const { akashaId, entryProfileIterator } = this.props;
        if (akashaId !== nextProps.akashaId) {
            entryProfileIterator(null, nextProps.akashaId);
        }
    }

    fetchMoreProfileEntries = () => {
        const { akashaId, entryMoreProfileIterator } = this.props;
        entryMoreProfileIterator(null, akashaId);
    }

    render () {
        const { profileEntries, fetchingProfileEntries, moreProfileEntries,
            fetchingMoreProfileEntries, firstName, profiles } = this.props;
        return (
          <div className="profile-activity">
            <div className="profile-activity__name">{firstName}&#8217;s activity </div>
            <EntryListContainer
              style={{ height: '100%', flexFlow: 'row wrap' }}
              cardStyle={{ width: '400px' }}
              contextId={ACTIVITY}
              entries={profileEntries}
              fetchingEntries={fetchingProfileEntries}
              fetchingMoreEntries={fetchingMoreProfileEntries}
              fetchMoreEntries={this.fetchMoreProfileEntries}
              moreEntries={moreProfileEntries}
              profiles={profiles}
            />
          </div>
        );
    }
}

ProfileActivity.propTypes = {
    akashaId: PropTypes.string,
    entryMoreProfileIterator: PropTypes.func,
    entryProfileIterator: PropTypes.func,
    profileEntries: PropTypes.shape(),
    fetchingProfileEntries: PropTypes.bool,
    fetchingMoreProfileEntries: PropTypes.bool,
    firstName: PropTypes.string,
    moreProfileEntries: PropTypes.bool,
    profiles: PropTypes.shape()
};


export default injectIntl(ProfileActivity);

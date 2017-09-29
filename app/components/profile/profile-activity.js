import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { profileMessages } from '../../locale-data/messages';
import { entryProfileIterator, entryMoreProfileIterator } from '../../local-flux/actions/entry-actions';
import { ACTIVITY } from '../../constants/context-types';
import { selectProfileEntries } from '../../local-flux/selectors';
import { EntryList } from '../';

class ProfileActivity extends Component {
    componentDidMount () {
        const { akashaId } = this.props;
        this.props.entryProfileIterator(null, akashaId);
    }

    componentWillReceiveProps (nextProps) {
        const { akashaId } = this.props;
        if (akashaId !== nextProps.akashaId) {
            this.props.entryProfileIterator(null, nextProps.akashaId);
        }
    }

    fetchMoreProfileEntries = () => {
        const { akashaId } = this.props;
        this.props.entryMoreProfileIterator(null, akashaId);
    }

    render () {
        const { intl, profileEntries, fetchingProfileEntries, moreProfileEntries,
            fetchingMoreProfileEntries, profiles } = this.props;
        return (
          <div className="profile-activity">
            <div className="flex-center-y profile-activity__column">
              <div className="profile-activity__column-header">
                <div className="profile-activity__column-title">
                  {intl.formatMessage(profileMessages.entries)}
                </div>
              </div>
              <EntryList
                style={{ height: '100%', flexFlow: 'row wrap' }}
                cardStyle={{ width: '340px' }}
                contextId={ACTIVITY}
                entries={profileEntries}
                fetchingEntries={fetchingProfileEntries}
                fetchingMoreEntries={fetchingMoreProfileEntries}
                fetchMoreEntries={this.fetchMoreProfileEntries}
                moreEntries={moreProfileEntries}
                profiles={profiles}
              />
            </div>
          </div>
        );
    }
}

ProfileActivity.propTypes = {
    akashaId: PropTypes.string,
    entryMoreProfileIterator: PropTypes.func,
    entryProfileIterator: PropTypes.func,
    intl: PropTypes.shape(),
    profileEntries: PropTypes.shape(),
    fetchingProfileEntries: PropTypes.bool,
    fetchingMoreProfileEntries: PropTypes.bool,
    moreProfileEntries: PropTypes.bool,
    profiles: PropTypes.shape()
};

function mapStateToProps (state, ownProps) {
    const akashaId = ownProps.akashaId;
    return {
        fetchingMoreProfileEntries: state.entryState.getIn(['flags', 'fetchingMoreProfileEntries']),
        fetchingProfileEntries: state.entryState.getIn(['flags', 'fetchingProfileEntries']),
        profileEntries: selectProfileEntries(state, akashaId),
        profiles: state.profileState.get('byId'),
        moreProfileEntries: state.entryState.get('moreProfileEntries'),
    };
}


export default connect(
    mapStateToProps,
    {
        entryMoreProfileIterator,
        entryProfileIterator
    }
)(injectIntl(ProfileActivity));

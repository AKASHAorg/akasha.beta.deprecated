import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { entryProfileIterator, entryMoreProfileIterator } from '../../local-flux/actions/entry-actions';
import { selectLoggedEthAddress, selectProfileLoggedEntries } from '../../local-flux/selectors';
import { EntryList } from '../';

class MyEntries extends Component {
    componentDidMount () {
        const { ethAddress } = this.props;
        this.props.entryProfileIterator({ id: 'profileEntries', value: ethAddress });
    }

    fetchMoreProfileEntries = () => {
        const { ethAddress, profileEntriesColumn } = this.props;
        this.props.entryMoreProfileIterator(profileEntriesColumn, true);
    };

    render () {
        const { profileEntries, fetchingProfileEntries, moreProfileEntries,
            fetchingMoreProfileEntries, profileEntriesColumn } = this.props;

        return (
          <div className="myentries">
            <EntryList
              contextId="profileEntries"
              entries={profileEntries}
              fetchingEntries={fetchingProfileEntries}
              fetchingMoreEntries={fetchingMoreProfileEntries}
              fetchMoreEntries={this.fetchMoreProfileEntries}
              moreEntries={moreProfileEntries}
              masonry
              style={{ padding: '30px 0px' }}
            />
          </div>
        );
    }
}

MyEntries.propTypes = {
    entryMoreProfileIterator: PropTypes.func,
    entryProfileIterator: PropTypes.func,
    ethAddress: PropTypes.string,
    profileEntries: PropTypes.shape(),
    fetchingProfileEntries: PropTypes.bool,
    fetchingMoreProfileEntries: PropTypes.bool,
    moreProfileEntries: PropTypes.bool,
};

function mapStateToProps (state) {
    const ethAddress = selectLoggedEthAddress(state);
    return {
        ethAddress,
        fetchingMoreProfileEntries: state.dashboardState.getIn(['columnById', 'profileEntries', 'flags', 'fetchingMoreItems']),
        fetchingProfileEntries: state.dashboardState.getIn(['columnById', 'profileEntries', 'flags', 'fetchingItems']),
        profileEntries: selectProfileLoggedEntries(state, ethAddress),
        profiles: state.profileState.get('byEthAddress'),
        moreProfileEntries: state.dashboardState.getIn(['columnById', 'profileEntries', 'flags', 'moreItems']),
        profileEntriesColumn: state.dashboardState.getIn(['columnById', 'profileEntries']),
    };
}

export default connect(
    mapStateToProps,
    {
        entryMoreProfileIterator,
        entryProfileIterator
    }
)(injectIntl(MyEntries));

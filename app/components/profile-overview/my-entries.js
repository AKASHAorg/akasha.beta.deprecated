import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { entryProfileIterator, entryMoreProfileIterator } from '../../local-flux/actions/entry-actions';
import { ACTIVITY } from '../../constants/context-types';
import { selectLoggedEthAddress, selectProfileEntries } from '../../local-flux/selectors';
import { EntryList } from '../';

class Highlights extends Component {
    componentDidMount () {
        const { ethAddress } = this.props;
        this.props.entryProfileIterator({ columnId: 'profileEntries', value: ethAddress });
    }

    fetchMoreProfileEntries = () => {
        const { ethAddress } = this.props;
        this.props.entryMoreProfileIterator({ columnId: 'profileEntries', value: ethAddress });
    };

    render () {
        const { profileEntries, fetchingProfileEntries, moreProfileEntries,
            fetchingMoreProfileEntries } = this.props;

        return (
          <div className="myentries">
            <EntryList
              contextId={ACTIVITY}
              entries={profileEntries}
              fetchingEntries={fetchingProfileEntries}
              fetchingMoreEntries={fetchingMoreProfileEntries}
              fetchMoreEntries={this.fetchMoreProfileEntries}
              moreEntries={moreProfileEntries}
              masonry
              style={{ padding: '30px 0px', margin: '6px 0px' }}
            />
          </div>
        );
    }
}

Highlights.propTypes = {
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
        fetchingMoreProfileEntries: state.entryState.getIn(['profileEntries', ethAddress, 'fetchingMoreEntries']),
        fetchingProfileEntries: state.entryState.getIn(['profileEntries', ethAddress, 'fetchingEntries']),
        profileEntries: selectProfileEntries(state, ethAddress),
        profiles: state.profileState.get('byEthAddress'),
        moreProfileEntries: state.entryState.getIn(['profileEntries', ethAddress, 'moreEntries']),
    };
}

export default connect(
    mapStateToProps,
    {
        entryMoreProfileIterator,
        entryProfileIterator
    }
)(injectIntl(Highlights));

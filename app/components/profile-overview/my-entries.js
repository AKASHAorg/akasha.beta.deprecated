import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { entryProfileIterator, entryMoreProfileIterator } from '../../local-flux/actions/entry-actions';
import { ACTIVITY } from '../../constants/context-types';
import { selectLoggedEthAddress, selectProfileEntries } from '../../local-flux/selectors';
import { EntryList } from '../';

class Highlights extends Component {
    componentDidMount () {
        const { ethAddress } = this.props;
        this.props.entryProfileIterator({
            columnId: 'profileEntries',
            value: ethAddress
        });
    }

    fetchMoreProfileEntries = () => {
        const { ethAddress, lastBlock, lastIndex } = this.props;
        this.props.entryMoreProfileIterator({
            columnId: 'profileEntries',
            value: ethAddress,
            lastBlock,
            lastIndex,
        });
    };

    render () {
        const { profileEntries, fetchingProfileEntries, moreProfileEntries, entries,
            fetchingMoreProfileEntries } = this.props;
        let entriesMap = new List();
        if (profileEntries) {
            entriesMap = profileEntries.map(profEthAddress => entries.get(profEthAddress))
        }
        return (
          <div className="myentries">
            <EntryList
              contextId={ACTIVITY}
              entries={entriesMap}
              fetchingEntries={fetchingProfileEntries}
              fetchingMoreEntries={fetchingMoreProfileEntries}
              fetchMoreEntries={this.fetchMoreProfileEntries}
              moreEntries={moreProfileEntries}
              masonry
              style={{ padding: '30px 0px' }}
              cardStyle={{ width: 340 }}
            />
          </div>
        );
    }
}

Highlights.propTypes = {
    entries: PropTypes.shape(),
    entryMoreProfileIterator: PropTypes.func,
    entryProfileIterator: PropTypes.func,
    ethAddress: PropTypes.string,
    profileEntries: PropTypes.shape(),
    fetchingProfileEntries: PropTypes.bool,
    fetchingMoreProfileEntries: PropTypes.bool,
    moreProfileEntries: PropTypes.bool,
    lastBlock: PropTypes.number,
    lastIndex: PropTypes.number,
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
        entries: state.entryState.get('byId'),
        lastBlock: state.entryState.getIn(['profileEntries', ethAddress, 'lastBlock']),
        lastIndex: state.entryState.getIn(['profileEntries', ethAddress, 'lastIndex']),
    };
}

export default connect(
    mapStateToProps,
    {
        entryMoreProfileIterator,
        entryProfileIterator
    }
)(injectIntl(Highlights));

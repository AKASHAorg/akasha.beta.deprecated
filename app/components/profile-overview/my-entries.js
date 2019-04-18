import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { entryProfileIterator } from '../../local-flux/actions/entry-actions';
import { EntryList } from '../';
import { entrySelectors, profileSelectors } from '../../local-flux/selectors';
import withRequest from '../high-order-components/with-request';

class MyEntries extends Component {
    componentDidMount () {
        const { ethAddress } = this.props;
        this.props.dispatchAction(entryProfileIterator({
            id: 'profileEntries',
            value: ethAddress
        }));
    }

    fetchMoreProfileEntries = () => {
        const { ethAddress } = this.props;
        this.props.dispatchAction(entryProfileIterator({
            id: 'profileEntries',
            value: ethAddress
        }));
    };

    render () {
        const {
            profileEntries, fetchingProfileEntries, moreProfileEntries,
            fetchingMoreProfileEntries
        } = this.props;

        return (
            <div className="myentries">
                <EntryList
                    contextId="profileEntries"
                    entries={ profileEntries }
                    fetchingEntries={ fetchingProfileEntries }
                    fetchingMoreEntries={ fetchingMoreProfileEntries }
                    fetchMoreEntries={ this.fetchMoreProfileEntries }
                    moreEntries={ moreProfileEntries }
                    masonry
                    style={ { padding: '30px 0px' } }
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
    const ethAddress = profileSelectors.selectLoggedEthAddress(state);
    return {
        ethAddress,
        fetchingMoreProfileEntries: entrySelectors.getProfileEntriesFlags(state).fetchingMoreProfileEntries,
        fetchingProfileEntries: entrySelectors.getProfileEntriesFlags(state).fetchingProfileEntries,
        profileEntries: entrySelectors.getProfileEntries(state, ethAddress),
        profiles: profileSelectors.selectProfilesByEthAddress(state),
        moreProfileEntries: entrySelectors.getProfileEntriesFlags(state).moreEntries,
    };
}

export default connect(
    mapStateToProps,
    {
        // entryProfileIterator
    }
)(injectIntl(withRequest(MyEntries)));

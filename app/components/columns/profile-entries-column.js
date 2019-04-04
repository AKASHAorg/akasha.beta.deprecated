import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import Waypoint from 'react-waypoint';
import { ColumnHeader, EntryList } from '../';
import { profileMessages } from '../../locale-data/messages';
import { entryProfileIterator, entryMoreProfileIterator } from '../../local-flux/actions/entry-actions';
import { entrySelectors } from '../../local-flux/selectors';
import withRequest from '../high-order-components/with-request';

class ProfileEntriesColumn extends Component {
    firstCallDone = false;
    firstLoad = () => {
        if (!this.firstCallDone) {
            this.entryIterator();
            this.firstCallDone = true;
        }
    }

    componentWillReceiveProps (nextProps) {
        const { ethAddress } = nextProps;
        if (this.props.ethAddress !== ethAddress) {
            this.entryIterator(ethAddress);
        }
    }

    entryIterator = (ethAddress) => {
        if (!ethAddress) {
            ethAddress = this.props.ethAddress;
        }
        this.props.dispatchAction(entryProfileIterator({ columnId: 'profileEntries', value: ethAddress }));
    };

    render () {
        const { entriesList, fetchingEntries, fetchingMoreEntries, intl, moreEntries } = this.props;

        return (
          <div className="column">
            <ColumnHeader
              onRefresh={this.entryIterator}
              noMenu
              readOnly
              title={intl.formatMessage(profileMessages.entries)}
            />
            <Waypoint onEnter={this.firstLoad} horizontal />
            <EntryList
              contextId="profileEntries"
              entries={entriesList}
              fetchingEntries={fetchingEntries}
              fetchingMoreEntries={fetchingMoreEntries}
              fetchMoreEntries={this.entryIterator}
              moreEntries={moreEntries}
            />
          </div>
        );
    }
}

ProfileEntriesColumn.propTypes = {
    entriesList: PropTypes.shape().isRequired,
    entryProfileIterator: PropTypes.func.isRequired,
    ethAddress: PropTypes.string.isRequired,
    fetchingEntries: PropTypes.bool,
    fetchingMoreEntries: PropTypes.bool,
    intl: PropTypes.shape().isRequired,
    moreEntries: PropTypes.bool,
};

function mapStateToProps (state, ownProps) {
    const { ethAddress } = ownProps;
    const { fetchingEntries, fetchingMoreEntries, moreEntries } =
        entrySelectors.getProfileEntriesFlags(state, ethAddress);
    return {
        entriesList: entrySelectors.getProfileEntries(state, ethAddress),
        fetchingEntries,
        fetchingMoreEntries,
        moreEntries
    };
}

export default connect(
    mapStateToProps,
    {
        // entryProfileIterator,
    }
)(injectIntl(withRequest(ProfileEntriesColumn)));

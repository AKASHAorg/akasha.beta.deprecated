import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { ColumnHeader, EntryList } from '../';
import { profileMessages } from '../../locale-data/messages';
import { entryProfileIterator, entryMoreProfileIterator } from '../../local-flux/actions/entry-actions';
import { selectProfileEntries, selectProfileEntriesFlags } from '../../local-flux/selectors';

class ProfileEntriesColumn extends Component {
    componentDidMount () {
        this.entryIterator();
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
        this.props.entryProfileIterator({ columnId: 'profileEntries', value: ethAddress });
    };

    entryMoreIterator = () => {
        const { ethAddress } = this.props;
        this.props.entryMoreProfileIterator({ columnId: 'profileEntries', value: ethAddress });
    }

    render () {
        const { entriesList, fetchingEntries, fetchingMoreEntries, intl, moreEntries } = this.props;

        return (
          <div className="column">
            <ColumnHeader
              onRefresh={this.entryIterator}
              notEditable
              readOnly
              title={intl.formatMessage(profileMessages.entries)}
            />
            <EntryList
              contextId="profileEntries"
              entries={entriesList}
              fetchingEntries={fetchingEntries}
              fetchingMoreEntries={fetchingMoreEntries}
              fetchMoreEntries={this.entryMoreIterator}
              moreEntries={moreEntries}
            />
          </div>
        );
    }
}

ProfileEntriesColumn.propTypes = {
    entriesList: PropTypes.shape().isRequired,
    entryMoreProfileIterator: PropTypes.func.isRequired,
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
        selectProfileEntriesFlags(state, ethAddress);
    return {
        entriesList: selectProfileEntries(state, ethAddress),
        fetchingEntries,
        fetchingMoreEntries,
        moreEntries
    };
}

export default connect(
    mapStateToProps,
    {
        entryMoreProfileIterator,
        entryProfileIterator,
    }
)(injectIntl(ProfileEntriesColumn));

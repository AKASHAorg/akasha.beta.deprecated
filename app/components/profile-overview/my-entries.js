import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Icon, Input } from 'antd';
import { searchMessages } from '../../locale-data/messages';
import { entryProfileIterator, entryMoreProfileIterator } from '../../local-flux/actions/entry-actions';
import { ACTIVITY } from '../../constants/context-types';
import { selectLoggedEthAddress, selectProfileEntries } from '../../local-flux/selectors';
import { EntryList } from '../';


class Highlights extends Component {
    componentDidMount () {
        const { ethAddress } = this.props;
        this.props.entryProfileIterator({ columnId: null, value: ethAddress });
    }

    fetchMoreProfileEntries = () => {
        const { ethAddress } = this.props;
        this.props.entryMoreProfileIterator({ columnId: null, value: ethAddress });
    };

    // onSearchChange = (ev) => {
    // };

    render () {
        const { search, intl, profileEntries, fetchingProfileEntries, moreProfileEntries,
            fetchingMoreProfileEntries } = this.props;

        return (
          <div className="myentries">
            <div className="myentries__content" ref={this.getContainerRef}>
              <div className="myentries__search">
                <Input
                  onChange={this.onSearchChange}
                  value={search}
                  size="large"
                  placeholder={intl.formatMessage(searchMessages.searchSomething)}
                  prefix={<Icon type="search" />}
                />
              </div>
              <div className="myentries__list">
                <EntryList
                  contextId={ACTIVITY}
                  entries={profileEntries}
                  fetchingEntries={fetchingProfileEntries}
                  fetchingMoreEntries={fetchingMoreProfileEntries}
                  fetchMoreEntries={this.fetchMoreProfileEntries}
                  moreEntries={moreProfileEntries}
                  masonry
                />
              </div>
            </div>
          </div>
        );
    }
}

Highlights.propTypes = {
    search: PropTypes.string,
    entryMoreProfileIterator: PropTypes.func,
    entryProfileIterator: PropTypes.func,
    ethAddress: PropTypes.string,
    intl: PropTypes.shape(),
    profileEntries: PropTypes.shape(),
    fetchingProfileEntries: PropTypes.bool,
    fetchingMoreProfileEntries: PropTypes.bool,
    moreProfileEntries: PropTypes.bool,
};

function mapStateToProps (state) {
    const ethAddress = selectLoggedEthAddress(state);
    return {
        ethAddress,
        fetchingMoreProfileEntries: state.entryState.getIn(['flags', 'fetchingMoreProfileEntries']),
        fetchingProfileEntries: state.entryState.getIn(['flags', 'fetchingProfileEntries']),
        profileEntries: selectProfileEntries(state, ethAddress),
        profiles: state.profileState.get('byEthAddress'),
        moreProfileEntries: state.entryState.get('moreProfileEntries'),
    };
}

export default connect(
    mapStateToProps,
    {
        entryMoreProfileIterator,
        entryProfileIterator
    }
)(injectIntl(Highlights));

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import Waypoint from 'react-waypoint';
import { ColumnHeader, EntryList } from '../';
import { entryMessages, profileMessages } from '../../locale-data/messages';
import { entryMoreProfileIterator, entryProfileIterator } from '../../local-flux/actions/entry-actions';
import { searchProfiles } from '../../local-flux/actions/search-actions';
import { selectColumnEntries, selectProfileExists,
    selectProfileSearchResults } from '../../local-flux/selectors';

class ProfileColumn extends Component {
    firstCallDone = false;
    firstLoad = () => {
        const { column } = this.props;
        const value = column.get('value');
        if (!column.get('entriesList').size && value && !this.firstCallDone) {
            this.props.entryProfileIterator({ columnId: column.get('id'), value });
            this.firstCallDone = true;
        }
    }

    componentDidMount () {
        const { column } = this.props;
        const value = column.get('value');
        if (!column.get('entriesList').size && value) {
            this.props.entryProfileIterator({ columnId: column.get('id'), value });
        }
    }

    componentWillReceiveProps ({ column }) {
        const value = column.get('value');
        if (value !== this.props.column.get('value')) {
            this.props.entryProfileIterator({ columnId: column.get('id'), value });
        }
    }

    entryMoreProfileIterator = () => {
        const { column } = this.props;
        const value = column.get('value');
        this.props.entryMoreProfileIterator({ columnId: column.get('id'), value });
    };

    onRefresh = () => {
        const { column } = this.props;
        this.props.entryProfileIterator({
            columnId: column.get('id'),
            value: column.get('value')
        });
    };

    render () {
        const { column, entriesList, intl, profileExists, profileResults } = this.props;
        let placeholderMessage;
        if (column.get('value') && profileExists.get('akashaId') === column.get('value')) {
            placeholderMessage = profileExists.getIn(['data', 'exists']) ?
                intl.formatMessage(entryMessages.noEntries) :
                intl.formatMessage(profileMessages.profileDoesntExist);
        } else {
            intl.formatMessage(entryMessages.searchProfile);
        }
        const className = classNames('column', { column_large: column.get('large') });

        return (
          <div className={className}>
            <ColumnHeader
              column={column}
              dataSource={profileResults}
              iconType="user"
              onRefresh={this.onRefresh}
              onSearch={this.props.searchProfiles}
            />
            <Waypoint onEnter={this.firstLoad} horizontal />
            <EntryList
              contextId={column.get('id')}
              entries={entriesList}
              fetchingEntries={column.getIn(['flags', 'fetchingEntries'])}
              fetchingMoreEntries={column.getIn(['flags', 'fetchingMoreEntries'])}
              fetchMoreEntries={this.entryMoreProfileIterator}
              large={column.get('large')}
              moreEntries={column.getIn(['flags', 'moreEntries'])}
              placeholderMessage={placeholderMessage}
            />
          </div>
        );
    }
}

ProfileColumn.propTypes = {
    column: PropTypes.shape().isRequired,
    entriesList: PropTypes.shape().isRequired,
    entryMoreProfileIterator: PropTypes.func.isRequired,
    entryProfileIterator: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    profileExists: PropTypes.shape().isRequired,
    profileResults: PropTypes.shape().isRequired,
    searchProfiles: PropTypes.func.isRequired,
};

function mapStateToProps (state, ownProps) {
    return {
        entriesList: selectColumnEntries(state, ownProps.column.get('id')),
        profileExists: selectProfileExists(state),
        profileResults: selectProfileSearchResults(state),
    };
}

export default connect(
    mapStateToProps,
    {
        entryMoreProfileIterator,
        entryProfileIterator,
        searchProfiles
    }
)(injectIntl(ProfileColumn));

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { ColumnHeader, EntryList } from '../';
import { ColumnProfile } from '../svg';
import { entryMessages, profileMessages } from '../../locale-data/messages';
import { entryMoreProfileIterator, entryProfileIterator } from '../../local-flux/actions/entry-actions';
import { searchProfiles } from '../../local-flux/actions/search-actions';
import { selectColumnEntries, selectProfileExists,
    selectProfileSearchResults } from '../../local-flux/selectors';

class ProfileColumn extends Component {
    componentDidMount () {
        const { column } = this.props;
        const value = column.get('value');
        if (!column.get('entries').size && value) {
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
        const { baseWidth, column, entries, intl, profileExists, profileResults } = this.props;
        let placeholderMessage;
        if (column.get('value')) {
            placeholderMessage = profileExists.getIn([column.get('value'), 'exists']) ?
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
              icon={<ColumnProfile />}
              onRefresh={this.onRefresh}
              onSearch={this.props.searchProfiles}
            />
            <EntryList
              baseWidth={baseWidth}
              cardStyle={{ width: column.get('large') ? '520px' : '340px' }}
              contextId={column.get('id')}
              entries={entries}
              fetchingEntries={column.getIn(['flags', 'fetchingEntries'])}
              fetchingMoreEntries={column.getIn(['flags', 'fetchingMoreEntries'])}
              fetchMoreEntries={this.entryMoreProfileIterator}
              moreEntries={column.getIn(['flags', 'moreEntries'])}
              placeholderMessage={placeholderMessage}
            />
          </div>
        );
    }
}

ProfileColumn.propTypes = {
    baseWidth: PropTypes.number,
    column: PropTypes.shape().isRequired,
    entries: PropTypes.shape().isRequired,
    entryMoreProfileIterator: PropTypes.func.isRequired,
    entryProfileIterator: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    profileExists: PropTypes.shape().isRequired,
    profileResults: PropTypes.shape().isRequired,
    searchProfiles: PropTypes.func.isRequired,
};

function mapStateToProps (state, ownProps) {
    return {
        entries: selectColumnEntries(state, ownProps.column.get('id')),
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

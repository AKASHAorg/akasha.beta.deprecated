import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { ColumnHeader, EntryList } from '../';
import { ColumnTag } from '../svg';
import { entryMessages, tagMessages } from '../../locale-data/messages';
import { entryMoreTagIterator, entryTagIterator } from '../../local-flux/actions/entry-actions';
import { searchTags } from '../../local-flux/actions/search-actions';
import { selectColumnEntries, selectTagExists, selectTagSearchResults } from '../../local-flux/selectors';

class TagColumn extends Component {
    componentDidMount () {
        const { column } = this.props;
        const value = column.get('value');
        if (!column.get('entries').size && value) {
            this.props.entryTagIterator({ columnId: column.get('id'), value });
        }
    }

    componentWillReceiveProps ({ column }) {
        const value = column.get('value');
        if (value !== this.props.column.get('value')) {
            this.props.entryTagIterator({ columnId: column.get('id'), value });
        }
    }

    entryMoreTagIterator = () => {
        const { column } = this.props;
        this.props.entryMoreTagIterator(column.get('id'), column.get('value'));
    };

    onRefresh = () => {
        const { column } = this.props;
        this.props.entryTagIterator({
            columnId: column.get('id'),
            value: column.get('value')
        });
    };

    render () {
        const { baseWidth, column, entries, intl, tagExists, tagResults } = this.props;
        let placeholderMessage;
        if (column.get('value')) {
            placeholderMessage = tagExists.get(column.get('value')) ?
                intl.formatMessage(entryMessages.noEntries) :
                intl.formatMessage(tagMessages.tagDoesntExist);
        } else {
            intl.formatMessage(entryMessages.searchTag);
        }
        const className = classNames('column', { column_large: column.get('large') });

        return (
          <div className={className}>
            <ColumnHeader
              column={column}
              dataSource={tagResults}
              icon={<ColumnTag />}
              onRefresh={this.onRefresh}
              onSearch={this.props.searchTags}
            />
            <EntryList
              baseWidth={baseWidth}
              cardStyle={{ width: column.get('large') ? '520px' : '340px' }}
              contextId={column.get('id')}
              entries={entries}
              fetchingEntries={column.getIn(['flags', 'fetchingEntries'])}
              fetchingMoreEntries={column.getIn(['flags', 'fetchingMoreEntries'])}
              fetchMoreEntries={this.entryMoreTagIterator}
              moreEntries={column.getIn(['flags', 'moreEntries'])}
              placeholderMessage={placeholderMessage}
            />
          </div>
        );
    }
}

TagColumn.propTypes = {
    baseWidth: PropTypes.number,
    column: PropTypes.shape().isRequired,
    entries: PropTypes.shape().isRequired,
    entryMoreTagIterator: PropTypes.func.isRequired,
    entryTagIterator: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    searchTags: PropTypes.func.isRequired,
    tagExists: PropTypes.shape().isRequired,
    tagResults: PropTypes.shape().isRequired,
};

function mapStateToProps (state, ownProps) {
    const columnId = ownProps.column.get('id');
    return {
        entries: selectColumnEntries(state, columnId),
        tagExists: selectTagExists(state),
        tagResults: selectTagSearchResults(state),
    };
}

export default connect(
    mapStateToProps,
    {
        entryMoreTagIterator,
        entryTagIterator,
        searchTags,
    }
)(injectIntl(TagColumn));

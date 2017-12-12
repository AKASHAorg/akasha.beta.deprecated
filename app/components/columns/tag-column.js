import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import Waypoint from 'react-waypoint';
import { ColumnHeader, EntryList } from '../';
import { entryMessages, tagMessages } from '../../locale-data/messages';
import { entryMoreTagIterator, entryTagIterator } from '../../local-flux/actions/entry-actions';
import { searchTags } from '../../local-flux/actions/search-actions';
import { selectColumnEntries, selectTagExists, selectTagSearchResults } from '../../local-flux/selectors';

class TagColumn extends Component {
    firstCallDone = false;
    firstLoad = () => {
        const { column } = this.props;
        const value = column.get('value');
        if (!column.get('entriesList').size && !this.firstCallDone && value) {
            this.props.entryTagIterator({ columnId: column.get('id'), value });
            this.firstCallDone = true;
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
        this.props.entryMoreTagIterator({ columnId: column.get('id'), value: column.get('value') });
    };

    onRefresh = () => {
        const { column } = this.props;
        this.props.entryTagIterator({
            columnId: column.get('id'),
            value: column.get('value')
        });
    };

    render () {
        const { column, entriesList, intl, tagExists, tagResults } = this.props;
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
              iconType="tag"
              onRefresh={this.onRefresh}
              onSearch={this.props.searchTags}
            />
            <Waypoint onEnter={this.firstLoad} horizontal={true} />
            <EntryList
              contextId={column.get('id')}
              entries={entriesList}
              fetchingEntries={column.getIn(['flags', 'fetchingEntries'])}
              fetchingMoreEntries={column.getIn(['flags', 'fetchingMoreEntries'])}
              fetchMoreEntries={this.entryMoreTagIterator}
              large={column.get('large')}
              moreEntries={column.getIn(['flags', 'moreEntries'])}
              placeholderMessage={placeholderMessage}
            />
          </div>
        );
    }
}

TagColumn.propTypes = {
    column: PropTypes.shape().isRequired,
    entriesList: PropTypes.shape().isRequired,
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
        entriesList: selectColumnEntries(state, columnId),
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

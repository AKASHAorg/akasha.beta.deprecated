import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import Waypoint from 'react-waypoint';
import { ColumnHeader, EntryList } from '../';
import { entryMessages, tagMessages } from '../../locale-data/messages';
import { dashboardResetColumnEntries } from '../../local-flux/actions/dashboard-actions';
import { entryMoreTagIterator, entryTagIterator } from '../../local-flux/actions/entry-actions';
import { searchTags } from '../../local-flux/actions/search-actions';
import { selectColumnEntries, selectTagExists, selectTagSearchResults } from '../../local-flux/selectors';

const DELAY = 60000;

class TagColumn extends Component {
    firstCallDone = false;
    interval = null;
    timeout = null;

    componentWillReceiveProps ({ column }) {
        const value = column.get('value');
        if (value !== this.props.column.get('value')) {
            this.props.entryTagIterator({ columnId: column.get('id'), value });
            if (this.interval) {
                clearInterval(this.interval);
            }
            this.timeout = setTimeout(this.setPollingInterval, DELAY);
        }
        if (column.get('hasNewEntries') && this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    componentWillUnmount () {
        const { column } = this.props;
        if (this.interval) {
            clearInterval(this.interval);
        }
        if (this.timeout) {
            clearTimeout(this.timeout);
        }
        this.props.dashboardResetColumnEntries(column.get('id'));
    }

    firstLoad = () => {
        const { column } = this.props;
        const value = column.get('value');
        if (!this.firstCallDone && value) {
            this.entryIterator();
            this.firstCallDone = true;
        }
    };

    setPollingInterval = () => {
        this.interval = setInterval(() => {
            this.props.entryTagIterator({
                columnId: this.props.column.get('id'),
                reversed: true,
                value: this.props.column.get('value')
            });
        }, DELAY);
    };

    entryIterator = () => {
        const { column } = this.props;
        this.props.entryTagIterator({
            columnId: column.get('id'),
            value: column.get('value')
        });
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.timeout = setTimeout(this.setPollingInterval, DELAY);
    }

    entryMoreTagIterator = () => {
        const { column } = this.props;
        this.props.entryMoreTagIterator({ columnId: column.get('id'), value: column.get('value') });
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
              onRefresh={this.entryIterator}
              onSearch={this.props.searchTags}
            />
            <Waypoint onEnter={this.firstLoad} horizontal />
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
    dashboardResetColumnEntries: PropTypes.func.isRequired,
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
        dashboardResetColumnEntries,
        entryMoreTagIterator,
        entryTagIterator,
        searchTags,
    }
)(injectIntl(TagColumn));

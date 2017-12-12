import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import Waypoint from 'react-waypoint';
import { ColumnHeader, EntryList } from '../';
import { entryMessages } from '../../locale-data/messages';
import { entryListIterator, entryMoreListIterator } from '../../local-flux/actions/entry-actions';
import { selectColumnEntries, selectListsAll } from '../../local-flux/selectors';

class ListColumn extends Component {
    firstCallDone = false;
    firstLoad = () => {
        const { column } = this.props;
        const value = column.get('value');
        if (!column.get('entriesList').size && value && !this.firstCallDone) {
            this.props.entryListIterator({ columnId: column.get('id'), value });
            this.firstCallDone = true;
        }
    };

    componentWillReceiveProps ({ column }) {
        const value = column.get('value');
        if (value !== this.props.column.get('value')) {
            this.props.entryListIterator({ columnId: column.get('id'), value });
        }
    }

    entryMoreListIterator = () => {
        const { column } = this.props;
        this.props.entryMoreListIterator({
            columnId: column.get('id'),
            value: column.get('value')
        });
    };

    onRefresh = () => {
        const { column } = this.props;
        this.props.entryListIterator({
            columnId: column.get('id'),
            value: column.get('value')
        });
    };

    render () {
        const { column, entries, intl, lists } = this.props;
        const className = classNames('column', { column_large: column.get('large') });
        const index = lists.indexOf(list => list.get('id') === column.get('value'));
        const listName = lists.getIn([index, 'name']);
        return (
          <div className={className}>
            <ColumnHeader
              column={column}
              dataSource={lists}
              iconType="entries"
              onRefresh={this.onRefresh}
              title={listName}
            />
            <Waypoint onEnter={this.firstLoad} horizontal={true} />
            <EntryList
              contextId={column.get('id')}
              entries={entries}
              fetchingEntries={column.getIn(['flags', 'fetchingEntries'])}
              fetchingMoreEntries={column.getIn(['flags', 'fetchingMoreEntries'])}
              fetchMoreEntries={this.entryMoreListIterator}
              large={column.get('large')}
              moreEntries={column.getIn(['flags', 'moreEntries'])}
              placeholderMessage={intl.formatMessage(entryMessages.noEntries)}
            />
          </div>
        );
    }
}

ListColumn.propTypes = {
    column: PropTypes.shape().isRequired,
    entries: PropTypes.shape().isRequired,
    entryListIterator: PropTypes.func.isRequired,
    entryMoreListIterator: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    lists: PropTypes.shape().isRequired,
};

function mapStateToProps (state, ownProps) {
    const columnId = ownProps.column.get('id');
    return {
        entries: selectColumnEntries(state, columnId),
        lists: selectListsAll(state)
    };
}

export default connect(
    mapStateToProps,
    {
        entryListIterator,
        entryMoreListIterator,
    }
)(injectIntl(ListColumn));

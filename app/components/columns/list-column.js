import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import { ColumnHeader, EntryList } from '../';
import { ColumnTag } from '../svg';
import { entryMessages } from '../../locale-data/messages';
import { entryListIterator, entryMoreListIterator } from '../../local-flux/actions/entry-actions';
import { selectColumnEntries, selectListsNames } from '../../local-flux/selectors';

class ListColumn extends Component {
    componentDidMount () {
        const { column } = this.props;
        const value = column.get('value');
        if (!column.get('entries').size && value) {
            this.props.entryListIterator({ columnId: column.get('id'), value });
        }
    }

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

        return (
          <div className={className}>
            <ColumnHeader
              column={column}
              dataSource={lists}
              icon={<ColumnTag />}
              onRefresh={this.onRefresh}
            />
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
        lists: selectListsNames(state)
    };
}

export default connect(
    mapStateToProps,
    {
        entryListIterator,
        entryMoreListIterator,
    }
)(injectIntl(ListColumn));

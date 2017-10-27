import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { ColumnHeader, EntryList } from '../';
import { ColumnTag } from '../svg';
import { entryMessages } from '../../locale-data/messages';
import { entryMoreTagIterator, entryTagIterator } from '../../local-flux/actions/entry-actions';
import { selectColumnEntries } from '../../local-flux/selectors';

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
        const { column, entries, intl } = this.props;
        const placeholderMessage = column.get('value') ?
            intl.formatMessage(entryMessages.noEntries) :
            intl.formatMessage(entryMessages.searchTag);

        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ColumnHeader
              column={column}
              onInputChange={() => {}}
              icon={<ColumnTag />}
              onRefresh={this.onRefresh}
            />
            <EntryList
              cardStyle={{ width: column.get('large') ? '700px' : '340px' }}
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
    column: PropTypes.shape().isRequired,
    entries: PropTypes.shape().isRequired,
    entryMoreTagIterator: PropTypes.func.isRequired,
    entryTagIterator: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
};

function mapStateToProps (state, ownProps) {
    const columnId = ownProps.column.get('id');
    return {
        entries: selectColumnEntries(state, columnId),
    };
}

export default connect(
    mapStateToProps,
    {
        entryMoreTagIterator,
        entryTagIterator,
    }
)(injectIntl(TagColumn));

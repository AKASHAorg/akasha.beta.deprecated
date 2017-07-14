import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { ColumnHeader, EntryList } from '../';
import { ColumnTag } from '../svg';
import { entryMessages } from '../../locale-data/messages';
import { dashboardGetTagSuggestions } from '../../local-flux/actions/dashboard-actions';
import { entryMoreTagIterator, entryTagIterator } from '../../local-flux/actions/entry-actions';
import { selectColumnEntries, selectColumnSuggestions } from '../../local-flux/selectors';

class TagColumn extends Component {

    componentDidMount () {
        const { column } = this.props;
        const value = column.get('value');
        if (!column.get('entries').size && value) {
            this.props.entryTagIterator(column.get('id'), value);
        }
    }

    componentWillReceiveProps ({ column }) {
        const newValue = column.get('value');
        if (newValue !== this.props.column.get('value')) {
            this.props.entryTagIterator(column.get('id'), newValue);
        }
    }

    entryMoreTagIterator = () => {
        const { column } = this.props;
        this.props.entryMoreTagIterator(column.get('id'), column.get('value'));
    };

    render () {
        const { column, entries, intl, suggestions } = this.props;
        const placeholderMessage = column.get('value') ?
            intl.formatMessage(entryMessages.noEntries) :
            intl.formatMessage(entryMessages.searchTag);

        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ColumnHeader
              column={column}
              onInputChange={val => this.props.dashboardGetTagSuggestions(val, 'column', column.get('id'))}
              icon={<ColumnTag />}
              suggestions={suggestions}
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
    dashboardGetTagSuggestions: PropTypes.func.isRequired,
    entries: PropTypes.shape().isRequired,
    entryMoreTagIterator: PropTypes.func.isRequired,
    entryTagIterator: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    suggestions: PropTypes.shape().isRequired,
};

function mapStateToProps (state, ownProps) {
    const columnId = ownProps.column.get('id');
    return {
        entries: selectColumnEntries(state, columnId),
        suggestions: selectColumnSuggestions(state, columnId)
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardGetTagSuggestions,
        entryMoreTagIterator,
        entryTagIterator,
    }
)(injectIntl(TagColumn));

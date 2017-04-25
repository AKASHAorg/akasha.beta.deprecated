import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { ColumnHeader } from '../';
import { ColumnTag } from '../svg';
import { EntryListContainer } from '../../shared-components';
import { entryMessages } from '../../locale-data/messages';
import { entryMoreTagIterator, entryTagIterator } from '../../local-flux/actions/entry-actions';
import { selectColumnEntries } from '../../local-flux/selectors';

class TagColumn extends Component {

    componentDidMount () {
        const { column } = this.props;
        const value = column.get('value');
        if (value) {
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
        const { column, entries, intl, profiles } = this.props;
        const placeholderMessage = column.get('value') ?
            intl.formatMessage(entryMessages.noEntries) :
            intl.formatMessage(entryMessages.searchTag);

        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ColumnHeader
              columnId={column.get('id')}
              icon={<ColumnTag />}
              value={column.get('value')}
            />
            <EntryListContainer
              entries={entries}
              fetchingEntries={column.getIn(['flags', 'fetchingEntries'])}
              fetchingMoreEntries={column.getIn(['flags', 'fetchingMoreEntries'])}
              fetchMoreEntries={this.entryMoreTagIterator}
              moreEntries={column.getIn(['flags', 'moreEntries'])}
              placeholderMessage={placeholderMessage}
              profiles={profiles}
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
    profiles: PropTypes.shape().isRequired,
};

function mapStateToProps (state, ownProps) {
    return {
        entries: selectColumnEntries(state, ownProps.column.get('id')),
        profiles: state.profileState.get('byId'),
    };
}

export default connect(
    mapStateToProps,
    {
        entryMoreTagIterator,
        entryTagIterator,
    }
)(injectIntl(TagColumn));

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { ColumnHeader } from '../';
import { ColumnProfile } from '../svg';
import { EntryListContainer } from '../../shared-components';
import { entryMessages } from '../../locale-data/messages';
import { dashboardGetProfileSuggestions } from '../../local-flux/actions/dashboard-actions';
import { entryMoreProfileIterator, entryProfileIterator } from '../../local-flux/actions/entry-actions';
import { selectColumnEntries, selectColumnSuggestions } from '../../local-flux/selectors';

class ProfileColumn extends Component {
    componentDidMount () {
        const { column } = this.props;
        const value = column.get('value');
        if (!column.get('entries').size && value) {
            this.props.entryProfileIterator(column.get('id'), value);
        }
    }

    componentWillReceiveProps ({ column }) {
        const newValue = column.get('value');
        if (newValue !== this.props.column.get('value')) {
            this.props.entryProfileIterator(column.get('id'), newValue);
        }
    }

    entryMoreProfileIterator = () => {
        const { column } = this.props;
        this.props.entryMoreProfileIterator(column.get('id'), column.get('value'));
    };

    render () {
        const { column, entries, intl, profiles, suggestions } = this.props;
        const placeholderMessage = column.get('value') ?
            intl.formatMessage(entryMessages.noEntries) :
            intl.formatMessage(entryMessages.searchProfile);

        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ColumnHeader
              column={column}
              onInputChange={val => this.props.dashboardGetProfileSuggestions(val, column.get('id'))}
              icon={<ColumnProfile />}
              suggestions={suggestions}
            />
            <EntryListContainer
              cardStyle={{ width: column.get('large') ? '700px' : '340px' }}
              contextId={column.get('id')}
              entries={entries}
              fetchingEntries={column.getIn(['flags', 'fetchingEntries'])}
              fetchingMoreEntries={column.getIn(['flags', 'fetchingMoreEntries'])}
              fetchMoreEntries={this.entryMoreProfileIterator}
              moreEntries={column.getIn(['flags', 'moreEntries'])}
              placeholderMessage={placeholderMessage}
              profiles={profiles}
            />
          </div>
        );
    }
}

ProfileColumn.propTypes = {
    column: PropTypes.shape().isRequired,
    dashboardGetProfileSuggestions: PropTypes.func.isRequired,
    entries: PropTypes.shape().isRequired,
    entryMoreProfileIterator: PropTypes.func.isRequired,
    entryProfileIterator: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    profiles: PropTypes.shape().isRequired,
    suggestions: PropTypes.shape().isRequired
};

function mapStateToProps (state, ownProps) {
    const columnId = ownProps.column.get('id');
    return {
        entries: selectColumnEntries(state, ownProps.column.get('id')),
        profiles: state.profileState.get('byId'),
        suggestions: selectColumnSuggestions(state, columnId)
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardGetProfileSuggestions,
        entryMoreProfileIterator,
        entryProfileIterator,
    }
)(injectIntl(ProfileColumn));

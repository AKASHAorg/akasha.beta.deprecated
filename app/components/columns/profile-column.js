import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { ColumnHeader } from '../';
import { ColumnProfile } from '../svg';
import { EntryListContainer } from '../../shared-components';
import { entryMessages } from '../../locale-data/messages';
import { entryMoreProfileIterator, entryProfileIterator } from '../../local-flux/actions/entry-actions';
import { selectColumnEntries } from '../../local-flux/selectors';

const hardCodedProfile = 'john.doe';

class ProfileColumn extends Component {

    componentDidMount () {
        const { column } = this.props;
        this.props.entryProfileIterator(column.get('id'), hardCodedProfile);
    }

    entryMoreTagIterator = () => {
        const { column } = this.props;
        this.props.entryMoreProfileIterator(column.get('id'), hardCodedProfile);
    };

    render () {
        const { column, entries, intl, profiles } = this.props;

        return (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ColumnHeader
              icon={<ColumnProfile />}
              title={hardCodedProfile}
            />
            <EntryListContainer
              entries={entries}
              fetchingEntries={column.getIn(['flags', 'fetchingEntries'])}
              fetchingMoreEntries={column.getIn(['flags', 'fetchingMoreEntries'])}
              fetchMoreEntries={this.entryMoreTagIterator}
              moreEntries={column.getIn(['flags', 'moreEntries'])}
              placeholderMessage={intl.formatMessage(entryMessages.noNewEntries)}
              profiles={profiles}
            />
          </div>
        );
    }
}

ProfileColumn.propTypes = {
    column: PropTypes.shape().isRequired,
    entries: PropTypes.shape().isRequired,
    entryMoreProfileIterator: PropTypes.func.isRequired,
    entryProfileIterator: PropTypes.func.isRequired,
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
        entryMoreProfileIterator,
        entryProfileIterator,
    }
)(injectIntl(ProfileColumn));

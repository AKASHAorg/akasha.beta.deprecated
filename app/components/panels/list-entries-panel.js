import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { FormattedDate, injectIntl } from 'react-intl';
import { entryListIterator } from '../../local-flux/actions/entry-actions';
import { selectEntry, selectListByName } from '../../local-flux/selectors';
import { generalMessages } from '../../locale-data/messages';
import { EntryList } from '../';

class ListEntriesPanel extends Component {
    componentDidMount () {
        const { list } = this.props;
        this.props.entryListIterator(list.get('name'));
    }

    render () {
        const { entries, intl, list } = this.props;
        const date = (
          <FormattedDate
            day="2-digit"
            month="long"
            value={new Date(list.get('timestamp'))}
            year="numeric"
          />
        );

        return (
          <div className="list-entries-panel">
            <div className="list-entries-panel__header">
              <div className="list-entries-panel__name">
                {list.get('name')}
              </div>
              <div className="list-entries-panel__date">
                <span>
                  {intl.formatMessage(generalMessages.created)}
                </span>
                {date}
              </div>
            </div>
            <div className="list-entries-panel__content">
              <EntryList
                contextId={list.get('name')}
                entries={entries}
                fetchMoreEntries={() => this.props.entryListIterator(list.get('name'))}
                masonry
                moreEntries={list.get('moreEntries')}
                style={{ padding: '0px 50px' }}
              />
            </div>
          </div>
        );
    }
}

ListEntriesPanel.propTypes = {
    entries: PropTypes.shape(),
    entryListIterator: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    list: PropTypes.shape(),
};

function mapStateToProps (state, ownProps) {
    const { listName } = ownProps.match.params;
    const list = selectListByName(state, listName);
    const entries = list && list.get('entryIds').map(id => selectEntry(state, id));
    return {
        entries,
        list,
    };
}

export default connect(
    mapStateToProps,
    {
        entryListIterator,
    }
)(injectIntl(ListEntriesPanel));

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import classNames from 'classnames';
import Waypoint from 'react-waypoint';
import { ColumnHeader, EntryList } from '../';
import { entryMessages } from '../../locale-data/messages';
import { dashboardResetColumnEntries } from '../../local-flux/actions/dashboard-actions';
import { entryListIterator, entryMoreListIterator } from '../../local-flux/actions/entry-actions';
import { dashboardSelectors, listSelectors } from '../../local-flux/selectors';
import { dashboardMessages } from '../../locale-data/messages/dashboard-messages';
import withRequest from '../high-order-components/with-request';

class ListColumn extends Component {
    firstCallDone = false;

    componentWillReceiveProps ({ column }) {
        const value = column.get('value');
        this.props.dispatchAction(entryListIterator({
            columnId: column.get('id'),
            value
        }), (value !== this.props.column.get('value')));

    }

    componentWillUnmount () {
        const { column } = this.props;
        this.props.dashboardResetColumnEntries(column.get('id'));
    }

    firstLoad = () => {
        const { column, lists } = this.props;
        const value = column.get('value');
        const list = lists.find(lst => lst.get('id') === value);
        if (list && !column.get('entriesList').size && value && !this.firstCallDone) {
            this.props.dispatchAction(entryListIterator({ columnId: column.get('id'), value }));
            this.firstCallDone = true;
        }
    };

    entryMoreListIterator = () => {
        const { column } = this.props;
        this.props.disaptchAction(entryListIterator({
            columnId: column.get('id'),
            value: value
        }));
    };

    onRefresh = () => {
        const { column, lists } = this.props;
        const value = column.get('value');
        const list = lists.find(lst => lst.get('id') === value);
        if (list) {
            this.props.disaptchAction(entryListIterator({
                columnId: column.get('id'),
                value: value
            }));
        }
    };

    render () {
        const { column, entries, intl, lists } = this.props;
        const className = classNames('column', { column_large: column.get('large') });
        const list = lists.find(lst => lst.get('id') === column.get('value'));
        const listName = list ? list.get('name') : ' ';
        return (
            <div className={ className }>
                <ColumnHeader
                    column={ column }
                    dataSource={ lists }
                    iconType="entries"
                    onRefresh={ this.onRefresh }
                    readOnly={ !list }
                    title={ listName }
                />
                <Waypoint onEnter={ this.firstLoad } horizontal/>
                { !list &&
                <div className="flex-center column__placeholder">
                    { intl.formatMessage(dashboardMessages.listDeleted) }
                </div>
                }
                { list &&
                <EntryList
                    contextId={ column.get('id') }
                    entries={ entries }
                    fetchingEntries={ column.getIn(['flags', 'fetchingEntries']) }
                    fetchingMoreEntries={ column.getIn(['flags', 'fetchingMoreEntries']) }
                    fetchMoreEntries={ this.entryMoreListIterator }
                    large={ column.get('large') }
                    moreEntries={ column.getIn(['flags', 'moreEntries']) }
                    placeholderMessage={ intl.formatMessage(entryMessages.noEntries) }
                />
                }
            </div>
        );
    }
}

ListColumn.propTypes = {
    column: PropTypes.shape().isRequired,
    dashboardResetColumnEntries: PropTypes.func.isRequired,
    entries: PropTypes.shape().isRequired,
    entryListIterator: PropTypes.func.isRequired,
    entryMoreListIterator: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
    lists: PropTypes.shape().isRequired,
};

function mapStateToProps (state, ownProps) {
    const columnId = ownProps.column.get('id');
    return {
        entries: dashboardSelectors.getColumnEntries(state, columnId),
        lists: listSelectors.selectLists(state)
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardResetColumnEntries,
        // entryListIterator,
        entryMoreListIterator,
    }
)(injectIntl(withRequest(ListColumn)));

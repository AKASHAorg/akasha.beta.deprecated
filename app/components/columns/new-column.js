import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button } from 'antd';
import classNames from 'classnames';
import * as columnTypes from '../../constants/columns';
import { dashboardAddColumn, dashboardAddNewColumn, dashboardDeleteNewColumn,
    dashboardResetNewColumn, dashboardUpdateNewColumn } from '../../local-flux/actions/dashboard-actions';
import { entryListIterator, entryMoreListIterator, entryMoreProfileIterator, entryMoreTagIterator,
    entryProfileIterator, entryTagIterator } from '../../local-flux/actions/entry-actions';
import { searchProfiles, searchTags } from '../../local-flux/actions/search-actions';
import { selectColumn, selectColumnEntries, selectListsAll, selectNewColumn, selectProfileSearchResults,
    selectTagSearchResults } from '../../local-flux/selectors';
import { dashboardMessages, generalMessages } from '../../locale-data/messages';
import { getDisplayName } from '../../utils/dataModule';
import { Icon, NewSearchColumn, NewSelectColumn } from '../';

const columns = [columnTypes.latest, columnTypes.stream, columnTypes.profile, columnTypes.tag,
    columnTypes.list];
const oneStepColumns = [columnTypes.latest, columnTypes.stream];
const iconTypes = {
    [columnTypes.latest]: 'entries',
    [columnTypes.stream]: 'entries',
    [columnTypes.profile]: 'user',
    [columnTypes.tag]: 'tag',
    [columnTypes.list]: 'entries',
};

class NewColumn extends Component {
    state = {
        selectedColumn: null
    };

    componentWillReceiveProps (nextProps) {
        const { newColumn } = nextProps;
        if (!newColumn && this.props.newColumn) {
            this.setState({ selectedColumn: null });
        }
    }

    isDisabled = () => {
        const { newColumn } = this.props;
        const { selectedColumn } = this.state;
        if (!selectedColumn) {
            return true;
        }
        if (oneStepColumns.includes(selectedColumn)) {
            return false;
        }
        if (newColumn.get('type')) {
            return !newColumn.get('value');
        }
        return false;
    };

    updateNewColumn = type => this.props.dashboardUpdateNewColumn({ type });

    onAddColumn = () => {
        const { newColumn } = this.props;
        const { selectedColumn } = this.state;
        if (oneStepColumns.includes(selectedColumn)) {
            this.props.dashboardAddColumn(selectedColumn);
        } else if (newColumn.get('value')) {
            this.props.dashboardAddColumn(newColumn.get('type'), newColumn.get('value'));
        } else {
            this.props.dashboardUpdateNewColumn({ type: selectedColumn });
        }
    };

    onCancel = () => {
        const { newColumn } = this.props;
        if (!newColumn.get('type')) {
            this.props.dashboardDeleteNewColumn();
        } else {
            this.setState({ selectedColumn: null });
            this.props.dashboardUpdateNewColumn({ type: null, value: null });
        }
    }

    onSelectColumn = (selectedColumn) => { this.setState({ selectedColumn }); };

    renderPlaceholder = () => (
      <div className="new-column">
        <div className="new-column__inner">
          <div
            className="flex-center new-column__placeholder content-link"
            onClick={this.props.dashboardAddNewColumn}
          >
            <span>
              {this.props.intl.formatMessage(dashboardMessages.addColumn)}
            </span>
          </div>
        </div>
      </div>
    );

    renderListItem = (columnType) => {
        const { intl } = this.props;
        const { selectedColumn } = this.state;
        const className = classNames('flex-center-y new-column__list-item', {
            'new-column__list-item_active': columnType === selectedColumn
        });

        return (
          <div
            className={className}
            key={columnType}
            onClick={() => this.onSelectColumn(columnType)}
          >
            <Icon className="dark-icon new-column__icon" type={iconTypes[columnType]} />
            <span>{intl.formatMessage(dashboardMessages[columnType])}</span>
          </div>
        );
    };

    render () {
        const { column, intl, lists, newColumn, previewEntries, profileResults, tagResults } = this.props;
        if (!newColumn) {
            return this.renderPlaceholder();
        }

        let component, displayName, previewMessage, title, subtitle, listName; // eslint-disable-line
        const value = column.get('value');
        if (newColumn.get('type') === columnTypes.list) {
            const list = lists.find(lst => lst.get('id') === value);
            listName = list && list.get('name');
        }
        const props = {
            column,
            dashboardResetNewColumn: this.props.dashboardResetNewColumn,
            dashboardUpdateNewColumn: this.props.dashboardUpdateNewColumn,
            newColumn,
            previewEntries
        };
        switch (newColumn.get('type')) {
            case columnTypes.profile:
                if (!value) {
                    displayName = '';
                } else if (value.length === 42 && value.startsWith('0x')) {
                    displayName = getDisplayName({ ethAddress: value });
                } else {
                    displayName = getDisplayName({ akashaId: value });
                }
                previewMessage = intl.formatMessage(dashboardMessages.previewProfile, {
                    displayName
                });
                component = (
                  <NewSearchColumn
                    dataSource={profileResults}
                    entryIterator={this.props.entryProfileIterator}
                    entryMoreIterator={this.props.entryMoreProfileIterator}
                    onSearch={this.props.searchProfiles}
                    previewMessage={previewMessage}
                    {...props}
                  />
                );
                title = dashboardMessages.addNewProfileColumn;
                subtitle = dashboardMessages.addNewProfileColumnSubtitle;
                break;
            case columnTypes.tag:
                previewMessage = intl.formatMessage(dashboardMessages.previewTag, { tagName: value });
                component = (
                  <NewSearchColumn
                    dataSource={tagResults}
                    entryIterator={this.props.entryTagIterator}
                    entryMoreIterator={this.props.entryMoreTagIterator}
                    onSearch={this.props.searchTags}
                    previewMessage={previewMessage}
                    {...props}
                  />
                );
                title = dashboardMessages.addNewTagColumn;
                subtitle = dashboardMessages.addNewTagColumnSubtitle;
                break;
            case columnTypes.list:
                previewMessage = intl.formatMessage(dashboardMessages.previewList, { listName });
                component = (
                  <NewSelectColumn
                    entryIterator={this.props.entryListIterator}
                    entryMoreIterator={this.props.entryMoreListIterator}
                    options={lists}
                    previewMessage={previewMessage}
                    {...props}
                  />
                );
                title = dashboardMessages.addNewListColumn;
                subtitle = dashboardMessages.addNewListColumnSubtitle;
                break;
            default:
                title = dashboardMessages.addNewColumn;
                subtitle = dashboardMessages.addNewColumnSubtitle;
                break;
        }

        return (
          <div className="new-column">
            <div className="new-column__inner">
              <div className="new-column__header">
                <div className="flex-center-y new-column__title">
                  {intl.formatMessage(title)}
                </div>
                <div className="new-column__subtitle">
                  {intl.formatMessage(subtitle)}
                </div>
              </div>
              <div className="new-column__content">
                {component}
                {!component &&
                  <div className="new-column__list">
                    {columns.map(this.renderListItem)}
                  </div>
                }
                <div className="new-column__actions">
                  <Button
                    className="new-column__button"
                    onClick={this.onCancel}
                  >
                    {intl.formatMessage(generalMessages.cancel)}
                  </Button>
                  <Button
                    className="new-column__button"
                    disabled={this.isDisabled()}
                    onClick={this.onAddColumn}
                    type="primary"
                  >
                    {intl.formatMessage(generalMessages.add)}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        );
    }
}

NewColumn.propTypes = {
    column: PropTypes.shape().isRequired,
    dashboardAddColumn: PropTypes.func.isRequired,
    dashboardAddNewColumn: PropTypes.func.isRequired,
    dashboardDeleteNewColumn: PropTypes.func.isRequired,
    dashboardResetNewColumn: PropTypes.func.isRequired,
    dashboardUpdateNewColumn: PropTypes.func.isRequired,
    entryListIterator: PropTypes.func.isRequired,
    entryMoreListIterator: PropTypes.func.isRequired,
    entryMoreProfileIterator: PropTypes.func.isRequired,
    entryMoreTagIterator: PropTypes.func.isRequired,
    entryProfileIterator: PropTypes.func.isRequired,
    entryTagIterator: PropTypes.func.isRequired,
    intl: PropTypes.shape(),
    lists: PropTypes.shape().isRequired,
    newColumn: PropTypes.shape(),
    previewEntries: PropTypes.shape().isRequired,
    profileResults: PropTypes.shape().isRequired,
    searchProfiles: PropTypes.func.isRequired,
    searchTags: PropTypes.func.isRequired,
    tagResults: PropTypes.shape().isRequired,
};

function mapStateToProps (state) {
    return {
        column: selectColumn(state, 'newColumn'),
        lists: selectListsAll(state),
        newColumn: selectNewColumn(state),
        previewEntries: selectColumnEntries(state, 'newColumn'),
        profileResults: selectProfileSearchResults(state),
        tagResults: selectTagSearchResults(state)
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardAddColumn,
        dashboardAddNewColumn,
        dashboardDeleteNewColumn,
        dashboardResetNewColumn,
        dashboardUpdateNewColumn,
        entryListIterator,
        entryMoreListIterator,
        entryMoreProfileIterator,
        entryMoreTagIterator,
        entryProfileIterator,
        entryTagIterator,
        searchProfiles,
        searchTags
    }
)(injectIntl(NewColumn));

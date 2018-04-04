import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button, Input, Form } from 'antd';
import classNames from 'classnames';
import * as columnTypes from '../../constants/columns';
import { listAdd } from '../../local-flux/actions/list-actions';
import { dashboardAddColumn, dashboardAddNewColumn, dashboardDeleteNewColumn,
    dashboardResetNewColumn, dashboardUpdateNewColumn } from '../../local-flux/actions/dashboard-actions';
import { entryListIterator, entryMoreListIterator, entryMoreProfileIterator, entryMoreTagIterator,
    entryProfileIterator, entryTagIterator } from '../../local-flux/actions/entry-actions';
import { searchProfiles, searchResetResults, searchTags } from '../../local-flux/actions/search-actions';
import { selectActiveDashboard, selectColumn, selectColumnEntries, selectListsAll, selectNewColumn,
    selectProfileSearchResults, selectTagSearchResults } from '../../local-flux/selectors';
import { dashboardMessages, generalMessages, listMessages } from '../../locale-data/messages';
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
        selectedColumn: null,
        newListName: '',
        newListDescription: ''
    };

    componentWillReceiveProps (nextProps) {
        const { newColumn } = nextProps;
        if (!newColumn && this.props.newColumn) {
            this.setState({ selectedColumn: null });
        }
    }

    shouldComponentUpdate (nextProps, nextState) { // eslint-disable-line complexity
        const { activeDashboard, column, dashboardId, lists, newColumn, previewEntries, profileResults,
            tagResults } = nextProps;
        const { newListDescription, newListName, selectedColumn } = nextState;
        if (
            !activeDashboard.equals(this.props.activeDashboard) ||
            !column.equals(this.props.column) ||
            dashboardId !== this.props.dashboardId ||
            !lists.equals(this.props.lists) ||
            (!newColumn && this.props.newColumn) ||
            (newColumn && !newColumn.equals(this.props.newColumn)) ||
            !previewEntries.equals(this.props.previewEntries) ||
            !profileResults.equals(this.props.profileResults) ||
            !tagResults.equals(this.props.tagResults) ||
            selectedColumn !== this.state.selectedColumn ||
            newListDescription !== this.state.newListDescription ||
            newListName !== this.state.newListName
        ) {
            return true;
        }
        return false;
    }

    componentWillUnmount () {
        this.props.searchResetResults();
    }

    isDisabled = () => {
        const { lists, newColumn } = this.props;
        const { newListName, selectedColumn } = this.state;
        if (!selectedColumn) {
            return true;
        }
        if (oneStepColumns.includes(selectedColumn)) {
            return false;
        }
        if (newColumn.get('type') === columnTypes.list && lists.size === 0 && newListName) {
            return false;
        }
        if (newColumn.get('type')) {
            return !newColumn.get('value');
        }
        return false;
    };

    onListNameChange = (ev) => {
        this.setState({ newListName: ev.target.value });
    };

    onListDescriptionChange = (ev) => {
        this.setState({ newListDescription: ev.target.value });
    };

    updateNewColumn = type => this.props.dashboardUpdateNewColumn({ type });

    onAddColumn = () => {
        const { newColumn } = this.props;
        const { newListDescription, newListName, selectedColumn } = this.state;
        if (oneStepColumns.includes(selectedColumn)) {
            this.props.dashboardAddColumn(selectedColumn);
        } else if (newListName) {
            this.props.listAdd({
                name: newListName,
                description: newListDescription,
                entryIds: [],
                addColumn: true
            });
            this.setState({
                newListName: '',
                newListDescription: ''
            });
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
            this.setState({
                selectedColumn: null,
                newListName: '',
                newListDescription: ''
            });
            this.props.dashboardUpdateNewColumn({ type: null, value: null });
        }
    }

    onSelectColumn = (selectedColumn) => {
        if (!oneStepColumns.includes(selectedColumn)) {
            this.setState({ selectedColumn }, () => {
                this.props.dashboardUpdateNewColumn({ type: selectedColumn });
            });
        } else {
            this.setState({ selectedColumn });
        }
    };

    renderPlaceholder = () => (
      <div className="new-column">
        <div className="new-column__inner new-column__inner_placeholder">
          <div className="new-column__placeholder-background">
            <div className="flex-center-x new-column__placeholder-title">
              {this.props.intl.formatMessage(dashboardMessages.noColumnsTitle)}
            </div>
            <div className="flex-center-x new-column__placeholder-message">
              {this.props.intl.formatMessage(dashboardMessages.noColumns)}
            </div>
            <div className="flex-center-x">
              <Button
                onClick={this.props.dashboardAddNewColumn}
                type="primary"
              >
                {this.props.intl.formatMessage(dashboardMessages.addFirstColumn)}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );

    renderNewColumn = () => (
      <div className="new-column">
        <div className="new-column__inner">
          <div
            className="flex-center new-column__add-column"
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

    render () { // eslint-disable-line complexity
        const { activeDashboard, column, entries, dashboardId, intl, lists, newColumn, previewEntries,
            profileResults, tagResults } = this.props;
        if (dashboardId !== activeDashboard.get('id')) {
            return null;
        }
        if (!newColumn) {
            const hasColumns = !!activeDashboard.get('columns').size;
            return hasColumns ? this.renderNewColumn() : this.renderPlaceholder();
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
            previewEntries,
            entries
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
                    dataSource={tagResults.filter(t => !t.includes(' '))}
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
                component = (lists.size !== 0) ?
                    (
                      <NewSelectColumn
                        entryIterator={this.props.entryListIterator}
                        entryMoreIterator={this.props.entryMoreListIterator}
                        options={lists}
                        previewMessage={previewMessage}
                        {...props}
                      />
                    ) :
                    (
                      <div className="new-column__new-list">
                        <Form>
                          <Form.Item
                            label={intl.formatMessage(listMessages.listName)}
                            colon={false}
                          >
                            <div className="new-column__new-list-input">
                              <Input
                                value={this.state.newListName}
                                onChange={this.onListNameChange}
                              />
                            </div>
                          </Form.Item>
                          <Form.Item
                            label={intl.formatMessage(listMessages.shortDescription)}
                            colon={false}
                          >
                            <div className="new-column__new-list-input">
                              <Input
                                value={this.state.newListDescription}
                                onChange={this.onListDescriptionChange}
                              />
                            </div>
                          </Form.Item>
                        </Form>
                      </div>
                    );
                title = dashboardMessages.addNewListColumn;
                subtitle = (lists.size !== 0) ?
                    dashboardMessages.addNewListColumnSubtitle :
                    dashboardMessages.createNewListColumnSubtitle
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
    activeDashboard: PropTypes.shape(),
    column: PropTypes.shape().isRequired,
    dashboardAddColumn: PropTypes.func.isRequired,
    dashboardAddNewColumn: PropTypes.func.isRequired,
    dashboardDeleteNewColumn: PropTypes.func.isRequired,
    dashboardId: PropTypes.string.isRequired,
    dashboardResetNewColumn: PropTypes.func.isRequired,
    dashboardUpdateNewColumn: PropTypes.func.isRequired,
    entries: PropTypes.shape(),
    entryListIterator: PropTypes.func.isRequired,
    entryMoreListIterator: PropTypes.func.isRequired,
    entryMoreProfileIterator: PropTypes.func.isRequired,
    entryMoreTagIterator: PropTypes.func.isRequired,
    entryProfileIterator: PropTypes.func.isRequired,
    entryTagIterator: PropTypes.func.isRequired,
    intl: PropTypes.shape(),
    lists: PropTypes.shape().isRequired,
    listAdd: PropTypes.func.isRequired,
    newColumn: PropTypes.shape(),
    previewEntries: PropTypes.shape().isRequired,
    profileResults: PropTypes.shape().isRequired,
    searchProfiles: PropTypes.func.isRequired,
    searchResetResults: PropTypes.func.isRequired,
    searchTags: PropTypes.func.isRequired,
    tagResults: PropTypes.shape().isRequired,
};

function mapStateToProps (state) {
    return {
        activeDashboard: selectActiveDashboard(state),
        column: selectColumn(state, 'newColumn'),
        lists: selectListsAll(state),
        newColumn: selectNewColumn(state),
        previewEntries: selectColumnEntries(state, 'newColumn'),
        entries: state.entryState.get('byId'),
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
        listAdd,
        searchProfiles,
        searchResetResults,
        searchTags
    }
)(injectIntl(NewColumn));

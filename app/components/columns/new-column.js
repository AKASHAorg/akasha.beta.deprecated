import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Button } from 'antd';
import classNames from 'classnames';
import * as columnTypes from '../../constants/columns';
import { dashboardAddColumn, dashboardAddNewColumn, dashboardDeleteNewColumn,
    dashboardUpdateNewColumn } from '../../local-flux/actions/dashboard-actions';
import { selectNewColumn } from '../../local-flux/selectors';
import { dashboardMessages, generalMessages } from '../../locale-data/messages';
import { NewTagColumn } from '../';

const columns = [columnTypes.latest, columnTypes.stream, columnTypes.profile, columnTypes.tag];
const oneStepColumns = [columnTypes.latest, columnTypes.stream];

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
          <div className="flex-center new-column__placeholder">
            <span className="content-link" onClick={this.props.dashboardAddNewColumn}>
              {this.props.intl.formatMessage(dashboardMessages.addColumn)}
            </span>
          </div>
        </div>
      </div>
    );

    renderListItem = (columnType) => {
        const { intl } = this.props;
        const { selectedColumn } = this.state;
        const className = classNames('new-column__list-item', {
            'new-column__list-item_active': columnType === selectedColumn
        });

        return (
          <div
            className={className}
            key={columnType}
            onClick={() => this.onSelectColumn(columnType)}
          >
            {intl.formatMessage(dashboardMessages[columnType])}
          </div>
        );
    };

    render () {
        const { intl, newColumn } = this.props;

        if (!newColumn) {
            return this.renderPlaceholder();
        }

        let component;
        let title;
        let subtitle;
        switch (newColumn.get('type')) {
            case columnTypes.tag:
                component = <NewTagColumn column={newColumn} />;
                title = dashboardMessages.addNewTagColumn;
                subtitle = dashboardMessages.addNewTagColumnSubtitle;
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
                    size="large"
                  >
                    {intl.formatMessage(generalMessages.cancel)}
                  </Button>
                  <Button
                    className="new-column__button"
                    disabled={this.isDisabled()}
                    onClick={this.onAddColumn}
                    size="large"
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
    dashboardAddColumn: PropTypes.func.isRequired,
    dashboardAddNewColumn: PropTypes.func.isRequired,
    dashboardDeleteNewColumn: PropTypes.func.isRequired,
    dashboardUpdateNewColumn: PropTypes.func.isRequired,
    intl: PropTypes.shape(),
    newColumn: PropTypes.shape(),
};

function mapStateToProps (state) {
    return {
        newColumn: selectNewColumn(state)
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardAddColumn,
        dashboardAddNewColumn,
        dashboardDeleteNewColumn,
        dashboardUpdateNewColumn,
    }
)(injectIntl(NewColumn));

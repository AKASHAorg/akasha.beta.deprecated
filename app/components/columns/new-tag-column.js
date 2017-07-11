import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { List, ListItem } from 'material-ui';
import { entryMessages } from '../../locale-data/messages';
import { dashboardAddColumn, dashboardUpdateNewColumn } from '../../local-flux/actions/dashboard-actions';
import { NewColumnFooter, SearchInput } from '../';
import styles from './new-tag-column.scss';

const NewTagColumn = (props) => {
    const { column, entriesCount, intl } = props;
    const onAdd = () => props.dashboardAddColumn(column.get('type'), column.get('value'));
    const onBack = () => props.dashboardUpdateNewColumn();
    const onChange = value => props.dashboardUpdateNewColumn({ value });

    return (
      <div className={styles.root}>
        <div style={{ flex: '0 0 auto', padding: '10px 0' }}>
          <SearchInput
            onChange={onChange}
            onSubmit={onAdd}
            value={column.get('value')}
          />
        </div>
        <List style={{ flex: '1 1 auto' }}>
          {column.get('value') && column.get('suggestions').map((tag) => {
              const count = entriesCount.get(tag);
              const message = count && intl.formatMessage(entryMessages.entriesCount, { count });
              return (
                <ListItem
                  key={tag}
                  innerDivStyle={{ height: '64px', paddingTop: '15px', paddingBottom: '15px' }}
                  onClick={() => onChange(tag)}
                  primaryText={tag}
                  secondaryText={message}
                />
              );
          })}
        </List>
        <NewColumnFooter
          onBack={onBack}
          onAdd={onAdd}
        />
      </div>
    );
};

NewTagColumn.contextTypes = {
    muiTheme: PropTypes.shape()
};

NewTagColumn.propTypes = {
    column: PropTypes.shape(),
    dashboardAddColumn: PropTypes.func.isRequired,
    dashboardUpdateNewColumn: PropTypes.func.isRequired,
    entriesCount: PropTypes.shape(),
    intl: PropTypes.shape(),
};

function mapStateToProps (state) {
    return {
        entriesCount: state.tagState.get('entriesCount')
    };
}

export default connect(
    mapStateToProps,
    {
        dashboardAddColumn,
        dashboardUpdateNewColumn
    }
)(injectIntl(NewTagColumn));

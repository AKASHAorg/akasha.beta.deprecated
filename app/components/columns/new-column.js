import React, { PropTypes } from 'react';
import { injectIntl } from 'react-intl';
import { List, ListItem } from 'material-ui';
import * as columnTypes from '../../constants/columns';
import { dashboardMessages } from '../../locale-data/messages';
import { NewTagColumn } from '../';
import styles from './new-column.scss';

const columns = [columnTypes.latest, columnTypes.stream, columnTypes.profile, columnTypes.tag];

const NewColumn = ({ column, intl, updateNewColumn }, { muiTheme }) => {
    const { palette } = muiTheme;
    let component;
    let title;
    let subtitle;
    switch (column.get('type')) {
        case columnTypes.tag:
            component = <NewTagColumn column={column} />;
            title = dashboardMessages.addNewTagColumn;
            subtitle = dashboardMessages.addNewTagColumnSubtitle;
            break;
        default:
            title = dashboardMessages.addNewColumn;
            subtitle = dashboardMessages.addNewColumnSubtitle;
            break;
    }

    return (
      <div className={styles.root}>
        <div
          className={styles.inner}
          style={{ borderColor: palette.borderColor, backgroundColor: palette.columnColor }}
        >
          <div className={styles.header}>
            <div>{intl.formatMessage(title)}</div>
            <small>{intl.formatMessage(subtitle)}</small>
          </div>
          <div className={styles.content}>
            {component}
            {!component &&
              <List>
                {columns.map(columnType => (
                  <ListItem
                    key={columnType}
                    onClick={() => updateNewColumn({ type: columnType })}
                    primaryText={intl.formatMessage(dashboardMessages[columnType])}
                  />
                ))}
              </List>
            }
          </div>
        </div>
      </div>
    );
};

NewColumn.contextTypes = {
    muiTheme: PropTypes.shape()
};

NewColumn.propTypes = {
    column: PropTypes.shape(),
    intl: PropTypes.shape(),
    updateNewColumn: PropTypes.func.isRequired
};

export default injectIntl(NewColumn);

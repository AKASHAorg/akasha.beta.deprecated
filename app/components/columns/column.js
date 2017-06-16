import PropTypes from 'prop-types';
import React from 'react';
import { columnType } from '../../constants/columns';
import { LatestColumn, ProfileColumn, StreamColumn, TagColumn } from '../';

const Column = ({ column }) => {
    let component;
    switch (column.get('type')) {
        case columnType.latest:
            component = <LatestColumn column={column} />;
            break;
        case columnType.tag:
            component = <TagColumn column={column} />;
            break;
        case columnType.stream:
            component = <StreamColumn column={column} />;
            break;
        case columnType.profile:
            component = <ProfileColumn column={column} />;
            break;
        default:
            break;
    }
    return (
      <div style={{ height: '100%', width: '100%' }}>
        {component}
      </div>
    );
};

Column.propTypes = {
    column: PropTypes.shape()
};

export default Column;

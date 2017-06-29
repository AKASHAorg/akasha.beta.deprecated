import PropTypes from 'prop-types';
import React from 'react';
import * as columnTypes from '../../constants/columns';
import { LatestColumn, ProfileColumn, StreamColumn, TagColumn } from '../';

const Column = ({ column }) => {
    let component;
    switch (column.get('type')) {
        case columnTypes.latest:
            component = <LatestColumn column={column} />;
            break;
        case columnTypes.tag:
            component = <TagColumn column={column} />;
            break;
        case columnTypes.stream:
            component = <StreamColumn column={column} />;
            break;
        case columnTypes.profile:
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

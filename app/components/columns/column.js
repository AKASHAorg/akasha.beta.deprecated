import PropTypes from 'prop-types';
import React from 'react';
import { columnType } from '../../constants/columns';
import { LatestColumn, StreamColumn, TagColumn } from '../';

const Column = ({ column }) => {
    switch (column.get('type')) {
        case columnType.latest:
            return <LatestColumn column={column} />;
        case columnType.tag:
            return <TagColumn column={column} />;
        case columnType.stream:
            return <StreamColumn column={column} />;
        default:
            return null;
    }
};

Column.propTypes = {
    column: PropTypes.shape()
};

export default Column;

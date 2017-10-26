import PropTypes from 'prop-types';
import React from 'react';
import * as columnTypes from '../../constants/columns';
import { LatestColumn, ProfileColumn, StreamColumn, TagColumn } from '../';

const Column = ({ column, baseWidth }) => {
    let component;
    switch (column.get('type')) {
        case columnTypes.latest:
            component = <LatestColumn column={column} baseWidth={baseWidth} />;
            break;
        case columnTypes.tag:
            component = <TagColumn column={column} baseWidth={baseWidth} />;
            break;
        case columnTypes.stream:
            component = <StreamColumn column={column} baseWidth={baseWidth} />;
            break;
        case columnTypes.profile:
            component = <ProfileColumn column={column} baseWidth={baseWidth} />;
            break;
        default:
            break;
    }
    return (
      <div className="column__wrapper">
        {component}
      </div>
    );
};

Column.propTypes = {
    column: PropTypes.shape()
};

export default Column;

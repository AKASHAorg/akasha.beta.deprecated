import PropTypes from 'prop-types';
import React from 'react';
import * as columnTypes from '../../constants/columns';
import { LatestColumn, ListColumn, ProfileColumn, StreamColumn, TagColumn } from '../';

const Column = ({ column, baseWidth }) => {
    let component;
    const props = { column, baseWidth };
    switch (column.get('type')) {
        case columnTypes.latest:
            component = <LatestColumn {...props} />;
            break;
        case columnTypes.list:
            component = <ListColumn {...props} />;
            break;
        case columnTypes.tag:
            component = <TagColumn {...props} />;
            break;
        case columnTypes.stream:
            component = <StreamColumn {...props} />;
            break;
        case columnTypes.profile:
            component = <ProfileColumn {...props} />;
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
    baseWidth: PropTypes.number,
    column: PropTypes.shape()
};

export default Column;

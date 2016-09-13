import React from 'react';
import { Chip } from 'material-ui';

const TagChip = ({ style, onTagClick, tag }) => {
    const tagStyle = {
        display: 'inline-block',
        border: '1px solid',
        borderColor: '#DDD',
        backgroundColor: '#FFF',
        borderRadius: 3,
        height: 34,
        verticalAlign: 'middle',
        marginRight: '4px',
        marginBottom: '4px',
        cursor: 'pointer',
    };
    return (
      <Chip
        style={{ ...tagStyle, ...style }}
        onTouchTap={(ev) => onTagClick(ev, tag)}
      >
        {tag}
      </Chip>
    );
};

TagChip.propTypes = {
    tag: React.PropTypes.string.isRequired,
    style: React.PropTypes.object,
    onTagClick: React.PropTypes.func.isRequired
};

export default TagChip;

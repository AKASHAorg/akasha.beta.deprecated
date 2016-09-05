import React from 'react';
import { Chip } from 'material-ui';

const TagChip = (props) => {
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
        style={{ ...tagStyle, ...props.style }}
        onTouchTap={(ev) => props.onTagClick(ev, props.tag)}
      >
        {props.tag}
      </Chip>
    );
};

TagChip.propTypes = {
    tag: React.PropTypes.string,
    style: React.PropTypes.object,
    onTagClick: React.PropTypes.func
};

export default TagChip;

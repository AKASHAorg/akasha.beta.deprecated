import PropTypes from 'prop-types';
import React from 'react';
import { Tag } from 'antd';

const TagChip = ({ style, onTagClick, tag, isSelected }, { muiTheme }) => {
    const { palette } = muiTheme;
    const tagStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid',
        borderColor: palette.borderColor,
        backgroundColor: palette.canvasColor,
        borderRadius: 3,
        height: 34,
        marginRight: '4px',
        marginBottom: '4px',
        cursor: 'pointer',
    };
    return (
      <Tag
        style={{ ...tagStyle, ...style }}
        onTouchTap={ev => onTagClick(ev, tag)}
      >
        {tag}
      </Tag>
    );
};

TagChip.propTypes = {
    tag: PropTypes.string.isRequired,
    isSelected: PropTypes.bool,
    style: PropTypes.shape(),
    onTagClick: PropTypes.func.isRequired
};

TagChip.contextTypes = {
    muiTheme: PropTypes.shape(),
};

export default TagChip;

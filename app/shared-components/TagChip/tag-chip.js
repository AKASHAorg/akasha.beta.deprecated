import React from 'react';
import { Chip } from 'material-ui';

const TagChip = ({ style, onTagClick, tag, isSelected }, { muiTheme, router }) => {
    const { palette } = muiTheme;
    const { filter } = router.params;
    const tagStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid',
        borderColor: isSelected && filter === 'tag' ? palette.primary1Color : palette.borderColor,
        backgroundColor: palette.canvasColor,
        borderRadius: 3,
        height: 34,
        marginRight: '4px',
        marginBottom: '4px',
        cursor: 'pointer',
    };
    return (
      <Chip
        style={{ ...tagStyle, ...style }}
        onTouchTap={ev => onTagClick(ev, tag)}
      >
        {tag}
      </Chip>
    );
};

TagChip.propTypes = {
    tag: React.PropTypes.string.isRequired,
    isSelected: React.PropTypes.bool,
    style: React.PropTypes.shape(),
    onTagClick: React.PropTypes.func.isRequired
};

TagChip.contextTypes = {
    muiTheme: React.PropTypes.shape(),
    router: React.PropTypes.shape()
};

export default TagChip;

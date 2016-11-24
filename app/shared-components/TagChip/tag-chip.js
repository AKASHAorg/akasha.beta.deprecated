import React from 'react';
import { Chip } from 'material-ui';

const TagChip = ({ style, onTagClick, tag, selectedTag }, { muiTheme }) => {
    const { palette } = muiTheme;
    const tagStyle = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid',
        borderColor: tag === selectedTag ? palette.primary1Color : palette.borderColor,
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
        onTouchTap={tag !== selectedTag ?
            (ev) => onTagClick(ev, tag) :
            () => null
        }
      >
        {tag}
      </Chip>
    );
};

TagChip.propTypes = {
    tag: React.PropTypes.string.isRequired,
    selectedTag: React.PropTypes.string,
    style: React.PropTypes.shape(),
    onTagClick: React.PropTypes.func.isRequired
};

TagChip.contextTypes = {
    muiTheme: React.PropTypes.shape()
};

export default TagChip;

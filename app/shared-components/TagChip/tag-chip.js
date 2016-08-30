import React from 'react';
import { Chip } from 'material-ui';
import style from './tag-chip.scss';

const TagChip = (props) =>
  <Chip
    style={style.root}
    onTouchTap={(ev) => props.onTouchTap(ev, props.tag)}
  >
    {props.tag}
  </Chip>;

TagChip.propTypes = {
    tag: React.PropTypes.string
};

export default TagChip;

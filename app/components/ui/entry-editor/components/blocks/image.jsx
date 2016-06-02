import React, { PropTypes } from 'react';

const Image = (props) =>
    <img
      src = {props.src.dataURL}
      data-key = {props.src.key}
      style = {{ width: '100%', height: 'auto' }}
    />;
Image.propTypes = {
    src: PropTypes.object
};

export default Image;

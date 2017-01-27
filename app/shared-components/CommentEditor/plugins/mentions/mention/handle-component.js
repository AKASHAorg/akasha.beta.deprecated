import React from 'react';

const HandleComponent = (initialProps) =>
    props =>
      <span data-mention-to={props.decoratedText} style={{ color: '#478fff', cursor: 'pointer', fontWeight: 500 }}>
        {props.children}
      </span>;

HandleComponent.propTypes = {
    children: React.PropTypes.arrayOf(React.PropTypes.shape())
};

export default HandleComponent;

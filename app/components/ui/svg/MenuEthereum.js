import React from 'react';

function MenuEthereum({ style }) {
  return (
    <g style={style}>
      <polygon points="11 17.18 16 24 21 17.18 16 20.04 11 17.18" />
      <path d="M16,9.91l3.61,5.86L16,17.82l-3.61-2.05L16,9.91M16,8l-5,8.12L16,19l5-2.84L16,8h0Z" />
    </g>
  );
}
MenuEthereum.propTypes = {
  style: React.PropTypes.object
};

export default MenuEthereum;

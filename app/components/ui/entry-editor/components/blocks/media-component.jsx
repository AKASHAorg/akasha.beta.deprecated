import React, { PropTypes } from 'react';
import Image from './image';
import { Entity } from 'draft-js';

const MediaComponent = (props) => {
    const entity = Entity.get(props.block.getEntityAt(0));
    const src = entity.getData();
    const type = entity.getType();

    switch (type) {
    case 'image': return <Image src={src} style = {props.style} />;
    default: return null;
    }
};
MediaComponent.propTypes = {
    block: PropTypes.object,
    style: PropTypes.object
};
export default MediaComponent;

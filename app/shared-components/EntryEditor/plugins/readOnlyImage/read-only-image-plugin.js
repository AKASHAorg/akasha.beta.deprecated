import React from 'react';
import ImageBlock from './ImageBlock';

const readOnlyImagePlugin = otherProps => ({
    type: 'image',
    blockComponent: props => <ImageBlock {...otherProps} {...props} />
});

export default readOnlyImagePlugin;

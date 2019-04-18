import React from 'react';
import ImageButton from './ImageButton';
import ImageBlock from './ImageBlock';

const imagePlugin = otherProps => ({
    type: 'image',
    buttonComponent: props => <ImageButton { ...otherProps } { ...props } />,
    blockComponent: props => <ImageBlock { ...otherProps } { ...props } />
});

export default imagePlugin;

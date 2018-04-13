import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { equals } from 'ramda';
import imageCreator, { findClosestMatch } from '../utils/imageUtils';
class LazyImageLoader extends Component {
    state = {
        loadedImageSrc: null
    }

    componentDidMount () {
        window.requestIdleCallback(() => {
            this._loadImage(this.props.image, this.props.baseWidth);
        });
    }

    shouldComponentUpdate (nextProps, nextState) {
        return nextProps.baseWidth !== this.props.baseWidth ||
            nextState.loadedImageSrc !== this.state.loadedImageSrc ||
            !equals(nextProps.image, this.props.image);
    }

    componentWillReceiveProps (nextProps) {
        const { baseWidth } = nextProps;
        if (baseWidth !== this.props.baseWidth) {
            window.requestIdleCallback(() => {
                this._loadImage(this.props.image, baseWidth);
            });
        }
    }

    _loadImage = (image, baseWidth) => {
        const img = new Image();
        const imageSrc = this._getImageSrc(image, baseWidth)
        img.src = imageSrc;
        img.onload = this._handleImageLoad(imageSrc);
    }

    _createImageRef = (node) => this.imageNodeRef = node;

    _getImageSrc = (imageObj, baseWidth) => {
        const { baseUrl } = this.props;
        const initial = Object.keys(imageObj).find(key => key !== 'gif');
        const bestMatch = findClosestMatch(baseWidth, imageObj, initial);
        if (bestMatch) {
            return imageCreator(imageObj[bestMatch].src, baseUrl);
        }
        return '';
    };

    _handleImageLoad = imageSrc => () => {
        if(this.imageNodeRef) {
            this.setState({
                loadedImageSrc: imageSrc
            });
        }
    }

    render () {
        return (
          <img
            className={this.props.className}
            ref={this._createImageRef}
            src={this.state.loadedImageSrc ? this.state.loadedImageSrc : ''}
          />
        );
    }
}

LazyImageLoader.defaultProps = {
    baseWidth: 700,
    image: {},
    className: 'entry-card'
}

LazyImageLoader.propTypes = {
    image: PropTypes.shape(),
    baseUrl: PropTypes.string,
    baseWidth: PropTypes.number,
    className: PropTypes.string,
}

export default LazyImageLoader;

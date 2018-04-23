import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { equals } from 'ramda';
import classNames from 'classnames';
import { injectIntl } from 'react-intl';
import imageCreator, { findClosestMatch } from '../utils/imageUtils';
import { generalMessages } from '../locale-data/messages';
import { Icon } from './';
class LazyImageLoader extends Component {
    state = {
        loaded: false,
        errored: false,
    }

    shouldComponentUpdate (nextProps, nextState) {
        return nextProps.baseWidth !== this.props.baseWidth ||
            nextState.loaded !== this.state.loaded ||
            nextState.errored !== this.state.errored ||
            !equals(nextProps.image, this.props.image);
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

    _handleImageLoad = (imgSrc) => () => {
        window.requestIdleCallback(() => {
            this.setState({
                loaded: imgSrc,
                errored: false
            });
        }, {
            timeout: 500
        });
    }

    _handleImageError = (imgSrc) => () => {
        this.setState({
            loaded: true,
            errored: imgSrc,
        });
    }

    render () {
        const { loaded, errored } = this.state;
        const { className, image, baseUrl, intl } = this.props;
        const source = this._getImageSrc(image, baseUrl);
        const imageLoaded = source === loaded;
        const imageErrored = source === errored;
        const rootClass = classNames({
            [`${className}_loading`]: !imageLoaded && !imageErrored,
            [`${className}_loading loaded`]: imageLoaded && !imageErrored,
            [`${className}_loading errored`]: imageLoaded && imageErrored,
        });
        return [
          <div key="loading_message" className={rootClass}>
            <div className="loading-message-inner">
              <Icon type="photoImage" width="32px" height="32px" />
              <div
                className="text-message">
                {intl.formatMessage(generalMessages.loadingImage)}
              </div>
            </div>
          </div>,
          <img
            key="image"
            ref={this._createImageRef}
            src={source}
            style={{ width: '100%' }}
            onError={this._handleImageError(source)}
            onLoad={this._handleImageLoad(source)}
          />
        ];
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
    intl: PropTypes.shape(),
}

export default injectIntl(LazyImageLoader);

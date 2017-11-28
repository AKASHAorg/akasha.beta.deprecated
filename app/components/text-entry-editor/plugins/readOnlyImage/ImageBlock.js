import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { findClosestMatch } from '../../../../utils/imageUtils';


/**
 * *****************************************************************
 *
 * data.media is the size the user wants to display an image
 *      - xs -> show the image on right size;
 *      - md -> show the image at the same width as the content;
 *      - xl -> show the image full window width;
 * Steps:
 *      - load the smallest image at the size the user wants (use imageObj.xs.src) and preset;
 *        the container for user selected size (data.media);
 *      - on image load calculate the size of the container and pick the matching resolution from imageObj;
 *      - (optional) on window resize recalculate the container size and rematch the res;
 *
 * ******************************************************************
 */


class ImageBlock extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: true,
            isPlaying: false,
            imageLoaded: false,
            placeholderLoaded: false,
        };
    }
    _getBaseNodeStyle = () => {
        // const { media } = this.props.data;
        // if (media === 'xs') {
        //     const marginLeft = ((document.body.getBoundingClientRect().width - 700) / 2) - 32;
        //     return {
        //         width: 320,
        //         float: 'left',
        //         marginRight: 48,
        //         // @TODO: DIRTYHACK!! GET RID OF THIS!!!
        //         marginLeft
        //     };
        // }
        // if (media === 'md') {
        //     if (this.baseNodeRef) this.baseNodeRef.parentNode.parentNode.style.float = 'none';
        //     return {
        //         margin: '48px auto',
        //         width: 700
        //     };
        // }
        // if (media === 'lg' || media === 'xl' || media === 'xxl') {
        //     if (this.baseNodeRef) this.baseNodeRef.parentNode.parentNode.style.float = 'none';
        //     return {
        //         margin: '48px auto',
        //         width: '100%'
        //     };
        // }
        // return {};
    }
    _handleImageClick = (ev) => {
        const { files } = this.props.data;
        if (files.gif) {
            this.setState({
                isPlaying: !this.state.isPlaying
            });
        }
    }

    _getImageSrc = () => {
        const { baseUrl, data } = this.props;
        const { files, media } = data;
        let fileKey = findClosestMatch(700, files, media);
        if ((media === 'xl' || media === 'xxl') && this.baseNodeRef) {
            fileKey = findClosestMatch(this.baseNodeRef.parentNode.clientWidth, files, media);
        }
        // @todo: get rid of this too;
        if (files.gif && this.state.isPlaying) {
            fileKey = 'gif';
        }
        return {
            width: files[fileKey].width,
            height: files[fileKey].height,
            src: `${baseUrl}/${files[fileKey].src}`
        };
    }
    _handlePlaceholderLoad = (ev) => {
        const image = ev.target;
        this.setState((prevState) => {
            if (!prevState.placeholderLoaded) {
                return {
                    placeholderLoaded: true,
                    placeholderSize: {
                        width: image.getBoundingClientRect().width,
                        height: image.getBoundingClientRect().height,
                    }
                };
            }
            return prevState;
        });
    }

    _onLargeImageLoad = () => {
        this.setState({
            imageLoaded: true
        });
    }

    render () {
        const { data, baseUrl } = this.props;
        const { caption, files, media } = data;
        const { isPlaying, imageLoaded } = this.state;
        const baseNodeStyle = this._getBaseNodeStyle();
        return (
          <div
            ref={(baseNode) => { this.baseNodeRef = baseNode; }}
            style={baseNodeStyle}
            className={`image-block image-block__readonly image-block__readonly_${media}`}
          >
            {files.gif &&
            <Icon
              type="play-circle-o"
              className={
                `image-block__gif-image
                image-block__gif-image${isPlaying ? '_is-playing' : ''}`
              }
            />
            }
            <div
              className={
                `image-block__image-placeholder-wrapper
                image-block__image-placeholder-wrapper${imageLoaded ? '_loaded' : ''}`
              }
              ref={(node) => { this.placeholderNodeRef = node; }}
            >
              <div className={`image-block__image-placeholder-wrapper_${media}`}>
                <img
                  src={`${baseUrl}/${files.xs.src}`}
                  onLoad={this._handlePlaceholderLoad}
                  className="image-block__image-placeholder"
                  alt=""
                />
              </div>
              <img
                src={this._getImageSrc().src}
                alt=""
                onLoad={this._onLargeImageLoad}
                style={{
                  opacity: imageLoaded ? 1 : 0,
                  display: imageLoaded ? 'block' : 'none',
                }}
              />
            </div>
            <div className="image-block__image-caption" >
              <small>{caption}</small>
            </div>
          </div>
        );
    }
}

ImageBlock.propTypes = {
    baseUrl: PropTypes.string.isRequired,
    data: PropTypes.shape({
        files: PropTypes.shape(),
        caption: PropTypes.string,
        rightsHolder: PropTypes.string,
        media: PropTypes.string,
        licence: PropTypes.string,
        termsAccepted: PropTypes.bool
    })
};

export default ImageBlock;

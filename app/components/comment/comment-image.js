import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { List } from 'immutable';
import { connect } from 'react-redux';
import { Button, Icon } from 'antd';
import classNames from 'classnames';
import { selectBaseUrl } from '../../local-flux/selectors';
import clickAway from '../../utils/clickAway';
import { findClosestMatch, getBestAvailableImage } from '../../utils/imageUtils';

class CommentImage extends Component {
    state = {
        gifPlaying: false
    };

    onMouseDown = (ev) => {
        ev.stopPropagation();
        ev.preventDefault();
    };

    onMouseEnter = () => {
        this.setState({
            gifPlaying: true
        });
    };

    onMouseLeave = () => {
        this.setState({
            gifPlaying: false
        });
    };

    onDelete = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        const { block, removeImage } = this.props;
        removeImage(block.getKey());
    };
    _handleFullSizeSwitch = () => {
        const { baseUrl, block, contentState, readOnly } = this.props;
        const entityKey = block.getEntityAt(0);
        const entity = contentState.getEntity(entityKey);
        const data = entity.getData();
        const { files } = data;
        const bestImage = getBestAvailableImage(files);
        const images = new List();
        const fullSizeImgs = images.push({
            src: `${baseUrl}/${bestImage.src}`,
            height: bestImage.height,
            width: bestImage.width,
            imgId: data.imgId,
            caption: data.caption,
        });
        if (readOnly) {
            this.props.onImageClick({
                startId: data.imgId,
                images: fullSizeImgs
            });
        }
    }
    render () {
        const { baseUrl, block, contentState, readOnly } = this.props;
        const { gifPlaying } = this.state;
        const entityKey = block.getEntityAt(0);
        const entity = contentState.getEntity(entityKey);
        const data = entity.getData();
        const { gif, ...other } = data.files;
        const bestKey = findClosestMatch(500, other);
        const hash = gifPlaying ? data.files.gif.src : data.files[bestKey].src;
        if (typeof hash !== 'string') {
            console.error('hash is not string');
            return null;
        }
        const url = `${baseUrl}/${hash}`;
        const imageDimensions = {
            width: bestKey === 'xs' ? data.files[bestKey].width : '100%',
            height: bestKey === 'xs' ? data.files[bestKey].height : ''
        };
        const gifIconClass = classNames('comment-image__gif-play-icon', {
            'comment-image__gif-play-icon_transparent': this.state.gifPlaying
        });

        return (
          <div className="flex-center-x comment-image" onMouseDown={this.onMouseDown}>
            <div
              className="comment-image__image-wrapper"
              onMouseEnter={data.files.gif && this.onMouseEnter}
              onMouseLeave={data.files.gif && this.onMouseLeave}
              style={imageDimensions}
              onClick={this._handleFullSizeSwitch}
            >
              <img
                alt=""
                className={`comment-image__img comment-image__img${readOnly ? '_readonly' : ''}`}
                src={url}
                style={imageDimensions}
              />
              {!readOnly &&
                <Button
                  className="comment-image__close-button"
                  icon="close"
                  onClick={this.onDelete}
                  size="small"
                  type="standard"
                />
              }
              {data.files.gif &&
                <div className={gifIconClass}>
                  <Icon type="caret-right" />
                </div>
              }
            </div>
          </div>
        );
    }
}

CommentImage.propTypes = {
    baseUrl: PropTypes.string.isRequired,
    block: PropTypes.shape().isRequired,
    contentState: PropTypes.shape().isRequired,
    readOnly: PropTypes.bool,
    removeImage: PropTypes.func,
    onImageClick: PropTypes.func,
};

function mapStateToProps (state) {
    return {
        baseUrl: selectBaseUrl(state)
    };
}

export default connect(mapStateToProps)(clickAway(CommentImage));

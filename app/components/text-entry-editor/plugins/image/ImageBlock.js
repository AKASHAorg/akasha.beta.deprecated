import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Input, Popover, Menu, Dropdown } from 'antd';
import PlayIcon from 'material-ui/svg-icons/av/play-arrow';
import {
    ImageSizeXS,
    ImageSizeLarge,
    ImageSizeMedium,
    ImageSizeSmall,
    ImageSizeXL,
    ImageSizeXXL } from '../../../../components/svg';
import { SvgIcon } from '../../../../components';
import imageCreator, { findClosestMatch } from '../../../../utils/imageUtils';
import clickAway from '../../../../utils/clickAway';
import styles from './image-block.scss';

const { TextArea } = Input;

class ImageBlock extends Component {
    constructor (props) {
        super(props);
        const { files, media, caption, licence, termsAccepted } = this.props.data;
        this.state = {
            previewImage: media,
            caption,
            licence,
            termsAccepted,
            imageSrc: media ? imageCreator(files[media].src) : null,
            isCardEnabled: false,
            popoverVisible: false
        };
    }
    componentDidMount () {
        this.setImageSrc();
    }
    componentDidUpdate (prevProps, prevState) {
        if (prevState.previewImage !== this.state.previewImage) {
            this.setImageSrc();
        }
    }
    // this method will get the `best fit` image based on current container`s width;
    // because we want to be efficient :)
    setImageSrc = () => {
        /**
         * containerWidth <enum> [1, 2, 3]
         * 1 => smallWidth
         * 2 => mediumWidth
         * 3 => largeWidth
         * Please see those attrs passed when exporting this component;
         */
        let imageKey = this.state.previewImage;
        const baseNode = this.baseNodeRef;
        const containerWidth = baseNode.parentNode.clientWidth;
        const imageFiles = this.props.data.files;
        if (imageKey === 'xl') {
            imageKey = findClosestMatch(containerWidth, imageFiles, this.state.previewImage);
        }
        this.props.container.updateData({ media: imageKey });
        if (typeof imageFiles[imageKey].src === 'string') {
            return this.setState({
                previewImage: imageKey,
                imageSrc: `${this.props.baseUrl}/${imageFiles[imageKey].src}`
            });
        }
        return this.setState({
            previewImage: imageKey,
            imageSrc: imageCreator(imageFiles[imageKey].src)
        });
    }
    componentClickAway = () => {
        if (this.state.isCardEnabled) {
            this.setState({
                isCardEnabled: false
            }, () => {
                this.props.blockProps.setReadOnly(false);
                window.removeEventListener('keyup', this._removeImageContainer);
            });
        }
    }
    _handleCaptionChange = (ev) => {
        ev.stopPropagation();
        this.props.container.updateData({ caption: ev.target.value });
    }

    _handleSizeChange = (ev, key, payload) => {
        ev.stopPropagation();
        this.setState({
            previewImage: payload
        });
        this.props.container.updateData({ media: payload });
    }
    _handleImageClick = (ev) => {
        ev.stopPropagation();
        this.setState({
            isCardEnabled: true
        }, () => {
            this.props.blockProps.setReadOnly(true);
            window.addEventListener('keyup', this._removeImageContainer);
        });
    }
    _removeImageContainer = (ev) => {
        if (ev.key === 'Delete' || ev.key === 'Backspace') {
            this.props.container.remove();
            this.props.blockProps.setReadOnly(false);
            window.removeEventListener('keyup', this._removeImageContainer);
        }
    }
    _getBaseNodeStyle = () => {
        const { previewImage } = this.state;
        if (previewImage === 'xs') {
            if (this.baseNodeRef) {
                this.baseNodeRef.parentNode.parentNode.style.float = 'left';
                this.baseNodeRef.parentNode.parentNode.style.width = 'inherit';
            }
            return {
                width: 320,
                float: 'left',
                marginRight: 48,
                // @TODO: DIRTYHACK!! GET RID OF THIS!!!
                marginLeft: this.baseNodeRef ?
                  this.baseNodeRef.parentNode.parentNode.previousSibling.offsetLeft : 0
            };
        }
        if (previewImage === 'md') {
            if (this.baseNodeRef) this.baseNodeRef.parentNode.parentNode.style.float = 'none';
            return {
                margin: '0 auto',
                width: 700
            };
        }
        if (previewImage === 'xl') {
            if (this.baseNodeRef) this.baseNodeRef.parentNode.parentNode.style.float = 'none';
            return {
                margin: '0 auto',
                width: '100%'
            };
        }
        return {};
    }
    _getImageSizeMenu = () => (
      <Menu className="image-block__image-size-menu">
        <Menu.Item className="image-block__image-size-menu-item">
          <SvgIcon viewBox="0 0 24 24">
            <ImageSizeXS />
          </SvgIcon>
        </Menu.Item>
        <Menu.Item className="image-block__image-size-menu-item">
          <SvgIcon viewBox="0 0 24 24">
            <ImageSizeMedium />
          </SvgIcon>
        </Menu.Item>
        <Menu.Item className="image-block__image-size-menu-item">
          <SvgIcon viewBox="0 0 24 24">
            <ImageSizeXL />
          </SvgIcon>
        </Menu.Item>
      </Menu>
    )
    _getImagePopoverContent = () => {
        return (
          <Dropdown
            overlay={this._getImageSizeMenu()}
            trigger={['click']}
            className="test"
          >
            <div className="test">Select size</div>
          </Dropdown>
        );
    }
    _handlePopoverVisibility = (visible) => {
        this.setState({
            popoverVisible: visible
        });
    }
    /* eslint-disable complexity */
    render () {
        const { isCardEnabled, imageSrc, previewImage } = this.state;
        const { files, caption } = this.props.data;
        const baseNodeStyle = this._getBaseNodeStyle();
        let imageSource;
        if (isCardEnabled && files.gif) {
            if (typeof files.gif.src === 'string') {
                imageSource = imageCreator(files.gif.src, this.props.baseUrl);
            } else if (typeof files.gif.src === 'object') {
                imageSource = imageCreator(files.gif.src);
            } else {
                imageSource = imageSrc;
            }
        } else {
            imageSource = imageSrc;
        }
        return (
          <div
            ref={(baseNode) => { this.baseNodeRef = baseNode; }}
            style={baseNodeStyle}
          >
            <div
              className={`${styles.rootInner}`}
            >
              {files &&
                <Popover
                  style={{
                    backgroundColor: '#FFF',
                    opacity: (isCardEnabled ? 1 : 0),
                    top: (isCardEnabled ? -64 : 0)
                  }}
                  content={this._getImageSizeMenu()}
                  placement="top"
                  trigger="click"
                  visible={this.state.popoverVisible}
                  onVisibleChange={this._handlePopoverVisibility}
                  autoAdjustOverflow={false}
                >
                  <div
                    style={{
                      boxShadow: isCardEnabled ? '0 0 0 3px #4285f4' : 'none',
                      position: 'relative'
                    }}
                  >
                    {files && files.gif &&
                      <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            marginTop: '-48px',
                            marginLeft: '-48px'
                        }}
                      >
                        <PlayIcon
                          style={{
                              fill: 'rgba(255, 255, 255, 0.86)',
                              color: '#FFF',
                              height: 96,
                              width: 96,
                              opacity: isCardEnabled ? 0 : 1,
                              filter: `blur(${isCardEnabled ? '3px' : '0'}) drop-shadow(0 0 2px #444)`,
                              transition: 'opacity 0.218s ease-in-out, blur 0.218s ease-in-out',
                          }}
                        />
                      </div>
                    }
                    <img
                      src={imageSource}
                      alt=""
                      style={{ width: '100%', display: 'block' }}
                    />
                  </div>
                  <TextArea
                    className={`${styles.caption}`}
                    placeholder="image caption"
                    value={caption}
                    autosize
                    onChange={this._handleCaptionChange}
                  />
                </Popover>
              }
            </div>
          </div>
        );
    }
}
ImageBlock.propTypes = {
    container: PropTypes.shape({
        updateData: PropTypes.func,
        remove: PropTypes.func
    }),
    data: PropTypes.shape({
        files: PropTypes.shape(),
        caption: PropTypes.string,
        rightsHolder: PropTypes.string,
        media: PropTypes.string,
        licence: PropTypes.string,
        termsAccepted: PropTypes.bool
    }),
    blockProps: PropTypes.shape(),
    baseUrl: PropTypes.string,
};

export default clickAway(ImageBlock);

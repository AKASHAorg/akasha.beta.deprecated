import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Input, Popover, Menu, Icon } from 'antd';
import {
    ImageSizeXS,
    ImageSizeMedium,
    ImageSizeXL } from '../../../../components/svg';
import { SvgIcon } from '../../../../components';
import imageCreator, { findClosestMatch } from '../../../../utils/imageUtils';
import clickAway from '../../../../utils/clickAway';
import { entryMessages } from '../../../../locale-data/messages/entry-messages';

const { TextArea } = Input;

/**
 * ************* ImageBlock used only in editing mode ***************
 *
 * data.media is the size the user wants to display an image
 *      - xs -> show the image on right size;
 *      - md -> show the image at the same width as the content;
 *      - xl -> show the image full window width;
 *
 *      - because we are in editting mode, we can use any size we want, but position the image as user selects
 *
 * ******************************************************************
 */

class ImageBlock extends Component {
    constructor (props) {
        super(props);
        this.state = {
            isCardEnabled: false,
            popoverVisible: false
        };
    }

    // componentDidMount () {
    //     this.setImageSrc();
    // }

    // componentDidUpdate (prevProps, prevState) {
    //     if (prevState.previewImage !== this.state.previewImage) {
    //         this.setImageSrc();
    //     }
    // }
    // this method will get the `best fit` image based on current container`s width;
    // because we want to be efficient :)
    // setImageSrc = () => {
    //     /**
    //      * containerWidth <enum> [1, 2, 3]
    //      * 1 => smallWidth
    //      * 2 => mediumWidth
    //      * 3 => largeWidth
    //      * Please see those attrs passed when exporting this component;
    //      */
    //     let imageKey = this.state.previewImage;
    //     const baseNode = this.baseNodeRef;
    //     // const containerWidth = baseNode.parentNode.clientWidth;
    //     const imageFiles = this.props.data.files;
    //     // if (imageKey === 'xl') {
    //     //     imageKey = findClosestMatch(containerWidth, imageFiles, this.state.previewImage);
    //     // }
    //     // this.props.container.updateData({ media: imageKey });
    //     // if (typeof imageFiles[imageKey].src === 'string') {
    //     //     return this.setState({
    //     //         previewImage: imageKey,
    //     //         imageSrc: `${this.props.baseUrl}/${imageFiles[imageKey].src}`
    //     //     });
    //     // }
    //     return this.setState({
    //         previewImage: imageKey,
    //         imageSrc: imageCreator(imageFiles[imageKey].src)
    //     });
    // }

    componentClickAway = () => {
        if (this.state.isCardEnabled) {
            this.setState({
                isCardEnabled: false
            }, () => {
                this.props.blockProps.setReadOnly(false);
                // window.removeEventListener('keyup', this._removeImageContainer);
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
        // const { previewImage } = this.state;
        // if (previewImage === 'xs') {
        //     if (this.baseNodeRef) {
        //         this.baseNodeRef.parentNode.parentNode.style.float = 'left';
        //         this.baseNodeRef.parentNode.parentNode.style.width = 'inherit';
        //     }
        //     return {
        //         width: 320,
        //         float: 'left',
        //         marginRight: 48,
        //         // @TODO: DIRTYHACK!! GET RID OF THIS!!!
        //         marginLeft: this.baseNodeRef ?
        //             this.baseNodeRef.parentNode.parentNode.previousSibling.offsetLeft : 0
        //     };
        // }
        // if (previewImage === 'md') {
        //     if (this.baseNodeRef) this.baseNodeRef.parentNode.parentNode.style.float = 'none';
        //     return {
        //         margin: '0 auto',
        //         width: 700
        //     };
        // }
        // if (previewImage === 'xl') {
        //     if (this.baseNodeRef) this.baseNodeRef.parentNode.parentNode.style.float = 'none';
        //     return {
        //         margin: '0 auto',
        //         width: '100%'
        //     };
        // }
        // return {};
    }

    _handleImageSizeChange = ({ key }) => {
        const { container } = this.props;
        container.updateData({ media: key });
    }

    _getImageSizeMenu = () => {
        const { data } = this.props;
        const { media } = data;
        return (
          <Menu
            className="image-block__image-size-menu"
            onSelect={this._handleImageSizeChange}
            defaultSelectedKeys={['md']}
            selectedKeys={[media]}
          >
            <Menu.Item className="image-block__image-size-menu-item" key="xs">
              <SvgIcon viewBox="0 0 24 24">
                <ImageSizeXS />
              </SvgIcon>
            </Menu.Item>
            <Menu.Item className="image-block__image-size-menu-item" key="md">
              <SvgIcon viewBox="0 0 24 24">
                <ImageSizeMedium />
              </SvgIcon>
            </Menu.Item>
            {data.files.xl &&
              <Menu.Item className="image-block__image-size-menu-item" key="lg">
                <SvgIcon viewBox="0 0 24 24">
                  <ImageSizeXL />
                </SvgIcon>
              </Menu.Item>
            }
          </Menu>
        );
    }
    _getImageSource = (files) => {
        const { media } = this.props.data;
        switch (media) {
            case 'xs':
                return files[findClosestMatch(320, files, 'xs')].src;
            case 'md':
                return files[findClosestMatch(700, files, 'md')].src;
            case 'lg':
                return files[findClosestMatch(1920, files, 'xl')].src;
            default:
                break;
        }
    }
    _handlePopoverVisibility = (visible) => {
        this.setState({
            popoverVisible: visible,
            isCardEnabled: visible,
        });
    }

    _getPopupContainer = () => document.getElementById('image-block');

    /* eslint-disable complexity */
    render () {
        const { baseUrl, data, intl } = this.props;
        const { isCardEnabled } = this.state;
        const { files, caption, media } = data;
        return (
          <div ref={(baseNode) => { this.baseNodeRef = baseNode; }} className="image-block">
            <div
              id="image-block"
              className="image-block__inner"
            >
              {files &&
                <Popover
                  content={this._getImageSizeMenu()}
                  placement="top"
                  trigger="click"
                  visible={this.state.popoverVisible}
                  onVisibleChange={this._handlePopoverVisibility}
                  autoAdjustOverflow={false}
                  getPopupContainer={this._getPopupContainer}
                >
                  <div
                    className={
                        `image-block__image-wrapper
                        image-block__image-wrapper_${media}
                        image-block__image-wrapper${isCardEnabled ? '_active' : ''}`
                    }
                  >
                    {files && files.gif &&
                      <div
                        className="image-block__gif-play-icon"
                      >
                        <Icon
                          type="play-circle-o"
                          className="image-block__gif-image"
                        />
                      </div>
                    }
                    <img
                      src={`${baseUrl}/${this._getImageSource(files)}`}
                      alt=""
                      style={{ width: '100%', display: 'block' }}
                    />
                  </div>
                  <TextArea
                    className="image-block__caption-input"
                    placeholder={intl.formatMessage(entryMessages.imageCaptionPlaceholder)}
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
    intl: PropTypes.shape(),
};

export default clickAway(ImageBlock);

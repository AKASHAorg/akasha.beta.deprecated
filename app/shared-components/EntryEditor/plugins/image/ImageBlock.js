import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    CardMedia,
    CardText,
    SelectField,
    MenuItem,
    TextField,
    SvgIcon,
    Toolbar,
    ToolbarGroup } from 'material-ui';
import withWidth from 'material-ui/utils/withWidth';
import PlayIcon from 'material-ui/svg-icons/av/play-arrow';
import {
  ImageSizeXS,
  ImageSizeLarge,
  ImageSizeMedium,
  ImageSizeSmall,
  ImageSizeXL,
  ImageSizeXXL } from '../../../svg';
import imageCreator, { findClosestMatch } from '../../../../utils/imageUtils';
import clickAway from '../../../../utils/clickAway';
import styles from './image-block.scss';

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
            isCardEnabled: false
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
                imageSrc: `${window.entry__baseUrl}/${imageFiles[imageKey].src}`
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
            isCardEnabled: true,
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
    render () {
        const { isCardEnabled, imageSrc, previewImage } = this.state;
        const { files, caption } = this.props.data;
        const baseNodeStyle = this._getBaseNodeStyle();
        let imageSource;
        if (isCardEnabled && files.gif) {
            if (typeof files.gif.src === 'string') {
                imageSource = imageCreator(files.gif.src, window.entry__baseUrl);
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
              <Toolbar
                className={`${styles.toolbar}`}
                style={{
                    backgroundColor: '#FFF',
                    opacity: (isCardEnabled ? 1 : 0),
                    top: (isCardEnabled ? -64 : 0)
                }}
              >
                <ToolbarGroup>
                  <SelectField
                    value={(previewImage === 'xxl') ? 'xl' : previewImage}
                    onChange={this._handleSizeChange}
                  >
                    {files.xs &&
                      <MenuItem
                        leftIcon={
                          <SvgIcon>
                            <ImageSizeSmall />
                          </SvgIcon>
                        }
                        value={'xs'}
                        primaryText={'Small'}
                      />
                    }
                    {files.md &&
                      <MenuItem
                        leftIcon={
                          <SvgIcon>
                            <ImageSizeMedium />
                          </SvgIcon>
                        }
                        value={'md'}
                        primaryText={'Normal'}
                      />
                    }
                    {(files.xl || files.xxl) &&
                      <MenuItem
                        leftIcon={
                          <SvgIcon>
                            <ImageSizeLarge />
                          </SvgIcon>
                        }
                        value={'xl'}
                        primaryText={'Large'}
                      />
                    }
                  </SelectField>
                </ToolbarGroup>
              </Toolbar>
              <CardMedia

                onClick={this._handleImageClick}
              >
                <div
                  style={{
                      boxShadow: isCardEnabled ? '0 0 0 3px #4285f4' : 'none',
                      position: 'relative'
                  }}
                >
                  {files.gif &&
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
              </CardMedia>
              <CardText style={{ padding: 0, marginTop: 8, borderBottom: '1px solid #F5F5F5' }}>
                <TextField
                  className={`${styles.caption}`}
                  hintText="image caption"
                  style={{ height: 'auto' }}
                  hintStyle={{
                      textAlign: 'center',
                      color: isCardEnabled ? '#4285f4' : '#DDD',
                      left: 0,
                      right: 0,
                      top: 0
                  }}
                  value={caption}
                  textareaStyle={{
                      textAlign: 'center',
                      margin: 0,
                      fontSize: 14,
                      color: 'rgba(0,0,0,0.8)'
                  }}
                  multiLine
                  fullWidth
                  underlineShow={false}
                  onChange={this._handleCaptionChange}
                />
              </CardText>
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
    blockProps: PropTypes.shape()
};

export default withWidth({
    largeWidth: 1920,
    mediumWidth: 700,
    smallWidth: 320
})(clickAway(ImageBlock));

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
import {
  ImageSizeXS,
  ImageSizeLarge,
  ImageSizeMedium,
  ImageSizeSmall,
  ImageSizeXL,
  ImageSizeXXL } from 'shared-components/svg'; // eslint-disable-line import/no-unresolved, import/extensions
import imageCreator, { findBestMatch } from 'utils/imageUtils'; // eslint-disable-line import/no-unresolved, import/extensions
import clickAway from 'utils/clickAway'; // eslint-disable-line import/no-unresolved, import/extensions
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

        if (!imageKey && imageKey === '') {
            imageKey = findBestMatch(containerWidth, imageFiles, this.state.previewImage);
        }

        this.props.container.updateData({ media: imageKey });
        this.setState({
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
            if (this.baseNodeRef) this.baseNodeRef.parentNode.parentNode.style.float = 'left';
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
        if (previewImage === 'lg') {
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
                    value={(previewImage === 'xl') ? 'lg' : previewImage}
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
                    {(files.lg || files.xl) &&
                      <MenuItem
                        leftIcon={
                          <SvgIcon>
                            <ImageSizeLarge />
                          </SvgIcon>
                        }
                        value={'lg'}
                        primaryText={'Large'}
                      />
                    }
                  </SelectField>
                </ToolbarGroup>
              </Toolbar>
              <CardMedia
                style={{
                    boxShadow: isCardEnabled ? '0 0 0 3px #4285f4' : 'none'
                }}
                onClick={this._handleImageClick}
              >
                <img
                  src={imageSrc}
                  alt=""
                />
              </CardMedia>
              <CardText style={{ padding: 0, marginTop: 8 }}>
                <TextField
                  className={`${styles.caption}`}
                  hintText="image caption"
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
    container: React.PropTypes.shape({
        updateData: React.PropTypes.func,
        remove: React.PropTypes.func
    }),
    data: React.PropTypes.shape({
        files: React.PropTypes.shape(),
        caption: React.PropTypes.string,
        rightsHolder: React.PropTypes.string,
        media: React.PropTypes.string,
        licence: React.PropTypes.string,
        termsAccepted: React.PropTypes.bool
    }),
    blockProps: React.PropTypes.shape()
};

export default withWidth({
    largeWidth: 920,
    mediumWidth: 600,
    smallWidth: 320
})(clickAway(ImageBlock));

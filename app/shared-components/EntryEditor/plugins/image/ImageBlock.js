import React, { Component } from 'react';
import { MegadraftPlugin } from 'megadraft';
import {
    Card,
    CardMedia,
    CardText,
    Checkbox,
    SelectField,
    DropDownMenu,
    MenuItem,
    IconButton,
    TextField,
    SvgIcon,
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator } from 'material-ui';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import withWidth, { SMALL, MEDIUM, LARGE } from 'material-ui/utils/withWidth';
import {
  ImageSizeXS,
  ImageSizeLarge,
  ImageSizeMedium,
  ImageSizeSmall,
  ImageSizeXL,
  ImageSizeXXL } from 'shared-components/svg';
import imageCreator, { findBestMatch } from 'utils/imageUtils';

/**
 * @TODO: Move this to a config file;
 */
const variants = {
    xs: {
        primaryText: 'Extra Small',
        component: <ImageSizeXS />
    },
    sm: {
        primaryText: 'Small',
        component: <ImageSizeSmall />
    },
    md: {
        primaryText: 'Medium',
        component: <ImageSizeMedium />
    },
    lg: {
        primaryText: 'Large',
        component: <ImageSizeLarge />
    },
    xl: {
        primaryText: 'Extra Large',
        component: <ImageSizeXL />
    },
    xxl: {
        primaryText: 'Evolved',
        component: <ImageSizeXXL />
    }
};

class ImageBlock extends Component {
    constructor (props) {
        super(props);
        const { files, media, caption, licence, termsAccepted, } = this.props.data;

        this.state = {
            previewImage: media,
            caption,
            licence,
            termsAccepted,
            imageSrc: imageCreator(files[media].src),
        };
        this.menuItems = [];
        for (const key of Object.keys(files)) {
            this.menuItems.push(
              <MenuItem
                key={`k-${key}`}
                leftIcon={
                  <SvgIcon>
                    {variants[key].component}
                  </SvgIcon>
                }
                value={key}
                primaryText={variants[key].primaryKey}
              />
            );
        }
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
        const baseNode = this.baseNodeRef;
        const containerWidth = baseNode.parentNode.clientWidth;
        const imageFiles = this.props.data.files;
        const imageKey = findBestMatch(containerWidth, imageFiles, this.state.previewImage);
        this.props.container.updateData({ media: imageKey });
        this.setState({
            previewImage: imageKey,
            isCardEnabled: true,
            imageSrc: imageCreator(imageFiles[this.state.previewImage].src)
        });
    }
    _handleCaptionChange = (ev) => {
        ev.stopPropagation();
        this.props.container.updateData({ caption: event.target.value });
    }

    _handleLicenceChange = (ev, key, payload) => {
        ev.stopPropagation();
        this.props.container.updateData({ licence: payload });
    }
    _handleTermsAccept = (ev, isInputChecked) => {
        ev.stopPropagation();
        this.props.container.updateData({ termsAccepted: isInputChecked });
    }
    _handleSizeChange = (ev, key, payload) => {
        ev.stopPropagation();
        this.setState({
            previewImage: payload
        });
    }
    _handleImageClick = (ev) => {
        ev.stopPropagation();
        this.setState({
            isCardEnabled: !this.state.isCardEnabled
        });
    }
    render () {
        const { isCardEnabled, imageSrc, previewImage } = this.state;
        const { files, termsAccepted, licence, caption } = this.props.data;
        const akashaTermsLink = <a href="">{'AKASHA\'s terms'}</a>;
        return (
          <div
            ref={(baseNode) => { this.baseNodeRef = baseNode; }}
            style={{
                width: files[previewImage].width,
                margin: '0 auto'
            }}
          >
            <Card
              style={{
                  width: this.state.cardWidth,
                  WebkitUserSelect: 'none'
                  // boxShadow: isCardEnabled ? 'initial' : 'none'
              }}
            >
              <Toolbar
                style={{
                    backgroundColor: '#FFF',
                    boxShadow: '1px, 1px, 1px, #DDD'
                    // opacity: (this.state.isCardEnabled ? 1 : 0)
                }}
              >
                <ToolbarGroup>
                  <SelectField
                    value={previewImage}
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
                        primaryText={'Medium'}
                      />
                    }
                    {files.lg &&
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
                <ToolbarGroup>
                  <div>
                    <IconButton onClick={this.props.container.remove}>
                      <SvgIcon>
                        <DeleteIcon />
                      </SvgIcon>
                    </IconButton>
                  </div>
                </ToolbarGroup>
              </Toolbar>
              <CardMedia>
                <img
                  src={imageSrc}
                  alt=""
                  onClick={this._handleImageClick}
                />
              </CardMedia>
              <CardText>
                <TextField hintText="Caption" value={caption} multiLine fullWidth onChange={this._handleCaptionChange} />
                <div className="row">
                  <div className="col-xs-4">
                    <h4>Image Licence</h4>
                  </div>
                  <div className="col-xs-8">
                    <SelectField value={licence} onChange={this._handleLicenceChange} fullWidth>
                      <MenuItem value={'CC BY'} primaryText="Attribution" />
                      <MenuItem value={'CC BY-SA'} primaryText="Attribution-ShareAlike" />
                      <MenuItem value={'CC BY-ND'} primaryText="Attribution-NoDerivs" />
                      <MenuItem value={'CC BY-NC'} primaryText="Attribution-NonCommercial" />
                      <MenuItem value={'CC BY-NC-SA'} primaryText="Attribution-NonCommercial-ShareAlike" />
                      <MenuItem value={'CC BY-NC-ND'} primaryText="Attribution-NonCommercial-NoDerivs" />
                    </SelectField>
                  </div>
                  <div className="col-xs-12">
                    <div className="row">
                      <Checkbox
                        className="col-xs-1"
                        label=""
                        onCheck={this._handleTermsAccept}
                        checked={termsAccepted}
                      />
                      <div className="col-xs-10">I acknowledge and agree {akashaTermsLink} on using images</div>
                    </div>
                  </div>
                </div>
              </CardText>
            </Card>
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
    })
};

export default withWidth({
    largeWidth: 920,
    mediumWidth: 600,
    smallWidth: 320
})(ImageBlock);

import React, { Component } from 'react';
import { MegadraftPlugin } from 'megadraft';
import {
    Card,
    CardMedia,
    CardText,
    Checkbox,
    SelectField,
    MenuItem,
    IconButton,
    TextField,
    SvgIcon,
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator } from 'material-ui';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import withWidth, { SMALL, MEDIUM, LARGE } from 'material-ui/utils/withWidth';
import { ImageSizeLarge, ImageSizeMedium, ImageSizeSmall } from 'shared-components/svg';
import { findBestMatch } from 'utils/imageUtils';

class ImageBlock extends Component {
    constructor (props) {
        super(props);
        this.state = {
            previewImage: this.props.data.media,
            componentWidth: null,
            cardWidth: '100%'
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
        const baseNode = this.baseNodeRef;
        const containerWidth = baseNode.parentNode.clientWidth;
        const imageFiles = this.props.data.files;
        const imageKey = findBestMatch(containerWidth, imageFiles, this.state.previewImage);
        this.props.container.updateData({ media: imageKey });
        this.setState({
            previewImage: imageKey,
            isCardEnabled: true
        });
    }
    _handleCaptionChange = (event) => {
        event.stopPropagation();
        this.props.container.updateData({ caption: event.target.value });
    }

    _handleRightsHolderChange = (event) => {
        event.stopPropagation();
        this.props.container.updateData({ rightsHolder: event.target.value });
    }
    _getSizeValue = () => {
        const imageKey = this.state.previewImage;
        switch (imageKey) {
            case 'xs':
            case 'sm':
                return 1;
            case 'md':
                return 2;
            case 'lg':
                return 3;
            default:
                break;
        }
    }
    _handleSizeChange = (ev, key, payload) => {
        console.log('change size to ', key, 'key', payload, 'payload');
    }
    _handleImageClick = (ev) => {
        this.setState({
            isCardEnabled: !this.state.isCardEnabled
        });
    }
    render () {
        console.log(this.props);
        const { isCardEnabled } = this.state;
        const akashaTermsLink = <a href="">{'AKASHA\'s terms'}</a>;
        return (
          <div ref={(baseNode) => { this.baseNodeRef = baseNode; }} >
            <Card
              style={{
                  width: this.state.cardWidth,
                  webkitUserSelect: 'none'
                  // boxShadow: isCardEnabled ? 'initial' : 'none'
              }}
              onClick={(ev) => ev.preventDefault()}
            >
              <Toolbar
                style={{
                    backgroundColor: '#FFF',
                    boxShadow: '1px, 1px, 1px, #DDD'
                    // opacity: (this.state.isCardEnabled ? 1 : 0)
                }}
              >
                <ToolbarGroup>
                  <SelectField value={this._getSizeValue()} onChange={this._handleSizeChange}>
                    <MenuItem
                      leftIcon={
                        <SvgIcon>
                          <ImageSizeSmall />
                        </SvgIcon>
                      }
                      value={1}
                      primaryText="Small"
                    />
                    <MenuItem
                      leftIcon={
                        <SvgIcon>
                          <ImageSizeMedium />
                        </SvgIcon>
                      }
                      value={2}
                      primaryText="Medium"
                    />
                    <MenuItem
                      leftIcon={
                        <SvgIcon>
                          <ImageSizeLarge />
                        </SvgIcon>
                      }
                      value={3}
                      primaryText="Large"
                    />
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
                  src={this.props.data.files[this.state.previewImage].src}
                  alt=""
                  onClick={this._handleImageClick}
                />
              </CardMedia>
              <CardText>
                <TextField hintText="Caption" multiLine fullWidth />
                <div className="row">
                  <div className="col-xs-6">
                    <h4>Image Licence</h4>
                  </div>
                  <div className="col-xs-6">
                    <SelectField value={1} onChange={this._handleLicenceChange}>
                      <MenuItem value={1} primaryText="CC0" />
                      <MenuItem value={2} primaryText="CC1" />
                    </SelectField>
                  </div>
                  <div className="col-xs-12">
                    <div className="row">
                      <Checkbox className="col-xs-1" label="" />
                      <div className="col-xs-10">I acknowledge and agree {akashaTermsLink} on using images</div>
                    </div>
                  </div>
                </div>
              </CardText>
              { /** <CommonBlock {...this.props} actions={this.actions}>
                  <BlockContent>
                  <img src={this.props.data.src} alt="" />
                  </BlockContent>

                  <BlockData>
                  <BlockInput
                      placeholder="Caption"
                      value={this.props.data.caption}
                      onChange={this._handleCaptionChange}
                  />

                  <BlockInput
                      placeholder="Rights Holder"
                      value={this.props.data.rightsHolder}
                      onChange={this._handleRightsHolderChange}
                  />
                  </BlockData>
              </CommonBlock>*/ }
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

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

class ImageBlock extends Component {
    constructor (props) {
        super(props);
        this.state = {
            previewImage: '',
            componentWidth: null
        };
    }
    componentDidMount () {
        const baseNode = this.baseNodeRef;
        const containerWidth = baseNode.clientWidth();
        console.log(baseNode, containerWidth);
    }
    _handleCaptionChange = (event) => {
        event.stopPropagation();
        this.props.container.updateData({ caption: event.target.value });
    }

    _handleRightsHolderChange = (event) => {
        event.stopPropagation();
        this.props.container.updateData({ rightsHolder: event.target.value });
    }
    // this method will get the `best fit` image based on current container`s width;
    // because we want to be efficient :)
    _getImageFile = () => {
        /**
         * containerWidth <enum> [1, 2, 3]
         * 1 => smallWidth
         * 2 => mediumWidth
         * 3 => largeWidth
         * Please see those attrs passed when exporting this component;
         */

        const imageFiles = this.props.data.files;

        let src = '';
        // if (containerWidth === 1) {
        //     // remember 1 means small < 600px
        //     Object.keys(imageFiles).forEach((imgKey) => {
        //         if (imageFiles[imgKey].width < 600) {
        //             src = imageFiles[imgKey].src;
        //         }
        //     });
        // }

        // if (containerWidth === 2) {
        //     // 2 means medium >= 600px
        //     Object.keys(imageFiles).forEach((imgKey) => {
        //         if (imageFiles[imgKey].width >= 600) {
        //             src = imageFiles[imgKey].src;
        //         }
        //     });
        // }

        // if (containerWidth === 3) {
        //     // already forgot it?
        //     // 3 means large >= 920px
        //     Object.keys(imageFiles).forEach((imgKey) => {
        //         if (imageFiles[imgKey].width >= 920) {
        //             src = imageFiles[imgKey].src;
        //         }
        //     });
        // }
        // console.log(containerWidth);
        return <img src={src} alt="" />;
    }

    render () {
        console.log(this.props);
        const akashaTermsLink = <a href="">AKASHA's terms</a>;
        return (
          <Card ref={(baseNode) => { this.baseNodeRef = baseNode; }}>
            <Toolbar
              style={{
                  backgroundColor: '#FFF',
                  boxShadow: '1px, 1px, 1px, #DDD'
              }}
            >
              <ToolbarGroup>
                <SelectField value={0}>
                  <MenuItem
                    leftIcon={
                      <SvgIcon>
                        <ImageSizeSmall />
                      </SvgIcon>
                    }
                    value={0}
                    primaryText="Small"
                  />
                  <MenuItem
                    leftIcon={
                      <SvgIcon>
                        <ImageSizeMedium />
                      </SvgIcon>
                    }
                    value={0}
                    primaryText="Medium"
                  />
                  <MenuItem
                    leftIcon={
                      <SvgIcon>
                        <ImageSizeLarge />
                      </SvgIcon>
                    }
                    value={0}
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
              {this._getImageFile()}
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

        );
    }
}
ImageBlock.propTypes = {
    container: React.PropTypes.shape({
        updateData: React.PropTypes.func,
        remove: React.PropTypes.func
    }),
    data: React.PropTypes.shape({
        src: React.PropTypes.string,
        caption: React.PropTypes.string,
        rightsHolder: React.PropTypes.string
    })
};

export default withWidth({
    largeWidth: 920,
    mediumWidth: 600,
    smallWidth: 320
})(ImageBlock);

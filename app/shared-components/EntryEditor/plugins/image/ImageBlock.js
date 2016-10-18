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
import {ImageSizeLarge, ImageSizeMedium, ImageSizeSmall} from 'shared-components/svg';
export default class ImageBlock extends Component {
    constructor (props) {
        super(props);

        this.actions = [
            { key: 'delete', icon: 'w', action: this.props.container.remove }
        ];
    }

    _handleCaptionChange = (event) => {
        event.stopPropagation();
        this.props.container.updateData({ caption: event.target.value });
    }

    _handleRightsHolderChange = (event) => {
        event.stopPropagation();
        this.props.container.updateData({ rightsHolder: event.target.value });
    }
    _getImageFile = () => {
        return <img src="http://blog.akasha.world/content/images/Dragonv2.jpg" />;
    }

    render () {
        const {
          BlockContent,
          BlockData,
          BlockInput,
          CommonBlock
      } = MegadraftPlugin;
        const akashaTermsLink = <a href="">AKASHA's terms</a>;
        return (
          <Card>
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
                  <IconButton>
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

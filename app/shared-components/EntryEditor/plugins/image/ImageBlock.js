import React, { Component } from 'react';
import { MegadraftPlugin } from 'megadraft';


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

    render () {
        const {
          BlockContent,
          BlockData,
          BlockInput,
          CommonBlock
      } = MegadraftPlugin;
        return (
          <CommonBlock {...this.props} actions={this.actions}>
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
          </CommonBlock>
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

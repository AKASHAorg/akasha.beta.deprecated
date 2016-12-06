import React, { Component } from 'react';
import {
    SvgIcon } from 'material-ui';
import withWidth from 'material-ui/utils/withWidth';
import imageCreator, { findBestMatch } from 'utils/imageUtils'; // eslint-disable-line import/no-unresolved, import/extensions
import clickAway from 'utils/clickAway'; // eslint-disable-line import/no-unresolved, import/extensions
import styles from './image-block.scss';

class ImageBlock extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: true
        }
    }
    _getBaseNodeStyle = () => {
        const { media } = this.props.data;
        if (media === 'xs') {
            const marginLeft = ((document.body.getBoundingClientRect().width - 700) / 2) - 32;
            return {
                width: 320,
                float: 'left',
                marginRight: 48,
                // @TODO: DIRTYHACK!! GET RID OF THIS!!!
                marginLeft
            };
        }
        if (media === 'md') {
            if (this.baseNodeRef) this.baseNodeRef.parentNode.parentNode.style.float = 'none';
            return {
                margin: '0 auto',
                width: 700
            };
        }
        if (media === 'lg') {
            if (this.baseNodeRef) this.baseNodeRef.parentNode.parentNode.style.float = 'none';
            return {
                margin: '0 auto',
                width: '100%'
            };
        }
        return {};
    }
    _getImageSrc = () => {
        const { files, media } = this.props.data;
        const { width } = this.props;
        const widths = [320, 700, 1280];
        const fileKey = findBestMatch(widths[width - 1], files, media);
        return `http://127.0.0.1:8080/ipfs/${files[fileKey].src}`;
    }
    render () {
        const { files, caption, media } = this.props.data;
        const baseNodeStyle = this._getBaseNodeStyle();
        return (
          <div
            ref={(baseNode) => { this.baseNodeRef = baseNode; }}
            style={baseNodeStyle}
          >
            <div
              className={`${styles.rootInner}`}
            >
              <div className={`${styles.image}`} >
                <img src={this._getImageSrc()} />
              </div>
              <div className={`${styles.caption}`} >
                <small>{caption}</small>
              </div>
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
    largeWidth: 1280,
    mediumWidth: 700,
    smallWidth: 320
})(ImageBlock);

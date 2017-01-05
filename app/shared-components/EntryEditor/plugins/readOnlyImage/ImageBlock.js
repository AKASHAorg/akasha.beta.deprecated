import React, { Component } from 'react';
import withWidth from 'material-ui/utils/withWidth';
import { findClosestMatch } from 'utils/imageUtils'; // eslint-disable-line import/no-unresolved, import/extensions
import styles from './image-block.scss';

class ImageBlock extends Component {
    constructor (props) {
        super(props);
        this.state = {
            loading: true
        };
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
        const widths = [320, 700, 1280, 1920];
        let fileKey = findClosestMatch(widths[width], files, media);
        if ((media === 'xl' || media === 'xxl') && this.baseNodeRef) {
            fileKey = findClosestMatch(this.baseNodeRef.parentNode.clientWidth, files, media);
        }
        // @todo: [code: 3ntry3] get rid of this too;
        return `${window.entry__baseUrl}/${files[fileKey].src}`;
    }
    render () {
        const { caption, } = this.props.data;
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
                <img src={this._getImageSrc()} role="presentation" />
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
    data: React.PropTypes.shape({
        files: React.PropTypes.shape(),
        caption: React.PropTypes.string,
        rightsHolder: React.PropTypes.string,
        media: React.PropTypes.string,
        licence: React.PropTypes.string,
        termsAccepted: React.PropTypes.bool
    }),
    width: React.PropTypes.number
};

export default withWidth({
    largeWidth: 1920,
    mediumWidth: 728,
    smallWidth: 320
})(ImageBlock);

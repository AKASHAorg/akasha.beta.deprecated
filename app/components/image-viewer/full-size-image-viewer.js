import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { Icon } from '../';
import { fullSizeImageDelete } from '../../local-flux/actions/app-actions';

class FullSizeImageViewer extends Component {
    constructor (props) {
        super(props);
        this.state = {
            currentIndex: 0,
            loadingImage: true
        };
    }
    componentWillReceiveProps = (nextProps) => {
        const { fullSizeImages } = nextProps;
        if (fullSizeImages.size > 0) {
            const startImgId = fullSizeImages.get('startId');
            const images = fullSizeImages.get('images');
            const startIndex = images.findIndex(img => img.imgId === startImgId);
            this.setState({
                currentIndex: startIndex
            });
        }
    }
    _getImages = () => {}
    _handleViewerClose = () => {
        this.setState({
            loadingImage: false,
            currentIndex: 0,
        }, () => {
            this.props.fullSizeImageDelete();
        });
    }
    _handleImageLoad = () => {
        this.setState({
            loadingImage: false
        });
    }
    _incrementIndex = () => {
        const { fullSizeImages } = this.props;
        const images = fullSizeImages.get('images');
        this.setState((prevState) => {
            if (prevState.currentIndex === images.size - 1) {
                return {
                    currentIndex: 0
                };
            }
            return {
                currentIndex: prevState.currentIndex + 1
            };
        });
    }
    _decrementIndex = () => {
        const { fullSizeImages } = this.props;
        const images = fullSizeImages.get('images');
        this.setState((prevState) => {
            if (prevState.currentIndex === 0) {
                return {
                    currentIndex: images.size - 1
                };
            }
            return {
                currentIndex: prevState.currentIndex - 1
            };
        });
    }
    render () {
        const { fullSizeImages } = this.props;
        const { currentIndex, loadingImage } = this.state;
        const showViewer = fullSizeImages.size > 0 && fullSizeImages.get('images').size > 0;
        return (
          <div
            className={
              `full-size-image-viewer full-size-image-viewer${showViewer ? '' : '__hidden'}`
            }
          >
            <div
              className="full-size-image-viewer__close-button"
            >
              <Button
                icon="close"
                size="small"
                type="primary"
                onClick={this._handleViewerClose}
              />
            </div>
            <div
              className="full-size-image-viewer__images"
            >
              {showViewer && loadingImage &&
                <div>
                    Loading
                </div>
              }
              {showViewer && fullSizeImages.get('images').size > 1 &&
                <div
                  onClick={this._incrementIndex}
                  className="full-size-image-viewer__arrow full-size-image-viewer__arrow_left"
                >
                  <Icon
                    type="back"
                    className="full-size-image-viewer__arrow_icon"
                  />
                </div>
              }
              {showViewer &&
                <img
                  className="full-size-image-viewer__image"
                  src={fullSizeImages.getIn(['images', currentIndex]).src}
                  onLoad={this._handleImageLoad}
                  alt=""
                />
              }
              {showViewer && fullSizeImages.get('images').size > 1 &&
                <div
                  className="full-size-image-viewer__arrow full-size-image-viewer__arrow_right"
                  onClick={this._decrementIndex}
                >
                  <Icon
                    type="forward"
                    className="full-size-image-viewer__arrow_icon"
                  />
                </div>
              }
              <div
                className="full-size-image-viewer__bg-overlay"
                onClick={this._handleViewerClose}
              />
            </div>
          </div>
        );
    }
}

const mapStateToProps = state => ({
    fullSizeImages: state.appState.get('fullSizeImages'),
});
FullSizeImageViewer.propTypes = {
    fullSizeImages: PropTypes.shape(),
    fullSizeImageDelete: PropTypes.func,
};
export default connect(
    mapStateToProps,
    {
        fullSizeImageDelete,
    }
)(FullSizeImageViewer);

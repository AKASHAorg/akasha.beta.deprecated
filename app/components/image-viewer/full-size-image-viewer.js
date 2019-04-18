import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import { injectIntl } from 'react-intl';
import { fullSizeImageDelete } from '../../local-flux/actions/app-actions';
import { entryMessages } from '../../locale-data/messages';
import { appSelectors } from '../../local-flux/selectors';

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
        if (this.props.fullSizeImages.size > 0 && fullSizeImages.size === 0) {
            this.setState({
                loadingImage: true,
            });
        }
    }
    _getImages = () => {
    }
    _handleViewerClose = () => {
        this.setState({
            loadingImage: true,
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
        const { fullSizeImages, intl } = this.props;
        const { currentIndex, loadingImage } = this.state;
        const showViewer = fullSizeImages.size > 0 && fullSizeImages.get('images').size > 0;
        return (
            <div
                className={
                    `full-size-image-viewer full-size-image-viewer${ showViewer ? '' : '__hidden' }`
                }
                onClick={ this._handleViewerClose }
            >
                {/* <div
              className="full-size-image-viewer__close-button"
            >
              <Button
                icon="close"
                size="small"
                type="primary"
                onClick={this._handleViewerClose}
              />
            </div> */ }
                <div
                    className="full-size-image-viewer__images"
                >
                    { showViewer && loadingImage &&
                    <div className="full-size-image-viewer__loading-wrapper">
                        <div className="full-size-image-viewer__loading">
                            <Spin
                                size="large"
                                tip={ intl.formatMessage(entryMessages.loadingImage) }
                            />
                        </div>
                    </div>
                    }
                    {/* {showViewer && fullSizeImages.get('images').size > 1 &&
                <div
                  onClick={this._incrementIndex}
                  className="full-size-image-viewer__arrow full-size-image-viewer__arrow_left"
                >
                  <Icon
                    type="back"
                    className="full-size-image-viewer__arrow_icon"
                  />
                </div>
              } */ }
                    { showViewer &&
                    <img
                        className={
                            `full-size-image-viewer__image
                      full-size-image-viewer__image${ loadingImage ? '_loading' : '' }`
                        }
                        src={ fullSizeImages.getIn(['images', currentIndex]).src }
                        onLoad={ this._handleImageLoad }
                        alt=""
                    />
                    }
                    {/* {showViewer && fullSizeImages.get('images').size > 1 &&
                <div
                  className="full-size-image-viewer__arrow full-size-image-viewer__arrow_right"
                  onClick={this._decrementIndex}
                >
                  <Icon
                    type="forward"
                    className="full-size-image-viewer__arrow_icon"
                  />
                </div>
              } */ }
                    <div
                        className="full-size-image-viewer__bg-overlay"
                        // onClick={this._handleViewerClose}
                    />
                </div>
            </div>
        );
    }
}

FullSizeImageViewer.propTypes = {
    fullSizeImages: PropTypes.shape(),
    fullSizeImageDelete: PropTypes.func,
    intl: PropTypes.shape(),
};

const mapStateToProps = state => ({
    fullSizeImages: appSelectors.selectFullSizeImages(state),
});

export default connect(
    mapStateToProps,
    {
        fullSizeImageDelete,
    }
)(injectIntl(FullSizeImageViewer));

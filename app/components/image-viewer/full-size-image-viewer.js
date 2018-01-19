import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { fullSizeImageDelete } from '../../local-flux/actions/app-actions';

class FullSizeImageViewer extends Component {
    state = {
        currentIndex: 0
    }
    _getImages = () => {}
    _handleViewerClose = () => {
        this.props.fullSizeImageDelete();
    }
    render () {
        const { fullSizeImages } = this.props;
        const { currentIndex } = this.state;
        const showViewer = fullSizeImages && fullSizeImages.size > 0;
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
              {showViewer &&
                <img
                  className="full-size-image-viewer__image"
                  src={fullSizeImages.get(0).src}
                  alt=""
                />
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

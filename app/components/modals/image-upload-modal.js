import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import { Button, Modal, Progress } from 'antd';
import { generalMessages } from '../../locale-data/messages';
import { fromJS } from 'immutable';
import { equals } from 'ramda';
import { generalMessages } from '../../locale-data/messages';
import imageCreator, { getResizedImages, findClosestMatch } from '../../utils/imageUtils';
import { uploadImage } from '../../local-flux/services/utils-service';
import { Icon } from '../';

const INITIAL_PROGRESS_VALUE = 20;


class ImageUploadModal extends Component {
    constructor (props) {
        super(props);
        this.state = {
            progress: INITIAL_PROGRESS_VALUE,
            error: null,
            processingFinished: true,
            imageLoaded: false,
            imageUploaderClose: false
        };
    }

    componentDidUpdate () {
        if (this.props.modalVisible) {
            
        }
    }

    _handleResizeProgress = (totalProgress) => {
        this.setState({
            progress: Math.round(totalProgress + INITIAL_PROGRESS_VALUE)
        });
        this.forceUpdate();
    }
    _resizeImages = (files) => {
        const filePromises = getResizedImages(files, {
            minWidth: this.props.minWidth,
            minHeight: this.props.minHeight,
            progressHandler: this._handleResizeProgress,
            maxProgress: (100 - INITIAL_PROGRESS_VALUE)
        });
        // only support single file for now! (notice the 0 index)
        filePromises[0].then((results) => {
            this.setState({
                processingFinished: true,
                error: null,
                imageLoaded: false
            }, () => {
                if (typeof this.props.onChange === 'function') {
                    if (!this.props.useIpfs) {
                        return this.props.onChange(results);
                    }
                    if (results) {
                        return uploadImage(results)
                            .then(converted => this.props.onChange(converted));
                    }
                }
                return true;
            });
        }).catch((err) => {
            this.setState({
                error: err,
                progress: INITIAL_PROGRESS_VALUE,
                processingFinished: false,
            });
        });
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    
    hideModal = () => {
        this.setState({
            visible: false,
        });
    }

    handleOk = () => {
        this.props.saveImage();
    }

    handleCancel = () => {
    }

    render () {
        const { intl, modalVisible } = this.props;

        return (
          <Modal
            closable
            onCancel={this.handleCancel}
            onOk={this.handleOk}
            visible={modalVisible}
            footer={null}
            title={intl.formatMessage(generalMessages.uploadImageTitle)}
            wrapClassName="image-upload-modal"
          >
            <div className="image-upload-modal__title">
            </div>
            <div className="image-upload-modal__footer-btns">
              <div className="image-upload-modal__cancel-btn">
                <Button key="back" onClick={this.handleCancel}>
                  {intl.formatMessage(generalMessages.cancel)}
                </Button>
              </div>
              <Button key="submit" type="primary" onClick={this.handleOk}>
                {intl.formatMessage(generalMessages.confirm)}
              </Button>
            </div>
          </Modal>
        );
    }
}

ImageUploadModal.propTypes = {
    // used in profile update
    baseUrl: PropTypes.string,
    // pass the container width
    containerSize: PropTypes.number,
    // pass an image object from ipfs
    initialImage: PropTypes.shape(),
    // internationalization
    intl: PropTypes.shape().isRequired,
    // minimum accepted image width
    minWidth: PropTypes.number,
    // min accepted image height
    minHeight: PropTypes.number,
    // support multiple files
    multiFiles: PropTypes.bool,
    // change event for updates
    onChange: PropTypes.func,
    // handler when remove image is pressed
    onImageClear: PropTypes.func,
    // when true, image sources will be ipfs hashes
    useIpfs: PropTypes.bool,
}

export default injectIntl(ImageUploadModal);

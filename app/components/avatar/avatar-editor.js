import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AvatarEditor from 'react-avatar-editor/dist';
import { injectIntl } from 'react-intl';
import { Button } from 'antd';
import { Icon } from '../';
import { generalMessages } from '../../locale-data/messages/general-messages';
import { selectBaseUrl } from '../../local-flux/selectors/index';

class AvatarEditr extends Component {
    constructor (props) {
        super(props);
        this.state = {
            avatarImage: null,
            avatarScale: props.avatarScale || 1,
            imageLoaded: false,
            rotation: 0,
            highlightDropZone: false,
            avatarClose: false
        };
    }
    onImageLoad = () => {
        this.setState({
            imageLoaded: true
        });
    }
    getImage = () =>
        new Promise((resolve) => {
            // if image is a string it means it comes from ipfs
            if (this.props.image && typeof this.props.image === 'string') {
                return resolve(this.props.image);
            }
            if (!this.props.image && !this.editor) {
                return resolve(null);
            }
            const imageCanvas = this.editor.getImage();
            return imageCanvas.toBlob((blob) => {
                const reader = new FileReader();
                reader.onloadend = ev =>
                    resolve(new Uint8Array(ev.target.result));
                reader.readAsArrayBuffer(blob);
            }, 'image/jpg');
        });
    _handleAvatarClear = () => {
        const { onImageClear } = this.props;
        if (onImageClear) {
            onImageClear();
        }
        this.setState({
            avatarImage: null,
            isNewAvatarLoaded: false,
            rotation: 0,
            avatarScale: 1,
            highlightDropZone: false
        }, () => {
            this.forceUpdate();
        });
    }
    _handleSliderChange = (sliderValue) => {
        this.setState({
            avatarScale: sliderValue
        });
    }
    _handleRotate = () => {
        this.setState((prevState) => {
            if (prevState.rotation < 270) {
                return {
                    rotation: prevState.rotation + 90
                };
            }
            return {
                rotation: 0
            };
        });
    }
    _handleImageAdd = () => {
        const files = this.fileInput.files[0].path;
        this.setState({
            avatarImage: files,
            isNewAvatarLoaded: true,
            highlightDropZone: false,
        });
    }
    _handleImageDrop = (ev) => {
        this._handleAvatarClear();
        const files = ev.target.toDataURL('image/jpeg', 1);
        this.setState({
            avatarImage: files,
            isNewAvatarLoaded: true,
            highlightDropZone: false,
        });
    }
    _handleImageLoad = () => {
        if (this.props.onImageAdd) {
            this.props.onImageAdd();
        }
    }
    _highlightDropZone = (ev) => {
        ev.preventDefault();
        if (ev.target.className === 'avatar__dialog-handler') {
            this.setState({
                highlightDropZone: true
            });
        }
    }
    _diminishDropZone = () => {
        this.setState({
            highlightDropZone: false
        });
    }
    _handleAvatarClick = (ev) => {
        // only when not editable!!
        if (this.props.onClick) {
            this.props.onClick(ev);
        }
    }
    render () {
        const { baseUrl, backgroundColor, image, offsetBorder,
            onMouseEnter, onMouseLeave, size, style } = this.props;
        let avatarImage;
        if (this.state.avatarImage) {
            avatarImage = this.state.avatarImage;
        } else if (image) {
            avatarImage = `${baseUrl}/${image}`;
        }
        if (!avatarImage) {
            this.editor = null;
        }

        return (
          <div
            className="avatar avatar_with-overflow"
            style={{ width: size, height: size, ...style }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onDragEnter={this._highlightDropZone}
            onDragLeave={this._diminishDropZone}
          >
            {!avatarImage &&
            <div>
              <input
                ref={(fileInput) => { this.fileInput = fileInput; }}
                className="avatar__dialog-handler"
                type="file"
                onChange={this._handleImageAdd}
              />
              <div
                className={
                    `avatar__avatar-empty
                    avatar__avatar-empty${this.state.highlightDropZone ? '_dragEnter' : ''}`
                }
                style={{
                    width: size,
                    height: size
                }}
              />
              <div
                className={
                    `avatar__add-image-icon-wrapper
                    avatar__add-image-icon-wrapper${this.state.highlightDropZone ? '_dragEnter' : ''}`
                }
              >
                <Icon className="avatar__add-image-icon" type="photoImage" />
              </div>
              {/* <div
                className={
                    `avatar__add-image-help-text
                    avatar__add-image-help-text${this.state.highlightDropZone ? '_dragEnter' : ''}`
                }
              >
                {!this.state.highlightDropZone && intl.formatMessage(generalMessages.addImage)}
                {this.state.highlightDropZone && intl.formatMessage(generalMessages.addImageDragged)}
              </div> */}
            </div>
            }
            {avatarImage &&
              <div>
                <div
                  onMouseEnter={() => { this.setState({ avatarClose: true }); }}
                  onMouseLeave={() => { this.setState({ avatarClose: false }); }}
                >
                  <AvatarEditor
                    style={{
                        border: offsetBorder || 0,
                        backgroundColor,
                        width: size,
                        height: size
                    }}
                    className="avatar__avatar-editor"
                    border={0}
                    image={avatarImage}
                    ref={(editor) => { this.editor = editor; }}
                    scale={this.state.avatarScale}
                    rotate={this.state.rotation}
                    onDropFile={this._handleImageDrop}
                    onLoadSuccess={this._handleImageLoad}
                  />
                  {this.state.avatarClose &&
                    <div className="avatar__clear-image-button">
                      <Button
                        type="standard"
                        icon="close-circle"
                        onClick={this._handleAvatarClear}
                      />
                    </div>
                  }
                </div>
                {/* <div className="avatar__controls">
                  <Row type="flex" align="middle" gutter={8}>
                    <Col span={16}>
                      <Slider
                        max={2}
                        min={1}
                        step={0.1}
                        defaultValue={this.state.avatarScale}
                        onChange={this._handleSliderChange}
                      />
                    </Col>
                    <Col
                      span={4}
                    >
                      <Button
                        ghost
                        onClick={this._handleRotate}
                        shape="circle"
                        icon="reload"
                        className="standard-button"
                      />
                    </Col>
                    <Col span={4}>
                      <Button
                        ghost
                        onClick={this._handleAvatarClear}
                        shape="circle"
                        icon="close"
                        className="standard-button"
                      />
                    </Col>
                  </Row>
                </div> */}
              </div>
            }
          </div>
        );
    }
}
AvatarEditr.propTypes = {
    avatarScale: PropTypes.number,
    baseUrl: PropTypes.string,
    backgroundColor: PropTypes.string,
    image: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape()
    ]),
    onClick: PropTypes.func,
    offsetBorder: PropTypes.string,
    onImageAdd: PropTypes.func,
    onImageClear: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
    size: PropTypes.number,
    style: PropTypes.shape(),
};

AvatarEditr.defaultProps = {
    size: 200,
};

function mapStateToProps (state) {
    return {
        baseUrl: selectBaseUrl(state)
    };
  }

export default connect(mapStateToProps, null, null, { withRef: true })(injectIntl(AvatarEditr, { withRef: true }));

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AvatarEditor from 'react-avatar-editor/dist';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import RotateIcon from 'material-ui/svg-icons/image/rotate-right';
import { SvgIcon, Slider } from 'material-ui';
import { AddImage, AvatarPlaceholder } from '../svg';
import styles from './avatar.scss';

class Avatar extends Component {
    constructor (props) {
        super(props);
        this.state = {
            avatarImage: null,
            avatarScale: props.avatarScale || 1.2,
            imageLoaded: false,
            rotation: 0
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
            const imageCanvas = this.editor.getImageScaledToCanvas();
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
            avatarScale: 1.2
        });
    }
    _handleSliderChange = (ev, sliderValue) => {
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
            isNewAvatarLoaded: true
        }, () => {
            if (this.props.onImageAdd) {
                this.props.onImageAdd();
            }
        });
    }
    _handleImageChange = () => {

    }
    _handleAvatarClick = (ev) => {
        // only when not editable!!
        if (this.props.onClick) {
            this.props.onClick(ev);
        }
    }
    render () {
        const {
            size,
            editable,
            image,
            userInitials,
            userInitialsStyle,
            userInitialsAlignStyle,
            userInitialsWrapperStyle,
            offsetBorder,
            backgroundColor,
            style,
            onMouseEnter,
            onMouseLeave } = this.props;
        const { palette } = this.context.muiTheme;
        let avatarImage;
        if (this.state.avatarImage) {
            avatarImage = this.state.avatarImage;
        } else if (image) {
            avatarImage = image;
        }
        if (!avatarImage) {
            this.editor = null;
        }

        return (
          <div
            className={`${styles.root}`}
            style={
              Object.assign({ maxWidth: size }, style)
            }
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            {editable && !avatarImage &&
              <input
                ref={(fileInput) => { this.fileInput = fileInput; }}
                className={`${styles.dialogHandler}`}
                type="file"
                onChange={this._handleImageAdd}
              />
            }
            {avatarImage &&
              <div>
                {editable ?
                  <AvatarEditor
                    style={{
                        borderRadius: 5,
                        border: offsetBorder || 0,
                        backgroundColor,
                        width: size,
                        height: size,
                        borderColor: palette.textColor
                    }}
                    border={1}
                    image={avatarImage}
                    ref={(editor) => { this.editor = editor; }}
                    borderRadius={5}
                    scale={editable ? this.state.avatarScale : 1}
                    rotate={this.state.rotation}
                    onDropFile={this._handleImageAdd}
                  /> :
                  <img
                    alt=""
                    src={avatarImage}
                    style={{
                        display: this.state.imageLoaded ? 'initial' : 'none',
                        width: size,
                        height: size,
                        borderRadius: '5px',
                        imageRendering: 'auto'
                    }}
                    onLoad={this.onImageLoad}
                    onClick={this._handleAvatarClick}
                  />
                }
                {editable &&
                  <div className="col-xs-12">
                    <div className="row middle-xs">
                      <div className="col-xs-9">
                        <Slider
                          max={2}
                          min={1}
                          step={0.1}
                          defaultValue={this.state.avatarScale}
                          onChange={this._handleSliderChange}
                        />
                      </div>
                      <div
                        onClick={this._handleRotate}
                        className={`col-xs-3 ${styles.rotateButton}`}
                      >
                        <SvgIcon>
                          <RotateIcon color={palette.primary1Color} />
                        </SvgIcon>
                      </div>
                    </div>
                    <div
                      className={`${styles.clearAvatarButton}`}
                      onClick={this._handleAvatarClear}
                    >
                      <SvgIcon>
                        <ClearIcon color={palette.primary1Color} />
                      </SvgIcon>
                    </div>
                  </div>
                }
                {!this.state.imageLoaded && !editable &&
                  <div
                    className={`${styles.avatarEmpty}`}
                    style={{
                        width: size,
                        height: size,
                        border: `1px solid ${palette.textColor}`,
                        backgroundColor: palette.avatarBackground
                    }}
                  >
                    <SvgIcon viewBox="0 0 32 32" style={{ color: '#fff', width: size - 2, height: size - 2 }} onClick={this._handleAvatarClick}>
                      <AvatarPlaceholder />
                    </SvgIcon>
                  </div>
                }
              </div>
            }
            {!avatarImage &&
              <div
                className={`${styles.avatarEmpty}`}
                style={{
                    width: size,
                    height: size,
                    border: '1px solid #fcfcfc',
                    backgroundColor: '#788',
                    fontWeight: '600',
                    fontSize: '36px'
                }}
              >
                {userInitials &&
                  <div
                    style={{
                        height: '100%',
                        backgroundColor: this.props.backgroundColor || '#788',
                        color: '#fff',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                  >
                    <div style={userInitialsAlignStyle} />
                    <div style={userInitialsWrapperStyle} onClick={this._handleAvatarClick}>
                      <h3
                        className={styles.userInitials}
                        style={Object.assign({}, { color: '#fff' }, userInitialsStyle)}
                      >
                        {userInitials}
                      </h3>
                    </div>
                  </div>
                }
                {!userInitials && editable &&
                  <SvgIcon
                    viewBox="0 0 36 36"
                    color={palette.textColor}
                    className={`${styles.addImageIcon}`}
                  >
                    <AddImage />
                  </SvgIcon>
                }
                {!userInitials && !editable &&
                  <SvgIcon viewBox="0 0 32 32" style={{ color: '#fff', width: size - 2, height: size - 2 }} onClick={this._handleAvatarClick}>
                    <AvatarPlaceholder />
                  </SvgIcon>
                }
              </div>
            }
          </div>
        );
    }
}
Avatar.propTypes = {
    avatarScale: PropTypes.number,
    backgroundColor: PropTypes.string,
    editable: PropTypes.bool,
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
    userInitials: PropTypes.string,
    userInitialsStyle: PropTypes.shape(),
    userInitialsAlignStyle: PropTypes.shape(),
    userInitialsWrapperStyle: PropTypes.shape(),
};

Avatar.contextTypes = {
    muiTheme: PropTypes.object
};

Avatar.defaultProps = {
    size: 150,
    userInitialsAlignStyle: {
        height: '100%',
        display: 'inline-block',
        verticalAlign: 'middle'
    },
    userInitialsWrapperStyle: {
        display: 'inline-block',
        verticalAlign: 'middle',
        textAlign: 'center',
        width: '100%'
    },
};

export default Avatar;

import PropTypes from 'prop-types';
import React from 'react';
import AvatarEditor from 'react-avatar-editor/dist';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import RotateIcon from 'material-ui/svg-icons/image/rotate-right';
import { SvgIcon, Slider } from 'material-ui';
import { AddImage, AvatarPlaceholder } from '../svg';
import styles from './avatar.scss';

class Avatar extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            avatarImage: null,
            avatarScale: props.avatarScale || 1.2,
            imageLoaded: false,
            rotation: 0
        };
    }
    componentWillUnmount () {
        this._handleAvatarClear();
    }
    onImageLoad = () => {
        this.setState({
            imageLoaded: true
        });
    }
    getImage = () =>
        new Promise((resolve) => {
            if (this.props.image && typeof this.props.image === 'string') {
                return resolve(this.props.image);
            }
            if (this.editor) {
                const imageCanvas = this.editor.getImageScaledToCanvas();
                imageCanvas.toBlob((blob) => {
                    const reader = new FileReader();
                    reader.onloadend = ev =>
                        resolve(new Uint8Array(ev.target.result));
                    reader.readAsArrayBuffer(blob);
                }, 'image/jpg');
            } else {
                resolve(null);
            }
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
        });
    }
    _handleAvatarClick = (ev) => {
        // only when not editable!!
        if (this.props.onClick) {
            this.props.onClick(ev);
        }
    }
    render () {
        const {
            radius,
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
              Object.assign({ maxWidth: radius }, style)
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
                        borderRadius: 150,
                        border: offsetBorder || 0,
                        backgroundColor,
                        width: radius,
                        height: radius,
                        borderColor: palette.borderColor
                    }}
                    border={1}
                    image={avatarImage}
                    ref={(editor) => { this.editor = editor; }}
                    borderRadius={100}
                    scale={editable ? this.state.avatarScale : 1}
                    rotate={this.state.rotation}
                  /> :
                  <img
                    alt=""
                    src={avatarImage}
                    style={{
                        display: this.state.imageLoaded ? 'initial' : 'none',
                        width: radius,
                        height: radius,
                        borderRadius: '50%',
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
                        width: radius,
                        height: radius,
                        border: `1px solid ${palette.borderColor}`,
                        backgroundColor: palette.avatarBackground
                    }}
                  >
                    <SvgIcon viewBox="0 0 32 32" style={{ width: radius, height: radius }} onClick={this._handleAvatarClick}>
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
                    width: radius,
                    height: radius,
                    border: `1px solid ${palette.borderColor}`,
                    backgroundColor: palette.avatarBackground
                }}
              >
                {userInitials &&
                  <div
                    style={{
                        height: '100%',
                        backgroundColor: this.props.backgroundColor || palette.avatarBackground,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                  >
                    <div style={userInitialsAlignStyle} />
                    <div style={userInitialsWrapperStyle} onClick={this._handleAvatarClick}>
                      <h3
                        className={styles.userInitials}
                        style={Object.assign({}, {
                            color: palette.textColor,
                            fontSize: '36px',
                            fontWeight: 600
                        }, userInitialsStyle)}
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
                  <SvgIcon viewBox="0 0 32 32" style={{ width: radius, height: radius }} onClick={this._handleAvatarClick}>
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
    image: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.shape()
    ]),
    editable: PropTypes.bool,
    userInitials: PropTypes.string,
    radius: PropTypes.number,
    userInitialsStyle: PropTypes.shape(),
    backgroundColor: PropTypes.string,
    userInitialsAlignStyle: PropTypes.shape(),
    userInitialsWrapperStyle: PropTypes.shape(),
    offsetBorder: PropTypes.string,
    onImageClear: PropTypes.func,
    style: PropTypes.shape(),
    onClick: PropTypes.func,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
};
Avatar.contextTypes = {
    muiTheme: PropTypes.object
};
Avatar.defaultProps = {
    radius: 150,
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

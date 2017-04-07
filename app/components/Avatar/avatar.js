import React from 'react';
import AvatarEditor from 'react-avatar-editor/dist';
import AddPhotoIcon from 'material-ui/svg-icons/image/add-a-photo';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import { SvgIcon, Slider } from 'material-ui';
import { AvatarPlaceholder } from '../svg';

const defaultUserInitialsStyle = {
    textTransform: 'uppercase',
    fontSize: '36px',
    fontWeight: '600'
};

class Avatar extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            avatarImage: null,
            avatarScale: props.avatarScale || 1.2,
            imageLoaded: false
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
        const { clearAvatarImage } = this.props;
        if (clearAvatarImage) {
            clearAvatarImage();
        }
        this.setState({
            avatarImage: null,
            isNewAvatarLoaded: false
        });
    }
    _handleSliderChange = (ev, sliderValue) => {
        this.setState({
            avatarScale: sliderValue
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
            avatarEmptyStyle,
            avatarClearStyle,
            dialogHandlerStyle,
            userInitialsAlignStyle,
            userInitialsWrapperStyle,
            offsetBorder,
            backgroundColor,
            style,
            onMouseEnter,
            onMouseLeave } = this.props;
        const palette = this.context.muiTheme.palette;
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
            style={
              Object.assign({ maxWidth: radius, maxHeight: radius, position: 'relative' }, style)
            }
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          >
            {editable && !avatarImage &&
              <input
                ref={(fileInput) => { this.fileInput = fileInput; }}
                style={dialogHandlerStyle}
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
                  /> :
                  <img
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
                  <div>
                    <Slider
                      defaultValue={this.state.avatarScale}
                      max={2}
                      min={1}
                      step={0.1}
                      onChange={this._handleSliderChange}
                    />
                    <div
                      style={avatarClearStyle}
                      onClick={this._handleAvatarClear}
                    >
                      <SvgIcon>
                        <ClearIcon color="red" />
                      </SvgIcon>
                    </div>
                  </div>
                }
                {!this.state.imageLoaded && !editable &&
                  <div
                    style={{
                        ...avatarEmptyStyle,
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
                style={{
                    ...avatarEmptyStyle,
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
                      <h3 style={Object.assign({}, defaultUserInitialsStyle, userInitialsStyle)}>
                        {userInitials}
                      </h3>
                    </div>
                  </div>
                }
                {!userInitials && editable &&
                  <SvgIcon
                    style={{
                        width: radius,
                        height: radius
                    }}
                    color={palette.textColor}
                  >
                    <AddPhotoIcon viewBox="-30 -30 86 86" />
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
    avatarScale: React.PropTypes.number,
    image: React.PropTypes.string,
    editable: React.PropTypes.bool,
    userInitials: React.PropTypes.string,
    radius: React.PropTypes.number,
    userInitialsStyle: React.PropTypes.shape(),
    backgroundColor: React.PropTypes.string,
    avatarEmptyStyle: React.PropTypes.shape(),
    avatarClearStyle: React.PropTypes.shape(),
    dialogHandlerStyle: React.PropTypes.shape(),
    userInitialsAlignStyle: React.PropTypes.shape(),
    userInitialsWrapperStyle: React.PropTypes.shape(),
    offsetBorder: React.PropTypes.string,
    clearAvatarImage: React.PropTypes.func,
    style: React.PropTypes.shape(),
    onClick: React.PropTypes.func,
    onMouseEnter: React.PropTypes.func,
    onMouseLeave: React.PropTypes.func,
};
Avatar.contextTypes = {
    muiTheme: React.PropTypes.object
};
Avatar.defaultProps = {
    radius: 150,
    avatarEmptyStyle: {
        borderRadius: '50%',
        overflow: 'hidden',
    },
    avatarClearStyle: {
        cursor: 'pointer',
        position: 'absolute',
        top: 0,
        right: 0
    },
    dialogHandlerStyle: {
        height: '100%',
        width: '100%',
        position: 'absolute',
        cursor: 'pointer',
        opacity: 0,
        left: 0
    },
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

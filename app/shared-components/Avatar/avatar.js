import React from 'react';
import AvatarEditor from 'react-avatar-editor/dist';
import AddPhotoIcon from 'material-ui/svg-icons/image/add-a-photo';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import { SvgIcon, Slider } from 'material-ui';
import { remote } from 'electron';

const { dialog } = remote;

class Avatar extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            avatarImage: null,
            avatarScale: props.avatarScale || 1.2
        };
    }
    componentWillUnmount () {
        this._handleAvatarClear();
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

    _handleMouseEnter = () => {
        this.setState({
            showChangeAvatar: this.props.editable,
            showNameTooltip: this.props.editable
        });
    }
    _handleMouseLeave = () => {
        this.setState({
            showChangeAvatar: false,
            showNameTooltip: false
        });
    }
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
    _handleDialogOpen = () => {
        dialog.showOpenDialog({
            title: 'Select image for your avatar',
            properties: ['openFile'],
            filters: [{ name: 'Images', extensions: ['jpg', 'png'] }]
        }, (files) => {
            if (!files) {
                return;
            }
            this.setState({
                avatarImage: files[0],
                isNewAvatarLoaded: true
            });
        });
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
              style } = this.props;
        const palette = this.context.muiTheme.palette;
        let avatarImage;

        if (this.state.avatarImage) {
            avatarImage = this.state.avatarImage;
        } else if (image) {
            avatarImage = image;
        }
        return (
          <div
            style={Object.assign({ maxWidth: radius, position: 'relative' }, style)}
            onMouseEnter={this._handleMouseEnter}
            onMouseLeave={this._handleMouseLeave}
          >
            {this.state.showChangeAvatar && !this.state.isNewAvatarLoaded &&
              <div
                style={dialogHandlerStyle}
                onClick={this._handleDialogOpen}
              />
            }
            {avatarImage &&
              <div>
                {/*<AvatarEditor
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
                />*/}
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
              </div>
            }
            {!avatarImage &&
              <div
                style={{
                    ...avatarEmptyStyle,
                    width: radius,
                    height: radius,
                    border: `1px solid ${palette.borderColor}`
                }}
              >
                {this.props.userInitials &&
                  <div
                    style={{
                        height: '100%',
                        backgroundColor: this.props.backgroundColor
                    }}
                  >
                    <div style={userInitialsAlignStyle} />
                    <div style={userInitialsWrapperStyle}>
                      <h3 style={userInitialsStyle}>{userInitials}</h3>
                    </div>
                  </div>
                }
                {!userInitials &&
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
    style: React.PropTypes.shape()
};
Avatar.contextTypes = {
    muiTheme: React.PropTypes.object
};
Avatar.defaultProps = {
    radius: 150,
    backgroundColor: 'rgba(239, 239, 239, 1)',
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
        cursor: 'pointer'
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
    userInitialsStyle: {
        textTransform: 'uppercase',
        fontSize: '36px',
        fontWeight: '600'
    }
};
export default Avatar;

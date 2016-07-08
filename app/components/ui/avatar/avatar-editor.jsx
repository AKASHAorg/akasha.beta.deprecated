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
            avatarScale: 1.2
        };
    }

    getImage = () => {
        return new Promise((resolve) => {
            if (this.refs.editor && this.state.avatarImage) {
                const imageCanvas = this.refs.editor.getImageScaledToCanvas();

                imageCanvas.toBlob(blob => {
                    const reader = new FileReader();
                    reader.onloadend = (ev) =>
                        resolve(new Uint8Array(ev.target.result));

                    reader.readAsArrayBuffer(blob);
                }, 'image/jpg');
            } else {
                resolve(null);
            }
        });
    }
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
        }, files => {
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
        const userName = this.props.userName;
        const palette = this.context.muiTheme.palette;
        const avatarEmptyStyle = {
            width: (this.props.radius || 150),
            height: (this.props.radius || 150),
            borderRadius: '50%',
            overflow: 'hidden',
            border: `1px solid ${palette.textColor}`
        };
        const avatarClearStyle = {
            cursor: 'pointer',
            position: 'absolute',
            top: 0,
            right: 0
        };
        const dialogHandlerStyle = {
            height: '100%',
            width: '100%',
            position: 'absolute',
            cursor: 'pointer'
        };
        const userInitialsAlignStyle = {
            height: '100%',
            display: 'inline-block',
            verticalAlign: 'middle'
        };
        const userInitialsWrapperStyle = {
            display: 'inline-block',
            verticalAlign: 'middle',
            textAlign: 'center',
            width: '100%'
        };
        let userInitials;
        let avatarImage;
        if (this.props.userName) {
            userInitials = userName.split(' ').map((part) => part.charAt(0)).join('');
        }
        if (this.state.avatarImage) {
            avatarImage = this.state.avatarImage;
        } else if (this.props.image) {
            avatarImage = this.props.image;
        }

        return (
          <div
            style={{ maxWidth: (this.props.radius || 150), position: 'relative' }}
            onMouseEnter={this._handleMouseEnter}
            onMouseLeave={this._handleMouseLeave}
            {...this.props}
          >
          {this.state.showChangeAvatar && !this.state.isNewAvatarLoaded &&
            <div
              style={dialogHandlerStyle}
              onClick={this._handleDialogOpen}
            />
            }

            {avatarImage &&
              <div>
                <AvatarEditor
                  style={{
                      borderRadius: 150,
                      border: this.props.offsetBorder ? this.props.offsetBorder : 0
                  }}
                  border={this.state.isNewAvatarLoaded ? 10 : 0}
                  image={avatarImage}
                  ref="editor"
                  width={this.props.radius || 130}
                  height={this.props.radius || 130}
                  borderRadius={100}
                  scale={this.props.editable ? 1 : this.state.avatarScale}
                />
                {this.props.editable &&
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
              <div style={avatarEmptyStyle}>
                {this.props.userName &&
                  <div
                    style={{
                        height: '100%',
                        backgroundColor: this.props.backgroundColor
                    }}
                  >
                    <div style={userInitialsAlignStyle} />
                    <div style={userInitialsWrapperStyle}>
                      <h2 style={this.props.userInitialsStyle}>{userInitials}</h2>
                    </div>
                  </div>
                }
                {!this.props.userName &&
                  <SvgIcon
                    style={{
                        width: this.props.radius,
                        height: this.props.radius
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
    image: React.PropTypes.string,
    editable: React.PropTypes.bool,
    userName: React.PropTypes.string,
    radius: React.PropTypes.number,
    userInitialsStyle: React.PropTypes.object,
    backgroundColor: React.PropTypes.string
};
Avatar.contextTypes = {
    muiTheme: React.PropTypes.object
};
Avatar.defaultProps = {
    radius: 150,
    backgroundColor: 'rgba(239, 239, 239, 1)'
};
export default Avatar;

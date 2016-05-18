import React from 'react';
import AvatarEditor from 'react-avatar-editor';
import AddPhotoIcon from 'material-ui/svg-icons/image/add-a-photo';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import {SvgIcon, Slider} from 'material-ui';
const remote = require('remote');
const dialog = remote.require('electron').dialog;

class Avatar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatarImage: null,
      avatarScale: 1.2
    }
  }
  getImage  = () => {
    return this.editor.getImage();
  }
  render () {
    const userName = this.props.userName;
    const avatarHandlerStyle = {

    }
    let userInitials, avatarImage;
    if (this.props.userName) {
      userInitials = userName.split(' ').map((part) => part.charAt(0)).join('');
    }

    if(this.state.avatarImage) {
      avatarImage = this.state.avatarImage
    } else if(this.props.image) {
      avatarImage = this.props.image
    }

    return (
      <div style = {{maxWidth: '150px', position: 'relative'}}
            onMouseEnter = {this._handleMouseEnter}
            onMouseLeave={this._handleMouseLeave}>
        { this.state.showChangeAvatar && !this.state.isNewAvatarLoaded &&
          <div style = {{height: '100%', width: '100%', position: 'absolute', cursor: 'pointer'}} 
                onClick = {this._handleDialogOpen}
          />
        }
        
        { avatarImage &&
          <div>
            <AvatarEditor
              style = {{ borderRadius: 150 }}
              border = {this.state.isNewAvatarLoaded ? 10 : 0}
              image = {avatarImage}
              ref = {(editor) => this.editor = editor}
              width = {130}
              height = {130}
              borderRadius = {100}
              scale = {this.state.avatarScale}
            />
            <div>
              <Slider defaultValue = {this.state.avatarScale}
                      max = {2}
                      min = {1}
                      step = {0.1}
                      onChange = {this._handleSliderChange}
              />
              <div style = {{ cursor: 'pointer', position: 'absolute', top: 0, right: 0 }}
                    onClick = {this._handleAvatarClear}>
                <SvgIcon>
                  <ClearIcon color = "red"/>
                </SvgIcon>
              </div>
            </div>
          </div>
        }
        {!avatarImage &&
          <div style={{width: '150px', height: '150px', borderRadius: '50%', overflow: 'hidden', border: '1px solid ' + this.context.muiTheme.palette.textColor}}>
            {this.props.userName &&
              <div style={{ height: '100%', backgroundColor: '#DDD' }}>
                <div style={{ height: '100%', display: 'inline-block', verticalAlign: 'middle' }} />
                <div style={{ display: 'inline-block', verticalAlign: 'middle', textAlign: 'center', width: '100%' }}>
                  <h2>{userInitials}</h2>
                </div>
              </div>
            }
            {!this.props.userName &&
              <SvgIcon style={{width: 150, height: 150}} color={this.context.muiTheme.palette.textColor}>
                <AddPhotoIcon viewBox="-30 -30 86 86"/>
              </SvgIcon>
            }
          </div>
        }
      </div>
      );
  }
  _handleMouseEnter = (ev) => {
    this.setState({
      showChangeAvatar: (this.props.editable ? true : false),
      showNameTooltip: (this.props.editable ? false : true)
    });
  }
  _handleMouseLeave = (ev) => {
    this.setState({
      showChangeAvatar: false,
      showNameTooltip: false
    });
  }
  _handleAvatarClear = (ev) => {
    this.setState({
      avatarImage: null,
      isNewAvatarLoaded: false
    })
  }
  _handleSliderChange = (ev, sliderValue) => {
    this.setState({
      avatarScale: sliderValue
    })
  }
  _handleDialogOpen = (ev) => {
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
}
Avatar.propTypes = {
  image: React.PropTypes.string,
  editable: React.PropTypes.bool,
  userName: React.PropTypes.string
};
Avatar.contextTypes = {
  muiTheme: React.PropTypes.object
}
export default Avatar;

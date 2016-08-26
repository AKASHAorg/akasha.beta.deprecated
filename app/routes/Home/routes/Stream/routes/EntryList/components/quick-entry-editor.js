import React from 'react';
import { Paper, FlatButton } from 'material-ui';
import Avatar from 'shared-components/Avatar/avatar';
import imageCreator from '../../../../../../../utils/imageUtils';
import clickAway from '../../../../../../../utils/clickAway';
import EntryEditor from 'shared-components/EntryEditor';

class QuickEntryEditor extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            isExpanded: false
        };
    }
    _handleEditClick = (ev) => {
        this.setState({
            isExpanded: true
        }, () => {
            this.editor.refs.clickAwayableElement.focus();
        });
    }
    componentClickAway () {
      // @TODO verify if editor has content first. It it has do not close editor.
        this.setState({
            isExpanded: false
        }, () => {
            this.editor.refs.clickAwayableElement.blur();
        });
    }
    render () {
        const { loggedProfile } = this.props;
        const { isExpanded } = this.state;
        const avatarImage = imageCreator(loggedProfile.getIn(['optionalData', 'avatar']));
        return (
          <div className="col-xs-12" style={{ marginBottom: 24 }}>
            <Paper
              className="row middle-xs start-xs"
              style={{
                  padding: '8px 16px',
                  overflow: 'hidden',
                  height: isExpanded ? 'auto' : 64,
                  transition: 'all 0.218s ease-in-out'
              }}
            >
              <div>
                <Avatar
                  editable={false}
                  userName={`${loggedProfile.get('firstName')} ${loggedProfile.get('lastName')}`}
                  image={avatarImage}
                  radius={40}
                />
              </div>
              <div className="col-xs-11" style={{ cursor: 'text' }} onClick={this._handleEditClick}>
                <p
                  style={{
                      height: '24px',
                      overflow: 'hidden'
                  }}
                >
                  <b
                    style={{
                        marginTop: isExpanded ? '-24px' : '0px',
                        display: 'block',
                        transition: 'all 0.218s ease-in-out'
                    }}
                  >
                    Create new entry
                  </b>
                  <b
                    style={{
                        marginTop: isExpanded ? '0px' : '24px',
                        display: 'block',
                        transition: 'all 0.218s ease-in-out',
                        color: '#03a9f4'
                    }}
                  >
                    {`${loggedProfile.get('firstName')} ${loggedProfile.get('lastName')}`}
                  </b>
                </p>
              </div>
              <div className="col-xs-12">
                <div className="row" style={{ minHeight: 150 }}>
                  <div className="col-xs-12">
                    <EntryEditor
                      ref={(editor) => this.editor = editor}
                      onAutosave={this._handleEditorChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-2">
                    <FlatButton primary label="Publish" />
                  </div>
                  <div className="col-xs-4">
                    <FlatButton label="Go Fullscreen" />
                  </div>
                </div>
              </div>
            </Paper>
          </div>
        );
    }
}

QuickEntryEditor.propTypes = {
    loggedProfile: React.PropTypes.object
};

export default clickAway(QuickEntryEditor);

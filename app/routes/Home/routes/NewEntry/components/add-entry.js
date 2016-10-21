import React, { Component } from 'react';
import {
    Toolbar,
    ToolbarGroup,
    FlatButton,
    IconButton,
    IconMenu,
    MenuItem } from 'material-ui';
import { getWordCount } from 'utils/dataModule';
import EntryEditor from 'shared-components/EntryEditor';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { is } from 'immutable';

class NewEntryPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            publishable: true,
            draftToEdit: {},
            isNewDraft: false,
            shouldBeSaved: true
        };
    }
    componentWillMount () {
        const { params, draftActions } = this.props;
        if (params.draftId === 'new') {
            this.setState({
                isNewDraft: true
            });
        } else {
            draftActions.getDraftById(params.draftId);
        }
    }
    componentDidMount () {
        console.log(this.props, this.context);
        this.context.router.setRouteLeaveHook(this.props.route, this._checkIfMustSave)
    }
    // componentWillReceiveProps (nextProps) {
    //     const { draftState, draftActions, params } = this.props;
    //     if (is(draftState, nextProps.draftState)) {
    //         return;
    //     }
    //     // this.context.router.push(`${params.username}/${params.draftId}`)
    //     this.setState({
    //         isNewDraft: false,
    //         draftToEdit: draftState.get('drafts').find()
    //     }, () => {
    //         draftActions.createDraft();
    //     });
    // }

    _checkIfMustSave = () => {
        if (this.state.shouldBeSaved) {
            return 'You have unsaved changes!, Are you sure you want to leave?';
        }
    }
    _handleDraftSave = () => {
        this._saveDraft();
    }
    _saveDraft = (cb) => {
        const { draftActions, params, profileState } = this.props;
        const loggedProfile = profileState.get('loggedProfile');
        const content = this.editor.getRawContent();
        const contentState = this.editor.getContent();
        const title = this.editor.getTitle();
        const wordCount = getWordCount(contentState);

        // console.log(htmlContent, 'htmlContent');
        // console.log(content, 'rawContent');
        // console.log(contentState, 'contentState');

        if (params.draftId !== 'new') {
            const draftId = parseInt(params.draftId, 10);
            draftActions.updateDraftThrottled({ id: draftId, content, title, wordCount });
        } else {
            draftActions.createDraft(loggedProfile.get('userName'), { content, title, wordCount });
        }
        if (typeof cb === 'function') {
            cb();
        }
    };
    _handleTitleChange = () => {};

    render () {
        const { draftState } = this.props;
        const { shouldBeSaved } = this.state;

        let entryTitle = 'First entry';
        if (draftState.get('drafts').size > 1 && !draftState.get('savingDraft')) {
            entryTitle = 'New Entry';
        } else if (draftState.get('savingDraft')) {
            entryTitle = 'Saving draft...';
        }
        return (
          <div style={{ height: '100%', position: 'relative' }}>
            <Toolbar
              className="row"
              style={{ backgroundColor: '#FFF', borderBottom: '1px solid rgb(204, 204, 204)' }}
            >
              <ToolbarGroup>
                <h3 style={{ fontWeight: '200' }}>{entryTitle}</h3>
              </ToolbarGroup>
              <ToolbarGroup>
                <FlatButton
                  primary
                  label="Publish"
                  disabled={!this.state.publishable}
                  onClick={this._setupEntryForPublication}
                />
                <FlatButton
                  primary
                  label="Save"
                  disabled={!shouldBeSaved}
                  onClick={this._handleDraftSave}
                />
                <IconMenu
                  iconButtonElement={
                    <IconButton>
                      <MoreVertIcon />
                    </IconButton>
                  }
                  anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                  targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                  style={{ margin: '4px 0' }}
                >
                  <MenuItem primaryText="Create public link" />
                  <MenuItem primaryText="Word count" />
                  <MenuItem primaryText="Delete draft" />
                </IconMenu>
              </ToolbarGroup>
            </Toolbar>
            <div
              className="row center-xs"
              style={{
                  marginTop: '32px',
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 24,
                  bottom: 0,
                  overflowY: 'auto',
                  padding: '24px 0'
              }}
            >
              <div className="col-xs-12">
                <EntryEditor
                  editorRef={(editor) => { this.editor = editor; }}
                  onChange={this._handleEditorChange}
                  onTitleChange={this._handleTitleChange}
                  readOnly={false}
                  content={'draft.content'}
                  title={'draft.title'}
                  showTitleField
                  textHint="Write something"
                />
              </div>
            </div>
            {this.props.children &&
              <div className="row">
                {React.cloneElement(this.props.children, { draft: 'draft' })}
                <div
                  style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      bottom: 0,
                      right: 0,
                      zIndex: 5,
                      backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                />
              </div>
            }
          </div>
        );
    }
}
NewEntryPage.propTypes = {
    draftActions: React.PropTypes.shape().isRequired,
    draftState: React.PropTypes.shape().isRequired,
    profileState: React.PropTypes.shape().isRequired,
    params: React.PropTypes.shape(),
    children: React.PropTypes.node
};
NewEntryPage.contextTypes = {
    router: React.PropTypes.shape()
};
export default NewEntryPage;

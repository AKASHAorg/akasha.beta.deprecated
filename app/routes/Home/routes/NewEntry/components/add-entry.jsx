import React, { Component } from 'react';
import {
    Toolbar,
    ToolbarGroup,
    FlatButton,
    IconButton,
    IconMenu,
    MenuItem } from 'material-ui';
import { convertFromRaw } from 'draft-js';
import EntryEditor from 'shared-components/EntryEditor';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

class NewEntryPage extends Component {
    constructor (props) {
        super(props);
        this.state = {
            publishable: false,
            draftToEdit: {}
        };
    }
    componentWillMount () {
        const { entryActions, params } = this.props;
        if (params.draftId !== 'new') {
            entryActions.getDraftById(params.draftId);
        }
    }
    componentWillReceiveProps (nextProps) {
        const currentDrafts = this.props.entryState.get('drafts');
        const nextDrafts = nextProps.entryState.get('drafts');
        
        if (nextDrafts !== currentDrafts && nextProps.params.draftId !== 'new') {
            const draft = nextDrafts.find(
                drft => drft.id === parseInt(nextProps.params.draftId, 10));
            this.editor.setTitle(draft.title);
            this.editor.setContent(draft.content);
        }
    }
    _setupEntryForPublication = () => {
        const { profileState, params } = this.props;
        const loggedProfile = profileState.get('loggedProfile');
        this._saveDraft(() => {
            this.context.router.push(
                `/${loggedProfile.get('userName')}/draft/${params.draftId}/publish`
            );
        });
    };
    _getWordCount = (rawContent) => {
        let text = convertFromRaw(rawContent).getPlainText(' ');
        text = text.trim();
        text = text.replace(/[ ]{2,}/gi, ' '); // convert 2 or more spaces to 1
        return text.split(' ').length;
    };
    _saveDraft = (cb) => {
        const { entryActions, params } = this.props;
        const content = this.editor.getContent();
        const title = this.editor.getTitle();
        const wordCount = this._getWordCount(content);
        if (params.draftId !== 'new') {
            const draftId = parseInt(params.draftId, 10);
            entryActions.updateDraftThrottled({ id: draftId, content, title, wordCount });
        } else {
            entryActions.createDraft({ content, title, wordCount });
        }
        if (typeof cb === 'function') {
            cb();
        }
    };
    _handleEditorChange = (text) => {
        const txt = text.trim();
        
        if (txt.length > 0) {
            this.setState({
                publishable: true
            });
        } else {
            this.setState({
                publishable: false
            });
        }
        this._saveDraft();
    };
    _handleTitleChange = () => {
        this._saveDraft();
    };
    render () {
        const { entryState, params } = this.props;
        const draftId = parseInt(params.draftId, 10);
        const draft = entryState.get('drafts').find(drft =>
            drft.id === draftId
        );
        let entryTitle = 'First entry';
        if (entryState.get('drafts').size > 0 && !entryState.get('savingDraft')) {
            entryTitle = 'New Entry';
        } else if (entryState.get('savingDraft')) {
            entryTitle = 'Saving draft...';
        }
        return (
            <div>
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
                        <IconMenu
                            iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
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
                <div className="row center-xs" style={{ marginTop: '32px' }}>
                    <div className="col-xs-6">
                        <EntryEditor
                            editorRef={(editor) => { this.editor = editor; }}
                            onChange={this._handleEditorChange}
                            onTitleChange={this._handleTitleChange}
                            readOnly={false}
                        />
                    </div>
                </div>
                {this.props.children &&
                <div>
                    {React.cloneElement(this.props.children, { draft })}
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
    entryActions: React.PropTypes.object.isRequired,
    entryState: React.PropTypes.object.isRequired,
    profileState: React.PropTypes.object.isRequired,
    params: React.PropTypes.object,
    children: React.PropTypes.node
};
NewEntryPage.contextTypes = {
    router: React.PropTypes.object
};
export default NewEntryPage;

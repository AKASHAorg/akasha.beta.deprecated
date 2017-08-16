import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Icon, Row, Col, Button } from 'antd';
import { PublishOptionsPanel, TextEntryEditor, TagEditor } from '../components';
import { secondarySidebarToggle } from '../local-flux/actions/app-actions';
import { draftCreate, draftGetById, draftUpdate, draftAutosave } from '../local-flux/actions/draft-actions';
import { entryMessages, generalMessages } from '../locale-data/messages';

class NewEntryPage extends Component {
    state = {
        showPublishPanel: false,
    }
    componentWillMount () {
        const { match, draftObj } = this.props;
        const { draftId } = match.params;
        if (!draftObj && draftId === 'new') {
            this.props.draftCreate({
                id: 'new',
                type: 'article',
            });
        } else if (!draftObj) {
            this.props.draftGetById(draftId);
        }
    }
    _showPublishOptionsPanel = () => {
        this.setState({
            showPublishPanel: true
        });
    }
    _handleEditorChange = (editorState) => {
        const { match } = this.props;
        // const tagsField = this.tagsField;
        // tagsField.scrollIntoViewIfNeeded(true);
        this.props.draftUpdate({
            id: match.params.draftId,
            editorState
        });
    }
    _handleTitleChange = (ev) => {
        this.setState({
            title: ev.target.value
        });
    }
    _handlePublishPanelClose = () => {
        this.setState({
            showPublishPanel: false
        });
    }
    _handleAutosave = (editorState) => {
        console.log('save', editorState);
    }
    _createRef = nodeName =>
        (node) => { this[nodeName] = node; };

    _handleForceSave = () => {
        console.log('handle save', this.editor.getRawContent());
    }
    _handlePublish = () => {
        console.log(this.editor.getContent());
    }
    componentWillUnmount () {
        this.props.secondarySidebarToggle({ forceToggle: true });
    }
    render () {
        const { showPublishPanel } = this.state;
        const { showSecondarySidebar, intl, draftObj, match } = this.props;

        if (!draftObj && match.params.draftId !== 'new') {
            return <div>Finding Draft</div>;
        } else if (!draftObj) {
            return <div>Generating Draft</div>;
        }

        const { content, tags } = draftObj;
        const { title, excerpt, licence, draft } = content;

        return (
          <div className="text-entry-page">
            <div
              className="text-entry-page__publish-options"
              onClick={this._showPublishOptionsPanel}
            >
              <Icon
                type="ellipsis"
                style={{ transform: 'rotate(90deg)' }}
              />
              {intl.formatMessage(entryMessages.publishOptions)}
            </div>
            <Row
              type="flex"
              className="text-entry-page__content"
            >
              <Col
                span={showPublishPanel ? 17 : 24}
                className="text-entry-page__editor-wrapper"
              >
                <div className="text-entry-page__editor">
                  <textarea
                    className="text-entry-page__title-input-field"
                    placeholder="Title"
                    onChange={this._handleTitleChange}
                    value={this.state.title}
                  />
                  <TextEntryEditor
                    ref={this._createRef('editor')}
                    onChange={this._handleEditorChange}
                    onAutosave={this._handleAutosave}
                    content={draft}
                  />
                </div>
                <div className="text-entry-page__tag-editor">
                  <TagEditor
                    nodeRef={(node) => { this.tagsField = node; }}
                  />
                </div>
              </Col>
              <Col
                span={6}
                className={
                    `text-entry-page__publish-options-panel-wrapper
                    text-entry-page__publish-options-panel-wrapper${showPublishPanel ? '_open' : ''}`
                }
              >
                <PublishOptionsPanel
                  intl={intl}
                  onClose={this._handlePublishPanelClose}
                  title={title}
                  excerpt={excerpt}
                />
              </Col>
              <div
                className={
                    `text-entry-page__footer-wrapper
                    text-entry-page__footer-wrapper${showSecondarySidebar ? '' : '_full'}`
                }
              >
                <div className="text-entry-page__footer">
                  <div className="text-entry-page__footer-messages-wrapper">
                    <div className="text-entry-page__footer-message">
                        A sample message. this is a long message and should fit into this container.
                    </div>
                  </div>
                  <div className="text-entry-page__footer-actions">
                    <Button
                      size="large"
                      onClick={this._handleForceSave}
                    >
                      {intl.formatMessage(generalMessages.save)}
                    </Button>
                    <Button
                      size="large"
                      type="primary"
                    >
                      {intl.formatMessage(generalMessages.publish)}
                    </Button>
                  </div>
                </div>
              </div>
            </Row>
          </div>
        );
    }
}

NewEntryPage.propTypes = {
    draftObj: PropTypes.shape(),
    draftCreate: PropTypes.func,
    draftGetById: PropTypes.func,
    draftUpdate: PropTypes.func,
    draftAutosave: PropTypes.func,
    intl: PropTypes.shape(),
    match: PropTypes.shape(),
    showSecondarySidebar: PropTypes.bool,
    secondarySidebarToggle: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => {
    const { draftId } = ownProps.match.params;
    return {
        showSecondarySidebar: state.appState.get('showSecondarySidebar'),
        draftObj: state.draftState.getIn(['drafts', draftId]),
    };
};

export default connect(
    mapStateToProps,
    {
        secondarySidebarToggle,
        draftCreate,
        draftGetById,
        draftUpdate,
        draftAutosave,
    }
)(injectIntl(NewEntryPage));

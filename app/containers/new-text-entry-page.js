import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { Icon, Row, Col, Button } from 'antd';
import { PublishOptionsPanel, TextEntryEditor, TagEditor } from '../components';
import { secondarySidebarToggle } from '../local-flux/actions/app-actions';
import { entryMessages, generalMessages } from '../locale-data/messages';

class NewEntryPage extends Component {
    state = {
        showPublishPanel: false
    }
    _showPublishOptionsPanel = () => {
        this.setState({
            showPublishPanel: true
        });
    }
    _handleEditorChange = () => {
        // const tagsField = this.tagsField;
        // tagsField.scrollIntoViewIfNeeded(true);
    }
    _handlePublishPanelClose = () => {
        this.setState({
            showPublishPanel: false
        });
    }
    componentWillUnmount () {
        this.props.secondarySidebarToggle({ forceToggle: true });
    }
    render () {
        const { showPublishPanel } = this.state;
        const { showSecondarySidebar, intl } = this.props;
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
                  <TextEntryEditor
                    onChange={this._handleEditorChange}
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
    intl: PropTypes.shape(),
    showSecondarySidebar: PropTypes.bool,
    secondarySidebarToggle: PropTypes.func,
};

const mapStateToProps = state => ({
    showSecondarySidebar: state.appState.get('showSecondarySidebar')
});

export default connect(
    mapStateToProps,
    {
        secondarySidebarToggle,
    }
)(injectIntl(NewEntryPage));

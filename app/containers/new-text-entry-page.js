import React, { Component } from 'react';
import { Icon, Row, Col } from 'antd';

class NewEntryPage extends Component {
    state = {
        showPublishPanel: false
    }
    _showPublishOptionsPanel = () => {
        this.setState({
            showPublishPanel: true
        });
    }
    render () {
        const { showPublishPanel } = this.state;
        return (
          <div className="text-entry">
            <div
              className="text-entry__publish-options"
              onClick={this._showPublishOptionsPanel}
            >
              <Icon
                type="ellipsis"
                style={{ transform: 'rotate(90deg)' }}
              />
              Publish Options
            </div>
            <Row type="flex">
              <Col span={showPublishPanel ? 17 : 24} className="text-entry__editor-wrapper">
                <div className="text-entry__editor">
                    The editor
                </div>
              </Col>
              <Col
                span={6}
                className={
                    `text-entry__publish-options-panel
                    text-entry__publish-options-panel${showPublishPanel ? '_open' : ''}`
                }
              >
                Publish Options
              </Col>
            </Row>
          </div>
        );
    }
}

export default NewEntryPage;

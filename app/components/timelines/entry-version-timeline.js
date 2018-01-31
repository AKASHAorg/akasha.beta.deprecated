import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { entryMessages } from '../../locale-data/messages';

class EntryVersionTimeline extends Component {
    state = {
        rootWidth: null
    }
    componentDidMount () {
        const rootNode = this.rootNode;
        const rootNodeSize = rootNode.getBoundingClientRect();
        window.addEventListener('resize', this._handleResize);
        // necessary evil! we need to measure the root node to find
        /* eslint-disable react/no-did-mount-set-state */
        this.setState({
            rootWidth: rootNodeSize.width
        });
        /* eslint-enable react/no-did-mount-set-state */
    }
    componentWillReceiveProps (nextProps) {
        const { draftObj } = nextProps;
        if (draftObj.get('id') !== this.props.draftObj.get('id')) {
            this._handleResize();
        }
    }
    _handleResize = () => {
        const rootNode = this.rootNode;
        const rootNodeSize = rootNode.getBoundingClientRect();
        this.setState({
            rootWidth: rootNodeSize.width
        });
    }
    componentWillUnmount () {
        window.removeEventListener('resize', this._handleResize);
    }
    /* eslint-disable react/no-array-index-key */
    render () {
        const { draftObj, onRevertConfirm, intl } = this.props;
        const { content, localChanges } = draftObj;
        const { latestVersion, version } = content;
        const { rootWidth } = this.state;
        const timelineItems = [...Array(Number(latestVersion) + 1)];
        return (
          <div
            className="edit-entry-page__timeline"
            ref={(node) => { this.rootNode = node; }}
          >
            {rootWidth &&
                timelineItems.map((item, index) => (
                  <div
                    key={`step-${index}`}
                    className={
                        `edit-entry-page__timeline-step
                        edit-entry-page__timeline-step${(index === version) ? '_active' : ''}`
                    }
                    style={{
                        width: rootWidth / timelineItems.length
                    }}
                    onClick={ev => onRevertConfirm(ev, index)}
                  >
                    <div className="timeline-step_left-arm" />
                    <div className="timeline-content__bullet" />
                    <div
                      className={
                        `timeline-step_right-arm
                        timeline-step_right-arm${(index === timelineItems.length - 1) ? '_last' : ''}`
                      }
                    />
                    <div
                      className="timeline-content__text"
                    >
                      V{index + 1}
                    </div>
                  </div>
                ))
            }
            {rootWidth && localChanges &&
              <div
                className="edit-entry-page__timeline-step edit-entry-page__timeline-step_local"
                style={{
                    width: rootWidth / timelineItems.length
                }}
              >
                <div className="timeline-step_left-arm" />
                <div className="timeline-content__bullet" />
                <div className="timeline-step_right-arm" />
                <div
                  className="timeline-content__text"
                >
                  {intl.formatMessage(entryMessages.localVersion)}                </div>
              </div>
            }
          </div>
        );
    }
}

EntryVersionTimeline.propTypes = {
    draftObj: PropTypes.shape().isRequired,
    onRevertConfirm: PropTypes.func.isRequired,
    intl: PropTypes.shape().isRequired,
};

export default EntryVersionTimeline;

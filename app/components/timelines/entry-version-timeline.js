import React from 'react';
import PropTypes from 'prop-types';
import { Steps, Popover } from 'antd';

const { Step } = Steps;

const getProgressDot = (dot, { status, index }, onRevertConfirm) => {
    switch (status) {
        case 'draft':
            return (
              <span className="draft-dot">
                {dot}
              </span>
            );
        case 'published':
            return (
              <Popover content={`Status: ${status}`}>
                <a
                  href="##"
                  className="published-dot"
                  onClick={ev => onRevertConfirm(ev, index)}
                >
                  {dot}
                </a>
              </Popover>
            );
        case 'published-selected':
            return (
              <Popover
                content={'Status: Published'}
              >
                <a
                  href="##"
                  className="published-dot published-dot-selected"
                  onClick={ev => onRevertConfirm(ev, index)}
                >
                  {dot}
                </a>
              </Popover>
            );
        case 'none':
            return null;
        default:
            return dot;
    }
};

const getTimelineSteps = (items, localChanges, selectedVersion) => {
    /* eslint-disable react/no-array-index-key */
    const steps = items.map((item, index) => (
      <Step
        key={`${index}`}
        title={`v${index + 1}`}
        status={`published${(selectedVersion === index) ? '-selected' : ''}`}
      />
    ));
    /* eslint-enable react/no-array-index-key */
    if (localChanges) {
        steps.push(
          <Step key="$localVersion" title="Local Version" status="draft" />
        );
    }
    return steps;
};

const EntryVersionTimeline = ({ draftObj, onRevertConfirm }) => {
    const { content, localChanges } = draftObj;
    const { latestVersion, version } = content;
    const timelineItems = [...Array(Number(latestVersion) + 1)];
    return (
      <Steps
        progressDot={(dot, details) => getProgressDot(dot, details, onRevertConfirm)}
        current={latestVersion + 1}
        className="edit-entry-page__timeline-steps"
      >
        {
          getTimelineSteps(timelineItems, localChanges, version)
        }
      </Steps>
    );
};

EntryVersionTimeline.propTypes = {
    draftObj: PropTypes.shape().isRequired,
    onRevertConfirm: PropTypes.func.isRequired,
};

export default EntryVersionTimeline;

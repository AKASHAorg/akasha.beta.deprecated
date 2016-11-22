import React, { Component, PropTypes } from 'react';
import { Subheader, Chip, FlatButton } from 'material-ui';
import { TagChip } from 'shared-components';
import { injectIntl } from 'react-intl';
import { tagMessages, generalMessages } from 'locale-data/messages';
import styles from './stream-sidebar.scss';

const LIMIT = 11;

class StreamSidebar extends Component {
    constructor (props) {
        super(props);

        this.lastNewTagIndex = 0;
    }

    componentWillMount () {
        const { tagActions } = this.props;
        const start = 0;
        tagActions.tagIterator(start, LIMIT);
    }

    componentWillReceiveProps (nextProps) {
        const { newestTags } = nextProps;
        if (newestTags.size !== this.props.newestTags.size) {
            this.lastNewTagIndex = newestTags.size > 0 ?
                newestTags.last().get('tagId') :
                0;
        }
    }

    componentWillUnmount () {
        const { tagActions } = this.props;
        tagActions.clearNewestTags();
    }

    selectTag = (ev, tag) => {
        const { tagActions } = this.props;
        tagActions.saveTag(tag);
    }

    showMoreNewTags = () => {
        const { tagActions } = this.props;
        tagActions.tagIterator(this.lastNewTagIndex, LIMIT);
    }

    renderRecommendedTags () {
        const { streamTags, selectedTag, intl } = this.props;
        return <div>
          <Subheader className="row start-xs middle-xs">
            <small
              className="start-xs col-xs-8"
              style={{ textTransform: 'upperCase' }}
            >
              {intl.formatMessage(tagMessages.recommendedTags)}
            </small>
          </Subheader>
          <div className="start-xs" style={{ paddingLeft: 16 }}>
            {streamTags.map((tag, key) =>
              <TagChip
                key={key}
                tag={tag.get('tagName')}
                selectedTag={selectedTag}
                onTagClick={this.selectTag}
              />
            )}
          </div>
        </div>;
    }

    render () {
        const { subscriptionsCount, newestTags, moreNewTags, streamTags, selectedTag,
            intl } = this.props;
        return (
          <div
            className={'row center-xs'}
            style={{
                background: '#F5F5F5',
                paddingBottom: '10px'
            }}
          >
            <div className="col-xs-12">
              {subscriptionsCount === 0 && this.renderRecommendedTags()}
              {subscriptionsCount !== 0 &&
                <div>
                  <Subheader className="row start-xs middle-xs">
                    <small
                      className="start-xs col-xs-8"
                      style={{ textTransform: 'upperCase' }}
                    >
                      {intl.formatMessage(tagMessages.subscribedTags)}
                    </small>
                    {/*<div className="col-xs-4 end-xs">
                      <FlatButton>
                        <small>+ADD NEW</small>
                      </FlatButton>
                    </div>*/}
                  </Subheader>
                  <div className="start-xs" style={{ paddingLeft: 16 }}>
                    {streamTags.map((tag, key) =>
                      <TagChip
                        key={key}
                        tag={tag.get('tagName')}
                        selectedTag={selectedTag}
                        onTagClick={this.selectTag}
                      />
                    )}
                  </div>
                </div>
              }
              <Subheader className="start-xs row">
                <small className="start-xs col-xs-8" style={{ textTransform: 'upperCase' }}>
                  {intl.formatMessage(tagMessages.newestTags)}
                </small>
              </Subheader>
              <div className="start-xs" style={{ paddingLeft: 16 }}>
                {newestTags.map((tag, key) =>
                  <TagChip
                    key={key}
                    onTagClick={this.selectTag}
                    tag={tag.get('tagName')}
                    selectedTag={selectedTag}
                  />
                )}
              </div>
              {moreNewTags &&
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                  <FlatButton
                    label={intl.formatMessage(generalMessages.showMore)}
                    labelStyle={{ fontSize: '12px' }}
                    onClick={this.showMoreNewTags}
                    style={{ margin: '10px' }}
                    primary
                  />
                </div>
              }
            </div>
          </div>
        );
    }
}

StreamSidebar.propTypes = {
    selectedTag: PropTypes.string,
    streamTags: PropTypes.shape(),
    newestTags: PropTypes.shape(),
    moreNewTags: PropTypes.bool,
    subscriptionsCount: PropTypes.number,
    tagActions: PropTypes.shape(),
    intl: PropTypes.shape()
};

export default injectIntl(StreamSidebar);

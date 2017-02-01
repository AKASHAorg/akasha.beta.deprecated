import React, { Component, PropTypes } from 'react';
import { Subheader, FlatButton } from 'material-ui';
import { TagChip } from 'shared-components';
import { injectIntl } from 'react-intl';
import { tagMessages, generalMessages } from 'locale-data/messages';

const LIMIT = 21;

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
        const { params } = this.props;
        this.context.router.push(`/${params.akashaId}/explore/tag/${tag}`);
    };

    showMoreNewTags = () => {
        const { tagActions } = this.props;
        tagActions.tagIterator(this.lastNewTagIndex, LIMIT);
    }

    renderRecommendedTags () {
        const { streamTags, selectedTag, intl } = this.props;
        return (<div>
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
                isSelected={selectedTag === tag.get('tagName')}
                onTagClick={this.selectTag}
              />
            )}
          </div>
        </div>);
    }

    render () {
        const { subscriptionsCount, newestTags, moreNewTags, streamTags, selectedTag,
            intl } = this.props;
        return (
          <div
            className={'row center-xs'}
            style={{
                background: '#F3F3F3',
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
                  </Subheader>
                  <div className="start-xs" style={{ paddingLeft: 16 }}>
                    {streamTags.map((tag, key) =>
                      <TagChip
                        key={key}
                        tag={tag.get('tagName')}
                        isSelected={selectedTag === tag.get('tagName')}
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
                    isSelected={selectedTag === tag.get('tagName')}
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
    intl: PropTypes.shape(),
    moreNewTags: PropTypes.bool,
    newestTags: PropTypes.shape(),
    params: PropTypes.shape(),
    selectedTag: PropTypes.string,
    streamTags: PropTypes.shape(),
    subscriptionsCount: PropTypes.number,
    tagActions: PropTypes.shape(),
};

StreamSidebar.contextTypes = {
    router: PropTypes.shape()
};

export default injectIntl(StreamSidebar);

import React from 'react';
import { Subheader, Chip, FlatButton } from 'material-ui';
import { TagChip } from 'shared-components';
import styles from './stream-sidebar.scss';

class StreamSidebar extends React.Component {
    constructor (props) {
        super(props);
    }
    _handleTagNavigation = (ev, tag) => {
        this.context.router.push(`/${this.props.params.akashaId}/explore/tag/${tag}`);
    }
    render () {
        const followedTags = [
            'mathematics',
            'blockchain',
            'movies',
            'sports',
            'moon',
            'short-story'
        ];
        const recommendedTags = [
            'mathematics',
            'blockchain',
            'movies',
            'sports',
            'moon',
        ];
        return (
          <div
            className={`row center-xs ${styles.root}`}
            style={{
                background: '#F5F5F5'
            }}
          >
            <div className="col-xs-12">
              <Subheader className="row start-xs middle-xs">
                <small
                  className="start-xs col-xs-8"
                >
                    FOLLOWED TAGS
                </small>
                <div className="col-xs-4 end-xs">
                  <FlatButton>
                    <small>+ADD NEW</small>
                  </FlatButton>
                </div>
              </Subheader>
              <div className="start-xs" style={{ paddingLeft: 16 }}>
                {followedTags.map((tag, key) =>
                  <TagChip
                    key={key}
                    tag={tag}
                    onTagClick={this._handleTagNavigation}
                  />
                )}
              </div>
              <Subheader className="start-xs row">
                <small className="start-xs col-xs-8">RECOMMENDED TAGS</small>
              </Subheader>
              <div className="start-xs" style={{ paddingLeft: 16 }}>
                {recommendedTags.map((tag, key) =>
                  <TagChip
                    key={key}
                    onTagClick={this._handleTagNavigation}
                    tag={tag}
                  />
                )}
              </div>
            </div>
          </div>
        );
    }
}

StreamSidebar.propTypes = {
    params: React.PropTypes.object
};

StreamSidebar.contextTypes = {
    router: React.PropTypes.object
};

export default StreamSidebar;
